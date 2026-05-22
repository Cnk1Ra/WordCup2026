"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAuth, getCurrentAdmin } from "@/lib/supabase/auth-server";
import { logAdminAction } from "@/lib/audit-log";

export type EnrollResult =
  | { ok: true; factorId: string; qrCode: string; secret: string }
  | { ok: false; error: string };

// Inicia enrollment de um factor TOTP. Devolve QR code (SVG data URI) e secret
// pra exibir na tela. O factor fica em status="unverified" até o usuario
// confirmar com o codigo do app autenticador.
export async function enrollTotp(): Promise<EnrollResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "Não autorizado." };

  const supabase = await getSupabaseAuth();

  // Limpa factors unverified anteriores (lixo de tentativas que travaram)
  const { data: existing } = await supabase.auth.mfa.listFactors();
  if (existing) {
    for (const f of existing.all) {
      if (f.factor_type === "totp" && f.status === "unverified") {
        await supabase.auth.mfa.unenroll({ factorId: f.id });
      }
    }
  }

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    friendlyName: `SpaceFut (${admin.email})`,
    issuer: "SpaceFut",
  });
  if (error || !data) {
    return { ok: false, error: error?.message ?? "Falha ao iniciar 2FA." };
  }

  return {
    ok: true,
    factorId: data.id,
    qrCode: data.totp.qr_code,
    secret: data.totp.secret,
  };
}

export type VerifyResult = { ok: true } | { ok: false; error: string };

// Confirma o codigo do app autenticador → factor vira "verified" e a sessao
// eleva pra aal2. A partir desse momento, login futuro vai exigir 2FA.
export async function verifyTotpEnrollment(
  factorId: string,
  code: string
): Promise<VerifyResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "Não autorizado." };
  if (!/^\d{6}$/.test(code)) return { ok: false, error: "Código inválido." };

  const supabase = await getSupabaseAuth();
  const { data: challenge, error: cErr } = await supabase.auth.mfa.challenge({
    factorId,
  });
  if (cErr || !challenge) {
    return { ok: false, error: cErr?.message ?? "Falha no challenge." };
  }

  const { error: vErr } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challenge.id,
    code,
  });
  if (vErr) {
    return { ok: false, error: "Código incorreto. Confira o app." };
  }

  await logAdminAction({
    action: "admin.2fa_enabled",
    entityType: "admins",
    entityId: admin.id,
    description: `Ativou 2FA via TOTP`,
  });

  revalidatePath("/admin/configuracoes/seguranca");
  return { ok: true };
}

export async function disableTotp(factorId: string): Promise<VerifyResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { ok: false, error: "Não autorizado." };

  const supabase = await getSupabaseAuth();
  const { error } = await supabase.auth.mfa.unenroll({ factorId });
  if (error) return { ok: false, error: error.message };

  await logAdminAction({
    action: "admin.2fa_disabled",
    entityType: "admins",
    entityId: admin.id,
    description: `Desativou 2FA`,
  });

  revalidatePath("/admin/configuracoes/seguranca");
  return { ok: true };
}
