import { NextRequest } from "next/server";
import Stripe from "stripe";
import { getSupabaseServer } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email/send";
import {
  orderConfirmationEmail,
  orderRefundedEmail,
  newOrderAdminEmail,
} from "@/lib/email/templates";

// Stripe webhook handler.
// Documentação: https://docs.stripe.com/webhooks
//
// Configurar no dashboard Stripe:
//   Settings > Developers > Webhooks > Add endpoint
//   URL: https://<seu-dominio>/api/stripe/webhook
//   Eventos: checkout.session.completed, checkout.session.async_payment_succeeded,
//            charge.refunded
//   Copiar o Signing secret (whsec_...) pra STRIPE_WEBHOOK_SECRET no .env

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeKey || !webhookSecret) {
    return Response.json(
      { error: "STRIPE_SECRET_KEY ou STRIPE_WEBHOOK_SECRET não configurados" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeKey);
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return Response.json({ error: "Sem signature" }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (e) {
    return Response.json(
      { error: `Signature inválida: ${e instanceof Error ? e.message : "?"}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await persistOrder(stripe, session);
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await markRefunded(charge);
        break;
      }
    }
    return Response.json({ received: true });
  } catch (err) {
    console.error("[webhook]", event.type, err);
    return Response.json(
      { error: err instanceof Error ? err.message : "erro" },
      { status: 500 }
    );
  }
}

async function persistOrder(
  stripe: Stripe,
  session: Stripe.Checkout.Session
): Promise<void> {
  const supabase = getSupabaseServer();

  // Idempotência: se já gravou esse session_id, sai.
  const { data: existing } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .maybeSingle();
  if (existing) return;

  // Re-busca line items com expand pra ter metadata completo.
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ["data.price.product"],
    limit: 100,
  });

  const subtotalCents = lineItems.data
    .filter((li) => !/frete/i.test(li.description || ""))
    .reduce((s, li) => s + (li.amount_subtotal ?? 0), 0);
  const shippingCents = lineItems.data
    .filter((li) => /frete/i.test(li.description || ""))
    .reduce((s, li) => s + (li.amount_subtotal ?? 0), 0);
  const totalCents = session.amount_total ?? subtotalCents + shippingCents;

  const customerEmail =
    session.customer_details?.email ||
    session.customer_email ||
    "";
  const customerName = session.customer_details?.name ?? null;
  const customerPhone = session.customer_details?.phone ?? null;
  const shippingAddress = session.collected_information?.shipping_details
    ?.address
    ? {
        line1: session.collected_information.shipping_details.address.line1,
        line2: session.collected_information.shipping_details.address.line2,
        city: session.collected_information.shipping_details.address.city,
        state: session.collected_information.shipping_details.address.state,
        postal_code:
          session.collected_information.shipping_details.address.postal_code,
        country: session.collected_information.shipping_details.address.country,
        name: session.collected_information.shipping_details.name,
      }
    : null;

  // Customer upsert por email
  let customerId: string | null = null;
  if (customerEmail) {
    const { data: cust } = await supabase
      .from("customers")
      .upsert(
        {
          email: customerEmail,
          name: customerName,
          phone: customerPhone,
          address: shippingAddress,
        },
        { onConflict: "email" }
      )
      .select("id")
      .single();
    customerId = cust?.id ?? null;
  }

  // Generate human number (ex: SF-20260521-A4F2)
  const number = generateOrderNumber();

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      number,
      customer_id: customerId,
      customer_email: customerEmail,
      customer_name: customerName,
      customer_phone: customerPhone,
      status: "paid",
      subtotal: subtotalCents / 100,
      shipping: shippingCents / 100,
      total: totalCents / 100,
      shipping_address: shippingAddress,
      stripe_session_id: session.id,
      stripe_payment_intent:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null,
      paid_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (orderErr) throw orderErr;

  // Itens + decremento de estoque
  for (const li of lineItems.data) {
    if (/frete/i.test(li.description || "")) continue;
    const meta = (li.price?.product as Stripe.Product | undefined)?.metadata ?? {};
    const slug = meta.slug ?? "";
    const size = meta.size ?? "";
    const persoName = meta.perso_name || null;
    const persoNumber = meta.perso_number || null;

    let productId: string | null = null;
    if (slug) {
      const { data: prod } = await supabase
        .from("products")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      productId = prod?.id ?? null;
    }
    if (!productId) continue;

    await supabase.from("order_items").insert({
      order_id: order.id,
      product_id: productId,
      product_name: li.description ?? "",
      size,
      quantity: li.quantity ?? 1,
      unit_price: (li.amount_subtotal ?? 0) / 100 / (li.quantity ?? 1),
      personalization:
        persoName || persoNumber
          ? { name: persoName, number: persoNumber }
          : null,
    });

    // Decrementa estoque (não desce abaixo de 0)
    if (size && (li.quantity ?? 0) > 0) {
      const { data: inv } = await supabase
        .from("inventory")
        .select("quantity")
        .eq("product_id", productId)
        .eq("size", size)
        .maybeSingle();
      if (inv) {
        const newQty = Math.max(0, inv.quantity - (li.quantity ?? 1));
        await supabase
          .from("inventory")
          .update({ quantity: newQty })
          .eq("product_id", productId)
          .eq("size", size);
      }
    }
  }

  // Email de confirmação pro cliente + notificação interna pros admins.
  // Não bloqueia se falhar (pedido já salvo).
  const { data: full } = await supabase
    .from("orders")
    .select(
      "number, total, subtotal, shipping, customer_name, customer_email, status, shipping_address, order_items(product_name, size, quantity, unit_price, personalization)"
    )
    .eq("id", order.id)
    .maybeSingle();
  if (full) {
    if (customerEmail) {
      const tpl = orderConfirmationEmail(full);
      await sendEmail({
        to: customerEmail,
        subject: tpl.subject,
        html: tpl.html,
        text: tpl.text,
      });
    }

    // Notifica admins owners (vai pra Fabricio + Yuri automaticamente; se
    // adicionar mais owners no futuro, eles entram sozinhos)
    const { data: admins } = await supabase
      .from("admins")
      .select("email")
      .eq("role", "owner");
    const adminEmails = (admins ?? [])
      .map((a) => a.email)
      .filter((e): e is string => !!e);
    if (adminEmails.length > 0) {
      const tpl = newOrderAdminEmail(full);
      await sendEmail({
        to: adminEmails,
        subject: tpl.subject,
        html: tpl.html,
        text: tpl.text,
      });
    }
  }
}

async function markRefunded(charge: Stripe.Charge): Promise<void> {
  const supabase = getSupabaseServer();
  const intentId =
    typeof charge.payment_intent === "string"
      ? charge.payment_intent
      : charge.payment_intent?.id;
  if (!intentId) return;

  const { data: order } = await supabase
    .from("orders")
    .select("number, total, subtotal, shipping, customer_name, customer_email, status")
    .eq("stripe_payment_intent", intentId)
    .maybeSingle();

  await supabase
    .from("orders")
    .update({ status: "refunded" })
    .eq("stripe_payment_intent", intentId);

  if (order?.customer_email) {
    const tpl = orderRefundedEmail({ ...order, status: "refunded" });
    await sendEmail({
      to: order.customer_email,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
    });
  }
}

function generateOrderNumber(): string {
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SF-${yyyy}${mm}${dd}-${rand}`;
}
