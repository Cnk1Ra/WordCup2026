import "server-only";
import { headers } from "next/headers";
import { getSupabaseServer } from "./supabase/server";
import { getCurrentAdmin } from "./supabase/auth-server";

type LogInput = {
  action: string; // ex: "product.update"
  entityType?: string; // ex: "products"
  entityId?: string;
  description?: string;
  metadata?: Record<string, unknown>;
};

// Registra ação admin no audit log. Não bloqueia o fluxo se falhar —
// só loga no console. Audit log é nice-to-have, não pode quebrar a app.
export async function logAdminAction(input: LogInput): Promise<void> {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return; // Sem admin, sem log (provavelmente call interno)

    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0].trim() ?? null;
    const ua = h.get("user-agent") ?? null;

    const supabase = getSupabaseServer();
    await supabase.from("admin_audit_log").insert({
      admin_id: admin.id,
      admin_email: admin.email,
      action: input.action,
      entity_type: input.entityType ?? null,
      entity_id: input.entityId ?? null,
      description: input.description ?? null,
      metadata: input.metadata ?? null,
      ip,
      user_agent: ua?.slice(0, 500),
    });
  } catch (e) {
    // Log mas não quebra
    console.warn("[audit-log]", e instanceof Error ? e.message : String(e));
  }
}
