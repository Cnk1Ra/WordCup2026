"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { createManualOrderAction, type ManualOrderState } from "../actions";

type Product = { id: string; name: string; slug: string; base_price: number | string };

const initialState: ManualOrderState = { error: null };

export default function NovoPedidoForm({ products }: { products: Product[] }) {
  const [state, formAction, isPending] = useActionState(
    createManualOrderAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-4"
    >
      <h2 className="font-bold text-sm">Cliente</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Nome do cliente *">
          <input
            name="customer_name"
            type="text"
            required
            placeholder="João da Silva"
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          />
        </Field>
        <Field label="Email (opcional)">
          <input
            name="customer_email"
            type="email"
            placeholder="cliente@email.com"
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          />
        </Field>
        <Field label="Telefone / WhatsApp (opcional)" full>
          <input
            name="customer_phone"
            type="tel"
            placeholder="(31) 9 9999-9999"
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          />
        </Field>
      </div>

      <h2 className="font-bold text-sm mt-2">Produto</h2>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_120px] gap-3">
        <Field label="Produto *">
          <select
            name="product_id"
            required
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          >
            <option value="">Escolher…</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — R$ {Number(p.base_price).toFixed(2)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Tamanho">
          <select
            name="size"
            defaultValue="M"
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          >
            {["P", "M", "G", "GG", "XGG"].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Qtd">
          <input
            name="quantity"
            type="number"
            min="1"
            defaultValue="1"
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          />
        </Field>
      </div>

      <h2 className="font-bold text-sm mt-2">Pagamento</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Total recebido (R$) *">
          <input
            name="total"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="150.00"
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          />
        </Field>
        <Field label="Forma de pagamento">
          <select
            name="payment_method"
            defaultValue="dinheiro"
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          >
            <option value="dinheiro">Dinheiro</option>
            <option value="pix">Pix direto</option>
            <option value="transferencia">Transferência</option>
            <option value="cartao_externo">Cartão (maquininha externa)</option>
            <option value="outros">Outros</option>
          </select>
        </Field>
      </div>

      <Field label="Notas (opcional)" full>
        <textarea
          name="notes"
          rows={2}
          placeholder="Observações sobre a venda…"
          className="rounded-2xl border border-border bg-muted px-4 py-3 text-sm font-medium focus:outline-none focus:border-foreground resize-none"
        />
      </Field>

      {state.error && (
        <p className="text-xs text-red-600 font-medium">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="self-start h-12 px-6 rounded-full bg-foreground text-white font-bold text-sm hover:bg-foreground/90 disabled:opacity-50 inline-flex items-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Criando…
          </>
        ) : (
          <>
            <Save className="size-4" />
            Registrar pedido
          </>
        )}
      </button>

      <p className="text-[11px] text-foreground/55">
        O pedido é registrado como <strong>pago</strong> automaticamente.
        Entra no dashboard junto com as vendas online do Stripe.
      </p>
    </form>
  );
}

function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-bold text-foreground/70">{label}</span>
      {children}
    </label>
  );
}
