import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase/server";
import NovoPedidoForm from "./NovoPedidoForm";

export const dynamic = "force-dynamic";

export default async function NovoPedidoPage() {
  const supabase = getSupabaseServer();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, base_price")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <header className="flex flex-col gap-2">
        <Link
          href="/admin/pedidos"
          className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground self-start"
        >
          <ArrowLeft className="size-4" />
          Pedidos
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Novo pedido manual
          </h1>
          <p className="text-sm text-foreground/60">
            Pra vendas em dinheiro, Pix direto ou outros canais. Já entra como
            pago no dashboard.
          </p>
        </div>
      </header>

      <NovoPedidoForm products={products ?? []} />
    </div>
  );
}
