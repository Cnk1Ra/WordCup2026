"use client";

import { useState, useTransition } from "react";
import { Truck, Save, CheckCircle2, Loader2, XCircle, AlertCircle } from "lucide-react";
import {
  updateOrderStatus,
  updateTrackingCode,
  cancelOrderAction,
} from "../actions";
import { formatBRL } from "@/lib/products";

type OrderStatus =
  | "pending"
  | "paid"
  | "producing"
  | "shipping"
  | "delivered"
  | "cancelled"
  | "refunded";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Aguardando pagamento" },
  { value: "paid", label: "Pago" },
  { value: "producing", label: "Em produção" },
  { value: "shipping", label: "Em rota" },
  { value: "delivered", label: "Entregue" },
  { value: "cancelled", label: "Cancelado" },
  { value: "refunded", label: "Reembolsado" },
];

type Order = {
  id: string;
  number: string;
  status: string;
  customer_name: string | null;
  customer_email: string;
  customer_phone: string | null;
  subtotal: number | string;
  shipping: number | string;
  discount: number | string;
  total: number | string;
  coupon_code: string | null;
  tracking_code: string | null;
  shipping_address: Record<string, string> | null;
  notes: string | null;
  stripe_payment_intent: string | null;
};

type Item = {
  product_name: string;
  size: string;
  quantity: number;
  unit_price: number | string;
  personalization: { name: string; number: string } | null;
};

