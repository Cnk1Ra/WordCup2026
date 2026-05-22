import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  function normalize(s: string): string {
    return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  // Distância de edição (Levenshtein) iterativa
  function levenshtein(a: string, b: string): number {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const m = a.length;
    const n = b.length;
    let prev = new Array(n + 1).fill(0).map((_, i) => i);
    let curr = new Array(n + 1).fill(0);
    for (let i = 1; i <= m; i++) {
      curr[0] = i;
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        curr[j] = Math.min(
          curr[j - 1] + 1,
          prev[j] + 1,
          prev[j - 1] + cost
        );
      }
      [prev, curr] = [curr, prev];
    }
    return prev[n];
  }

  // Confere se cada palavra da query (normalizada) bate como substring
  // OU está perto (Levenshtein) de alguma palavra do haystack.
  function matchesFuzzy(query: string, haystack: string): boolean {
    const qWords = query.split(/\s+/).filter(Boolean);
    if (qWords.length === 0) return false;
    const hWords = haystack.split(/\s+/).filter(Boolean);
    return qWords.every((qw) => {
      if (haystack.includes(qw)) return true;
      // Toleramos até max(1, length/4) edits — "altetico" (8) tolera 2
      const maxDist = Math.max(1, Math.floor(qw.length / 4));
      return hWords.some((hw) => {
        if (Math.abs(hw.length - qw.length) > maxDist) return false;
        return levenshtein(qw, hw) <= maxDist;
      });
    });
  }

  let products: Product[] = [];
  if (query) {
    const supabase = getSupabaseServer();
    // Fetch todos os produtos ativos + filtra server-side com normalize.
    // ILIKE do Postgres nao ignora acentos, entao "são" nao acha "São Paulo".
    // Pra catalogo de ~700 produtos isso e tranquilo (~50KB transferido).
    const { data: allActive } = await supabase
      .from("products")
      .select("*, card_images:product_images(url, is_card)")
      .eq("is_active", true)
      .order("display_order");

    type Row = {
      slug: string;
      name: string;
      short_name: string | null;
      team: string | null;
      gender: "Masculina" | "Feminina" | null;
      color: string | null;
      hex: string | null;
      accent_hex: string | null;
      text_color: string | null;
      front_image: string | null;
      back_image: string | null;
      badge: string | null;
      base_price: string | number;
      compare_at_price: string | number | null;
      allows_personalization?: boolean;
      card_images?: { url: string; is_card: boolean }[];
    };

    const qNorm = normalize(query);
    const filtered = (allActive ?? []).filter((r) => {
      const row = r as Row;
      const hay = normalize(
        `${row.name ?? ""} ${row.short_name ?? ""} ${row.slug ?? ""}`
      );
      // Primeira tentativa: substring exata. Fallback: fuzzy match por
      // palavra (tolera typos de 1-2 chars).
      return hay.includes(qNorm) || matchesFuzzy(qNorm, hay);
    });

    products = filtered.map((r) => {
      const row = r as Row;
      const cardOverride = row.card_images?.find((i) => i.is_card)?.url ?? null;
      return {
        slug: row.slug,
        name: row.name,
        shortName: row.short_name ?? row.name,
        team: row.team ?? "",
        edition: "I",
        gender: row.gender ?? "Masculina",
        color: row.color ?? "",
        hex: row.hex ?? "#000000",
        accentHex: row.accent_hex ?? "#FFFFFF",
        textColor: row.text_color ?? "#FFFFFF",
        front: row.front_image ?? "",
        back: row.back_image ?? "",
        badge: row.badge ?? undefined,
        basePrice: Number(row.base_price),
        comparePrice: row.compare_at_price ? Number(row.compare_at_price) : null,
        allowsPersonalization: row.allows_personalization ?? false,
        cardImage: cardOverride,
      };
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 flex flex-col gap-8">
      <form className="flex flex-col gap-3" action="/buscar">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Buscar produtos
        </h1>
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-foreground/40" />
          <input
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Buscar por nome, time, modelo..."
            autoFocus
            className="w-full h-12 rounded-2xl border border-border bg-white pl-11 pr-4 text-sm font-medium focus:outline-none focus:border-foreground"
          />
        </div>
      </form>

      {!query ? (
        <p className="text-sm text-foreground/55">
          Digite uma busca acima — ex: <em>brasil</em>, <em>copa 1998</em>, <em>infantil</em>.
        </p>
      ) : products.length === 0 ? (
        <div className="rounded-3xl bg-white border border-border p-12 text-center">
          <p className="text-foreground/60">
            Nenhum produto encontrado pra <strong>{query}</strong>.
          </p>
          <Link
            href="/"
            className="mt-3 inline-block text-sm font-bold text-foreground/70 hover:text-foreground underline-offset-2 hover:underline"
          >
            Ver catálogo completo →
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-foreground/60">
            {products.length} resultado(s) pra <strong>{query}</strong>
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
