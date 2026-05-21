import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/products";
import OrderDetailClient from "./OrderDetailClient";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const supabase = getSupabaseServer();
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("number", number)
    .maybeSingle();
  if (!order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("product_name, size, quantity, unit_price, personalization")
    .eq("order_id", order.id);

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <header className="flex flex-col gap-2">
        <Link
          href="/admin/pedidos"
          className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground self-start"
        >
          <ArrowLeft className="size-4" />
          Pedidos
        </Link>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-foreground/55 font-semibold">
              Pedido
            </p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {order.number}
            </h1>
            <p className="text-sm text-foreground/65 mt-1">
              {new Date(order.created_at).toLocaleString("pt-BR")}
            </p>
          </div>
          <p className="text-2xl font-black">{formatBRL(Number(order.total))}</p>
        </div>
      </header>

      <OrderDetailClient
        order={order}
        items={items ?? []}
      />
    </div>
  );
}
