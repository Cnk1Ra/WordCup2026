"use client";

import { useActionState, useState, useMemo, useRef, useEffect } from "react";
import { Loader2, Save, Search, X } from "lucide-react";
import { createManualOrderAction, type ManualOrderState } from "../actions";

type Product = { id: string; name: string; slug: string; base_price: number | string };

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function ProductPicker({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = products.find((p) => p.id === selectedId);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return products.slice(0, 30);
    return products
      .filter((p) => normalize(`${p.name} ${p.slug}`).includes(q))
      .slice(0, 30);
  }, [query, products]);

  // Fecha o dropdown clicando fora
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  function pick(p: Product) {
    setSelectedId(p.id);
    setQuery("");
    setOpen(false);
  }

  function clear() {
    setSelectedId("");
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name="product_id" value={selectedId} required />

      {selected ? (
        <div className="h-11 rounded-2xl border border-foreground/30 bg-white px-3 flex items-center gap-2 text-sm">
          <div className="flex-1 truncate font-medium">
            {selected.name}
            <span className="text-foreground/55 ml-1.5 text-xs">
              R$ {Number(selected.base_price).toFixed(2)}
            </span>
          </div>
          <button
            type="button"
            onClick={clear}
            aria-label="Trocar produto"
            className="size-7 rounded-full hover:bg-muted grid place-items-center shrink-0"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setOpen(true)}
              placeholder="Buscar produto por nome…"
              autoComplete="off"
              className="h-11 w-full rounded-2xl border border-border bg-muted pl-9 pr-3 text-sm font-medium focus:outline-none focus:border-foreground"
            />
          </div>

          {open && (
            <div className="absolute z-20 mt-1 left-0 right-0 max-h-80 overflow-y-auto rounded-2xl border border-border bg-white shadow-lg">
              {filtered.length === 0 ? (
                <p className="px-4 py-3 text-xs text-foreground/55">
                  Nenhum produto encontrado.
                </p>
              ) : (
                filtered.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => pick(p)}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted flex items-center justify-between gap-3 border-b border-border last:border-0"
                  >
                    <span className="truncate font-medium">{p.name}</span>
                    <span className="text-xs text-foreground/55 shrink-0">
                      R$ {Number(p.base_price).toFixed(2)}
                    </span>
                  </button>
                ))
              )}
              {query.trim() === "" && products.length > 30 && (
                <p className="px-4 py-2 text-[11px] text-foreground/45 border-t border-border bg-muted/30">
                  Mostrando primeiros 30 — digite pra refinar
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

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
          <ProductPicker products={products} />
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
