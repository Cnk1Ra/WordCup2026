import Link from "next/link";
import { CheckCircle2, Package, Mail } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/products";
import ClearCartOnMount from "./ClearCartOnMount";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

// Busca o pedido por stripe_session_id. Tenta até 8s pra dar tempo do webhook
// processar e persistir o pedido (race condition: usuario chega aqui antes do
// webhook terminar). Se não achar, mostra fallback genérico.
async function fetchOrder(sessionId: string) {
  const supabase = getSupabaseServer();
  const startedAt = Date.now();

  while (Date.now() - startedAt < 8000) {
    const { data } = await supabase
      .from("orders")
      .select(
        "id, number, total, subtotal, shipping, customer_email, customer_name, status, created_at, order_items(product_name, size, quantity, unit_price, personalization)"
      )
      .eq("stripe_session_id", sessionId)
      .maybeSingle();
    if (data) return data;
    await new Promise((r) => setTimeout(r, 1000));
  }
  return null;
}

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;
  const order = session_id ? await fetchOrder(session_id) : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:py-16 flex flex-col items-center gap-6">
      <ClearCartOnMount />

      <div className="size-20 rounded-full bg-emerald-500/10 text-emerald-600 grid place-items-center">
        <CheckCircle2 className="size-12" strokeWidth={2} />
      </div>

      <div className="text-center flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Obrigado pela compra!
        </h1>
        <p className="text-foreground/65 max-w-md text-sm sm:text-base">
          Pagamento confirmado. Estamos preparando seu pedido com carinho.
        </p>
      </div>

      {order ? (
        <div className="w-full bg-white border border-border rounded-3xl p-6 sm:p-8 flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                Número do pedido
              </div>
              <div className="text-xl font-black mt-0.5">{order.number}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
                Total
              </div>
              <div className="text-xl font-black mt-0.5">
                {formatBRL(Number(order.total))}
              </div>
            </div>
          </div>

          {order.order_items && order.order_items.length > 0 && (
            <div className="border-t border-border pt-5 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                <Package className="size-4" />
                Itens ({order.order_items.length})
              </div>
              {order.order_items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <div className="flex-1">
                    <div className="font-semibold">{item.product_name}</div>
                    <div className="text-foreground/60 text-xs mt-0.5">
                      Tam. {item.size} · Qtd. {item.quantity}
                      {item.personalization &&
                        ((item.personalization as { name?: string }).name ||
                          (item.personalization as { number?: string })
                            .number) && (
                          <>
                            {" · "}
                            {(item.personalization as { name?: string }).name}
                            {(item.personalization as { number?: string })
                              .number &&
                              ` #${(item.personalization as { number?: string }).number}`}
                          </>
                        )}
                    </div>
                  </div>
                  <div className="font-medium">
                    {formatBRL(Number(item.unit_price) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-border pt-5 mt-1 flex items-start gap-3 rounded-2xl bg-muted/50 p-4">
            <Mail className="size-5 text-foreground/60 shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-semibold">Confirmação enviada</div>
              <div className="text-foreground/60 text-xs mt-0.5">
                Em breve você vai receber um e-mail em{" "}
                <strong>{order.customer_email}</strong> com os detalhes
                completos. Atualizamos o status assim que despachar.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full bg-white border border-border rounded-3xl p-6 text-sm text-foreground/70 text-center">
          Estamos processando seu pedido. Em alguns instantes você vai receber
          o e-mail de confirmação com os detalhes completos.
        </div>
      )}

      <div
        className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        style={{ position: "relative", zIndex: 20 }}
      >
        {order && (
          <Link
            href={`/pedido/${order.number}?email=${encodeURIComponent(order.customer_email)}`}
            prefetch={false}
            className="rounded-full bg-foreground text-white font-bold px-6 py-3 text-center transition hover:opacity-90 block sm:inline-block"
          >
            Acompanhar pedido →
          </Link>
        )}
        <Link
          href="/"
          prefetch={false}
          className="rounded-full border border-foreground/20 font-bold px-6 py-3 text-center transition hover:bg-muted/50 block sm:inline-block"
        >
          Voltar à loja
        </Link>
      </div>
    </div>
  );
}
