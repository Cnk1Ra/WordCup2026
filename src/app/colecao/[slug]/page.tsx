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

export default async function ColecaoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await fetchCategoryBySlug(slug);
  if (!data) notFound();

  const { category, products } = data;

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

      <section className="px-4 mt-8 mb-16">
        <div className="mx-auto max-w-6xl">
          {products.length === 0 ? (
            <div className="rounded-3xl bg-white border border-border p-12 text-center">
              <p className="text-foreground/60">
                Nenhum produto nessa coleção ainda.
              </p>
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
