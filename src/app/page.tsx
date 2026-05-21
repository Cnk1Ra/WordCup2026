import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
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
import { fetchHeroSettings } from "@/lib/site-settings";
import { ProductCard } from "@/components/ProductCard";

export const revalidate = 60;

export default async function Home() {
  const [products, hero] = await Promise.all([
    fetchProducts(),
    fetchHeroSettings(),
  ]);
  return (
    <div className="flex flex-col">
      {/* Hero com imagem de torcida */}
      <section className="px-4 pt-4">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-[2.5rem] min-h-[460px] sm:min-h-[560px] flex flex-col justify-end text-white">
            <Image
              src="/images/home/home-hero-stadium.png"
              alt="Torcida brasileira no estádio"
              fill
              priority
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.20) 80%)",
              }}
            />
            <div className="relative z-10 p-6 sm:p-12 max-w-xl flex flex-col gap-4">
              <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-brand-yellow/95 text-foreground px-3 py-1 text-xs font-bold">
                <Sparkles className="size-3.5" /> {hero.tag}
              </span>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[0.95]">
                {hero.title_line_1}
                <br />
                <span className="text-brand-yellow">{hero.title_line_2}</span>
              </h1>
              <p className="text-white/85 text-base sm:text-lg max-w-md">
                {hero.description}
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                <Link
                  href="#camisas"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-yellow text-foreground font-bold px-6 py-3 hover:bg-yellow-300 transition"
                >
                  {hero.cta_label} <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="#como-funciona"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 backdrop-blur bg-white/10 text-white font-bold px-6 py-3 hover:bg-white/20 transition"
                >
                  Como funciona
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

      {/* Como funciona */}
      <section id="como-funciona" className="px-4 mt-16 sm:mt-20">
        <div className="mx-auto max-w-6xl flex flex-col gap-8">
          <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
            <p className="text-xs uppercase tracking-wider text-foreground/50 font-semibold">
              Em 3 passos
            </p>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Da escolha à entrega.
            </h2>
            <p className="text-foreground/60 text-sm sm:text-base">
              Compre em 2 minutos. Receba em casa em até 7 dias úteis no Brasil
              (ou em 1 dia útil se você for de Sabará/MG).
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: Shirt,
                step: "1",
                title: "Escolhe a camisa",
                desc: "Edição I (amarela) ou II (azul). Modelagem masculina ou feminina. Tamanhos P ao XGG.",
              },
              {
                icon: Type,
                step: "2",
                title: "Personaliza",
                desc: "Coloca seu nome (até 12 caracteres) e número (1–99) nas costas. +R$ 2 por letra, +R$ 3 por número.",
              },
              {
                icon: PackageCheck,
                step: "3",
                title: "Recebe em casa",
                desc: "Frete fixo R$ 5 pra todo Brasil. Em Sabará chega no mesmo dia, em BH em até 2 dias úteis.",
              },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div
                key={step}
                className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-3 hover:border-foreground/30 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="size-10 rounded-2xl bg-foreground text-white grid place-items-center font-black">
                    {step}
                  </span>
                  <Icon className="size-6 text-brand-green" />
                </div>
                <h3 className="text-lg font-black">{title}</h3>
                <p className="text-sm text-foreground/65 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inline CTA personalização */}
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
            {products[0] && (
              <Link
                href={`/produto/${products[0].slug}`}
                className="inline-flex items-center gap-2 rounded-full bg-brand-yellow text-foreground font-bold px-6 py-3 hover:bg-yellow-300 transition"
              >
                Personalizar a minha <ArrowRight className="size-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Reviews / depoimentos */}
      <section className="px-4 mt-16 sm:mt-20">
        <div className="mx-auto max-w-6xl flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-foreground/50 font-semibold">
                Depoimentos
              </p>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                O que os torcedores estão falando.
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="size-4 fill-brand-yellow text-brand-yellow"
                  />
                ))}
              </div>
              <span className="text-sm font-bold">4.9</span>
              <span className="text-xs text-foreground/60">· 127 avaliações</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                name: "Lucas M.",
                location: "Sabará, MG",
                text: "Pedi sexta de noite, chegou sábado no almoço. Tecido top, costura impecável. Personalização ficou perfeita.",
                stars: 5,
                verified: true,
              },
              {
                name: "Carolina S.",
                location: "Belo Horizonte, MG",
                text: "Comprei a feminina amarela e a masculina azul pro meu marido. Os dois amaram. Vai ser nosso uniforme da Copa!",
                stars: 5,
                verified: true,
              },
              {
                name: "Rafael P.",
                location: "Contagem, MG",
                text: "Achei o frete justo, a camisa veio bem embalada e a personalização nas costas com meu sobrenome ficou show.",
                stars: 5,
                verified: true,
              },
            ].map((r) => (
              <div
                key={r.name}
                className="rounded-3xl bg-white border border-border p-5 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`size-3.5 ${
                          i <= r.stars
                            ? "fill-brand-yellow text-brand-yellow"
                            : "text-foreground/20"
                        }`}
                      />
                    ))}
                  </div>
                  {r.verified && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green">
                      ✓ Compra verificada
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <div className="size-8 rounded-full bg-foreground text-white grid place-items-center text-xs font-black">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold">{r.name}</p>
                    <p className="text-[11px] text-foreground/60">{r.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 mt-16 sm:mt-20">
        <div className="mx-auto max-w-3xl flex flex-col gap-6">
          <div className="text-center flex flex-col gap-2">
            <p className="text-xs uppercase tracking-wider text-foreground/50 font-semibold">
              Dúvidas frequentes
            </p>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Tudo que você precisa saber.
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            {[
              {
                q: "Em quanto tempo recebo a camisa?",
                a: "Se for de Sabará/MG e o tamanho estiver em estoque, entregamos no mesmo dia. BH leva até 2 dias úteis. Outras regiões do Brasil em até 7 dias úteis. Se a camisa for sob encomenda, soma 5 dias úteis ao prazo.",
              },
              {
                q: "Como funciona a personalização?",
                a: "Você escolhe um nome de até 12 caracteres e um número de 1 a 99. Cobramos +R$ 2 por letra e +R$ 3 por número. A aplicação é vinílica de alta durabilidade, aplicada nas costas. Aguenta lavagem em máquina sem descolar.",
              },
              {
                q: "Posso trocar o tamanho?",
                a: "Sim, em até 7 dias após receber, desde que a camisa esteja sem uso, com etiqueta e na embalagem original. Camisas personalizadas só podem ser trocadas em caso de defeito.",
              },
              {
                q: "Quais formas de pagamento aceitam?",
                a: "Cartão de crédito (até 12x), PIX (5% off à vista) e boleto. Pagamento processado pela Stripe — totalmente seguro.",
              },
              {
                q: "As camisas têm garantia?",
                a: "30 dias contra defeitos de fabricação. Se descosturar, descolorir ou rasgar sem motivo no uso normal, trocamos sem custo.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group rounded-2xl bg-white border border-border p-4 open:border-foreground/30"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-sm sm:text-base">
                  {item.q}
                  <Plus className="size-5 group-open:hidden" />
                  <Minus className="size-5 hidden group-open:block" />
                </summary>
                <p className="mt-3 text-sm text-foreground/70 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="px-4 mt-16 sm:mt-20 mb-4">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-[2.5rem] bg-brand-yellow text-foreground p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 justify-between">
            <div className="max-w-md flex flex-col gap-1">
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                Cupom de 5% na primeira compra.
              </h3>
              <p className="text-foreground/70 text-sm">
                Cadastre seu email e receba o cupom + novidades das próximas
                coleções.
              </p>
            </div>
            <form className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:min-w-[420px]">
              <input
                type="email"
                placeholder="seu@email.com"
                className="h-12 flex-1 rounded-full bg-white border border-foreground/20 px-5 text-sm font-medium focus:outline-none focus:border-foreground"
                required
              />
              <button
                type="submit"
                className="h-12 px-6 rounded-full bg-foreground text-white font-bold text-sm hover:bg-foreground/90 transition whitespace-nowrap"
              >
                Receber cupom
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
