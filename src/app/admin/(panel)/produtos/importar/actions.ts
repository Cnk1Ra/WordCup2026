"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/supabase/auth-server";
import { parseCsvAuto, type ParsedProduct } from "@/lib/import";

export type ImportResult = {
  created: number;
  updated: number;
  failed: number;
  errors: { handle: string; message: string }[];
};

const ALLOWED_SIZES = ["P", "M", "G", "GG", "XGG"] as const;

async function ensureAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Não autorizado");
  return admin;
}

export async function previewCsv(csvText: string) {
  await ensureAdmin();
  return parseCsvAuto(csvText);
}

export async function importProductsFromCsv(
  csvText: string
): Promise<ImportResult> {
  await ensureAdmin();
  const supabase = getSupabaseServer();
  const { products } = parseCsvAuto(csvText);

  const result: ImportResult = { created: 0, updated: 0, failed: 0, errors: [] };

  for (const p of products) {
    if (p.errors.length > 0) {
      result.failed += 1;
      result.errors.push({ handle: p.handle, message: p.errors.join("; ") });
      continue;
    }
    try {
      await upsertProduct(supabase, p);
      const { data: existing } = await supabase
        .from("products")
        .select("id")
        .eq("slug", p.handle)
        .maybeSingle();
      if (existing) {
        result.updated += 1;
      } else {
        result.created += 1;
      }
    } catch (err) {
      result.failed += 1;
      result.errors.push({
        handle: p.handle,
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/");
  return result;
}

async function upsertProduct(
  supabase: ReturnType<typeof getSupabaseServer>,
  p: ParsedProduct
) {
  const payload = {
    slug: p.handle,
    name: p.title,
    short_name: p.title.length > 40 ? p.title.slice(0, 40) : p.title,
    description: p.description,
    vendor: p.vendor,
    product_type: p.product_type,
    tags: p.tags,
    base_price: p.base_price,
    compare_at_price: p.compare_at_price,
    front_image: p.front_image,
    back_image: p.back_image,
    seo_title: p.seo_title,
    seo_description: p.seo_description,
    status: p.status,
    is_active: p.status === "active",
  };

  const { data: upserted, error: upsertError } = await supabase
    .from("products")
    .upsert(payload, { onConflict: "slug" })
    .select("id")
    .single();
  if (upsertError) throw upsertError;

  const validVariants = p.variants.filter((v) =>
    ALLOWED_SIZES.includes(v.size as (typeof ALLOWED_SIZES)[number])
  );
  if (validVariants.length === 0) return;

  const inventoryRows = validVariants.map((v) => ({
    product_id: upserted.id,
    size: v.size,
    quantity: v.quantity,
  }));

  const { error: invError } = await supabase
    .from("inventory")
    .upsert(inventoryRows, { onConflict: "product_id,size" });
  if (invError) throw invError;
}
