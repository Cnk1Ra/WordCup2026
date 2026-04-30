"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatBRL } from "@/lib/products";

export default function CartPage() {
  const { items, setQty, remove, subtotal, shipping, total } = useCart();
  const [loading, setLoading] = useState(false);

  const checkout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Erro ao iniciar checkout. Verifique a chave Stripe.");
        setLoading(false);
      }
    } catch (e) {
      alert("Erro ao iniciar checkout.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center flex flex-col items-center gap-4">
        <div className="size-20 rounded-3xl bg-muted grid place-items-center">
          <ShoppingBag className="size-8 text-foreground/40" />
        </div>
        <h1 className="text-2xl font-black">Carrinho vazio</h1>
        <p className="text-foreground/60 text-sm">
          Adicione uma camisa pra começar.
        </p>
        <Link
          href="/"
          className="rounded-full bg-foreground text-white font-bold px-6 py-3 inline-flex items-center gap-2"
        >
          Ver camisas <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 grid lg:grid-cols-[1.5fr_1fr] gap-6 pb-32 sm:pb-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Seu carrinho
        </h1>
        <div className="flex flex-col gap-3">
          {items.map((it) => (
            <div
              key={it.id}
              className="rounded-3xl border border-border bg-white p-3 flex gap-3 items-center"
            >
              <div className="size-20 sm:size-24 rounded-2xl bg-muted grid place-items-center shrink-0 overflow-hidden">
                <Image
                  src={it.image}
                  alt={it.name}
                  width={120}
                  height={120}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-tight">{it.name}</p>
                <p className="text-xs text-foreground/60 mt-0.5">
                  Tam {it.size}
                  {it.personalization &&
                    ` · ${it.personalization.name} #${it.personalization.number}`}
                </p>
                <p className="font-black text-sm mt-1">
                  {formatBRL(it.unitPrice * it.qty)}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center rounded-full border border-border bg-muted">
                    <button
                      onClick={() => setQty(it.id, it.qty - 1)}
                      className="size-8 grid place-items-center"
                      aria-label="Diminuir"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold">
                      {it.qty}
                    </span>
                    <button
                      onClick={() => setQty(it.id, it.qty + 1)}
                      className="size-8 grid place-items-center"
                      aria-label="Aumentar"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => remove(it.id)}
                    className="text-xs text-foreground/60 hover:text-red-600 inline-flex items-center gap-1"
                  >
                    <Trash2 className="size-3.5" /> Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <aside className="lg:sticky lg:top-20 self-start flex flex-col gap-3">
        <div className="rounded-3xl border border-border bg-white p-5 flex flex-col gap-3">
          <h2 className="text-lg font-black">Resumo</h2>
          <div className="flex justify-between text-sm">
            <span className="text-foreground/70">Subtotal</span>
            <span className="font-bold">{formatBRL(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground/70">Frete</span>
            <span className="font-bold">{formatBRL(shipping)}</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between items-baseline">
            <span className="font-bold">Total</span>
            <span className="text-2xl font-black">{formatBRL(total)}</span>
          </div>
          <button
            onClick={checkout}
            disabled={loading}
            className="hidden sm:inline-flex h-14 rounded-full bg-foreground text-white font-bold items-center justify-center gap-2 hover:bg-foreground/90 transition disabled:opacity-50"
          >
            {loading ? "Redirecionando..." : "Finalizar com Stripe"}
            {!loading && <ArrowRight className="size-4" />}
          </button>
          <p className="hidden sm:block text-[11px] text-foreground/50 text-center">
            Pagamento seguro via Stripe
          </p>
        </div>
      </aside>

      {/* Sticky mobile checkout */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-border p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <p className="text-[11px] text-foreground/60 leading-none">Total</p>
            <p className="text-lg font-black leading-tight">{formatBRL(total)}</p>
          </div>
          <button
            onClick={checkout}
            disabled={loading}
            className="flex-[2] h-12 rounded-full bg-foreground text-white font-bold text-sm disabled:opacity-50"
          >
            {loading ? "..." : "Finalizar com Stripe"}
          </button>
        </div>
      </div>
    </div>
  );
}