export default function OrderDetailClient({
  order,
  items,
}: {
  order: Order;
  items: Item[];
}) {
  const [status, setStatus] = useState<OrderStatus>(order.status as OrderStatus);
  const [tracking, setTracking] = useState(order.tracking_code ?? "");
  const [savingStatus, startStatus] = useTransition();
  const [savingTracking, startTracking] = useTransition();
  const [statusOk, setStatusOk] = useState(false);
  const [trackingOk, setTrackingOk] = useState(false);
  const [cancelling, startCancel] = useTransition();
  const [cancelMsg, setCancelMsg] = useState<{
    type: "ok" | "error";
    text: string;
  } | null>(null);

  const isCancelled = status === "cancelled" || status === "refunded";
  const wasPaid = ["paid", "producing", "shipping"].includes(status);

  function handleCancel() {
    const reason = prompt(
      "Motivo do cancelamento? (opcional, vai pro email do cliente)\n\nDeixe vazio se quiser pular."
    );
    if (reason === null) return; // usuário apertou cancel no prompt

    const confirmMsg = wasPaid
      ? `Confirmar cancelamento do pedido ${order.number}?\n\n• Reembolso de ${formatBRL(Number(order.total))} no Stripe\n• Estoque será restaurado\n• Cliente recebe email`
      : `Confirmar cancelamento do pedido ${order.number}?\n\n• Estoque será restaurado\n• Cliente recebe email`;
    if (!confirm(confirmMsg)) return;

    setCancelMsg(null);
    startCancel(async () => {
      const result = await cancelOrderAction(order.id, reason || undefined);
      if (result.ok) {
        setCancelMsg({
          type: "ok",
          text: result.refunded
            ? `Cancelado e reembolsado (${result.refundId}). Cliente notificado.`
            : "Cancelado. Cliente notificado.",
        });
        setStatus(result.refunded ? "refunded" : "cancelled");
      } else {
        setCancelMsg({ type: "error", text: result.error });
      }
    });
  }

  function saveStatus(next: OrderStatus) {
    setStatus(next);
    startStatus(async () => {
      await updateOrderStatus(order.id, next);
      setStatusOk(true);
      setTimeout(() => setStatusOk(false), 2000);
    });
  }

  function saveTracking() {
    startTracking(async () => {
      await updateTrackingCode(order.id, tracking);
      setTrackingOk(true);
      setTimeout(() => setTrackingOk(false), 2000);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Status + tracking */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <section className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Status</h2>
            {statusOk && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-green">
                <CheckCircle2 className="size-3.5" /> Salvo
              </span>
            )}
          </div>
          <select
            value={status}
            disabled={savingStatus}
            onChange={(e) => saveStatus(e.target.value as OrderStatus)}
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground disabled:opacity-50"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-foreground/55">
            Mudar pra <strong>Em rota</strong> ou <strong>Entregue</strong>{" "}
            registra a data automaticamente.
          </p>
        </section>

        <section className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold flex items-center gap-2">
              <Truck className="size-4" /> Código de rastreio
            </h2>
            {trackingOk && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-green">
                <CheckCircle2 className="size-3.5" /> Salvo
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="BR12345678AB"
              className="flex-1 h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-mono uppercase focus:outline-none focus:border-foreground"
            />
            <button
              onClick={saveTracking}
              disabled={savingTracking}
              className="h-11 px-4 rounded-2xl bg-foreground text-white text-xs font-bold hover:bg-foreground/90 disabled:opacity-50 inline-flex items-center gap-1"
            >
              {savingTracking ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Save className="size-3.5" />
              )}
              Salvar
            </button>
          </div>
          <p className="text-xs text-foreground/55">
            Cliente vê o código em <code>/pedido/{order.id.slice(0, 8)}</code>.
          </p>
        </section>
      </div>

      {/* Cliente */}
      <section className="rounded-3xl bg-white border border-border p-6">
        <h2 className="font-bold mb-3">Cliente</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div>
            <p className="text-xs text-foreground/55">Nome</p>
            <p className="font-bold">{order.customer_name ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-foreground/55">Email</p>
            <p className="font-mono text-xs">{order.customer_email}</p>
          </div>
          <div>
            <p className="text-xs text-foreground/55">Telefone</p>
            <p>{order.customer_phone ?? "—"}</p>
          </div>
        </div>
        {order.shipping_address && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-foreground/55 mb-1">Endereço de entrega</p>
            <p className="text-sm leading-relaxed">
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
          </div>
        )}
      </section>

      {/* Itens */}
      <section className="rounded-3xl bg-white border border-border p-6">
        <h2 className="font-bold mb-3">Itens</h2>
        <div className="divide-y divide-border">
          {items.map((it, i) => (
            <div key={i} className="py-3 flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-sm">{it.product_name}</p>
                <p className="text-xs text-foreground/60">
                  Tam {it.size} · {it.quantity}x
                </p>
                {it.personalization && (
                  <p className="text-xs text-foreground/60">
                    Personalização: {it.personalization.name} #
                    {it.personalization.number}
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

      {order.notes && (
        <section className="rounded-3xl bg-yellow-50 border border-yellow-200 p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-yellow-900/70">
            Notas internas
          </p>
          <p className="text-sm mt-1">{order.notes}</p>
        </section>
      )}

      {/* Zona perigosa: cancelar pedido */}
      <section className="rounded-3xl border border-red-200 bg-red-50/40 p-6 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="size-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h2 className="font-bold text-red-900">Cancelar pedido</h2>
            <p className="text-xs text-red-900/70 mt-1 leading-relaxed">
              {wasPaid
                ? "Vai reembolsar via Stripe (R$ volta pro cartão em 5-10 dias), restaurar o estoque e mandar email pro cliente."
                : "Vai restaurar o estoque e mandar email pro cliente. Sem cobrança envolvida."}
            </p>
          </div>
        </div>

        {cancelMsg && (
          <div
            className={`rounded-xl px-4 py-3 text-sm flex items-start gap-2 ${
              cancelMsg.type === "ok"
                ? "bg-emerald-50 text-emerald-800"
                : "bg-red-100 text-red-900"
            }`}
          >
            {cancelMsg.type === "ok" ? (
              <CheckCircle2 className="size-4 mt-0.5" />
            ) : (
              <AlertCircle className="size-4 mt-0.5" />
            )}
            {cancelMsg.text}
          </div>
        )}

        <button
          type="button"
          onClick={handleCancel}
          disabled={cancelling || isCancelled}
          className="self-start inline-flex items-center gap-2 h-11 px-5 rounded-full bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {cancelling ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <XCircle className="size-4" />
          )}
          {cancelling
            ? "Cancelando..."
            : isCancelled
              ? "Pedido já cancelado"
              : wasPaid
                ? `Cancelar e reembolsar ${formatBRL(Number(order.total))}`
                : "Cancelar pedido"}
        </button>
      </section>
    </div>
  );
}
