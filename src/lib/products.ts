export type Size = "P" | "M" | "G" | "GG" | "XGG";

export const SIZES: Size[] = ["P", "M", "G", "GG", "XGG"];

export const BASE_PRICE_BRL = 150;
export const SHIPPING_BRL = 5;
export const PERSONALIZATION_BRL = 49.9;

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  team: string;
  edition: "I" | "II";
  gender: "Masculina" | "Feminina";
  color: string;
  hex: string;
  accentHex: string;
  image: string;
  gallery: string[];
  badge?: string;
};

export const products: Product[] = [
  {
    slug: "brasil-i-amarela-masculina",
    name: "Camisa Brasil I 2026 Torcedor — Masculina",
    shortName: "Brasil I — Masculina",
    team: "Seleção Brasileira",
    edition: "I",
    gender: "Masculina",
    color: "Amarelo Oficial",
    hex: "#FEDD00",
    accentHex: "#009C3B",
    image: "/images/camisa-brasil.png",
    gallery: ["/images/camisa-brasil.png"],
    badge: "Lançamento",
  },
  {
    slug: "brasil-i-amarela-feminina",
    name: "Camisa Brasil I 2026 Torcedor — Feminina",
    shortName: "Brasil I — Feminina",
    team: "Seleção Brasileira",
    edition: "I",
    gender: "Feminina",
    color: "Amarelo Oficial",
    hex: "#FEDD00",
    accentHex: "#009C3B",
    image: "/images/camisa-brasil.png",
    gallery: ["/images/camisa-brasil.png"],
    badge: "Lançamento",
  },
  {
    slug: "brasil-ii-azul-masculina",
    name: "Camisa Brasil II 2026 Torcedor — Masculina",
    shortName: "Brasil II — Masculina",
    team: "Seleção Brasileira",
    edition: "II",
    gender: "Masculina",
    color: "Azul Oficial",
    hex: "#002776",
    accentHex: "#FEDD00",
    image: "/images/camisa-brasil.png",
    gallery: ["/images/camisa-brasil.png"],
  },
  {
    slug: "brasil-ii-azul-feminina",
    name: "Camisa Brasil II 2026 Torcedor — Feminina",
    shortName: "Brasil II — Feminina",
    team: "Seleção Brasileira",
    edition: "II",
    gender: "Feminina",
    color: "Azul Oficial",
    hex: "#002776",
    accentHex: "#FEDD00",
    image: "/images/camisa-brasil.png",
    gallery: ["/images/camisa-brasil.png"],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
