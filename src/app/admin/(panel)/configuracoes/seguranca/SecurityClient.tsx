"use client";

import { useState, useTransition } from "react";
import { AlertCircle, Check, ShieldCheck, ShieldX } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  enrollTotp,
  verifyTotpEnrollment,
  disableTotp,
} from "./actions";

type Props = {
  hasVerifiedTotp: boolean;
  currentFactorId: string | null;
  currentAal: string;
};

type EnrollState = {
  factorId: string;
  qrCode: string;
  secret: string;
};

export default function SecurityClient({
  hasVerifiedTotp,
  currentFactorId,
  currentAal,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [enrollState, setEnrollState] = useState<EnrollState | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleStartEnroll() {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const r = await enrollTotp();
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setEnrollState({ factorId: r.factorId, qrCode: r.qrCode, secret: r.secret });
    });
  }

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!enrollState) return;
    setError(null);
    startTransition(async () => {
      const r = await verifyTotpEnrollment(enrollState.factorId, code);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setEnrollState(null);
      setCode("");
      setSuccess("2FA ativado. Da próxima vez que fizer login, vão pedir o código do app.");
      router.refresh();
    });
  }

  function handleDisable() {
    if (!currentFactorId) return;
    if (
      !confirm(
        "Desativar 2FA? Sua conta vai voltar a depender só da senha. Você quer mesmo?"
      )
    )
      return;
    setError(null);
    startTransition(async () => {
      const r = await disableTotp(currentFactorId);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setSuccess("2FA desativado.");
      router.refresh();
    });
  }

  // Caso já tenha 2FA verificado
  if (hasVerifiedTotp) {
    return (
      <section className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div className="size-10 grid place-items-center rounded-full bg-emerald-50 text-emerald-700">
            <ShieldCheck className="size-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold">2FA ativo</h2>
            <p className="text-sm text-foreground/60 mt-1">
              Sua conta exige o código do app autenticador no login.
              Nível de assurance atual: <code className="px-1 bg-muted rounded">{currentAal}</code>.
            </p>
          </div>
        </div>

        {success && (
          <div className="rounded-xl bg-emerald-50 text-emerald-800 px-4 py-3 text-sm flex items-start gap-2">
            <Check className="size-4 mt-0.5" />
            {success}
          </div>
        )}
        {error && (
          <div className="rounded-xl bg-red-50 text-red-800 px-4 py-3 text-sm flex items-start gap-2">
            <AlertCircle className="size-4 mt-0.5" />
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleDisable}
          disabled={pending}
          className="self-start inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-300 text-red-700 hover:bg-red-50 text-sm font-medium disabled:opacity-50"
        >
          <ShieldX className="size-4" />
          {pending ? "Desativando..." : "Desativar 2FA"}
        </button>
      </section>
    );
  }

  // Em meio ao enrollment (mostra QR + form de codigo)
  if (enrollState) {
    return (
      <section className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-5">
        <h2 className="font-bold">Configure seu app autenticador</h2>

        <ol className="text-sm text-foreground/70 space-y-2 list-decimal list-inside">
          <li>
            Abra o Google Authenticator, 1Password, Bitwarden, Authy ou qualquer
            app TOTP no celular.
          </li>
          <li>
            Escaneie o QR code abaixo (ou cole a chave manual se preferir).
          </li>
          <li>Digite o código de 6 dígitos que aparece no app.</li>
        </ol>

        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div
            className="rounded-2xl border border-border bg-white p-4 shrink-0"
            // O qr_code do Supabase é um SVG; embedamos via data URI ou inline.
            dangerouslySetInnerHTML={{ __html: enrollState.qrCode }}
          />
          <div className="flex-1 flex flex-col gap-2 text-sm">
            <span className="text-foreground/60 text-xs uppercase tracking-wide font-semibold">
              Chave manual (caso não escaneie)
            </span>
            <code className="bg-muted px-3 py-2 rounded-lg font-mono text-xs break-all">
              {enrollState.secret}
            </code>
          </div>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Código de 6 dígitos
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              pattern="[0-9]{6}"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="border border-border rounded-xl px-4 py-3 text-2xl tracking-[0.5em] font-mono text-center bg-white max-w-xs"
              required
            />
          </label>

          {error && (
            <div className="rounded-xl bg-red-50 text-red-800 px-4 py-3 text-sm flex items-start gap-2">
              <AlertCircle className="size-4 mt-0.5" />
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending || code.length !== 6}
              className="px-5 py-2.5 rounded-xl bg-foreground text-white text-sm font-medium disabled:opacity-50"
            >
              {pending ? "Validando..." : "Confirmar"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEnrollState(null);
                setCode("");
                setError(null);
              }}
              className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted"
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>
    );
  }

  // Estado inicial — sem 2FA
  return (
    <section className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="size-10 grid place-items-center rounded-full bg-amber-50 text-amber-700">
          <ShieldX className="size-5" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold">2FA desativado</h2>
          <p className="text-sm text-foreground/60 mt-1">
            Sua conta protege com senha apenas. Ative 2FA com app autenticador
            (Google Authenticator, 1Password, Authy) para adicionar uma camada
            de proteção contra phishing e credential stuffing.
          </p>
        </div>
      </div>

      {success && (
        <div className="rounded-xl bg-emerald-50 text-emerald-800 px-4 py-3 text-sm flex items-start gap-2">
          <Check className="size-4 mt-0.5" />
          {success}
        </div>
      )}
      {error && (
        <div className="rounded-xl bg-red-50 text-red-800 px-4 py-3 text-sm flex items-start gap-2">
          <AlertCircle className="size-4 mt-0.5" />
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleStartEnroll}
        disabled={pending}
        className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground text-white text-sm font-medium disabled:opacity-50"
      >
        <ShieldCheck className="size-4" />
        {pending ? "Iniciando..." : "Ativar 2FA"}
      </button>
    </section>
  );
}
