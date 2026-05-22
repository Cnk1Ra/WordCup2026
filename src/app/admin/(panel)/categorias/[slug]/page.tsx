import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Upload, Plus, Package } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function CategoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = getSupabaseServer();

  const { data: category } = await supabase
    .from("categories")
    .select("id, slug, name, description, is_active")
    .eq("slug", slug)
    .maybeSingle();

  if (!category) notFound();

  const { data: links } = await supabase
    .from("product_categories")
    .select(
      "products!inner(id, slug, name, short_name, base_price, is_active, front_image)"
    )
    .eq("category_id", category.id);

  type ProductLink = {
    products: {
      id: string;
      slug: string;
      name: string;
      short_name: string | null;
      base_price: string | number;
      is_active: boolean;
      front_image: string | null;
    };
  };

  const products = (links ?? [])
    .map((l) => (l as unknown as ProductLink).products)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <header className="flex flex-col gap-2">
        <Link
          href="/admin/categorias"
          className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground self-start"
        >
          <ArrowLeft className="size-4" />
          Categorias
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-foreground/55 font-semibold">
              Categoria
            </p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-sm text-foreground/65 mt-1">
                {category.description}
              </p>
            )}
            <p className="text-xs text-foreground/55 mt-2">
              {products.length} produto(s){" "}
              {!category.is_active && (
                <span className="font-bold text-yellow-700">
                  · CATEGORIA INATIVA
                </span>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/admin/produtos/importar?category=${category.slug}`}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-foreground text-white font-bold text-sm hover:bg-foreground/90 transition"
            >
              <Upload className="size-4" />
              Importar CSV nessa categoria
            </Link>
            <Link
              href="/admin/produtos/novo"
              className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-border bg-white font-bold text-sm hover:bg-muted transition"
            >
              <Plus className="size-4" />
              Novo produto
            </Link>
          </div>
        </div>
      </header>

      <div className="rounded-3xl bg-white border border-border overflow-hidden">
        {products.length === 0 ? (
          <div className="p-10 text-center">
            <Package className="size-8 mx-auto text-foreground/30 mb-3" />
            <p className="text-sm text-foreground/65">
              Nenhum produto nessa categoria ainda.
            </p>
            <p className="text-xs text-foreground/45 mt-1">
              Use os botões acima pra importar via CSV ou criar manualmente.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/admin/produtos/${p.slug}?from=categoria/${category.slug}`}
                className="flex items-center gap-4 p-4 hover:bg-muted transition"
              >
                <div className="size-14 rounded-xl bg-muted overflow-hidden shrink-0 relative border border-border grid place-items-center">
                  {p.front_image ? (
                    <Image
                      src={p.front_image}
                      alt={p.short_name ?? p.name}
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                    />
                  ) : (
                    <Package className="size-5 text-foreground/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{p.short_name ?? p.name}</p>
                  <p className="text-xs text-foreground/55 mt-0.5">
                    {p.slug}
                    {!p.is_active && (
                      <span className="ml-2 inline-block text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-800 rounded-full px-2 py-0.5">
                        inativo
                      </span>
                    )}
                  </p>
                </div>
                <p className="text-sm font-bold whitespace-nowrap">
                  {formatBRL(Number(p.base_price))}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
