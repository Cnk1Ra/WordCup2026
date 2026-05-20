import Link from "next/link";
import Image from "next/image";
import { Pencil, Plus, Eye, EyeOff } from "lucide-react";
import { getSupabaseServer } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProdutosPage() {
  const supabase = getSupabaseServer();
  const { data: products } = await supabase
    .from("products")
    .select(
      "id, slug, name, short_name, color, gender, base_price, badge, is_active, front_image, display_order"
    )
    .order("display_order", { ascending: true });

  const { data: inventory } = await supabase
    .from("inventory")
    .select("product_id, size, quantity");

  const stockByProduct = new Map<string, number>();
  (inventory ?? []).forEach((row) => {
    stockByProduct.set(
      row.product_id,
      (stockByProduct.get(row.product_id) ?? 0) + row.quantity
    );
  });

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Produtos
          </h1>
          <p className="text-sm text-foreground/60">
            Gerencie catálogo, imagens, descrições, preços e estoque.
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-foreground text-white text-sm font-bold hover:bg-foreground/90 transition"
        >
          <Plus className="size-4" />
          Novo
        </Link>
      </header>

      <div className="rounded-3xl bg-white border border-border overflow-hidden">
        <div className="divide-y divide-border">
          {(products ?? []).map((p) => {
            const totalStock = stockByProduct.get(p.id) ?? 0;
            return (
              <Link
                key={p.id}
                href={`/admin/produtos/${p.slug}`}
                className="flex items-center gap-4 p-4 hover:bg-muted transition"
              >
                <div className="size-16 rounded-2xl bg-muted overflow-hidden shrink-0 relative border border-border">
                  <Image
                    src={p.front_image}
                    alt={p.short_name}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold truncate">{p.short_name}</p>
                    {p.badge && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-foreground text-white rounded-full px-2 py-0.5">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/60">
                    {p.color} · {p.gender}
                  </p>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-0.5">
                  <p className="text-xs text-foreground/55">Estoque</p>
                  <p className={`text-sm font-bold ${totalStock === 0 ? "text-orange-600" : ""}`}>
                    {totalStock} un
                  </p>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-0.5 w-24">
                  <p className="text-xs text-foreground/55">Preço</p>
                  <p className="text-sm font-bold">
                    {formatBRL(Number(p.base_price))}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {p.is_active ? (
                    <span title="Ativo" className="text-brand-green">
                      <Eye className="size-4" />
                    </span>
                  ) : (
                    <span title="Inativo" className="text-foreground/30">
                      <EyeOff className="size-4" />
                    </span>
                  )}
                  <Pencil className="size-4 text-foreground/40" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
