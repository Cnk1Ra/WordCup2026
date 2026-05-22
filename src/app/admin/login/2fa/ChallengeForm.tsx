"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";
import {
  verifyChallengeAction,
  cancelChallengeAction,
  type State,
} from "./actions";

const initial: State = { error: null };

export default function ChallengeForm({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState(
    verifyChallengeAction,
    initial
  );

  return (
    <form
      action={formAction}
      className="bg-white border border-border rounded-2xl p-6 flex flex-col gap-4"
    >
      <p className="text-sm text-foreground/70">
        Digite o código de 6 dígitos do seu app autenticador para entrar como{" "}
        <strong>{email}</strong>.
      </p>

      <input
        type="text"
        name="code"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        pattern="[0-9]{6}"
        autoFocus
        className="border border-border rounded-xl px-4 py-3 text-2xl tracking-[0.5em] font-mono text-center bg-white"
        required
      />

      {state.error && (
        <div className="rounded-xl bg-red-50 text-red-800 px-4 py-3 text-sm flex items-start gap-2">
          <AlertCircle className="size-4 mt-0.5" />
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="px-5 py-3 rounded-xl bg-foreground text-white text-sm font-bold disabled:opacity-50"
      >
        {pending ? "Verificando..." : "Confirmar"}
      </button>

      <button
        type="button"
        formAction={cancelChallengeAction}
        className="text-xs text-foreground/55 hover:text-foreground/80 self-center"
      >
        Cancelar e sair
      </button>
    </form>
  );
}
