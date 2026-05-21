"use client";

import { useState, useTransition, useActionState } from "react";
import Link from "next/link";
import { Plus, Trash2, Eye, EyeOff, Loader2, ChevronRight } from "lucide-react";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  type FormState,
} from "./actions";

type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  productCount: number;
};

const initialState: FormState = { error: null };

export default function CategoriasClient({
  categories,
}: {
  categories: Category[];
}) {
  const [state, formAction, isPending] = useActionState(
    createCategoryAction,
    initialState
  );
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function toggleActive(c: Category) {
    setBusyId(c.id);
    startTransition(async () => {
      await updateCategoryAction(c.id, { is_active: !c.is_active });
      setBusyId(null);
    });
  }

  function remove(c: Category) {
    if (c.productCount > 0) {
      alert(
        `Essa categoria tem ${c.productCount} produto(s) vinculados. Desassocie primeiro.`
      );
      return;
    }
    if (!confirm(`Excluir categoria "${c.name}"?`)) return;
    setBusyId(c.id);
    startTransition(async () => {
      await deleteCategoryAction(c.id);
      setBusyId(null);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <form
        action={formAction}
        className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-4"
      >
        <h2 className="font-bold text-sm">Nova categoria</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            name="name"
            type="text"
            required
            placeholder="Nome da categoria"
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          />
          <input
            name="slug"
            type="text"
            placeholder="slug (opcional, gerado do nome)"
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
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
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Criar
        </button>
      </form>

      <div className="rounded-3xl bg-white border border-border overflow-hidden">
        <div className="divide-y divide-border">
          {categories.length === 0 && (
            <p className="p-6 text-sm text-foreground/60 text-center">
              Nenhuma categoria ainda.
            </p>
          )}
          {categories.map((c) => (
            <div key={c.id} className="p-4 flex items-center gap-4">
              <Link
                href={`/admin/categorias/${c.slug}`}
                className="flex-1 min-w-0 group"
              >
                <div className="flex items-center gap-2">
                  <p className="font-bold truncate group-hover:text-brand-green transition">
                    {c.name}
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-muted text-foreground/60 rounded-full px-2 py-0.5">
                    {c.slug}
                  </span>
                  <ChevronRight className="size-3.5 text-foreground/30 group-hover:text-foreground/60 transition" />
                </div>
                <p className="text-xs text-foreground/60 mt-0.5">
                  {c.productCount} produto(s) · clique pra ver
                </p>
              </Link>
              <button
                onClick={() => toggleActive(c)}
                disabled={busyId === c.id}
                className="p-2 rounded-lg hover:bg-muted text-foreground/60 hover:text-foreground transition"
                title={c.is_active ? "Ativa" : "Inativa"}
              >
                {c.is_active ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              </button>
              <button
                onClick={() => remove(c)}
                disabled={busyId === c.id || c.productCount > 0}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition disabled:text-foreground/20 disabled:hover:bg-transparent"
                title={
                  c.productCount > 0
                    ? `Tem ${c.productCount} produto(s) — desassocie primeiro`
                    : "Excluir"
                }
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
