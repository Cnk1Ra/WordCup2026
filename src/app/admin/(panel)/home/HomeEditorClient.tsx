"use client";

import { useActionState } from "react";
import { Loader2, Save, ExternalLink, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { saveHeroAction, type SaveHeroState } from "./actions";
import type { HeroSettings } from "@/lib/site-settings";

const initialState: SaveHeroState = { error: null, success: false };

export default function HomeEditorClient({
  initialHero,
}: {
  initialHero: HeroSettings;
}) {
  const [state, formAction, isPending] = useActionState(
    saveHeroAction,
    initialState
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <section className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Banner principal (Hero)</h2>
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-foreground/60 hover:text-foreground"
          >
            <ExternalLink className="size-3.5" />
            Ver loja
          </Link>
        </div>

        <Field label="Etiqueta acima do título" hint="Ex.: Coleção Copa 2026">
          <input
            name="tag"
            defaultValue={initialHero.tag}
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Título (linha 1)">
            <input
              name="title_line_1"
              defaultValue={initialHero.title_line_1}
              className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
            />
          </Field>
          <Field label="Título (linha 2 — destacada)">
            <input
              name="title_line_2"
              defaultValue={initialHero.title_line_2}
              className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
            />
          </Field>
        </div>

        <Field label="Descrição">
          <textarea
            name="description"
            defaultValue={initialHero.description}
            rows={3}
            className="rounded-2xl border border-border bg-muted px-4 py-3 text-sm font-medium focus:outline-none focus:border-foreground resize-none"
          />
        </Field>

        <Field label="Texto do botão (CTA)">
          <input
            name="cta_label"
            defaultValue={initialHero.cta_label}
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
          />
        </Field>
      </section>

      <div className="flex items-center gap-3 sticky bottom-4">
        <button
          type="submit"
          disabled={isPending}
          className="h-12 px-6 rounded-full bg-foreground text-white font-bold text-sm hover:bg-foreground/90 disabled:opacity-50 transition inline-flex items-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Salvando…
            </>
          ) : (
            <>
              <Save className="size-4" />
              Salvar
            </>
          )}
        </button>
        {state.success && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-green">
            <CheckCircle2 className="size-4" />
            Salvo
          </span>
        )}
        {state.error && (
          <span className="text-sm font-medium text-red-600">{state.error}</span>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold text-foreground/70">{label}</span>
      {children}
      {hint && (
        <span className="text-[11px] text-foreground/50">{hint}</span>
      )}
    </label>
  );
}
