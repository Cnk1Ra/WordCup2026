import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase/server";
import { ProductEditForm } from "./ProductEditForm";

export const dynamic = "force-dynamic";

export default async function ProdutoEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { slug } = await params;
  const { from } = await searchParams;
  const supabase = getSupabaseServer();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!product) notFound();

  const { data: inventory } = await supabase
    .from("inventory")
    .select("size, quantity")
    .eq("product_id", product.id)
    .order("size");

  const { data: allCategories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("display_order");

  const { data: productCats } = await supabase
    .from("product_categories")
    .select("category_id")
    .eq("product_id", product.id);

  const selectedCategoryIds = (productCats ?? []).map((pc) => pc.category_id);

  const { data: gallery } = await supabase
    .from("product_images")
    .select("id, url, alt, display_order, is_card")
    .eq("product_id", product.id)
    .order("display_order");

  // De onde o usuário veio? Se entrou via /admin/categorias/[slug], volta pra lá.
  const backHref =
    from && /^categoria\/[a-z0-9-]+$/i.test(from)
      ? `/admin/categorias/${from.replace(/^categoria\//, "")}`
      : "/admin/produtos";
  const backLabel =
    from && from.startsWith("categoria/")
      ? "Voltar à categoria"
      : "Produtos";

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <header className="flex flex-col gap-2">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground self-start"
        >
          <ArrowLeft className="size-4" />
          {backLabel}
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {product.short_name}
          </h1>
          <p className="text-sm text-foreground/60">
            Editar dados, imagens e estoque deste produto.
          </p>
        </div>
      </header>

      <ProductEditForm
        product={product}
        inventory={inventory ?? []}
        allCategories={allCategories ?? []}
        selectedCategoryIds={selectedCategoryIds}
        gallery={gallery ?? []}
      />
    </div>
  );
}
