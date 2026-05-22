"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Search,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Loader2,
  Package,
} from "lucide-react";
import {
  searchProductsForPicker,
  getProductsByIds,
} from "./actions";

type Product = {
  id: string;
  slug: string;
  name: string;
  short_name: string | null;
  front_image: string | null;
};

export function ProductPicker({
  picks,
  onChange,
  hasCategory,
}: {
  picks: string[];
  onChange: (picks: string[]) => void;
  hasCategory: boolean;
}) {
  const [selected, setSelected] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [searching, startSearch] = useTransition();
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Carrega produtos dos picks iniciais
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const prods = await getProductsByIds(picks);
      if (!cancelled) {
        setSelected(prods);
        setLoadingInitial(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const t = setTimeout(() => {
      startSearch(async () => {
        const r = await searchProductsForPicker(query);
        setResults(r);
      });
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  function add(p: Product) {
    if (selected.find((s) => s.id === p.id)) return;
    const next = [...selected, p];
    setSelected(next);
    onChange(next.map((s) => s.id));
  }

  function remove(id: string) {
    const next = selected.filter((s) => s.id !== id);
    setSelected(next);
    onChange(next.map((s) => s.id));
  }

  function move(id: string, dir: "up" | "down") {
    const idx = selected.findIndex((s) => s.id === id);
    if (idx === -1) return;
    const swap = dir === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= selected.length) return;
    const next = [...selected];
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setSelected(next);
    onChange(next.map((s) => s.id));
  }

  return (
    <div className="rounded-3xl bg-white border border-border p-5 flex flex-col gap-4">
      <div>
        <h2 className="font-bold">Produtos selecionados manualmente</h2>
        <p className="text-xs text-foreground/60 mt-0.5">
          Se houver picks aqui, eles são mostrados nessa ordem exata e{" "}
          <strong>ignoram filtros automáticos</strong>
          {hasCategory && " (incluindo categoria)"}.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/40" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar produto pra adicionar..."
          className="w-full h-11 rounded-2xl border border-border bg-muted pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-foreground"
        />
        {searching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-foreground/40" />
        )}
      </div>

      {/* Search results */}
      {results.length > 0 && (
        <div className="rounded-2xl border border-border bg-muted/30 max-h-72 overflow-y-auto divide-y divide-border">
          {results.map((p) => {
            const already = !!selected.find((s) => s.id === p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => add(p)}
                disabled={already}
                className="w-full p-3 flex items-center gap-3 hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed text-left"
              >
                <div className="size-10 rounded-lg bg-muted overflow-hidden shrink-0 grid place-items-center border border-border">
                  {p.front_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.front_image}
                      alt=""
                      className="size-full object-contain p-0.5"
                    />
                  ) : (
                    <Package className="size-4 text-foreground/30" />
                  )}
                </div>
                <span className="flex-1 text-sm font-medium truncate">
                  {p.short_name ?? p.name}
                </span>
                {already ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-foreground/10 rounded-full px-2 py-0.5">
                    já incluído
                  </span>
                ) : (
                  <Plus className="size-4 text-foreground/60" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Selected list */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-bold uppercase tracking-wider text-foreground/55">
          {loadingInitial
            ? "Carregando picks..."
            : selected.length === 0
              ? "Nenhum produto selecionado — usa os filtros acima"
              : `${selected.length} produto(s) selecionado(s) — arrasta pra reordenar`}
        </p>
        <div className="rounded-2xl border border-border bg-muted/30 divide-y divide-border">
          {selected.map((p, i) => (
            <div key={p.id} className="p-3 flex items-center gap-3">
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => move(p.id, "up")}
                  disabled={i === 0}
                  className="p-0.5 rounded hover:bg-muted disabled:opacity-20"
                  aria-label="Mover pra cima"
                >
                  <ArrowUp className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(p.id, "down")}
                  disabled={i === selected.length - 1}
                  className="p-0.5 rounded hover:bg-muted disabled:opacity-20"
                  aria-label="Mover pra baixo"
                >
                  <ArrowDown className="size-3.5" />
                </button>
              </div>
              <div className="size-10 rounded-lg bg-muted overflow-hidden shrink-0 grid place-items-center border border-border">
                {p.front_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.front_image}
                    alt=""
                    className="size-full object-contain p-0.5"
                  />
                ) : (
                  <Package className="size-4 text-foreground/30" />
                )}
              </div>
              <span className="text-[11px] font-bold text-foreground/40 w-6">
                #{i + 1}
              </span>
              <span className="flex-1 text-sm font-medium truncate">
                {p.short_name ?? p.name}
              </span>
              <button
                type="button"
                onClick={() => remove(p.id)}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                aria-label="Remover"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
        {selected.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Limpar todos os picks?")) {
                setSelected([]);
                onChange([]);
              }
            }}
            className="self-start text-xs text-foreground/55 hover:text-foreground underline-offset-2 hover:underline mt-2"
          >
            Limpar picks (volta ao filtro automático)
          </button>
        )}
      </div>
    </div>
  );
}
