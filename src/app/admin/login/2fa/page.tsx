import Image from "next/image";
import { redirect } from "next/navigation";
import { getSupabaseAuth } from "@/lib/supabase/auth-server";
import ChallengeForm from "./ChallengeForm";

export const dynamic = "force-dynamic";

export default async function TwoFactorPage() {
  const supabase = await getSupabaseAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: aalData } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

  // Já está em aal2 — não precisa estar aqui
  if (aalData?.currentLevel === "aal2") redirect("/admin");

  // Sem factor — não há challenge possível
  if (aalData?.nextLevel !== "aal2") redirect("/admin");

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
          <p className="text-sm text-foreground/60">Verificação em 2 etapas</p>
        </div>

        <ChallengeForm email={user.email ?? ""} />
      </div>
    </div>
  );
}
