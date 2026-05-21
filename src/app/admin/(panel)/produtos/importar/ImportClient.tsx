"use client";

import { useState, useTransition } from "react";
import { Upload, FileText, AlertCircle, Check, Download } from "lucide-react";
import Link from "next/link";
import { previewCsv, importProductsFromCsv, type ImportResult } from "./actions";
import type { ParsedProduct, CsvFormat } from "@/lib/import";

const FORMAT_LABEL: Record<CsvFormat, string> = {
  shopify: "Shopify",
  lojadocapita: "Loja do Capita (scrape)",
  unknown: "desconhecido",
};

type Step = "upload" | "preview" | "result";

const SAMPLE_CSV = `Handle,Title,Body (HTML),Vendor,Type,Tags,Published,Status,Option1 Name,Option1 Value,Variant SKU,Variant Inventory Qty,Variant Price,Variant Compare At Price,Image Src,Image Position,SEO Title,SEO Description
camisa-exemplo-amarela,Camisa Exemplo Amarela,<p>Descrição da camisa.</p>,SpaceFut,Camisa,"brasil,2026",TRUE,active,Tamanho,P,SF-EX-AM-P,10,150.00,175.00,https://exemplo.com/frente.jpg,1,Camisa Exemplo Amarela,Camisa amarela para Copa 2026
camisa-exemplo-amarela,,,,,,,,Tamanho,M,SF-EX-AM-M,15,150.00,175.00,https://exemplo.com/costas.jpg,2,,
camisa-exemplo-amarela,,,,,,,,Tamanho,G,SF-EX-AM-G,12,150.00,175.00,,,,
camisa-exemplo-amarela,,,,,,,,Tamanho,GG,SF-EX-AM-GG,8,150.00,175.00,,,,
`;

