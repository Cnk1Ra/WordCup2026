"use client";

import Image from "next/image";
import { Bebas_Neue } from "next/font/google";
import type { Product } from "@/lib/products";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
});

type Props = {
  product: Product;
  flipped: boolean;
  personalize: boolean;
  name: string;
  number: string;
};

export function JerseyShowcase({
  product,
  flipped,
  personalize,
  name,
  number,
}: Props) {
  return (
    <div
      className={`${bebas.variable} relative aspect-square rounded-[2rem] overflow-hidden border border-border`}
      style={{ background: product.hex + "1f", perspective: "2000px" }}
    >
      {product.badge && (
        <span className="absolute top-4 left-4 z-30 rounded-full bg-foreground text-white text-[11px] font-bold px-3 py-1">
          {product.badge}
        </span>
      )}
      <span
        className="absolute top-4 right-4 z-30 rounded-full text-[10px] font-bold px-3 py-1 transition-opacity"
        style={{
          background: "rgba(255,255,255,0.85)",
          color: product.hex,
          opacity: flipped ? 1 : 0,
        }}
      >
        Costas
      </span>

      <div
        className="absolute inset-0 transition-transform duration-[1100ms]"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateY(${flipped ? 180 : 0}deg) scale(${
            flipped ? 1.04 : 1
          })`,
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 grid place-items-center p-6"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Image
            src={product.front}
            alt={`${product.name} — frente`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className="object-contain p-6"
          />
        </div>

        {/* Back */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="absolute inset-0 grid place-items-center p-6">
            <Image
              src={product.back}
              alt={`${product.name} — costas`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-6"
            />
          </div>
          {personalize && (
            <PersonalizationOverlay
              name={name}
              number={number}
              accent={product.accentHex}
              textColor={product.textColor}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function PersonalizationOverlay({
  name,
  number,
  accent,
  textColor,
}: {
  name: string;
  number: string;
  accent: string;
  textColor: string;
}) {
  const displayName = (name || "").toUpperCase().trim();
  const displayNumber = (number || "").trim();

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        fontFamily: "var(--font-bebas), sans-serif",
        mixBlendMode: "multiply",
      }}
    >
      {displayName && (
        <div
          className="absolute left-1/2 -translate-x-1/2 text-center transition-opacity duration-200"
          style={{
            top: "27%",
            color: textColor,
            fontSize: "clamp(18px, 4.6vw, 38px)",
            letterSpacing: "0.16em",
            fontWeight: 400,
            textShadow:
              "0 1px 0 rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.12)",
            filter: "contrast(1.1)",
            opacity: 0.92,
          }}
        >
          {displayName}
        </div>
      )}
      {displayNumber && (
        <div
          className="absolute left-1/2 -translate-x-1/2 text-center"
          style={{
            top: "38%",
            color: textColor,
            fontSize: "clamp(80px, 18vw, 180px)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            fontWeight: 400,
            textShadow:
              "0 2px 0 rgba(0,0,0,0.22), 0 4px 8px rgba(0,0,0,0.16)",
            filter: "contrast(1.1)",
            opacity: 0.92,
          }}
        >
          {displayNumber}
        </div>
      )}
    </div>
  );
}
