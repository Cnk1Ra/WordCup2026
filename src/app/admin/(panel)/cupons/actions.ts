"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/supabase/auth-server";
import { logAdminAction } from "@/lib/audit-log";

async function ensureAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Não autorizado");
}

export type CouponFormState = { error: string | null };

export async function createCouponAction(
  _prev: CouponFormState,
  formData: FormData
): Promise<CouponFormState> {
  await ensureAdmin();
  const code = String(formData.get("code") || "").trim().toUpperCase();
  const type = String(formData.get("type") || "percentage") as
    | "percentage"
    | "fixed";
  const valueRaw = String(formData.get("value") || "");
  const minRaw = String(formData.get("min_subtotal") || "0");
  const maxUsesRaw = String(formData.get("max_uses") || "");
  const expiresRaw = String(formData.get("expires_at") || "");
  const description = String(formData.get("description") || "").trim() || null;

  if (!code) return { error: "Código é obrigatório." };
  if (!/^[A-Z0-9_-]{3,30}$/.test(code))
    return { error: "Código: 3-30 chars, A-Z 0-9 _ -" };

  const value = parseFloat(valueRaw.replace(",", "."));
  if (!Number.isFinite(value) || value <= 0)
    return { error: "Valor inválido." };
  if (type === "percentage" && value > 100)
    return { error: "Percentual máximo 100%." };

  const supabase = getSupabaseServer();
  const { data: existing } = await supabase
    .from("coupons")
    .select("id")
    .eq("code", code)
    .maybeSingle();
  if (existing) return { error: `Já existe cupom "${code}".` };

  const { error } = await supabase.from("coupons").insert({
    code,
    description,
    type,
    value,
    min_subtotal: parseFloat(minRaw.replace(",", ".")) || 0,
    max_uses: maxUsesRaw ? parseInt(maxUsesRaw, 10) : null,
    expires_at: expiresRaw ? new Date(expiresRaw).toISOString() : null,
  });
  if (error) return { error: error.message };

  await logAdminAction({
    action: "coupon.create",
    entityType: "coupons",
    description: `Criou cupom "${code}" (${type === "percentage" ? `${value}%` : `R$ ${value.toFixed(2)}`})`,
    metadata: { code, type, value },
  });

  revalidatePath("/admin/cupons");
  return { error: null };
}

export async function toggleCouponActive(id: string) {
  await ensureAdmin();
  const supabase = getSupabaseServer();
  const { data: cur } = await supabase
    .from("coupons")
    .select("is_active, code")
    .eq("id", id)
    .single();
  if (!cur) return;
  const next = !cur.is_active;
  await supabase
    .from("coupons")
    .update({ is_active: next })
    .eq("id", id);
  await logAdminAction({
    action: next ? "coupon.activate" : "coupon.deactivate",
    entityType: "coupons",
    entityId: id,
    description: `${next ? "Ativou" : "Desativou"} cupom "${cur.code}"`,
  });
  revalidatePath("/admin/cupons");
}

export async function deleteCoupon(id: string) {
  await ensureAdmin();
  const supabase = getSupabaseServer();
  const { data: cur } = await supabase
    .from("coupons")
    .select("code")
    .eq("id", id)
    .maybeSingle();
  await supabase.from("coupons").delete().eq("id", id);
  await logAdminAction({
    action: "coupon.delete",
    entityType: "coupons",
    entityId: id,
    description: cur ? `Excluiu cupom "${cur.code}"` : `Excluiu cupom ${id}`,
  });
  revalidatePath("/admin/cupons");
}
