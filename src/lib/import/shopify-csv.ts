import Papa from "papaparse";

export type ParsedVariant = {
  size: string;
  sku: string | null;
  quantity: number;
  price: number | null;
  compare_at_price: number | null;
};

export type ParsedProduct = {
  handle: string;
  title: string;
  description: string | null;
  vendor: string | null;
  product_type: string | null;
  tags: string[];
  status: "active" | "draft" | "archived";
  base_price: number;
  compare_at_price: number | null;
  front_image: string | null;
  back_image: string | null;
  extra_images: string[];
  source_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  variants: ParsedVariant[];
  errors: string[];
};

export type ParseResult = {
  products: ParsedProduct[];
  globalErrors: string[];
};

function parseMoney(raw: string | undefined): number | null {
  if (!raw) return null;
  const cleaned = raw
    .replace(/[^\d.,-]/g, "")
    .replace(/\.(?=\d{3}(\D|$))/g, "")
    .replace(",", ".");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : null;
}

function parseInt0(raw: string | undefined): number {
  if (!raw) return 0;
  const n = parseInt(raw.replace(/\D/g, ""), 10);
  return Number.isFinite(n) ? n : 0;
}

function parseTags(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseStatus(
  row: Record<string, string>
): "active" | "draft" | "archived" {
  const status = (row["Status"] || "").toLowerCase().trim();
  if (status === "draft" || status === "archived") return status;
  const published = (row["Published"] || "").toLowerCase().trim();
  if (published === "false") return "draft";
  return "active";
}

export function parseShopifyCsv(csvText: string): ParseResult {
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

  const groups = new Map<string, Record<string, string>[]>();
  for (const row of result.data) {
    const handle = (row["Handle"] || "").trim();
    if (!handle) continue;
    if (!groups.has(handle)) groups.set(handle, []);
    groups.get(handle)!.push(row);
  }

  const products: ParsedProduct[] = [];
  for (const [handle, rows] of groups.entries()) {
    const first = rows[0];
    const errors: string[] = [];

    const title = (first["Title"] || "").trim();
    if (!title) errors.push("Title vazio");

    const description = (first["Body (HTML)"] || "").trim() || null;
    const vendor = (first["Vendor"] || "").trim() || null;
    const product_type = (first["Type"] || "").trim() || null;
    const tags = parseTags(first["Tags"]);
    const status = parseStatus(first);
    const seo_title = (first["SEO Title"] || "").trim() || null;
    const seo_description = (first["SEO Description"] || "").trim() || null;

    const variants: ParsedVariant[] = [];
    const imageByPosition = new Map<number, string>();

    for (const row of rows) {
      const optionName = (row["Option1 Name"] || "").trim();
      const optionValue = (row["Option1 Value"] || "").trim();
      if (optionValue && (optionName.toLowerCase().startsWith("tam") || optionName.toLowerCase() === "size" || !optionName)) {
        variants.push({
          size: optionValue,
          sku: (row["Variant SKU"] || "").trim() || null,
          quantity: parseInt0(row["Variant Inventory Qty"]),
          price: parseMoney(row["Variant Price"]),
          compare_at_price: parseMoney(row["Variant Compare At Price"]),
        });
      }

      const imgSrc = (row["Image Src"] || "").trim();
      if (imgSrc) {
        const pos = parseInt0(row["Image Position"]) || imageByPosition.size + 1;
        if (!imageByPosition.has(pos)) imageByPosition.set(pos, imgSrc);
      }
    }

    const firstVariantWithPrice = variants.find((v) => v.price !== null);
    const base_price = firstVariantWithPrice?.price ?? parseMoney(first["Variant Price"]) ?? 0;
    if (!base_price) errors.push("Preço ausente em todas as variantes");
    const compare_at_price = firstVariantWithPrice?.compare_at_price ?? null;

    const sortedImages = [...imageByPosition.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([, src]) => src);

    products.push({
      handle,
      title,
      description,
      vendor,
      product_type,
      tags,
      status,
      base_price,
      compare_at_price,
      front_image: sortedImages[0] ?? null,
      back_image: sortedImages[1] ?? null,
      extra_images: sortedImages.slice(2),
      source_url: null,
      seo_title,
      seo_description,
      variants,
      errors,
    });
  }

  return { products, globalErrors };
}
