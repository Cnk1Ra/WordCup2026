import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Package,
  Truck,
  Home,
  XCircle,
  Clock,
} from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/products";

export const dynamic = "force-dynamic";

type OrderStatus =
  | "pending"
  | "paid"
  | "producing"
  | "shipping"
  | "delivered"
  | "cancelled"
  | "refunded";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Aguardando pagamento",
  paid: "Pagamento confirmado",
  producing: "Em produção",
  shipping: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

const STATUS_FLOW: OrderStatus[] = ["paid", "producing", "shipping", "delivered"];

export default async function PedidoPage({
  params,
  searchParams,
}: {
  params: Promise<{ number: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { number } = await params;
  const { email } = await searchParams;

  // Sem email: mostra form pedindo o email pra dar match com o pedido
  if (!email) {
    return <EmailGate number={number} />;
  }

  const supabase = getSupabaseServer();
  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, number, status, customer_email, customer_name, subtotal, shipping, discount, total, tracking_code, created_at, paid_at, shipped_at, delivered_at, shipping_address, coupon_code"
    )
    .eq("number", number)
    .ilike("customer_email", email)
    .maybeSingle();

  if (!order) notFound();

  const { data: items } = await supabase
    .from("order_items")
    .select("product_name, size, quantity, unit_price, personalization")
    .eq("order_id", order.id);

  const currentStep =
    order.status === "cancelled" || order.status === "refunded"
      ? -1
      : STATUS_FLOW.indexOf(order.status as OrderStatus);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/"
        className="text-sm text-foreground/60 hover:text-foreground"
      >
        ← Voltar pra loja
      </Link>

      <header className="mt-3">
        <p className="text-xs uppercase tracking-wider text-foreground/55 font-semibold">
          Pedido
        </p>
        <h1 className="text-4xl font-black tracking-tight">{order.number}</h1>
        <p className="text-sm text-foreground/65 mt-2">
          Feito em{" "}
          {new Date(order.created_at).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </header>

      {/* Timeline */}
      <section className="mt-8 rounded-3xl bg-white border border-border p-6">
        {order.status === "cancelled" || order.status === "refunded" ? (
          <div className="flex items-center gap-3 text-red-700">
            <XCircle className="size-6" />
            <p className="font-bold">
              {STATUS_LABELS[order.status as OrderStatus]}
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            <StepBox
              label="Pago"
              done={currentStep >= 0}
              icon={CheckCircle2}
              date={order.paid_at}
            />
            <StepBox
              label="Em produção"
              done={currentStep >= 1}
              icon={Package}
            />
            <StepBox
              label="Enviado"
              done={currentStep >= 2}
              icon={Truck}
              date={order.shipped_at}
            />
            <StepBox
              label="Entregue"
              done={currentStep >= 3}
              icon={Home}
              date={order.delivered_at}
            />
          </div>
        )}

        {order.tracking_code && (
          <div className="mt-6 rounded-2xl bg-muted p-4 text-sm flex items-center gap-2">
            <Truck className="size-4 text-foreground/55" />
            <span>
              Código de rastreio:{" "}
              <strong className="font-mono">{order.tracking_code}</strong>
            </span>
          </div>
        )}
      </section>

      {/* Itens */}
      <section className="mt-6 rounded-3xl bg-white border border-border p-6">
        <h2 className="font-bold mb-4">Itens do pedido</h2>
        <div className="divide-y divide-border">
          {(items ?? []).map((it, i) => (
            <div key={i} className="py-3 flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-sm">{it.product_name}</p>
                <p className="text-xs text-foreground/60">
                  Tamanho {it.size} · {it.quantity}x
                </p>
                {it.personalization && (
                  <p className="text-xs text-foreground/60">
                    Personalização: {it.personalization.name} #{it.personalization.number}
                  </p>
                )}
              </div>
              <p className="text-sm font-bold whitespace-nowrap">
                {formatBRL(Number(it.unit_price) * it.quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-foreground/65">Subtotal</span>
            <span>{formatBRL(Number(order.subtotal))}</span>
          </div>
          {Number(order.discount) > 0 && (
            <div className="flex justify-between text-brand-green">
              <span>
                Cupom {order.coupon_code && <strong>{order.coupon_code}</strong>}
              </span>
              <span>−{formatBRL(Number(order.discount))}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-foreground/65">Frete</span>
            <span>{formatBRL(Number(order.shipping))}</span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2">
            <span>Total</span>
            <span>{formatBRL(Number(order.total))}</span>
          </div>
        </div>
      </section>

      {order.shipping_address && (
        <section className="mt-6 rounded-3xl bg-white border border-border p-6">
          <h2 className="font-bold mb-3">Endereço de entrega</h2>
          <p className="text-sm text-foreground/75 leading-relaxed">
            {order.customer_name && <>{order.customer_name}<br /></>}
            {[
              order.shipping_address.line1,
              order.shipping_address.line2,
              order.shipping_address.city,
              order.shipping_address.state,
              order.shipping_address.postal_code,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
        </section>
      )}
    </article>
  );
}

function StepBox({
  label,
  done,
  icon: Icon,
  date,
}: {
  label: string;
  done: boolean;
  icon: typeof CheckCircle2;
  date?: string | null;
}) {
  return (
    <div
      className={`flex-1 rounded-2xl p-3 flex items-center gap-3 ${
        done ? "bg-brand-green/10" : "bg-muted"
      }`}
    >
      <Icon
        className={`size-5 shrink-0 ${
          done ? "text-brand-green" : "text-foreground/30"
        }`}
      />
      <div className="min-w-0">
        <p
          className={`text-xs font-bold ${
            done ? "text-foreground" : "text-foreground/50"
          }`}
        >
          {label}
        </p>
        {date && (
          <p className="text-[10px] text-foreground/55">
            {new Date(date).toLocaleDateString("pt-BR")}
          </p>
        )}
      </div>
    </div>
  );
}

function EmailGate({ number }: { number: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Link
        href="/"
        className="text-sm text-foreground/60 hover:text-foreground"
      >
        ← Voltar pra loja
      </Link>

      <div className="mt-6 rounded-3xl bg-white border border-border p-6">
        <Clock className="size-6 text-foreground/55 mb-2" />
        <h1 className="text-2xl font-black tracking-tight">
          Acompanhar pedido
        </h1>
        <p className="text-sm text-foreground/65 mt-1">
          Pedido <strong>{number}</strong>. Confirma o email usado na compra
          pra ver o status.
        </p>
        <form className="mt-5 flex flex-col gap-3" method="GET">
          <input
            name="email"
            type="email"
            required
            placeholder="seu@email.com"
            className="h-12 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          />
          <button
            type="submit"
            className="h-12 rounded-full bg-foreground text-white font-bold text-sm hover:bg-foreground/90 transition"
          >
            Ver pedido
          </button>
        </form>
      </div>
    </div>
  );
}
