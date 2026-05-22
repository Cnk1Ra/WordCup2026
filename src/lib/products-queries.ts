import "server-only";
import { getSupabaseServer } from "./supabase/server";
import type { Product } from "./products";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  short_name: string | null;
  team: string | null;
  edition: "I" | "II" | null;
  gender: "Masculina" | "Feminina" | null;
  color: string | null;
  hex: string | null;
  accent_hex: string | null;
  text_color: string | null;
  front_image: string | null;
  back_image: string | null;
  base_price: string | number;
  compare_at_price: string | number | null;
  description: string | null;
  badge: string | null;
  is_active: boolean;
  display_order: number;
  allows_personalization?: boolean;
};

function rowToProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    shortName: row.short_name ?? row.name,
    team: row.team ?? "",
    edition: row.edition ?? "I",
    gender: row.gender ?? "Masculina",
    color: row.color ?? "",
    hex: row.hex ?? "#000000",
    accentHex: row.accent_hex ?? "#FFFFFF",
    textColor: row.text_color ?? "#FFFFFF",
    front: row.front_image ?? "",
    back: row.back_image ?? "",
    badge: row.badge ?? undefined,
    basePrice: Number(row.base_price ?? 0),
    comparePrice: row.compare_at_price != null ? Number(row.compare_at_price) : null,
    allowsPersonalization: row.allows_personalization ?? false,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("products")
    .select("*, card_images:product_images(url, is_card)")
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  if (error) throw error;
  type RowWithImages = ProductRow & {
    card_images?: { url: string; is_card: boolean }[];
  };
  const rows = (data ?? []) as RowWithImages[];
  return rows
    .map((row) => {
      const product = rowToProduct(row);
      const cardOverride = row.card_images?.find((i) => i.is_card)?.url;
      product.cardImage = cardOverride ?? null;
      return product;
    })
    .filter((p) => p.front || p.cardImage);
}

const MINEIROS_SLUGS = /atletico-mineiro|atletico-mg|atletico mg|cruzeiro|america-mg|america mineiro/i;

// Pra cada section da home, busca o subset de produtos certo.
export async function fetchProductsForSection(opts: {
  categorySlug?: string;
  personalizableOnly?: boolean;
  mineirosFirst?: boolean;
  limit?: number;
  picks?: string[]; // ids escolhidos manualmente; sobrescreve categoria/filter
}): Promise<Product[]> {
  const supabase = getSupabaseServer();
  const limit = opts.limit ?? 8;

  // Featured: picks manuais — fetch e respeita a ordem do array.
  if (opts.picks && opts.picks.length > 0) {
    const { data } = await supabase
      .from("products")
      .select("*, card_images:product_images(url, is_card)")
      .in("id", opts.picks)
      .eq("is_active", true);
    type Row = ProductRow & { name: string; card_images?: { url: string; is_card: boolean }[] };
    const byId = new Map<string, Row>();
    ((data ?? []) as Row[]).forEach((r) => byId.set(r.id, r));
    return opts.picks
      .slice(0, limit)
      .map((id) => byId.get(id))
      .filter((r): r is Row => !!r)
      .map((row) => {
        const product = rowToProduct(row);
        product.cardImage = row.card_images?.find((i) => i.is_card)?.url ?? null;
        return product;
      });
  }

  let query = supabase
    .from("products")
    .select("*, card_images:product_images(url, is_card)")
    .eq("is_active", true)
    .not("front_image", "is", null);

  if (opts.personalizableOnly) {
    query = query.eq("allows_personalization", true);
  }

  if (opts.categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", opts.categorySlug)
      .maybeSingle();
    if (cat) {
      const { data: links } = await supabase
        .from("product_categories")
        .select("product_id")
        .eq("category_id", cat.id);
      const ids = (links ?? []).map((l) => l.product_id);
      if (ids.length === 0) return [];
      query = query.in("id", ids);
    }
  }

  query = query.order("display_order", { ascending: true });
  if (!opts.mineirosFirst) {
    query = query.limit(limit);
  }

  const { data } = await query;
  type RowWithImages = ProductRow & {
    name: string;
    card_images?: { url: string; is_card: boolean }[];
  };
  let rows = (data ?? []) as RowWithImages[];

  if (opts.mineirosFirst) {
    // Mineiros (Atlético-MG, Cruzeiro, América-MG) primeiro, depois resto
    rows.sort((a, b) => {
      const aMin = MINEIROS_SLUGS.test(a.name) ? 0 : 1;
      const bMin = MINEIROS_SLUGS.test(b.name) ? 0 : 1;
      return aMin - bMin;
    });
    rows = rows.slice(0, limit);
  }

  return rows.map((row) => {
    const product = rowToProduct(row);
    const cardOverride = row.card_images?.find((i) => i.is_card)?.url;
    product.cardImage = cardOverride ?? null;
    return product;
  });
}

export async function fetchProductBySlug(
  slug: string
): Promise<Product | null> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToProduct(data as ProductRow) : null;
}
