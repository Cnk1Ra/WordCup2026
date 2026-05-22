"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/supabase/auth-server";
import { logAdminAction } from "@/lib/audit-log";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function ensureAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Não autorizado");
}

export type FormState = { error: string | null };

export async function createCategoryAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await ensureAdmin();
  const name = String(formData.get("name") || "").trim();
  if (!name) return { error: "Nome é obrigatório." };

  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugInput ? slugify(slugInput) : slugify(name);
  if (!slug) return { error: "Não foi possível gerar slug." };

  const supabase = getSupabaseServer();
  const { data: existing } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) return { error: `Já existe categoria com slug "${slug}".` };

  const { error } = await supabase.from("categories").insert({ slug, name });
  if (error) return { error: error.message };

  await logAdminAction({
    action: "category.create",
    entityType: "categories",
    description: `Criou categoria "${name}" (${slug})`,
    metadata: { slug, name },
  });

  revalidatePath("/admin/categorias");
  revalidatePath("/");
  return { error: null };
}

export async function updateCategoryAction(
  id: string,
  patch: { name?: string; description?: string | null; is_active?: boolean; display_order?: number }
) {
  await ensureAdmin();
  const supabase = getSupabaseServer();
  const { error } = await supabase.from("categories").update(patch).eq("id", id);
  if (error) throw new Error(error.message);
  await logAdminAction({
    action: "category.update",
    entityType: "categories",
    entityId: id,
    description: `Editou categoria ${patch.name ?? id}`,
    metadata: patch as Record<string, unknown>,
  });
  revalidatePath("/admin/categorias");
  revalidatePath("/");
}

export async function deleteCategoryAction(id: string) {
  await ensureAdmin();
  const supabase = getSupabaseServer();
  const { data: cur } = await supabase
    .from("categories")
    .select("name, slug")
    .eq("id", id)
    .maybeSingle();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  await logAdminAction({
    action: "category.delete",
    entityType: "categories",
    entityId: id,
    description: cur ? `Excluiu categoria "${cur.name}"` : `Excluiu categoria ${id}`,
  });
  revalidatePath("/admin/categorias");
  revalidatePath("/");
}
