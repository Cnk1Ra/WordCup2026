"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirectTo") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setState("error");
      setErrorMsg(translateError(error.message));
      return;
    }
    router.replace(redirectTo);
    router.refresh();
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

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-4"
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-foreground/70">Email</span>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/40" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full h-12 rounded-2xl border border-border bg-muted pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-foreground"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-foreground/70">Senha</span>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/40" />
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-12 rounded-2xl border border-border bg-muted pl-10 pr-12 text-sm font-medium focus:outline-none focus:border-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/70"
              aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </label>

        {state === "error" && (
          <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={state === "loading"}
          className="h-12 rounded-full bg-foreground text-white font-bold text-sm hover:bg-foreground/90 disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {state === "loading" ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </button>
      </form>
    </div>
  );
}

function translateError(msg: string): string {
  if (/invalid login credentials/i.test(msg)) return "Email ou senha incorretos.";
  if (/email not confirmed/i.test(msg)) return "Email não confirmado.";
  if (/too many/i.test(msg)) return "Muitas tentativas. Tente em alguns minutos.";
  return msg;
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
