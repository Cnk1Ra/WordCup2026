import { NextRequest } from "next/server";
import { validateCoupon } from "@/lib/coupons";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // 20 tentativas/min por IP. Previne brute force de códigos de cupom.
  const ip = getClientIp(req.headers);
  const rl = rateLimit(`coupon:${ip}`, 20, 60 * 1000);
  if (!rl.ok) {
    return Response.json(
      { valid: false, error: "Muitas tentativas. Aguarde um momento." },
      { status: 429 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const code = typeof body.code === "string" ? body.code : "";
  const subtotal = typeof body.subtotal === "number" ? body.subtotal : 0;

  if (!code) {
    return Response.json({ valid: false, error: "Código vazio." }, { status: 400 });
  }

  const result = await validateCoupon(code, subtotal);
  return Response.json(result);
}
