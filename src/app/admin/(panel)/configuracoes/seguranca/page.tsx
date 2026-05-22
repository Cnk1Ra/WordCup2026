import Link from "next/link";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { getSupabaseAuth } from "@/lib/supabase/auth-server";
import SecurityClient from "./SecurityClient";

export const dynamic = "force-dynamic";

export default async function SegurancaPage() {
  const supabase = await getSupabaseAuth();
  const { data: factorsData } = await supabase.auth.mfa.listFactors();
  const verifiedTotp = factorsData?.totp.find((f) => f.status === "verified");

  const { data: aalData } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  const currentAal = aalData?.currentLevel ?? "aal1";

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <Link
        href="/admin/configuracoes"
        className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Configurações
      </Link>

      <header>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
          <ShieldCheck className="size-6 text-brand-green" />
          Segurança
        </h1>
        <p className="text-sm text-foreground/60 mt-1">
          Autenticação em duas etapas (2FA) protege sua conta contra acesso
          indevido mesmo se a senha vazar.
        </p>
      </header>

      <SecurityClient
        hasVerifiedTotp={!!verifiedTotp}
        currentFactorId={verifiedTotp?.id ?? null}
        currentAal={currentAal}
      />
    </div>
  );
}
