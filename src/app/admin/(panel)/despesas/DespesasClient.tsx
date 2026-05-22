"use client";

import { useActionState, useState, useTransition } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import {
  createExpenseAction,
  deleteExpense,
  type ExpenseFormState,
} from "./actions";
import { formatBRL } from "@/lib/products";

type Expense = {
  id: string;
  description: string;
  category: string;
  amount: number | string;
  occurred_at: string;
  notes: string | null;
  paid_by_name?: string | null;
};

type Admin = { id: string; name: string | null; email: string };

const initialState: ExpenseFormState = { error: null };

const CATEGORY_LABELS: Record<string, string> = {
  anuncios: "Anúncios",
  fornecedor: "Fornecedor",
  frete: "Frete",
  taxas: "Taxas",
  salarios: "Salários",
  software: "Software",
  outros: "Outros",
};

export default function DespesasClient({
  expenses,
  admins,
}: {
  expenses: Expense[];
  admins: Admin[];
}) {
  const [state, formAction, isPending] = useActionState(
    createExpenseAction,
    initialState
  );
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function remove(id: string) {
    if (!confirm("Excluir essa despesa?")) return;
    setBusyId(id);
    startTransition(async () => {
      await deleteExpense(id);
      setBusyId(null);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <form
        action={formAction}
        className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-4"
      >
        <h2 className="font-bold text-sm">Nova despesa</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            name="description"
            type="text"
            required
            placeholder="Descrição (ex: Anúncio Instagram)"
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          />
          <input
            name="amount"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="Valor (R$)"
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          />
          <select
            name="category"
            defaultValue="outros"
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          >
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <input
            name="occurred_at"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          />
          <select
            name="paid_by_admin_id"
            required
            defaultValue=""
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          >
            <option value="">Quem pagou? *</option>
            {admins.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name || a.email.split("@")[0]}
              </option>
            ))}
          </select>
          <input
            name="notes"
            type="text"
            placeholder="Notas (opcional)"
            className="sm:col-span-2 h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          />
        </div>
        {state.error && (
          <p className="text-xs text-red-600 font-medium">{state.error}</p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="self-start h-11 px-5 rounded-full bg-foreground text-white font-bold text-sm hover:bg-foreground/90 disabled:opacity-50 inline-flex items-center gap-2"
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Adicionar despesa
        </button>
      </form>

      <div className="rounded-3xl bg-white border border-border overflow-hidden">
        {expenses.length === 0 ? (
          <p className="p-6 text-sm text-foreground/60 text-center">
            Nenhuma despesa registrada ainda.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {expenses.map((e) => (
              <div key={e.id} className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{e.description}</p>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    {new Date(e.occurred_at).toLocaleDateString("pt-BR")} ·{" "}
                    <span className="font-bold uppercase tracking-wider text-foreground/80">
                      {CATEGORY_LABELS[e.category] ?? e.category}
                    </span>
                    {e.paid_by_name && (
                      <span className="ml-2 inline-block bg-foreground/10 rounded-full px-2 py-0.5 text-foreground/75">
                        pagou: {e.paid_by_name}
                      </span>
                    )}
                    {e.notes && <span className="ml-2">· {e.notes}</span>}
                  </p>
                </div>
                <p className="text-sm font-black text-red-600 whitespace-nowrap">
                  −{formatBRL(Number(e.amount))}
                </p>
                <button
                  onClick={() => remove(e.id)}
                  disabled={busyId === e.id}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                  title="Excluir"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
