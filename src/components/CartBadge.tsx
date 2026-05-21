"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

export function CartBadge() {
  const { count } = useCart();
  return (
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
  );
}
