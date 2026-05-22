"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Check,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import {
  BASE_PRICE_BRL,
  PERSONALIZATION_PER_LETTER_BRL,
  PERSONALIZATION_PER_NUMBER_BRL,
  personalizationFee,
  SIZES,
  formatBRL,
  type Product,
  type Size,
} from "@/lib/products";
import { useCart, priceFor } from "@/lib/cart";
import { useRouter } from "next/navigation";
import { JerseyShowcase } from "@/components/JerseyShowcase";

const NAME_MAX = 12;

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { add } = useCart();
  const [size, setSize] = useState<Size | null>(null);
  const [personalize, setPersonalize] = useState(false);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [adding, setAdding] = useState(false);

  const validNumber = (n: string) => {
    const v = parseInt(n, 10);
    return !isNaN(v) && v >= 1 && v <= 99;
  };
  const persoValid =
    !personalize ||
    (name.trim().length >= 1 &&
      name.trim().length <= NAME_MAX &&
      validNumber(number));
  const canAdd = !!size && persoValid;
  const persoFee = personalizationFee(name, number);
  const unitPrice = priceFor(personalize, name, number);

  const handleAdd = (goToCart: boolean) => {
    if (!canAdd || !size) return;
    setAdding(true);
    add({
      slug: product.slug,
      name: product.shortName,
      size,
      image: product.front,
      qty: 1,
      unitPrice,
      personalization: personalize
        ? { name: name.trim().toUpperCase(), number: number.toString() }
        : undefined,
    });
    setTimeout(() => {
      setAdding(false);
      if (goToCart) router.push("/carrinho");
    }, 300);
  };

  return (
    <div className="pb-32 sm:pb-8">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-4 pt-4 text-xs text-foreground/60 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="size-3" />
        <Link href="/" className="hover:text-foreground">
          Camisas
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-foreground/80">{product.shortName}</span>
      </div>

      <div className="mx-auto max-w-6xl px-4 mt-4 grid lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-12">
        {/* Showcase */}
        <div className="flex flex-col gap-3">
          {product.allowsPersonalization ? (
            <JerseyShowcase
              product={product}
              personalize={personalize}
              name={name}
              number={number}
            />
          ) : (
            <div className="relative rounded-[2rem] overflow-hidden border border-border bg-white aspect-[3/4]">
              {product.front && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.front}
                  alt={product.name}
                  className="absolute inset-0 size-full object-contain p-4"
                />
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-foreground/50 font-bold">
              {product.team} · Edição {product.edition}
            </p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1 leading-tight">
              {product.name}
            </h1>
            <p className="text-sm text-foreground/60 mt-1">
              {product.color} · Versão Torcedor
            </p>
          </div>

          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-black">{formatBRL(unitPrice)}</p>
            {personalize && (
              <p className="text-sm text-foreground/60 line-through">
                {formatBRL(BASE_PRICE_BRL)}
              </p>
            )}
          </div>

          {/* Size selector */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">Tamanho</p>
              <button className="text-xs text-foreground/60 underline">
                Tabela de medidas
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`h-12 rounded-2xl border text-sm font-bold transition ${
                    size === s
                      ? "border-foreground bg-foreground text-white"
                      : "border-border bg-white hover:border-foreground/40"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Personalization */}
          {product.allowsPersonalization && (
          <div className="rounded-3xl border border-border bg-white p-4 flex flex-col gap-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={personalize}
                onChange={(e) => setPersonalize(e.target.checked)}
              />
              <span
                className={`mt-0.5 size-5 rounded-md border-2 grid place-items-center transition ${
                  personalize
                    ? "bg-brand-green border-brand-green"
                    : "border-foreground/30"
                }`}
              >
                {personalize && <Check className="size-3 text-white" />}
              </span>
              <span className="flex-1">
                <span className="flex items-center gap-1.5 font-bold text-sm">
                  <Sparkles className="size-4 text-brand-green" />
                  Personalizar com nome e número
                </span>
                <span className="text-xs text-foreground/60 block mt-0.5">
                  +{formatBRL(PERSONALIZATION_PER_LETTER_BRL)} por letra · +
                  {formatBRL(PERSONALIZATION_PER_NUMBER_BRL)} por número
                  {personalize && persoFee > 0 && (
                    <span className="text-foreground font-bold">
                      {" "}
                      · Acréscimo: {formatBRL(persoFee)}
                    </span>
                  )}
                </span>
              </span>
            </label>

            {personalize && (
              <div className="grid grid-cols-[1fr_100px] gap-2 pt-2 border-t border-border">
                <div>
                  <label className="text-xs font-semibold text-foreground/70 mb-1 block">
                    Nome (até {NAME_MAX} caracteres)
                  </label>
                  <input
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                          .replace(/[^a-zA-ZÀ-ſ ]/g, "")
                          .slice(0, NAME_MAX)
                      )
                    }
                    placeholder="SEU NOME"
                    className="w-full h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-semibold uppercase tracking-wider focus:outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground/70 mb-1 block">
                    Número
                  </label>
                  <input
                    value={number}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 2);
                      setNumber(digits);
                    }}
                    placeholder="10"
                    className="w-full h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-bold text-center focus:outline-none focus:border-foreground"
                  />
                </div>
              </div>
            )}
          </div>
          )}

          {/* Desktop CTA */}
          <div className="hidden sm:flex flex-col gap-2">
            <button
              onClick={() => handleAdd(false)}
              disabled={!canAdd || adding}
              className="h-14 rounded-full bg-foreground text-white font-bold text-base hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              <ShoppingBag className="size-5" />
              {adding ? "Adicionando..." : "Adicionar ao carrinho"}
            </button>
            <button
              onClick={() => handleAdd(true)}
              disabled={!canAdd || adding}
              className="h-14 rounded-full bg-brand-yellow text-foreground font-bold text-base hover:bg-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Comprar agora
            </button>
            {!size && (
              <p className="text-xs text-foreground/60 text-center">
                Selecione um tamanho
              </p>
            )}
          </div>

          {/* Frete */}
          <div className="rounded-3xl border border-border bg-white p-4 flex items-center gap-3">
            <Truck className="size-5 text-brand-green shrink-0" />
            <div className="text-sm">
              <p className="font-bold">Frete fixo R$ 5,00</p>
              <p className="text-foreground/60 text-xs">
                Entrega para todo o Brasil
              </p>
            </div>
          </div>

          {/* Sobre */}
          <div className="rounded-3xl border border-border bg-white p-4 text-sm text-foreground/80 leading-relaxed">
            <p className="font-bold mb-2 text-foreground">Sobre a camisa</p>
            <p>
              Camisa torcedor SpaceFut nas cores oficiais do Brasil para a Copa
              2026. Tecido respirável de alta performance, gola V em ribana,
              punhos elásticos e cuts atléticos. Personalize com seu nome e
              número.
            </p>
            <ul className="mt-3 space-y-1 text-xs">
              <li>• Versão torcedor</li>
              <li>• Tamanhos {SIZES.join(" / ")}</li>
              <li>• Lavar em máquina, água fria</li>
              <li>• Personalização vinílica de alta durabilidade</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-border p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <p className="text-[11px] text-foreground/60 leading-none">Total</p>
            <p className="text-lg font-black leading-tight">
              {formatBRL(unitPrice)}
            </p>
          </div>
          <button
            onClick={() => handleAdd(true)}
            disabled={!canAdd || adding}
            className="flex-[2] h-12 rounded-full bg-foreground text-white font-bold text-sm disabled:opacity-40 transition flex items-center justify-center gap-2"
          >
            <ShoppingBag className="size-4" />
            {!size
              ? "Selecione o tamanho"
              : adding
                ? "Adicionando..."
                : "Comprar agora"}
          </button>
        </div>
      </div>
    </div>
  );
}
