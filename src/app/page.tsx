import Link from "next/link";
import { ArrowRight, Sparkles, Truck, ShieldCheck } from "lucide-react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="px-4 pt-4">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-green via-brand-green to-emerald-700 text-white p-6 sm:p-12 min-h-[460px] flex flex-col justify-end">
            <div
              aria-hidden
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 80% 10%, #FEDD00 0, transparent 40%), radial-gradient(circle at 20% 90%, #002776 0, transparent 50%)",
              }}
            />
            <div className="relative z-10 max-w-xl flex flex-col gap-4">
              <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/15 backdrop-blur px-3 py-1 text-xs font-semibold">
                <Sparkles className="size-3.5" /> Coleção Copa 2026
              </span>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[0.95]">
                Veste o Brasil.
                <br />
                <span className="text-brand-yellow">Faz história.</span>
              </h1>
              <p className="text-white/85 text-base sm:text-lg max-w-md">
                Camisas oficiais I e II da Seleção, masculinas e femininas. Personalize com seu nome e número.
              </p>
              <div className="flex gap-3 mt-2">
                <Link
                  href="#camisas"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-yellow text-foreground font-bold px-6 py-3 hover:bg-yellow-300 transition"
                >
                  Comprar agora <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="px-4 mt-6">
        <div className="mx-auto max-w-6xl grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white border border-border p-4 flex items-center gap-3">
            <Truck className="size-5 text-brand-green shrink-0" />
            <div>
              <p className="text-xs font-bold">Frete fixo R$ 5</p>
              <p className="text-[11px] text-foreground/60">Em todo o Brasil</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-border p-4 flex items-center gap-3">
            <Sparkles className="size-5 text-brand-green shrink-0" />
            <div>
              <p className="text-xs font-bold">Personalização</p>
              <p className="text-[11px] text-foreground/60">Nome e número</p>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-2xl bg-white border border-border p-4 flex items-center gap-3">
            <ShieldCheck className="size-5 text-brand-green shrink-0" />
            <div>
              <p className="text-xs font-bold">Pagamento seguro</p>
              <p className="text-[11px] text-foreground/60">Stripe Checkout</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section id="camisas" className="px-4 mt-10 sm:mt-14">
        <div className="mx-auto max-w-6xl flex flex-col gap-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-foreground/50 font-semibold">
                Coleção 2026
              </p>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Camisas da Seleção
              </h2>
            </div>
            <span className="text-xs text-foreground/60 hidden sm:block">
              {products.length} produtos
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Inline CTA */}
      <section className="px-4 mt-12 sm:mt-16">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[2.5rem] bg-foreground text-white p-6 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between">
            <div className="max-w-md flex flex-col gap-2">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                Coloca seu nome nas costas.
              </h3>
              <p className="text-white/70 text-sm sm:text-base">
                Personalize com seu nome (até 12 caracteres) e número (1–99). +R$ 2 por letra e +R$ 3 por número.
              </p>
            </div>
            <Link
              href={`/produto/${products[0].slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-brand-yellow text-foreground font-bold px-6 py-3 hover:bg-yellow-300 transition"
            >
              Personalizar a minha <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
