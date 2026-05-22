"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/supabase/auth-server";
import { logAdminAction } from "@/lib/audit-log";

async function ensureAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Não autorizado");
}

export type ExpenseFormState = { error: string | null };

const VALID_CATS = [
  "anuncios",
  "fornecedor",
  "frete",
  "taxas",
  "salarios",
  "software",
  "outros",
] as const;

export async function createExpenseAction(
  _prev: ExpenseFormState,
  formData: FormData
): Promise<ExpenseFormState> {
  await ensureAdmin();
  const description = String(formData.get("description") || "").trim();
  const amountRaw = String(formData.get("amount") || "");
  const category = String(formData.get("category") || "outros");
  const occurredAt = String(formData.get("occurred_at") || "");
  const notes = String(formData.get("notes") || "").trim() || null;
  const paidByAdminId = String(formData.get("paid_by_admin_id") || "").trim() || null;

  if (!description) return { error: "Descrição é obrigatória." };
  const amount = parseFloat(amountRaw.replace(",", "."));
  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "Valor inválido." };
  }
  if (!VALID_CATS.includes(category as (typeof VALID_CATS)[number])) {
    return { error: "Categoria inválida." };
  }

  const supabase = getSupabaseServer();

  // Pega o nome do admin que pagou (cache de display)
  let paidByName: string | null = null;
  if (paidByAdminId) {
    const { data: a } = await supabase
      .from("admins")
      .select("name, email")
      .eq("id", paidByAdminId)
      .maybeSingle();
    paidByName = a?.name ?? a?.email?.split("@")[0] ?? null;
  }

  const { error } = await supabase.from("expenses").insert({
    description,
    amount,
    category,
    occurred_at: occurredAt || new Date().toISOString().slice(0, 10),
    notes,
    paid_by_admin_id: paidByAdminId,
    paid_by_name: paidByName,
  });
  if (error) return { error: error.message };

  await logAdminAction({
    action: "expense.create",
    entityType: "expenses",
    description: `${description} (R$ ${amount.toFixed(2)}) — pago por ${paidByName ?? "?"}`,
    metadata: { amount, category, paid_by: paidByName },
  });

  revalidatePath("/admin/despesas");
  revalidatePath("/admin");
  revalidatePath("/admin/financeiro");
  return { error: null };
}

export async function listAdminsForExpense() {
  await ensureAdmin();
  const supabase = getSupabaseServer();
  const { data } = await supabase
    .from("admins")
    .select("id, name, email")
    .order("name");
  return data ?? [];
}

export async function deleteExpense(id: string) {
  await ensureAdmin();
  const supabase = getSupabaseServer();
  const { data: exp } = await supabase
    .from("expenses")
    .select("description, amount")
    .eq("id", id)
    .maybeSingle();
  await supabase.from("expenses").delete().eq("id", id);
  await logAdminAction({
    action: "expense.delete",
    entityType: "expenses",
    entityId: id,
    description: exp
      ? `Excluiu despesa "${exp.description}" (R$ ${Number(exp.amount).toFixed(2)})`
      : `Excluiu despesa ${id}`,
  });
  revalidatePath("/admin/despesas");
  revalidatePath("/admin");
  revalidatePath("/admin/financeiro");
}
