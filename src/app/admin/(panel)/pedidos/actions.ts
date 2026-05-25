"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/supabase/auth-server";
import { logAdminAction } from "@/lib/audit-log";
import { sendEmail } from "@/lib/email/send";
import {
  orderShippedEmail,
  orderDeliveredEmail,
} from "@/lib/email/templates";

async function ensureAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Não autorizado");
}

function generateOrderNumber(): string {
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SF-${yyyy}${mm}${dd}-${rand}`;
}

export type ManualOrderState = { error: string | null };

export async function createManualOrderAction(
  _prev: ManualOrderState,
  formData: FormData
): Promise<ManualOrderState> {
  await ensureAdmin();

  const customerName = String(formData.get("customer_name") || "").trim();
  const customerEmail = String(formData.get("customer_email") || "").trim();
  const customerPhone = String(formData.get("customer_phone") || "").trim() || null;
  const total = parseFloat(String(formData.get("total") || "0").replace(",", "."));
  const productId = String(formData.get("product_id") || "");
  const size = String(formData.get("size") || "M");
  const quantity = parseInt(String(formData.get("quantity") || "1"), 10);
  const payMethod = String(formData.get("payment_method") || "cash");
  const notes = String(formData.get("notes") || "").trim() || null;

  if (!customerName) return { error: "Nome do cliente é obrigatório." };
  if (!Number.isFinite(total) || total <= 0) return { error: "Total inválido." };
  if (!productId) return { error: "Selecione o produto." };
  if (!Number.isFinite(quantity) || quantity < 1) return { error: "Quantidade inválida." };

  const supabase = getSupabaseServer();
  const { data: product } = await supabase
    .from("products")
    .select("id, name, base_price")
    .eq("id", productId)
    .maybeSingle();
  if (!product) return { error: "Produto não encontrado." };

  const number = generateOrderNumber();

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .insert({
      number,
      customer_email: customerEmail || "manual@spacefut.local",
      customer_name: customerName,
      customer_phone: customerPhone,
      status: "paid",
      subtotal: total,
      shipping: 0,
      total,
      paid_at: new Date().toISOString(),
      notes:
        `[Pedido manual${payMethod ? ` · ${payMethod}` : ""}]` +
        (notes ? ` ${notes}` : ""),
    })
    .select("id, number")
    .single();
  if (orderErr) return { error: orderErr.message };

  const { error: itemErr } = await supabase.from("order_items").insert({
    order_id: order.id,
    product_id: product.id,
    product_name: product.name,
    size,
    quantity,
    unit_price: total / quantity,
  });
  if (itemErr) return { error: itemErr.message };

  // Decrementa estoque (se houver)
  if (size) {
    const { data: inv } = await supabase
      .from("inventory")
      .select("quantity")
      .eq("product_id", product.id)
      .eq("size", size)
      .maybeSingle();
    if (inv) {
      await supabase
        .from("inventory")
        .update({ quantity: Math.max(0, inv.quantity - quantity) })
        .eq("product_id", product.id)
        .eq("size", size);
    }
  }

  await logAdminAction({
    action: "order.create_manual",
    entityType: "orders",
    entityId: order.id,
    description: `Pedido manual ${number} · ${customerName} · R$ ${total.toFixed(2)}`,
    metadata: { total, customer: customerName, payment_method: payMethod, product_id: productId, size, quantity },
  });

  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");
  revalidatePath("/admin/financeiro");
  redirect(`/admin/pedidos`);
}

const VALID_STATUS = [
  "pending",
  "paid",
  "producing",
  "shipping",
  "delivered",
  "cancelled",
  "refunded",
] as const;

export async function updateOrderStatus(
  orderId: string,
  status: (typeof VALID_STATUS)[number]
) {
  await ensureAdmin();
  if (!VALID_STATUS.includes(status)) throw new Error("Status inválido.");
  const supabase = getSupabaseServer();
  const patch: Record<string, unknown> = { status };
  const nowIso = new Date().toISOString();
  if (status === "paid") patch.paid_at = nowIso;
  if (status === "shipping") patch.shipped_at = nowIso;
  if (status === "delivered") patch.delivered_at = nowIso;
  const { error } = await supabase
    .from("orders")
    .update(patch)
    .eq("id", orderId);
  if (error) throw new Error(error.message);
  await logAdminAction({
    action: "order.status_update",
    entityType: "orders",
    entityId: orderId,
    description: `Status do pedido → ${status}`,
    metadata: { status },
  });

  // Email automático no shipping/delivered. Outros status (paid/refunded)
  // são tratados via webhook do Stripe.
  if (status === "shipping" || status === "delivered") {
    const { data: order } = await supabase
      .from("orders")
      .select(
        "number, total, subtotal, shipping, customer_name, customer_email, status, tracking_code"
      )
      .eq("id", orderId)
      .maybeSingle();
    if (order?.customer_email) {
      const tpl =
        status === "shipping"
          ? orderShippedEmail(order)
          : orderDeliveredEmail(order);
      await sendEmail({
        to: order.customer_email,
        subject: tpl.subject,
        html: tpl.html,
        text: tpl.text,
      });
    }
  }

  revalidatePath("/admin/pedidos");
  revalidatePath("/admin");
}

export async function updateTrackingCode(orderId: string, code: string) {
  await ensureAdmin();
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from("orders")
    .update({ tracking_code: code.trim() || null })
    .eq("id", orderId);
  if (error) throw new Error(error.message);
  await logAdminAction({
    action: "order.tracking_update",
    entityType: "orders",
    entityId: orderId,
    description: code.trim() ? `Tracking: ${code.trim()}` : "Tracking removido",
  });
  revalidatePath("/admin/pedidos");
}
