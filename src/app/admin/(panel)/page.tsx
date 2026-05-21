import {
  Shirt,
  ShoppingBag,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = getSupabaseServer();
  const [productsRes, ordersRes, customersRes, expensesRes] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total, status, created_at"),
    supabase.from("customers").select("*", { count: "exact", head: true }),
    supabase.from("expenses").select("amount, occurred_at"),
  ]);

  const orders = ordersRes.data ?? [];
  const expenses = expensesRes.data ?? [];

  const paidOrders = orders.filter((o) =>
    ["paid", "producing", "shipping", "delivered"].includes(o.status)
  );
  const revenue = paidOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const profit = revenue - totalExpenses;
  const avgTicket = paidOrders.length > 0 ? revenue / paidOrders.length : 0;
  const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

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

      {/* Lucro: destaque grande */}
      <section
        className={`rounded-3xl border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 ${
          profit >= 0
            ? "bg-brand-green/5 border-brand-green/30"
            : "bg-red-50 border-red-200"
        }`}
      >
        <div>
          <p className="text-xs uppercase tracking-wider font-bold text-foreground/55">
            Lucro líquido (receita − despesas)
          </p>
          <p
            className={`text-4xl sm:text-5xl font-black tracking-tight mt-1 ${
              profit >= 0 ? "text-brand-green" : "text-red-700"
            }`}
          >
            {profit < 0 ? "−" : ""}
            {formatBRL(Math.abs(profit))}
          </p>
          <p className="text-xs text-foreground/55 mt-1">
            Margem {profitMargin.toFixed(1)}% · {paidOrders.length} venda(s)
            paga(s) · {expenses.length} despesa(s)
          </p>
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-foreground/55 font-semibold">
              Receita
            </p>
            <p className="text-xl font-black">{formatBRL(revenue)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-foreground/55 font-semibold">
              Despesas
            </p>
            <p className="text-xl font-black text-red-600">
              −{formatBRL(totalExpenses)}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Receita total"
          value={formatBRL(revenue)}
          icon={TrendingUp}
          sub={`${paidOrders.length} pedidos pagos`}
        />
        <StatCard
          label="Despesas"
          value={`−${formatBRL(totalExpenses)}`}
          icon={TrendingDown}
          sub={`${expenses.length} registros`}
          tone="bad"
        />
        <StatCard
          label="Ticket médio"
          value={formatBRL(avgTicket)}
          icon={DollarSign}
          sub="Em pedidos pagos"
        />
        <StatCard
          label="Pedidos"
          value={orders.length.toString()}
          icon={ShoppingBag}
          sub="Todos os status"
        />
      </section>

      <section className="grid grid-cols-2 gap-3">
        <StatCard
          label="Produtos"
          value={(productsRes.count ?? 0).toString()}
          icon={Shirt}
          sub="No catálogo"
        />
        <StatCard
          label="Clientes"
          value={(customersRes.count ?? 0).toString()}
          icon={Users}
          sub="Cadastrados"
        />
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  tone,
}: {
  label: string;
  value: string;
  icon: typeof TrendingUp;
  sub: string;
  tone?: "ok" | "bad";
}) {
  return (
    <div className="rounded-3xl bg-white border border-border p-5 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-foreground/55">
          {label}
        </p>
        <Icon className="size-4 text-foreground/40" />
      </div>
      <p
        className={`text-2xl sm:text-3xl font-black tracking-tight ${
          tone === "bad" ? "text-red-600" : ""
        }`}
      >
        {value}
      </p>
      <p className="text-[11px] text-foreground/55">{sub}</p>
    </div>
  );
}
