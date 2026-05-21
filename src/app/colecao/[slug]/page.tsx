import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fetchCategoryBySlug } from "@/lib/categories-queries";
import { ProductCard } from "@/components/ProductCard";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await fetchCategoryBySlug(slug);
  if (!data) return { title: "Coleção · SpaceFut" };
  return {
    title: `${data.category.name} · SpaceFut`,
    description: data.category.description ?? undefined,
  };
}

type SortValue = "newest" | "price_asc" | "price_desc";

export default async function ColecaoPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    size?: string;
    gender?: string;
    min?: string;
    max?: string;
    sort?: string;
  }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const filters = {
    size: sp.size || undefined,
    gender: sp.gender || undefined,
    minPrice: sp.min ? Number(sp.min) : undefined,
    maxPrice: sp.max ? Number(sp.max) : undefined,
    sort: (sp.sort as SortValue | undefined) || "newest",
  };

  const data = await fetchCategoryBySlug(slug, filters);
  if (!data) notFound();
  const { category, products } = data;

  const hasFilters = !!(sp.size || sp.gender || sp.min || sp.max);

  return (
    <div className="flex flex-col">
      <section className="px-4 pt-6 sm:pt-10">
        <div className="mx-auto max-w-6xl flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground self-start"
          >
            <ArrowLeft className="size-4" />
            Voltar pra loja
          </Link>
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-foreground/55">
              Coleção
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-2 text-base text-foreground/65 max-w-2xl">
                {category.description}
              </p>
            )}
            <p className="mt-3 text-sm text-foreground/55">
              {products.length} produto{products.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </section>

      {/* Filtros */}
      <section className="px-4 mt-6">
        <div className="mx-auto max-w-6xl">
          <form
            method="GET"
            className="rounded-2xl bg-white border border-border p-4 flex flex-wrap items-center gap-3 text-sm"
          >
            <select
              name="size"
              defaultValue={sp.size ?? ""}
              className="h-10 rounded-xl border border-border bg-muted px-3 font-medium focus:outline-none focus:border-foreground"
            >
              <option value="">Todos tamanhos</option>
              {["P", "M", "G", "GG", "XGG"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              name="gender"
              defaultValue={sp.gender ?? ""}
              className="h-10 rounded-xl border border-border bg-muted px-3 font-medium focus:outline-none focus:border-foreground"
            >
              <option value="">Todos gêneros</option>
              <option value="Masculina">Masculina</option>
              <option value="Feminina">Feminina</option>
            </select>
            <input
              name="min"
              type="number"
              defaultValue={sp.min ?? ""}
              placeholder="R$ mín"
              className="h-10 w-24 rounded-xl border border-border bg-muted px-3 font-medium focus:outline-none focus:border-foreground"
            />
            <input
              name="max"
              type="number"
              defaultValue={sp.max ?? ""}
              placeholder="R$ máx"
              className="h-10 w-24 rounded-xl border border-border bg-muted px-3 font-medium focus:outline-none focus:border-foreground"
            />
            <select
              name="sort"
              defaultValue={sp.sort ?? "newest"}
              className="h-10 rounded-xl border border-border bg-muted px-3 font-medium focus:outline-none focus:border-foreground"
            >
              <option value="newest">Mais recentes</option>
              <option value="price_asc">Menor preço</option>
              <option value="price_desc">Maior preço</option>
            </select>
            <button
              type="submit"
              className="h-10 px-5 rounded-full bg-foreground text-white font-bold text-xs hover:bg-foreground/90"
            >
              Filtrar
            </button>
            {hasFilters && (
              <Link
                href={`/colecao/${category.slug}`}
                className="text-xs text-foreground/60 hover:text-foreground underline-offset-2 hover:underline"
              >
                Limpar filtros
              </Link>
            )}
          </form>
        </div>
      </section>

      <section className="px-4 mt-6 mb-16">
        <div className="mx-auto max-w-6xl">
          {products.length === 0 ? (
            <div className="rounded-3xl bg-white border border-border p-12 text-center">
              <p className="text-foreground/60">
                {hasFilters
                  ? "Nenhum produto encontrado com esses filtros."
                  : "Nenhum produto nessa coleção ainda."}
              </p>
              {hasFilters && (
                <Link
                  href={`/colecao/${category.slug}`}
                  className="mt-2 inline-block text-sm font-bold text-foreground/70 hover:text-foreground underline-offset-2 hover:underline"
                >
                  Limpar filtros →
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
