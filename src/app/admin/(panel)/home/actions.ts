"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/supabase/auth-server";
import { DEFAULT_HERO, type HeroSettings } from "@/lib/site-settings";

export type SaveHeroState = { error: string | null; success: boolean };

export async function saveHeroAction(
  _prev: SaveHeroState,
  formData: FormData
): Promise<SaveHeroState> {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: "Não autorizado.", success: false };

  const hero: HeroSettings = {
    tag: String(formData.get("tag") || DEFAULT_HERO.tag),
    title_line_1: String(formData.get("title_line_1") || DEFAULT_HERO.title_line_1),
    title_line_2: String(formData.get("title_line_2") || DEFAULT_HERO.title_line_2),
    description: String(formData.get("description") || DEFAULT_HERO.description),
    cta_label: String(formData.get("cta_label") || DEFAULT_HERO.cta_label),
  };

  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: "hero", value: hero }, { onConflict: "key" });
  if (error) return { error: error.message, success: false };

  revalidatePath("/");
  revalidatePath("/admin/home");
  return { error: null, success: true };
}
