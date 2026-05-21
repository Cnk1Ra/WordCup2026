"use client";

import { useActionState, useState, useTransition } from "react";
import { Plus, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import {
  createCouponAction,
  toggleCouponActive,
  deleteCoupon,
  type CouponFormState,
} from "./actions";

type Coupon = {
  id: string;
  code: string;
  description: string | null;
  type: "percentage" | "fixed";
  value: number | string;
  min_subtotal: number | string;
  max_uses: number | null;
  uses: number;
  expires_at: string | null;
  is_active: boolean;
};

const initialState: CouponFormState = { error: null };

export default function CuponsClient({ coupons }: { coupons: Coupon[] }) {
  const [state, formAction, isPending] = useActionState(
    createCouponAction,
    initialState
  );
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function toggle(id: string) {
    setBusyId(id);
    startTransition(async () => {
      await toggleCouponActive(id);
      setBusyId(null);
    });
  }

  function remove(c: Coupon) {
    if (!confirm(`Excluir cupom "${c.code}"?`)) return;
    setBusyId(c.id);
    startTransition(async () => {
      await deleteCoupon(c.id);
      setBusyId(null);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        action={formAction}
        className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-4"
      >
        <h2 className="font-bold text-sm">Novo cupom</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            name="code"
            type="text"
            required
            placeholder="CODIGO10"
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-bold uppercase focus:outline-none focus:border-foreground"
          />
          <select
            name="type"
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          >
            <option value="percentage">% (porcentagem)</option>
            <option value="fixed">R$ (valor fixo)</option>
          </select>
          <input
            name="value"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="10 (= 10% ou R$10)"
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          />
          <input
            name="min_subtotal"
            type="number"
            step="0.01"
            min="0"
            placeholder="Mínimo subtotal (R$)"
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          />
          <input
            name="max_uses"
            type="number"
            min="1"
            placeholder="Máx usos (vazio = ilimitado)"
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          />
          <input
            name="expires_at"
            type="date"
            placeholder="Validade (opcional)"
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          />
          <input
            name="description"
            type="text"
            placeholder="Descrição (interna)"
            className="sm:col-span-2 h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          />
        </div>
        {state.error && (
          <p className="text-xs text-red-600 font-medium">{state.error}</p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="self-start h-11 px-5 rounded-full bg-foreground text-white font-bold text-sm hover:bg-foreground/90 disabled:opacity-50 transition inline-flex items-center gap-2"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
          Criar cupom
        </button>
      </form>

      <div className="rounded-3xl bg-white border border-border overflow-hidden">
        <div className="divide-y divide-border">
          {coupons.length === 0 && (
            <p className="p-6 text-sm text-foreground/60 text-center">
              Nenhum cupom criado ainda.
            </p>
          )}
          {coupons.map((c) => (
            <div key={c.id} className="p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-black uppercase tracking-wide">{c.code}</p>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-foreground text-white rounded-full px-2 py-0.5">
                    {c.type === "percentage" ? `${c.value}%` : `R$ ${Number(c.value).toFixed(2)}`}
                  </span>
                  {!c.is_active && (
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-muted text-foreground/60 rounded-full px-2 py-0.5">
                      inativo
                    </span>
                  )}
                </div>
                {c.description && (
                  <p className="text-xs text-foreground/60 mt-0.5">{c.description}</p>
                )}
                <p className="text-[11px] text-foreground/55 mt-1">
                  {c.uses} usos{c.max_uses ? ` / ${c.max_uses}` : ""}
                  {Number(c.min_subtotal) > 0 && ` · mínimo R$ ${Number(c.min_subtotal).toFixed(2)}`}
                  {c.expires_at &&
                    ` · expira ${new Date(c.expires_at).toLocaleDateString("pt-BR")}`}
                </p>
              </div>
              <button
                onClick={() => toggle(c.id)}
                disabled={busyId === c.id}
                className="p-2 rounded-lg hover:bg-muted text-foreground/60 hover:text-foreground"
                title={c.is_active ? "Ativo" : "Inativo"}
              >
                {c.is_active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
              <button
                onClick={() => remove(c)}
                disabled={busyId === c.id}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                title="Excluir"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
