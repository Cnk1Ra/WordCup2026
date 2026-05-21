import { NextRequest } from "next/server";
import { validateCoupon } from "@/lib/coupons";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const code = typeof body.code === "string" ? body.code : "";
  const subtotal = typeof body.subtotal === "number" ? body.subtotal : 0;

  if (!code) {
    return Response.json({ valid: false, error: "Código vazio." }, { status: 400 });
  }

  const result = await validateCoupon(code, subtotal);
  return Response.json(result);
}
