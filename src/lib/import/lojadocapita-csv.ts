import Papa from "papaparse";
import type { ParsedProduct, ParsedVariant, ParseResult } from "./shopify-csv";

function parseMoney(raw: string | undefined): number | null {
  if (!raw) return null;
  const cleaned = raw
    .replace(/[^\d.,-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const ALLOWED_SIZES = new Set(["P", "M", "G", "GG", "XGG"]);

function suffix(n: number): string {
  return n === 1 ? "" : ` ${n}`;
}

// Cada coluna "js-item-name N" pertence a um slot (1, 2, 3...). Mapeio as colunas
// vizinhas pelo mesmo slot. Cada planilha do lojadocapita usa nomes irregulares
// (form-select sem numeração no slot 1, form-select 2/3/4/5 misturando opções de
// adicional + tamanhos), então a heurística é: pra cada slot, varre TODAS as
// colunas form-select* e pega os valores que sejam tamanhos (P/M/G/GG/XGG)
// próximos ao nome do produto.
function extractProductAtSlot(
  row: Record<string, string>,
  slot: number,
  headers: string[]
): ParsedProduct | null {
  const nameKey = `js-item-name${suffix(slot)}`;
  const linkKey = `js-item-image-padding href${suffix(slot === 1 ? 1 : slot)}`;
  const priceKey = `js-price-display${suffix(slot)}`;
  const comparePriceKey = `planweb-description-discount-price${suffix(slot)}`;

  const name = (row[nameKey] || "").trim();
  if (!name || name.startsWith("(")) return null; // "(7)" é review count

  const sourceUrl = (row[linkKey] || "").trim();
  const handle =
    sourceUrl
      ? slugify(sourceUrl.replace(/^https?:\/\/[^/]+\/produtos\//, "").replace(/\/$/, ""))
      : slugify(name);

  const priceRaw = row[priceKey];
  const compareRaw = row[comparePriceKey];
  const base_price = parseMoney(priceRaw) ?? 0;
  const compare_at_price = parseMoney(compareRaw);

  const stockLabel = (row["js-stock-label"] || "").trim().toLowerCase();
  const status: "active" | "draft" | "archived" =
    stockLabel === "esgotado" ? "draft" : "active";

  // Tamanhos: varre todas as colunas form-select* e pega valores que sao
  // tamanhos reconhecidos.
  const sizes = new Set<string>();
  for (const h of headers) {
    if (!h.startsWith("form-select")) continue;
    const v = (row[h] || "").trim();
    if (ALLOWED_SIZES.has(v)) sizes.add(v);
  }

  const variants: ParsedVariant[] = Array.from(sizes).map((size) => ({
    size,
    sku: null,
    quantity: 0,
    price: base_price || null,
    compare_at_price,
  }));

  const errors: string[] = [];
  if (!base_price) errors.push("Preço ausente");

  return {
    handle,
    title: name,
    description: null,
    vendor: "Loja do Capita (importado)",
    product_type: "Camisa",
    tags: ["importado", "lojadocapita"],
    status,
    base_price: base_price || 0,
    compare_at_price,
    front_image: null,
    back_image: null,
    extra_images: [],
    source_url: sourceUrl || null,
    seo_title: null,
    seo_description: null,
    variants,
    errors,
  };
}

export function parseLojaDoCapitaCsv(csvText: string): ParseResult {
  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  const globalErrors: string[] = [];
  if (result.errors.length) {
    for (const err of result.errors.slice(0, 5)) {
      globalErrors.push(`Linha ${err.row}: ${err.message}`);
    }
  }

  const headers = result.meta.fields ?? [];
  const maxSlots = headers
    .filter((h) => h.startsWith("js-item-name"))
    .map((h) => {
      const m = h.match(/js-item-name(?: (\d+))?$/);
      return m?.[1] ? parseInt(m[1], 10) : 1;
    });
  const maxSlot = maxSlots.length ? Math.max(...maxSlots) : 1;

  const byHandle = new Map<string, ParsedProduct>();
  for (const row of result.data) {
    for (let slot = 1; slot <= maxSlot; slot++) {
      const product = extractProductAtSlot(row, slot, headers);
      if (!product) continue;
      // Dedupe por handle (CSV repete os mesmos itens em várias páginas)
      if (!byHandle.has(product.handle)) {
        byHandle.set(product.handle, product);
      }
    }
  }

  return { products: Array.from(byHandle.values()), globalErrors };
}

export function detectCsvFormat(csvText: string): "shopify" | "lojadocapita" | "unknown" {
  const firstLine = csvText.split(/\r?\n/, 1)[0] ?? "";
  if (/(^|,)"?Handle"?(,|$)/i.test(firstLine)) return "shopify";
  if (/js-item-name/i.test(firstLine) || /js-price-display/i.test(firstLine))
    return "lojadocapita";
  return "unknown";
}
