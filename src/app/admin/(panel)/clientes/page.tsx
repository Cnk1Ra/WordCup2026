import { getSupabaseServer } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const supabase = getSupabaseServer();
  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <header>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Clientes
        </h1>
        <p className="text-sm text-foreground/60">
          {customers?.length === 0
            ? "Quando alguém comprar, aparece aqui."
            : `${customers?.length} clientes cadastrados`}
        </p>
      </header>

      {customers && customers.length > 0 ? (
        <div className="rounded-3xl bg-white border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {customers.map((c) => (
              <div key={c.id} className="flex items-center gap-4 p-4">
                <div className="size-10 rounded-full bg-foreground text-white grid place-items-center text-sm font-black shrink-0">
                  {(c.name || c.email)[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">
                    {c.name || c.email.split("@")[0]}
                  </p>
                  <p className="text-xs text-foreground/60 truncate">
                    {c.email}
                  </p>
                </div>
                <div className="hidden sm:flex flex-col items-end">
                  <p className="text-xs text-foreground/55">Pedidos</p>
                  <p className="text-sm font-bold">{c.total_orders}</p>
                </div>
                <div className="flex flex-col items-end w-28">
                  <p className="text-xs text-foreground/55">Total gasto</p>
                  <p className="text-sm font-bold">
                    {formatBRL(Number(c.total_spent))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-border p-12 text-center text-sm text-foreground/55">
          Clientes aparecerão aqui automaticamente após a primeira compra.
        </div>
      )}
    </div>
  );
}
