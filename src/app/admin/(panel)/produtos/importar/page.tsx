import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase/server";
import ImportClient from "./ImportClient";

export const dynamic = "force-dynamic";

export default async function ImportarPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: preselectSlug } = await searchParams;
  const supabase = getSupabaseServer();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("display_order");

  const preselectId = preselectSlug
    ? categories?.find((c) => c.slug === preselectSlug)?.id ?? null
    : null;

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <header className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/produtos"
            className="inline-flex items-center gap-1 text-xs text-foreground/60 hover:text-foreground mb-2"
          >
            <ArrowLeft className="size-3.5" /> Voltar
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Importar produtos
          </h1>
          <p className="text-sm text-foreground/60">
            CSV no formato Shopify. Mesmo Handle agrupa variantes do mesmo produto.
          </p>
        </div>
      </header>

      <ImportClient
        categories={categories ?? []}
        preselectCategoryIds={preselectId ? [preselectId] : []}
      />
    </div>
  );
}
