import "server-only";
import { getSupabaseServer } from "./supabase/server";
import type { Product } from "./products";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  team: string;
  edition: "I" | "II";
  gender: "Masculina" | "Feminina";
  color: string;
  hex: string;
  accent_hex: string;
  text_color: string;
  front_image: string;
  back_image: string;
  base_price: string | number;
  description: string | null;
  badge: string | null;
  is_active: boolean;
  display_order: number;
};

function rowToProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    shortName: row.short_name,
    team: row.team,
    edition: row.edition,
    gender: row.gender,
    color: row.color,
    hex: row.hex,
    accentHex: row.accent_hex,
    textColor: row.text_color,
    front: row.front_image,
    back: row.back_image,
    badge: row.badge ?? undefined,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToProduct);
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
