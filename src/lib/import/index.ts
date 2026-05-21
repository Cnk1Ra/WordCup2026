import { parseShopifyCsv } from "./shopify-csv";
import { parseLojaDoCapitaCsv, detectCsvFormat } from "./lojadocapita-csv";
import type { ParseResult } from "./shopify-csv";

export type CsvFormat = "shopify" | "lojadocapita" | "unknown";

export type DetectedResult = ParseResult & { format: CsvFormat };

export function parseCsvAuto(csvText: string): DetectedResult {
  const format = detectCsvFormat(csvText);
  if (format === "shopify") {
    return { ...parseShopifyCsv(csvText), format };
  }
  if (format === "lojadocapita") {
    return { ...parseLojaDoCapitaCsv(csvText), format };
  }
  return {
    products: [],
    globalErrors: [
      "Formato de CSV não reconhecido. Use o modelo Shopify ou um scrape do lojadocapita.com.br.",
    ],
    format,
  };
}

export { detectCsvFormat };
export type { ParseResult, ParsedProduct, ParsedVariant } from "./shopify-csv";