export default function ImportClient() {
  const [step, setStep] = useState<Step>("upload");
  const [csvText, setCsvText] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [format, setFormat] = useState<CsvFormat>("unknown");
  const [products, setProducts] = useState<ParsedProduct[]>([]);
  const [globalErrors, setGlobalErrors] = useState<string[]>([]);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleFile(file: File) {
    const text = await file.text();
    setFileName(file.name);
    setCsvText(text);
    startTransition(async () => {
      const parsed = await previewCsv(text);
      setFormat(parsed.format);
      setProducts(parsed.products);
      setGlobalErrors(parsed.globalErrors);
      setStep("preview");
    });
  }

  function downloadSample() {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "modelo-shopify.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function confirmImport() {
    startTransition(async () => {
      const r = await importProductsFromCsv(csvText);
      setResult(r);
      setStep("result");
    });
  }

  function reset() {
    setStep("upload");
    setCsvText("");
    setFileName("");
    setProducts([]);
    setGlobalErrors([]);
    setResult(null);
  }

  if (step === "upload") {
    return (
      <div className="rounded-3xl bg-white border border-border p-8">
        <label
          htmlFor="csv-file"
          className="block border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:bg-muted transition"
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add("bg-muted");
          }}
          onDragLeave={(e) =>
            e.currentTarget.classList.remove("bg-muted")
          }
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove("bg-muted");
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
          }}
        >
          <Upload className="size-10 mx-auto mb-3 text-foreground/40" />
          <p className="font-bold mb-1">Arraste um CSV ou clique aqui</p>
          <p className="text-xs text-foreground/60">
            Formato Shopify · até 5MB
          </p>
          <input
            id="csv-file"
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </label>

        <button
          onClick={downloadSample}
          type="button"
          className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-foreground/70 hover:text-foreground"
        >
          <Download className="size-4" />
          Baixar modelo de CSV
        </button>

        {isPending && (
          <p className="mt-4 text-sm text-foreground/60">Processando…</p>
        )}
      </div>
    );
  }

  if (step === "preview") {
    const totalErrors = products.filter((p) => p.errors.length > 0).length;
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-3xl bg-white border border-border p-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold">
              <FileText className="size-4" />
              {fileName}
              <span className="text-[10px] font-bold uppercase tracking-wider bg-muted text-foreground/60 rounded-full px-2 py-0.5">
                {FORMAT_LABEL[format]}
              </span>
            </div>
            <p className="text-xs text-foreground/60 mt-1">
              {products.length} produto(s) ·{" "}
              {products.reduce((acc, p) => acc + p.variants.length, 0)}{" "}
              variante(s)
              {totalErrors > 0 && (
                <span className="text-red-600 font-bold">
                  {" "}
                  · {totalErrors} com erro
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={reset}
              type="button"
              className="h-10 px-4 rounded-full border border-border text-sm font-bold hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              onClick={confirmImport}
              disabled={isPending || products.length === 0}
              type="button"
              className="h-10 px-5 rounded-full bg-foreground text-white text-sm font-bold hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending ? "Importando…" : `Importar ${products.length}`}
            </button>
          </div>
        </div>

        {globalErrors.length > 0 && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-900">
            <div className="flex items-center gap-2 font-bold mb-2">
              <AlertCircle className="size-4" /> Erros gerais
            </div>
            <ul className="list-disc list-inside space-y-1 text-xs">
              {globalErrors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-3xl bg-white border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {products.map((p) => (
              <div key={p.handle} className="p-4 flex gap-4">
                <div className="size-14 rounded-xl bg-muted overflow-hidden shrink-0 border border-border flex items-center justify-center">
                  {p.front_image ? (
                    <img
                      src={p.front_image}
                      alt={p.title}
                      className="size-full object-contain p-1"
                    />
                  ) : (
                    <FileText className="size-5 text-foreground/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold truncate">{p.title || p.handle}</p>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-muted text-foreground/60 rounded-full px-2 py-0.5">
                      {p.handle}
                    </span>
                    {p.status !== "active" && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-800 rounded-full px-2 py-0.5">
                        {p.status}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/60 mt-0.5">
                    {p.vendor && <span>{p.vendor} · </span>}
                    {p.product_type && <span>{p.product_type} · </span>}
                    R$ {p.base_price.toFixed(2)}
                    {p.compare_at_price && (
                      <span className="line-through ml-1 text-foreground/40">
                        R$ {p.compare_at_price.toFixed(2)}
                      </span>
                    )}
                  </p>
                  {p.variants.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.variants.map((v, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-bold uppercase bg-muted rounded-md px-2 py-0.5"
                        >
                          {v.size} · {v.quantity}un
                        </span>
                      ))}
                    </div>
                  )}
                  {p.errors.length > 0 && (
                    <div className="mt-2 text-xs text-red-700 flex items-center gap-1">
                      <AlertCircle className="size-3" />
                      {p.errors.join("; ")}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-white border border-border p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
          <Check className="size-5" />
        </div>
        <div>
          <h2 className="text-xl font-black">Importação concluída</h2>
          <p className="text-sm text-foreground/60">{fileName}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Stat label="Criados" value={result?.created ?? 0} tone="ok" />
        <Stat label="Atualizados" value={result?.updated ?? 0} tone="info" />
        <Stat label="Falhas" value={result?.failed ?? 0} tone="bad" />
      </div>

      {result && result.errors.length > 0 && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm mb-6">
          <p className="font-bold text-red-900 mb-2">Detalhes das falhas</p>
          <ul className="space-y-1 text-xs text-red-900">
            {result.errors.map((e, i) => (
              <li key={i}>
                <span className="font-bold">{e.handle}:</span> {e.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={reset}
          type="button"
          className="h-10 px-4 rounded-full border border-border text-sm font-bold hover:bg-muted"
        >
          Importar outro
        </button>
        <Link
          href="/admin/produtos"
          className="h-10 px-5 inline-flex items-center rounded-full bg-foreground text-white text-sm font-bold hover:bg-foreground/90"
        >
          Ver produtos
        </Link>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "ok" | "info" | "bad";
}) {
  const toneClass =
    tone === "ok"
      ? "text-brand-green"
      : tone === "bad"
        ? "text-red-600"
        : "text-foreground";
  return (
    <div className="rounded-2xl bg-muted p-4">
      <p className="text-xs text-foreground/60 mb-1">{label}</p>
      <p className={`text-2xl font-black ${toneClass}`}>{value}</p>
    </div>
  );
}
