"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { createProductAction, type CreateState } from "./actions";

const initialState: CreateState = { error: null };

export default function NovoForm() {
  const [state, formAction, isPending] = useActionState(
    createProductAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-4"
    >
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-bold text-foreground/70">Nome do produto</span>
        <input
          name="name"
          type="text"
          required
          placeholder="Ex.: Camisa Itália Azul 2026"
          className="h-12 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-bold text-foreground/70">
          Slug (opcional)
        </span>
        <input
          name="slug"
          type="text"
          placeholder="auto a partir do nome"
          className="h-12 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
        />
        <span className="text-[11px] text-foreground/50">
          URL final: /produto/<strong>slug</strong>
        </span>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-bold text-foreground/70">Preço base (R$)</span>
        <input
          name="base_price"
          type="number"
          step="0.01"
          min="0"
          required
          placeholder="150.00"
          className="h-12 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
        />
      </label>

      {state.error && (
        <p className="text-xs text-red-600 font-medium">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="h-12 rounded-full bg-foreground text-white font-bold text-sm hover:bg-foreground/90 disabled:opacity-50 transition flex items-center justify-center gap-2"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Criando...
          </>
        ) : (
          "Criar produto"
        )}
      </button>

      <p className="text-[11px] text-foreground/50 text-center">
        O produto é criado como rascunho (oculto na loja). Depois você completa
        imagens/estoque/descrição na tela de edição.
      </p>
    </form>
  );
}
