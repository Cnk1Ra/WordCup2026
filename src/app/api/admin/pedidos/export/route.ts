import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/supabase/auth-server";

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",\n;]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const supabase = getSupabaseServer();
  const { data: orders } = await supabase
    .from("orders")
    .select(
      "number, status, customer_name, customer_email, customer_phone, subtotal, shipping, discount, total, coupon_code, tracking_code, created_at, paid_at, shipped_at, delivered_at, shipping_address, notes"
    )
    .order("created_at", { ascending: false });

  const rows = orders ?? [];
  const headers = [
    "Numero",
    "Status",
    "Cliente",
    "Email",
    "Telefone",
    "Subtotal",
    "Frete",
    "Desconto",
    "Total",
    "Cupom",
    "Rastreio",
    "Data",
    "Pago em",
    "Enviado em",
    "Entregue em",
    "Endereço",
    "Notas",
  ];

  const lines: string[] = [headers.join(",")];
  for (const o of rows) {
    const addr = o.shipping_address
      ? [
          o.shipping_address.line1,
          o.shipping_address.line2,
          o.shipping_address.city,
          o.shipping_address.state,
          o.shipping_address.postal_code,
        ]
          .filter(Boolean)
          .join(", ")
      : "";
    lines.push(
      [
        csvEscape(o.number),
        csvEscape(o.status),
        csvEscape(o.customer_name),
        csvEscape(o.customer_email),
        csvEscape(o.customer_phone),
        csvEscape(o.subtotal),
        csvEscape(o.shipping),
        csvEscape(o.discount),
        csvEscape(o.total),
        csvEscape(o.coupon_code),
        csvEscape(o.tracking_code),
        csvEscape(o.created_at),
        csvEscape(o.paid_at),
        csvEscape(o.shipped_at),
        csvEscape(o.delivered_at),
        csvEscape(addr),
        csvEscape(o.notes),
      ].join(",")
    );
  }

  const csv = "﻿" + lines.join("\n"); // BOM pra Excel reconhecer UTF-8

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="pedidos-spacefut-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
