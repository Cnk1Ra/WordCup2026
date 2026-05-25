import {
  Shirt,
  ShoppingBag,
  Users,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = getSupabaseServer();
  const [productsRes, ordersRes, customersRes, expensesRes, adminsRes] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("total, status, created_at"),
    supabase.from("customers").select("*", { count: "exact", head: true }),
    supabase.from("expenses").select("amount, paid_by_admin_id, paid_by_name"),
    supabase.from("admins").select("id, name, email"),
  ]);

  const orders = ordersRes.data ?? [];
  const expenses = expensesRes.data ?? [];
  const admins = adminsRes.data ?? [];

  const paidOrders = orders.filter((o) =>
    ["paid", "producing", "shipping", "delivered"].includes(o.status)
  );
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const revenue = paidOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const pendingRevenue = pendingOrders.reduce(
    (sum, o) => sum + Number(o.total),
    0
  );
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const profit = revenue - totalExpenses;
  const avgTicket = paidOrders.length > 0 ? revenue / paidOrders.length : 0;
  const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

  // SPLIT entre sócios: cada um recebe (lucro / N sócios) + o que pagou de despesa.
  // Soma total dá receita (R - D)/N * N + D = R, igualando o caixa total.
  const numPartners = Math.max(1, admins.length);
  const profitShare = profit / numPartners;
  const partnerExpenses = new Map<string, number>();
  expenses.forEach((e) => {
    const id = e.paid_by_admin_id ?? "unknown";
    partnerExpenses.set(id, (partnerExpenses.get(id) ?? 0) + Number(e.amount));
  });
  const partnerSettlements = admins.map((a) => ({
    name: a.name || a.email.split("@")[0],
    paid: partnerExpenses.get(a.id) ?? 0,
    receive: profitShare + (partnerExpenses.get(a.id) ?? 0),
  }));

  return (
    <div className="flex flex-col gap-4 max-w-5xl">
      <header>
        <h1 className="text-xl font-black tracking-tight">Dashboard</h1>
      </header>

      {/* KPI strip: receita · aguardando · despesas · lucro */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Kpi
          label="Receita"
          value={formatBRL(revenue)}
          sub={`${paidOrders.length} pago${paidOrders.length === 1 ? "" : "s"}`}
        />
        <Kpi
          label="Aguardando"
          value={formatBRL(pendingRevenue)}
          tone="warn"
          sub={`${pendingOrders.length} pedido${pendingOrders.length === 1 ? "" : "s"}`}
        />
        <Kpi
          label="Despesas"
          value={`−${formatBRL(totalExpenses)}`}
          tone="bad"
        />
        <Kpi
          label="Lucro líquido"
          value={`${profit < 0 ? "−" : ""}${formatBRL(Math.abs(profit))}`}
          tone={profit >= 0 ? "ok" : "bad"}
          sub={`${profitMargin.toFixed(0)}% margem`}
        />
      </section>

      {/* Valor a receber por sócio — destaque principal */}
      {partnerSettlements.length > 0 && (
        <section className="rounded-2xl bg-white border border-border p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-foreground/55">
              Valor a receber
            </p>
            <p className="text-[10px] text-foreground/45">
              Lucro/{numPartners} + despesas pagas
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {partnerSettlements.map((p) => (
              <div
                key={p.name}
                className={`rounded-xl border p-3 ${
                  p.receive >= 0
                    ? "border-brand-green/40 bg-brand-green/5"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-bold text-foreground/70">
                    {p.name}
                  </p>
                  <p
                    className={`text-xl font-black tracking-tight ${
                      p.receive >= 0 ? "text-brand-green" : "text-red-700"
                    }`}
                  >
                    {p.receive < 0 ? "−" : ""}
                    {formatBRL(Math.abs(p.receive))}
                  </p>
                </div>
                <p className="text-[10px] text-foreground/55 mt-1">
                  Lucro {formatBRL(profitShare)} + reembolso{" "}
                  {formatBRL(p.paid)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Stats secundárias */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <MiniStat
          label="Pedidos pagos"
          value={paidOrders.length.toString()}
          icon={ShoppingBag}
        />
        <MiniStat
          label="Ticket médio"
          value={formatBRL(avgTicket)}
          icon={DollarSign}
        />
        <MiniStat
          label="Produtos"
          value={(productsRes.count ?? 0).toString()}
          icon={Shirt}
        />
        <MiniStat
          label="Clientes"
          value={(customersRes.count ?? 0).toString()}
          icon={Users}
        />
      </section>
    </div>
  );
}

function Kpi({
  label,
  value,
  tone,
  sub,
}: {
  label: string;
  value: string;
  tone?: "ok" | "bad" | "warn";
  sub?: string;
}) {
  const toneClass =
    tone === "bad"
      ? "text-red-600"
      : tone === "ok"
        ? "text-brand-green"
        : tone === "warn"
          ? "text-amber-600"
          : "";
  return (
    <div className="rounded-2xl bg-white border border-border p-3 sm:p-4 flex flex-col gap-0.5 min-w-0">
      <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-foreground/55">
        {label}
      </p>
      <p
        className={`text-base sm:text-xl font-black tracking-tight truncate ${toneClass}`}
      >
        {value}
      </p>
      {sub && <p className="text-[10px] text-foreground/45">{sub}</p>}
    </div>
  );
}

function MiniStat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof TrendingUp;
}) {
  return (
    <div className="rounded-2xl bg-white border border-border p-3 flex flex-col gap-0.5 min-w-0">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/55 truncate">
          {label}
        </p>
        <Icon className="size-3.5 text-foreground/35 shrink-0" />
      </div>
      <p className="text-base sm:text-lg font-black tracking-tight">
        {value}
      </p>
    </div>
  );
}
