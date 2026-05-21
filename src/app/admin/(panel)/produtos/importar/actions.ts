"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/supabase/auth-server";
import { parseCsvAuto, type ParsedProduct } from "@/lib/import";
import {
  fetchLojaDoCapitaImages,
  downloadImage,
} from "@/lib/import/fetch-images";

export type ImportResult = {
  created: number;
  updated: number;
  failed: number;
  imagesFetched: number;
  errors: { handle: string; message: string }[];
};

const ALLOWED_SIZES = ["P", "M", "G", "GG", "XGG"] as const;
const BUCKET = "products";

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

  const result: ImportResult = {
    created: 0,
    updated: 0,
    failed: 0,
    imagesFetched: 0,
    errors: [],
  };

  for (const p of products) {
    if (p.errors.length > 0) {
      result.failed += 1;
      result.errors.push({ handle: p.handle, message: p.errors.join("; ") });
      continue;
    }
    try {
      const { existed, productId } = await upsertProduct(supabase, p);

      // Resolve imagens em segundo passo, agora que sabemos productId.
      let fetched = 0;
      try {
        fetched = await fetchAndStoreImages(supabase, productId, p);
      } catch (err) {
        // Imagem falhar não bloqueia o import; apenas reporta.
        result.errors.push({
          handle: p.handle,
          message: `imagens: ${err instanceof Error ? err.message : String(err)}`,
        });
      }
      result.imagesFetched += fetched;

      if (existed) result.updated += 1;
      else result.created += 1;
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
): Promise<{ productId: string; existed: boolean }> {
  const { data: prev } = await supabase
    .from("products")
    .select("id")
    .eq("slug", p.handle)
    .maybeSingle();

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
  if (validVariants.length > 0) {
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

  return { productId: upserted.id, existed: !!prev };
}

// Resolve imagens reais: se a ParsedProduct já tem URL (Shopify), baixa direto.
// Senão, se tem source_url (lojadocapita), scrape do HTML pra achar imagem real.
// Baixa e sobe pro Supabase Storage. Atualiza products.front_image/back_image.
async function fetchAndStoreImages(
  supabase: ReturnType<typeof getSupabaseServer>,
  productId: string,
  p: ParsedProduct
): Promise<number> {
  let frontUrl = p.front_image;
  let backUrl = p.back_image;

  // Se não tem URL direta de imagem mas tem source_url, scrape primeiro
  if (!frontUrl && p.source_url && /lojadocapita\.com\.br/i.test(p.source_url)) {
    const { front, back } = await fetchLojaDoCapitaImages(p.source_url);
    frontUrl = front;
    backUrl = back ?? backUrl;
  }

  let count = 0;
  const update: { front_image?: string; back_image?: string } = {};

  if (frontUrl) {
    const stored = await downloadAndStore(
      supabase,
      productId,
      "front",
      frontUrl
    );
    if (stored) {
      update.front_image = stored;
      count += 1;
    }
  }
  if (backUrl) {
    const stored = await downloadAndStore(supabase, productId, "back", backUrl);
    if (stored) {
      update.back_image = stored;
      count += 1;
    }
  }

  if (Object.keys(update).length > 0) {
    await supabase.from("products").update(update).eq("id", productId);
  }
  return count;
}

async function downloadAndStore(
  supabase: ReturnType<typeof getSupabaseServer>,
  productId: string,
  slot: "front" | "back",
  url: string
): Promise<string | null> {
  const img = await downloadImage(url);
  if (!img) return null;
  const path = `${productId}/${slot}-${Date.now()}.${img.ext}`;
  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, img.buffer, {
      contentType: img.contentType,
      upsert: true,
    });
  if (upErr) return null;
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return publicUrl;
}
