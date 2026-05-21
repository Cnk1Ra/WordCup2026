"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/supabase/auth-server";

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

  if (!description) return { error: "Descrição é obrigatória." };
  const amount = parseFloat(amountRaw.replace(",", "."));
  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "Valor inválido." };
  }
  if (!VALID_CATS.includes(category as (typeof VALID_CATS)[number])) {
    return { error: "Categoria inválida." };
  }

  const supabase = getSupabaseServer();
  const { error } = await supabase.from("expenses").insert({
    description,
    amount,
    category,
    occurred_at: occurredAt || new Date().toISOString().slice(0, 10),
    notes,
  });
  if (error) return { error: error.message };

  revalidatePath("/admin/despesas");
  revalidatePath("/admin");
  revalidatePath("/admin/financeiro");
  return { error: null };
}

export async function deleteExpense(id: string) {
  await ensureAdmin();
  const supabase = getSupabaseServer();
  await supabase.from("expenses").delete().eq("id", id);
  revalidatePath("/admin/despesas");
  revalidatePath("/admin");
  revalidatePath("/admin/financeiro");
}
