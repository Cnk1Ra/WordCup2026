// Types-only. Sem `server-only` aqui pra poder ser importado por client components.

export type HeroSlide = {
  image: string;
  tag: string;
  title_1: string;
  title_2: string;
  description: string;
  cta_label: string;
  cta_link: string;
};

export type HeroCarouselData = {
  slides: HeroSlide[];
  autoplay_seconds?: number;
};

export type TrustBarItem = {
  icon: "truck" | "shield" | "star" | "package" | "shirt" | "type";
  title: string;
  subtitle: string;
};

export type TrustBarData = { items: TrustBarItem[] };

export type CategoriesData = { title: string; subtitle: string };

export type ProductsGridData = {
  title: string;
  subtitle: string;
  limit: number;
  category_slug?: string;
  filter_personalizable?: boolean;
  mineiros_first?: boolean;
  // Se definido, mostra APENAS esses produtos na ordem dada (overrides
  // qualquer category_slug/filter). Estilo "Featured products" do Shopify.
  picks?: string[]; // product ids
};

export type HowItWorksStep = { title: string; description: string };

export type HowItWorksData = {
  title: string;
  subtitle: string;
  steps: HowItWorksStep[];
};

export type FaqData = { title: string; subtitle: string };

export type SectionType =
  | "hero_carousel"
  | "trust_bar"
  | "categories"
  | "products_grid"
  | "how_it_works"
  | "faq";

export type HomeSection =
  | { id: string; type: "hero_carousel"; display_order: number; enabled: boolean; data: HeroCarouselData }
  | { id: string; type: "trust_bar"; display_order: number; enabled: boolean; data: TrustBarData }
  | { id: string; type: "categories"; display_order: number; enabled: boolean; data: CategoriesData }
  | { id: string; type: "products_grid"; display_order: number; enabled: boolean; data: ProductsGridData }
  | { id: string; type: "how_it_works"; display_order: number; enabled: boolean; data: HowItWorksData }
  | { id: string; type: "faq"; display_order: number; enabled: boolean; data: FaqData };

export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  hero_carousel: "Banner principal (carrossel)",
  trust_bar: "Selos de confiança",
  categories: "Coleções",
  products_grid: "Grade de produtos",
  how_it_works: "Como funciona",
  faq: "Perguntas frequentes",
};
