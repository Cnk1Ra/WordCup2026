"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";

// Limpa o carrinho assim que o usuário aterrissar em /sucesso. Componente
// invisível — só efeito colateral.
export default function ClearCartOnMount() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
