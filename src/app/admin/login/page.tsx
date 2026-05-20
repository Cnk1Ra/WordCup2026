"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Mail, Loader2, Check } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

function LoginForm() {
  const params = useSearchParams();
  const redirectTo = params.get("redirectTo") || "/admin";
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setErrorMsg("");
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
      },
    });
    if (error) {
      setState("error");
      setErrorMsg(error.message);
    } else {
      setState("sent");
    }
  }

  return (
    <div className="w-full max-w-sm flex flex-col gap-6">
      <div className="flex flex-col items-center gap-3">
        <Image
          src="/logo-spacefut.png"
          alt="SpaceFut"
          width={897}
          height={270}
          className="h-10 w-auto"
        />
        <p className="text-sm text-foreground/60">Painel administrativo</p>
      </div>

      {state === "sent" ? (
        <div className="rounded-3xl bg-white border border-border p-6 flex flex-col items-center gap-3 text-center">
          <div className="size-12 rounded-full bg-brand-green/10 grid place-items-center">
            <Check className="size-6 text-brand-green" />
          </div>
          <h2 className="font-bold">Link enviado</h2>
          <p className="text-sm text-foreground/65 leading-relaxed">
            Mandei um link mágico pra <strong>{email}</strong>. Abre o email e
            clica no link pra entrar.
          </p>
          <button
            onClick={() => setState("idle")}
            className="text-xs text-foreground/60 underline mt-2"
          >
            Usar outro email
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-foreground/70">
              Email do administrador
            </span>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full h-12 rounded-2xl border border-border bg-muted pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-foreground"
              />
            </div>
          </label>

          {state === "error" && (
            <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={state === "sending"}
            className="h-12 rounded-full bg-foreground text-white font-bold text-sm hover:bg-foreground/90 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {state === "sending" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Receber link de acesso"
            )}
          </button>

          <p className="text-[11px] text-foreground/50 text-center leading-relaxed">
            Sem senha. Mandamos um link mágico pro seu email — clica e tá
            logado.
          </p>
        </form>
      )}
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen grid place-items-center px-4 bg-muted">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
