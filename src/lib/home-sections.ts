import "server-only";
import { getSupabaseServer } from "./supabase/server";
import type { HomeSection } from "./home-sections-types";

export * from "./home-sections-types";

export async function fetchHomeSections(): Promise<HomeSection[]> {
  const supabase = getSupabaseServer();
  const { data } = await supabase
    .from("home_sections")
    .select("*")
    .order("display_order");
  return (data ?? []) as HomeSection[];
}

export async function fetchAllSectionsForAdmin(): Promise<HomeSection[]> {
  const supabase = getSupabaseServer();
  const { data } = await supabase
    .from("home_sections")
    .select("*")
    .order("display_order");
  return (data ?? []) as HomeSection[];
}
