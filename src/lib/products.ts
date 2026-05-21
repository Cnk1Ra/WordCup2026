export type Size = "P" | "M" | "G" | "GG" | "XGG";

export const SIZES: Size[] = ["P", "M", "G", "GG", "XGG"];

export const BASE_PRICE_BRL = 150;
export const SHIPPING_BRL = 5;
export const PERSONALIZATION_PER_LETTER_BRL = 2;
export const PERSONALIZATION_PER_NUMBER_BRL = 3;

export function personalizationFee(name: string, number: string): number {
  const letters = name.replace(/[^A-Za-zÀ-ſ]/g, "").length;
  const digits = number.replace(/\D/g, "").length;
  return (
    letters * PERSONALIZATION_PER_LETTER_BRL +
    digits * PERSONALIZATION_PER_NUMBER_BRL
  );
}

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
  textColor: string;
  front: string;
  back: string;
  badge?: string;
  basePrice?: number;
  comparePrice?: number | null;
  allowsPersonalization?: boolean;
};

export const products: Product[] = [
  {
    slug: "brasil-i-amarela-masculina",
    name: "SpaceFut Torcedor Brasil I — Masculina",
    shortName: "Brasil I — Masculina",
    team: "Coleção Brasil 2026",
    edition: "I",
    gender: "Masculina",
    color: "Amarelo Estádio",
    hex: "#FEDD00",
    accentHex: "#009C3B",
    textColor: "#0A4A1F",
    front: "/images/products/brasil-i-front.jpg",
    back: "/images/products/brasil-i-back.jpg",
    badge: "Lançamento",
  },
  {
    slug: "brasil-i-amarela-feminina",
    name: "SpaceFut Torcedor Brasil I — Feminina",
    shortName: "Brasil I — Feminina",
    team: "Coleção Brasil 2026",
    edition: "I",
    gender: "Feminina",
    color: "Amarelo Estádio",
    hex: "#FEDD00",
    accentHex: "#009C3B",
    textColor: "#0A4A1F",
    front: "/images/products/brasil-i-front.jpg",
    back: "/images/products/brasil-i-back.jpg",
    badge: "Lançamento",
  },
  {
    slug: "brasil-ii-azul-masculina",
    name: "SpaceFut Torcedor Brasil II — Masculina",
    shortName: "Brasil II — Masculina",
    team: "Coleção Brasil 2026",
    edition: "II",
    gender: "Masculina",
    color: "Azul Estádio",
    hex: "#1B2D5C",
    accentHex: "#FEDD00",
    textColor: "#FFFFFF",
    front: "/images/products/brasil-ii-front.jpg",
    back: "/images/products/brasil-ii-back.jpg",
  },
  {
    slug: "brasil-ii-azul-feminina",
    name: "SpaceFut Torcedor Brasil II — Feminina",
    shortName: "Brasil II — Feminina",
    team: "Coleção Brasil 2026",
    edition: "II",
    gender: "Feminina",
    color: "Azul Estádio",
    hex: "#1B2D5C",
    accentHex: "#FEDD00",
    textColor: "#FFFFFF",
    front: "/images/products/brasil-ii-front.jpg",
    back: "/images/products/brasil-ii-back.jpg",
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
