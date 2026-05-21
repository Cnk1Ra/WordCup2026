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
    .select("*")
    .eq("is_active", true)
    .not("front_image", "is", null)
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => rowToProduct(row as ProductRow));
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
