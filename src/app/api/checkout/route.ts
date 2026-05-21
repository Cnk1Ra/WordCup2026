import { NextRequest } from "next/server";
import Stripe from "stripe";
import { SHIPPING_BRL } from "@/lib/products";
import { validateCoupon } from "@/lib/coupons";

type CheckoutItem = {
  id: string;
  slug: string;
  name: string;
  size: string;
  image: string;
  qty: number;
  unitPrice: number;
  personalization?: { name: string; number: string };
};

type StripeLineItem = {
  quantity: number;
  price_data: {
    currency: string;
    unit_amount: number;
    product_data: {
      name: string;
      images?: string[];
      metadata?: Record<string, string>;
    };
  };
};

export async function POST(req: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return Response.json(
      {
        error:
          "STRIPE_SECRET_KEY não configurada. Adicione no Vercel ou .env.local.",
      },
      { status: 500 }
    );
  }

  const stripe = new Stripe(key);
  const { items, couponCode } = (await req.json()) as {
    items: CheckoutItem[];
    couponCode?: string | null;
  };

  if (!items?.length) {
    return Response.json({ error: "Carrinho vazio" }, { status: 400 });
  }

  // Valida cupom server-side (não confiar no preço que o cliente envia)
  const subtotal = items.reduce((s, it) => s + it.unitPrice * it.qty, 0);
  let appliedCoupon: { code: string; discount: number } | null = null;
  if (couponCode) {
    const valid = await validateCoupon(couponCode, subtotal);
    if (valid.valid) {
      appliedCoupon = { code: valid.code, discount: valid.discount };
    }
  }

  const origin =
    req.headers.get("origin") ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000";

  const lineItems: StripeLineItem[] = items.map((it) => {
    const persoLabel = it.personalization
      ? ` · ${it.personalization.name} #${it.personalization.number}`
      : "";
    return {
      quantity: it.qty,
      price_data: {
        currency: "brl",
        unit_amount: Math.round(it.unitPrice * 100),
        product_data: {
          name: `${it.name} (Tam ${it.size})${persoLabel}`,
          images: [`${origin}${it.image}`],
          metadata: {
            slug: it.slug,
            size: it.size,
            perso_name: it.personalization?.name ?? "",
            perso_number: it.personalization?.number ?? "",
          },
        },
      },
    };
  });

  lineItems.push({
    quantity: 1,
    price_data: {
      currency: "brl",
      unit_amount: SHIPPING_BRL * 100,
      product_data: { name: "Frete fixo · Brasil" },
    },
  });

  try {
    // Cria coupon Stripe (one-shot) se houver desconto
    const discounts: Array<{ coupon: string }> = [];
    if (appliedCoupon && appliedCoupon.discount > 0) {
      const stripeCoupon = await stripe.coupons.create({
        name: `Cupom ${appliedCoupon.code}`,
        amount_off: Math.round(appliedCoupon.discount * 100),
        currency: "brl",
        duration: "once",
        max_redemptions: 1,
      });
      discounts.push({ coupon: stripeCoupon.id });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      discounts: discounts.length > 0 ? discounts : undefined,
      success_url: `${origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/carrinho`,
      shipping_address_collection: { allowed_countries: ["BR"] },
      phone_number_collection: { enabled: true },
      locale: "pt-BR",
      metadata: appliedCoupon ? { coupon_code: appliedCoupon.code } : undefined,
    });

    return Response.json({ url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro Stripe";
    return Response.json({ error: msg }, { status: 500 });
  }
}
