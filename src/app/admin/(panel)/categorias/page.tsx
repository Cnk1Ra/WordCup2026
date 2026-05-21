import { getSupabaseServer } from "@/lib/supabase/server";
import CategoriasClient from "./CategoriasClient";

export const dynamic = "force-dynamic";

export default async function CategoriasPage() {
  const supabase = getSupabaseServer();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, slug, name, description, display_order, is_active")
    .order("display_order", { ascending: true });

  const { data: counts } = await supabase
    .from("product_categories")
    .select("category_id");

  const countMap = new Map<string, number>();
  (counts ?? []).forEach((c) => {
    countMap.set(c.category_id, (countMap.get(c.category_id) ?? 0) + 1);
  });

  const enriched = (categories ?? []).map((c) => ({
    ...c,
    productCount: countMap.get(c.id) ?? 0,
  }));

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <header>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Categorias
        </h1>
        <p className="text-sm text-foreground/60">
          Agrupe produtos por categoria pra organizar a home e listagens.
        </p>
      </header>

      <CategoriasClient categories={enriched} />
    </div>
  );
}
