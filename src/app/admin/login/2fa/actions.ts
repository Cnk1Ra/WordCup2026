"use server";

import { redirect } from "next/navigation";
import { getSupabaseAuth } from "@/lib/supabase/auth-server";

export type State = { error: string | null };

export async function verifyChallengeAction(
  _prev: State,
  formData: FormData
): Promise<State> {
  const code = String(formData.get("code") || "").trim();
  if (!/^\d{6}$/.test(code)) return { error: "Código deve ter 6 dígitos." };

  const supabase = await getSupabaseAuth();
  const { data: factors } = await supabase.auth.mfa.listFactors();
  const totp = factors?.totp.find((f) => f.status === "verified");
  if (!totp) {
    // Nada pra verificar — manda pra login
    redirect("/admin/login");
  }

  const { data: challenge, error: cErr } = await supabase.auth.mfa.challenge({
    factorId: totp.id,
  });
  if (cErr || !challenge) {
    return { error: cErr?.message ?? "Falha ao criar challenge." };
  }

  const { error: vErr } = await supabase.auth.mfa.verify({
    factorId: totp.id,
    challengeId: challenge.id,
    code,
  });
  if (vErr) {
    return { error: "Código incorreto. Confira o app." };
  }

  redirect("/admin");
}

export async function cancelChallengeAction() {
  const supabase = await getSupabaseAuth();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
