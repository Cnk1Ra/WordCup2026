import "server-only";
import { getSupabaseServer } from "./supabase/server";

export type HeroSettings = {
  tag: string;
  title_line_1: string;
  title_line_2: string;
  description: string;
  cta_label: string;
};

export const DEFAULT_HERO: HeroSettings = {
  tag: "Coleção Copa 2026",
  title_line_1: "Veste o Brasil.",
  title_line_2: "Faz história.",
  description:
    "Camisas oficiais I e II da Seleção, masculinas e femininas. Personalize com seu nome e número.",
  cta_label: "Comprar agora",
};

export type PromoBanner = {
  enabled: boolean;
  message: string;
  link: string | null;
};

export const DEFAULT_PROMO: PromoBanner = {
  enabled: false,
  message: "Frete fixo R$ 5,00 pra todo o Brasil ✦ Compre agora",
  link: null,
};

export async function fetchHeroSettings(): Promise<HeroSettings> {
  const supabase = getSupabaseServer();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "hero")
    .maybeSingle();
  if (!data?.value) return DEFAULT_HERO;
  return { ...DEFAULT_HERO, ...(data.value as Partial<HeroSettings>) };
}

export async function fetchPromoBanner(): Promise<PromoBanner> {
  const supabase = getSupabaseServer();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "promo_banner")
    .maybeSingle();
  if (!data?.value) return DEFAULT_PROMO;
  return { ...DEFAULT_PROMO, ...(data.value as Partial<PromoBanner>) };
}
