import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase/server";
import { ProductEditForm } from "./ProductEditForm";

export const dynamic = "force-dynamic";

export default async function ProdutoEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <header className="flex flex-col gap-2">
        <Link
          href="/admin/produtos"
          className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground self-start"
        >
          <ArrowLeft className="size-4" />
          Produtos
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
      />
    </div>
  );
}
