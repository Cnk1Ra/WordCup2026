import { redirect } from "next/navigation";
import { getCurrentAdmin, getSupabaseAuth } from "@/lib/supabase/auth-server";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  // 2FA gate: se admin tem TOTP verificado mas sessao está em aal1, exige challenge.
  const supabase = await getSupabaseAuth();
  const { data: aalData } =
    await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (
    aalData?.nextLevel === "aal2" &&
    aalData?.currentLevel === "aal1"
  ) {
    redirect("/admin/login/2fa");
  }

  return <AdminShell admin={admin}>{children}</AdminShell>;
}
