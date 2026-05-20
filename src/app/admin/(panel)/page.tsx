import { Shirt, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = getSupabaseServer();
  const [productsRes, ordersRes, customersRes] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total, status, created_at"),
    supabase.from("customers").select("*", { count: "exact", head: true }),
  ]);

  const orders = ordersRes.data ?? [];
  const paidOrders = orders.filter((o) =>
    ["paid", "producing", "shipping", "delivered"].includes(o.status)
  );
  const revenue = paidOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const avgTicket = paidOrders.length > 0 ? revenue / paidOrders.length : 0;

  const stats = [
    {
      label: "Receita total",
      value: formatBRL(revenue),
      icon: TrendingUp,
      sub: `${paidOrders.length} pedidos pagos`,
    },
    {
      label: "Pedidos",
      value: orders.length.toString(),
      icon: ShoppingBag,
      sub: "Todos os status",
    },
    {
      label: "Produtos",
      value: (productsRes.count ?? 0).toString(),
      icon: Shirt,
      sub: "No catálogo",
    },
    {
      label: "Clientes",
      value: (customersRes.count ?? 0).toString(),
      icon: Users,
      sub: "Cadastrados",
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <header>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-foreground/60">
          Visão geral do seu negócio em tempo real.
        </p>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, sub }) => (
          <div
            key={label}
            className="rounded-3xl bg-white border border-border p-5 flex flex-col gap-1"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-foreground/55">
                {label}
              </p>
              <Icon className="size-4 text-foreground/40" />
            </div>
            <p className="text-2xl sm:text-3xl font-black tracking-tight">
              {value}
            </p>
            <p className="text-[11px] text-foreground/55">{sub}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-3">
          <h2 className="font-bold">Ticket médio</h2>
          <p className="text-3xl font-black">{formatBRL(avgTicket)}</p>
          <p className="text-xs text-foreground/55">
            Calculado sobre pedidos pagos
          </p>
        </div>
        <div className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-3">
          <h2 className="font-bold">Próximas ações</h2>
          <ul className="text-sm text-foreground/70 flex flex-col gap-1.5 list-disc list-inside">
            <li>Configurar webhook Stripe pra capturar pedidos</li>
            <li>Conectar domínio admin.spacefut.shop na Vercel</li>
            <li>Definir estoque inicial em Produtos</li>
            <li>Fazer primeira campanha em Sabará</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
