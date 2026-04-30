"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Check, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart";

export default function SuccessPage() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center flex flex-col items-center gap-4">
      <div className="size-20 rounded-3xl bg-brand-green text-white grid place-items-center">
        <Check className="size-10" strokeWidth={3} />
      </div>
      <h1 className="text-3xl font-black">Pedido confirmado!</h1>
      <p className="text-foreground/70 text-sm max-w-md">
        Recebemos seu pagamento. Em breve você receberá um e-mail com os detalhes
        e o código de rastreio assim que a camisa for despachada.
      </p>
      <Link
        href="/"
        className="rounded-full bg-foreground text-white font-bold px-6 py-3 inline-flex items-center gap-2 mt-2"
      >
        Continuar comprando <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
