import Image from "next/image";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "Email ou senha incorretos.",
  unconfirmed: "Email não confirmado.",
  rate: "Muitas tentativas. Tente em alguns minutos.",
  missing: "Email e senha são obrigatórios.",
};

type Props = {
  searchParams: Promise<{ redirectTo?: string; err?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const { redirectTo = "/admin", err } = await searchParams;
  const errorMsg = err ? ERROR_MESSAGES[err] ?? null : null;

  return (
    <div className="min-h-screen grid place-items-center px-4 bg-muted">
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

        <Suspense fallback={null}>
          <LoginForm redirectTo={redirectTo} errorMsg={errorMsg} />
        </Suspense>
      </div>
    </div>
  );
}
