import { Settings } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const supabase = getSupabaseServer();
  const { data: rules } = await supabase
    .from("shipping_rules")
    .select("*")
    .order("display_order");

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <header>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Configurações
        </h1>
        <p className="text-sm text-foreground/60">
          Regras de frete, prazos por região, textos do site.
        </p>
      </header>

      <section className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Settings className="size-5 text-brand-green" />
          <h2 className="font-bold">Prazos de entrega por região</h2>
        </div>
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs uppercase tracking-wider text-foreground/60">
              <tr>
                <th className="px-4 py-3">Região</th>
                <th className="px-4 py-3">Pronta entrega</th>
                <th className="px-4 py-3">Sob encomenda</th>
                <th className="px-4 py-3">Frete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(rules ?? []).map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-bold">{r.region_name}</td>
                  <td className="px-4 py-3">
                    {r.days_in_stock} dia{r.days_in_stock !== 1 ? "s" : ""}
                  </td>
                  <td className="px-4 py-3">
                    {r.days_made_to_order} dias úteis
                  </td>
                  <td className="px-4 py-3">
                    R$ {Number(r.shipping_cost).toFixed(2).replace(".", ",")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-foreground/55">
          Edição inline desses prazos virá numa próxima fase. Por ora, ajuste
          direto no banco se precisar.
        </p>
      </section>
    </div>
  );
}
