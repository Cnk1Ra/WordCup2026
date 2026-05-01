"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu } from "lucide-react";
import { useCart } from "@/lib/cart";

export function Header() {
  const { count } = useCart();
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <button
          className="md:hidden p-2 -ml-2 rounded-full hover:bg-muted"
          aria-label="Menu"
        >
          <Menu className="size-5" />
        </button>
        <Link href="/" className="flex items-center" aria-label="SpaceFut">
          <Image
            src="/logo-spacefut.png"
            alt="SpaceFut"
            width={897}
            height={270}
            priority
            className="h-9 w-auto"
          />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-brand-green">
            Camisas
          </Link>
          <Link href="/?gender=Masculina" className="hover:text-brand-green">
            Masculina
          </Link>
          <Link href="/?gender=Feminina" className="hover:text-brand-green">
            Feminina
          </Link>
        </nav>
        <Link
          href="/carrinho"
          aria-label="Carrinho"
          className="relative p-2 -mr-2 rounded-full hover:bg-muted"
        >
          <ShoppingBag className="size-5" />
          {count > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-brand-green text-white text-[11px] font-bold grid place-items-center">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
