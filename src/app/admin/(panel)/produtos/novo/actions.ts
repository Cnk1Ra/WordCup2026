"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

export type CreateState = { error: string | null };

export async function createProductAction(
  _prev: CreateState,
  formData: FormData
): Promise<CreateState> {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: "Não autorizado." };

  const name = String(formData.get("name") || "").trim();
  const basePriceRaw = String(formData.get("base_price") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();

  if (!name) return { error: "Nome é obrigatório." };
  const base_price = parseFloat(basePriceRaw.replace(",", "."));
  if (!Number.isFinite(base_price) || base_price <= 0) {
    return { error: "Preço inválido." };
  }

  const slug = slugInput ? slugify(slugInput) : slugify(name);
  if (!slug) return { error: "Não foi possível gerar slug." };

  const supabase = getSupabaseServer();
  const { data: existing } = await supabase
    .from("products")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) return { error: `Já existe produto com slug "${slug}".` };

  const { data: created, error } = await supabase
    .from("products")
    .insert({
      slug,
      name,
      short_name: name.slice(0, 40),
      base_price,
      is_active: false,
      status: "draft",
    })
    .select("id")
    .single();
  if (error) return { error: error.message };

  await logAdminAction({
    action: "product.create",
    entityType: "products",
    entityId: created?.id,
    description: `Criou produto "${name}" (R$ ${base_price.toFixed(2)})`,
    metadata: { slug, base_price },
  });

  revalidatePath("/admin/produtos");
  redirect(`/admin/produtos/${slug}`);
}
