import Link from "next/link";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  Star,
  Shirt,
  Type,
  PackageCheck,
  Plus,
  Minus,
} from "lucide-react";
import { fetchProducts } from "@/lib/products-queries";
import { fetchActiveCategoriesWithCount } from "@/lib/categories-queries";
import { fetchHomeSections } from "@/lib/home-sections";
import type { TrustBarItem } from "@/lib/home-sections";
import { ProductCard } from "@/components/ProductCard";
import { HeroCarousel } from "@/components/home/HeroCarousel";

export const revalidate = 60;

const ICONS = {
  truck: Truck,
  shield: ShieldCheck,
  star: Star,
  package: PackageCheck,
  shirt: Shirt,
  type: Type,
} as const;

export default async function Home() {
  const [products, categories, sections] = await Promise.all([
    fetchProducts(),
    fetchActiveCategoriesWithCount(),
    fetchHomeSections(),
  ]);

  return (
    <div className="flex flex-col">
      {sections
        .filter((s) => s.enabled)
        .map((section) => {
          if (section.type === "hero_carousel") {
            return <HeroCarousel key={section.id} data={section.data} />;
          }
          if (section.type === "trust_bar") {
            return (
              <section key={section.id} className="px-4 mt-6">
                <div className="mx-auto max-w-6xl grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {section.data.items.map((it: TrustBarItem, i: number) => {
                    const Icon = ICONS[it.icon] ?? Star;
                    return (
                      <div
                        key={i}
                        className="rounded-2xl bg-white border border-border p-4 flex items-center gap-3"
                      >
                        <Icon className="size-5 text-brand-green shrink-0" />
                        <div>
                          <p className="text-xs font-bold">{it.title}</p>
                          <p className="text-[11px] text-foreground/60">
                            {it.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          }
          if (section.type === "categories") {
            if (categories.length === 0) return null;
            return (
              <section key={section.id} className="px-4 mt-10 sm:mt-14">
                <div className="mx-auto max-w-6xl flex flex-col gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-foreground/50 font-semibold">
                      {section.data.subtitle}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                      {section.data.title}
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {categories.map((c) => (
                      <Link
                        key={c.id}
                        href={`/colecao/${c.slug}`}
                        className="group rounded-3xl bg-white border border-border p-5 flex flex-col gap-2 hover:border-foreground hover:-translate-y-0.5 transition"
                      >
                        <p className="text-xs uppercase tracking-wider text-foreground/50 font-semibold">
                          {c.productCount} produto{c.productCount === 1 ? "" : "s"}
                        </p>
                        <p className="font-black text-lg leading-tight">
                          {c.name}
                        </p>
                        <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-foreground/70 group-hover:text-foreground">
                          Ver coleção <ArrowRight className="size-3.5" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );
          }
          if (section.type === "products_grid") {
            const limit = section.data.limit ?? 12;
            const shown = products.slice(0, limit);
            return (
              <section
                key={section.id}
                id="camisas"
                className="px-4 mt-10 sm:mt-14"
              >
                <div className="mx-auto max-w-6xl flex flex-col gap-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-foreground/50 font-semibold">
                        {section.data.subtitle}
                      </p>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                        {section.data.title}
                      </h2>
                    </div>
                    <span className="text-xs text-foreground/60 hidden sm:block">
                      {products.length} produtos
                    </span>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {shown.map((p) => (
                      <ProductCard key={p.slug} product={p} />
                    ))}
                  </div>
                </div>
              </section>
            );
          }
          if (section.type === "how_it_works") {
            return (
              <section key={section.id} className="px-4 mt-16 sm:mt-20">
                <div className="mx-auto max-w-6xl flex flex-col gap-8">
                  <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
                    <p className="text-xs uppercase tracking-wider text-foreground/50 font-semibold">
                      {section.data.subtitle}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                      {section.data.title}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {section.data.steps.map((step, i: number) => (
                      <div
                        key={i}
                        className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-2"
                      >
                        <div className="size-10 rounded-2xl bg-foreground text-white grid place-items-center font-black">
                          {i + 1}
                        </div>
                        <h3 className="font-black text-lg mt-2">{step.title}</h3>
                        <p className="text-sm text-foreground/65">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }
          if (section.type === "faq") {
            return (
              <section key={section.id} className="px-4 mt-16 sm:mt-20">
                <div className="mx-auto max-w-3xl flex flex-col gap-6">
                  <div className="text-center flex flex-col gap-1">
                    <p className="text-xs uppercase tracking-wider text-foreground/50 font-semibold">
                      {section.data.subtitle}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                      {section.data.title}
                    </h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    {FAQS.map((f) => (
                      <details
                        key={f.q}
                        className="rounded-2xl bg-white border border-border p-5 group"
                      >
                        <summary className="font-bold text-sm cursor-pointer list-none flex items-center justify-between gap-3">
                          <span>{f.q}</span>
                          <Plus className="size-4 text-foreground/40 group-open:hidden" />
                          <Minus className="size-4 text-foreground/40 hidden group-open:block" />
                        </summary>
                        <p className="text-foreground/70 text-sm mt-3 leading-relaxed">
                          {f.a}
                        </p>
                      </details>
                    ))}
                    <Link
                      href="/faq"
                      className="text-sm text-foreground/60 hover:text-foreground underline-offset-2 hover:underline text-center mt-2"
                    >
                      Ver todas as perguntas →
                    </Link>
                  </div>
                </div>
              </section>
            );
          }
          return null;
        })}

      <div className="mt-12" />
    </div>
  );
}

const FAQS = [
  {
    q: "Como funciona a personalização?",
    a: "Marca a opção 'Personalizar' no produto, coloca nome (até 12 chars) e número (1-99) — sai +R$ 49,90. Personalização é sob encomenda, não tem direito de arrependimento, mas defeito a gente troca.",
  },
  {
    q: "Qual o prazo de entrega?",
    a: "BH e Sabará: 1-2 dias úteis (pronto) ou 5-6 dias (personalizada). Demais regiões: 7-12 dias.",
  },
  {
    q: "Quanto custa o frete?",
    a: "R$ 5,00 fixo pra todo o Brasil.",
  },
];
