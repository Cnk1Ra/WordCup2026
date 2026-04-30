"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { BASE_PRICE_BRL, PERSONALIZATION_BRL, SHIPPING_BRL } from "./products";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  size: string;
  image: string;
  qty: number;
  unitPrice: number;
  personalization?: { name: string; number: string };
};

type CartCtx = {
  items: CartItem[];
  add: (item: Omit<CartItem, "id">) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "spacefut-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const value = useMemo<CartCtx>(() => {
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const shipping = items.length > 0 ? SHIPPING_BRL : 0;
    return {
      items,
      add: (item) =>
        setItems((prev) => {
          const id =
            item.slug +
            "-" +
            item.size +
            "-" +
            (item.personalization
              ? `${item.personalization.name}|${item.personalization.number}`
              : "plain");
          const existing = prev.find((p) => p.id === id);
          if (existing) {
            return prev.map((p) =>
              p.id === id ? { ...p, qty: p.qty + item.qty } : p
            );
          }
          return [...prev, { ...item, id }];
        }),
      remove: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
      setQty: (id, qty) =>
        setItems((prev) =>
          prev
            .map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p))
            .filter((p) => p.qty > 0)
        ),
      clear: () => setItems([]),
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used inside CartProvider");
  return v;
}

export function priceFor(personalized: boolean) {
  return BASE_PRICE_BRL + (personalized ? PERSONALIZATION_BRL : 0);
}
