import "server-only";
import { getSupabaseServer } from "./supabase/server";

export type CouponValidation =
  | { valid: true; code: string; discount: number; message: string }
  | { valid: false; error: string };

// Valida um código de cupom contra o subtotal atual. Retorna o desconto em R$
// (já aplicado às regras: tipo, mínimo, validade, limite de usos).
export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<CouponValidation> {
  const norm = code.trim().toUpperCase();
  if (!norm) return { valid: false, error: "Código vazio." };

  const supabase = getSupabaseServer();
  const { data: coupon } = await supabase
    .from("coupons")
    .select("*")
    .ilike("code", norm)
    .maybeSingle();

  if (!coupon) return { valid: false, error: "Cupom inválido." };
  if (!coupon.is_active) return { valid: false, error: "Cupom inativo." };

  const now = new Date();
  if (coupon.starts_at && new Date(coupon.starts_at) > now) {
    return { valid: false, error: "Cupom ainda não está válido." };
  }
  if (coupon.expires_at && new Date(coupon.expires_at) < now) {
    return { valid: false, error: "Cupom expirado." };
  }
  if (coupon.max_uses && coupon.uses >= coupon.max_uses) {
    return { valid: false, error: "Cupom esgotou os usos." };
  }
  if (Number(coupon.min_subtotal) > 0 && subtotal < Number(coupon.min_subtotal)) {
    return {
      valid: false,
      error: `Cupom válido pra pedidos acima de R$ ${Number(coupon.min_subtotal).toFixed(2)}.`,
    };
  }

  let discount = 0;
  if (coupon.type === "percentage") {
    discount = (subtotal * Number(coupon.value)) / 100;
  } else {
    discount = Number(coupon.value);
  }
  discount = Math.min(discount, subtotal);

  return {
    valid: true,
    code: coupon.code,
    discount: Math.round(discount * 100) / 100,
    message:
      coupon.type === "percentage"
        ? `${coupon.value}% de desconto`
        : `R$ ${Number(coupon.value).toFixed(2)} de desconto`,
  };
}
