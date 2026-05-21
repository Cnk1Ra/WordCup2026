import { getSupabaseServer } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/products";
import DespesasClient from "./DespesasClient";

export const dynamic = "force-dynamic";

export default async function DespesasPage() {
  const supabase = getSupabaseServer();
  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .order("occurred_at", { ascending: false });

  const total = (expenses ?? []).reduce(
    (s, e) => s + Number(e.amount),
    0
  );

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);
  const thisMonthTotal = (expenses ?? [])
    .filter((e) => e.occurred_at >= monthStart)
    .reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <header>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Despesas
        </h1>
        <p className="text-sm text-foreground/60">
          Gastos da operação — entram no cálculo de lucro do dashboard.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-3xl bg-white border border-border p-5">
          <p className="text-xs text-foreground/60">Despesas no mês</p>
          <p className="text-2xl font-black text-red-600 mt-1">
            −{formatBRL(thisMonthTotal)}
          </p>
        </div>
        <div className="rounded-3xl bg-white border border-border p-5">
          <p className="text-xs text-foreground/60">Total acumulado</p>
          <p className="text-2xl font-black text-foreground mt-1">
            −{formatBRL(total)}
          </p>
        </div>
      </div>

      <DespesasClient expenses={expenses ?? []} />
    </div>
  );
}
