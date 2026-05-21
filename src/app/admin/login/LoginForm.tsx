"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

type Props = {
  redirectTo: string;
  errorMsg: string | null;
};

export default function LoginForm({ redirectTo, errorMsg }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      action="/api/admin/login"
      method="POST"
      className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-4"
    >
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-bold text-foreground/70">Email</span>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/40" />
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
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
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
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

      {errorMsg && (
        <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
      )}

      <button
        type="submit"
        className="h-12 rounded-full bg-foreground text-white font-bold text-sm hover:bg-foreground/90 transition"
      >
        Entrar
      </button>
    </form>
  );
}
