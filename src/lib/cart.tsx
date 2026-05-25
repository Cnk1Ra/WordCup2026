"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { BASE_PRICE_BRL, SHIPPING_BRL, personalizationFee } from "./products";

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

export type AppliedCoupon = {
  code: string;
  discount: number;
  message: string;
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
  discount: number;
  total: number;
  coupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<{ ok: boolean; error?: string }>;
  removeCoupon: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "spacefut-cart-v1";
const COUPON_KEY = "spacefut-coupon-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
      const cRaw = localStorage.getItem(COUPON_KEY);
      if (cRaw) setCoupon(JSON.parse(cRaw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (coupon) localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
      else localStorage.removeItem(COUPON_KEY);
    } catch {}
  }, [coupon, hydrated]);

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + i.unitPrice * i.qty, 0),
    [items]
  );

  // Re-valida o cupom toda vez que o subtotal muda (pode ficar inválido se
  // remover items e cair abaixo do mínimo).
  useEffect(() => {
    if (!coupon || !hydrated) return;
    fetch("/api/coupon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: coupon.code, subtotal }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (!r.valid) {
          setCoupon(null);
        } else if (r.discount !== coupon.discount) {
          setCoupon({ code: r.code, discount: r.discount, message: r.message });
        }
      })
      .catch(() => {});
  }, [subtotal, coupon, hydrated]);

  const value = useMemo<CartCtx>(() => {
    const shipping = items.length > 0 ? SHIPPING_BRL : 0;
    const discount = coupon?.discount ?? 0;
    const total = Math.max(0, subtotal - discount) + shipping;
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
      clear: () => {
        setItems([]);
        setCoupon(null);
      },
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal,
      shipping,
      discount,
      total,
      coupon,
      applyCoupon: async (code: string) => {
        try {
          const r = await fetch("/api/coupon", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code, subtotal }),
          }).then((res) => res.json());
          if (!r.valid) return { ok: false, error: r.error };
          setCoupon({
            code: r.code,
            discount: r.discount,
            message: r.message,
          });
          return { ok: true };
        } catch {
          return { ok: false, error: "Erro de rede." };
        }
      },
      removeCoupon: () => setCoupon(null),
    };
  }, [items, subtotal, coupon]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used inside CartProvider");
  return v;
}

export function priceFor(
  personalized: boolean,
  name = "",
  number = "",
  basePrice?: number
) {
  const base = basePrice ?? BASE_PRICE_BRL;
  return base + (personalized ? personalizationFee(name, number) : 0);
}
