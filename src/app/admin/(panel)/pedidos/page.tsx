import { getSupabaseServer } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/products";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  pending: "Aguardando pagamento",
  paid: "Pago",
  producing: "Em produção",
  shipping: "Em rota",
  delivered: "Entregue",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-orange-100 text-orange-700",
  paid: "bg-blue-100 text-blue-700",
  producing: "bg-amber-100 text-amber-700",
  shipping: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

export default async function PedidosPage() {
  const supabase = getSupabaseServer();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <header>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Pedidos
        </h1>
        <p className="text-sm text-foreground/60">
          {orders?.length === 0
            ? "Nenhum pedido ainda. Quando tiver venda no Stripe, cai aqui automaticamente."
            : `${orders?.length} pedidos · mais recentes primeiro`}
        </p>
      </header>

      {orders && orders.length > 0 ? (
        <div className="rounded-3xl bg-white border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {orders.map((o) => (
              <div
                key={o.id}
                className="flex items-center gap-4 p-4 hover:bg-muted transition"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{o.number}</p>
                  <p className="text-xs text-foreground/60 truncate">
                    {o.customer_email} · {o.customer_name}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 ${
                    STATUS_COLOR[o.status] ?? "bg-gray-100"
                  }`}
                >
                  {STATUS_LABEL[o.status] ?? o.status}
                </span>
                <p className="text-sm font-bold text-right w-24">
                  {formatBRL(Number(o.total))}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-border p-12 text-center text-sm text-foreground/55">
          Pedidos vão aparecer aqui automaticamente quando o webhook do Stripe
          tiver configurado.
        </div>
      )}
    </div>
  );
}
