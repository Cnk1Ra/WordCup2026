import "server-only";
import { getSupabaseServer } from "./supabase/server";
import type { Product } from "./products";

type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
};

export type CategoryWithCount = CategoryRow & { productCount: number };

export async function fetchActiveCategoriesWithCount(): Promise<
  CategoryWithCount[]
> {
  const supabase = getSupabaseServer();
  const { data: cats } = await supabase
    .from("categories")
    .select("id, slug, name, description")
    .eq("is_active", true)
    .order("display_order");
  if (!cats || cats.length === 0) return [];

  const { data: links } = await supabase
    .from("product_categories")
    .select("category_id, products!inner(is_active, front_image)")
    .eq("products.is_active", true)
    .not("products.front_image", "is", null);

  const counts = new Map<string, number>();
  (links ?? []).forEach((l) => {
    counts.set(l.category_id, (counts.get(l.category_id) ?? 0) + 1);
  });

  return cats
    .map((c) => ({ ...c, productCount: counts.get(c.id) ?? 0 }))
    .filter((c) => c.productCount > 0);
}

export async function fetchCategoryBySlug(
  slug: string
): Promise<{ category: CategoryRow; products: Product[] } | null> {
  const supabase = getSupabaseServer();
  const { data: category } = await supabase
    .from("categories")
    .select("id, slug, name, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (!category) return null;

  const { data: links } = await supabase
    .from("product_categories")
    .select("products!inner(*, card_images:product_images(url, is_card))")
    .eq("category_id", category.id)
    .eq("products.is_active", true);

  type ProductRow = {
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
    badge: string | null;
    base_price?: string | number;
    compare_at_price?: string | number | null;
    allows_personalization?: boolean;
    card_images?: { url: string; is_card: boolean }[];
  };

  const products: Product[] = (links ?? [])
    .map((l) => l.products as unknown as ProductRow)
    .map((row) => {
      const cardOverride = row.card_images?.find((i) => i.is_card)?.url ?? null;
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
        basePrice: row.base_price ? Number(row.base_price) : undefined,
        comparePrice: row.compare_at_price ? Number(row.compare_at_price) : null,
        allowsPersonalization: row.allows_personalization ?? false,
        cardImage: cardOverride,
      };
    })
    .filter((p) => p.front || p.cardImage);

  return { category, products };
}
