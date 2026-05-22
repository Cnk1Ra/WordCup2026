"use client";

import Image from "next/image";
import localFont from "next/font/local";
import type { Product } from "@/lib/products";

const jerseyFont = localFont({
  src: "../app/fonts/brazil-world-cup-2026.ttf",
  variable: "--font-jersey",
  display: "swap",
});

type Props = {
  product: Product;
  personalize: boolean;
  name: string;
  number: string;
};

export function JerseyShowcase({
  product,
  personalize,
  name,
  number,
}: Props) {
  return (
    <div
      className={`${jerseyFont.variable} relative grid grid-cols-2 rounded-[2rem] overflow-hidden border border-border bg-white`}
      style={{ aspectRatio: "5 / 4" }}
    >
      {product.badge && (
        <span className="absolute top-4 left-4 z-30 rounded-full bg-foreground text-white text-[11px] font-bold px-3 py-1">
          {product.badge}
        </span>
      )}
      <span className="absolute top-4 right-4 z-30 rounded-full text-[10px] font-bold px-3 py-1 bg-white/85 text-foreground/70">
        Frente · Costas
      </span>

      {/* Front */}
      <div
        className="relative overflow-hidden"
        style={{ containerType: "inline-size" }}
      >
        <Image
          src={product.front}
          alt={`${product.name} — frente`}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          priority
          className="object-cover"
        />
        {personalize && (
          <ChestNumberOverlay
            number={number}
            accent={product.accentHex}
            textColor={product.textColor}
          />
        )}
      </div>

      {/* Back */}
      <div
        className="relative overflow-hidden"
        style={{ containerType: "inline-size" }}
      >
        <Image
          src={product.back}
          alt={`${product.name} — costas`}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
        />
        {personalize && (
          <BackOverlay
            name={name}
            number={number}
            accent={product.accentHex}
            textColor={product.textColor}
          />
        )}
      </div>
    </div>
  );
}

function BackOverlay({
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
  const displayName = name.toUpperCase().trim();
  const displayNumber = number.trim();

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ fontFamily: "var(--font-jersey), sans-serif" }}
    >
      {displayName && (
        <div
          className="absolute -translate-x-1/2 text-center"
          style={{
            top: "12%",
            left: "42%",
            color: textColor,
            // 11cqw = 11% da largura do slot (container query). Funciona
            // proporcional tanto em mobile (slot ~170px → 18.7px) quanto
            // desktop (slot ~480px → 53px).
            fontSize: "11cqw",
            letterSpacing: "0.10em",
            fontWeight: 400,
            textShadow:
              "0 1px 0 rgba(0,0,0,0.22), 0 2px 6px rgba(0,0,0,0.16)",
            filter: "contrast(1.1)",
            whiteSpace: "nowrap",
          }}
        >
          {displayName}
        </div>
      )}
      {displayNumber && (
        <div
          className="absolute -translate-x-1/2 text-center"
          style={{
            top: "20%",
            left: "42%",
            color: textColor,
            fontSize: "55cqw",
            lineHeight: 1,
            letterSpacing: "0.04em",
            fontWeight: 400,
            WebkitTextStroke: `1.2cqw ${accent}`,
            paintOrder: "stroke fill",
            textShadow:
              "0 3px 0 rgba(0,0,0,0.28), 0 6px 12px rgba(0,0,0,0.18)",
            filter: "contrast(1.1)",
          }}
        >
          {displayNumber}
        </div>
      )}
    </div>
  );
}

function ChestNumberOverlay({
  number,
  accent,
  textColor,
}: {
  number: string;
  accent: string;
  textColor: string;
}) {
  const displayNumber = number.trim();
  if (!displayNumber) return null;
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ fontFamily: "var(--font-jersey), sans-serif" }}
    >
      <div
        className="absolute text-center"
        style={{
          top: "40%",
          left: "34%",
          color: textColor,
          // 16cqw proporcional ao slot — escala bem em mobile e desktop
          fontSize: "16cqw",
          lineHeight: 1,
          letterSpacing: "0.02em",
          fontWeight: 400,
          WebkitTextStroke: `0.7cqw ${accent}`,
          paintOrder: "stroke fill",
          textShadow:
            "0 1px 0 rgba(0,0,0,0.22), 0 2px 4px rgba(0,0,0,0.14)",
          filter: "contrast(1.1)",
          transform: "translateX(-50%) scaleY(1.35)",
          transformOrigin: "top center",
        }}
      >
        {displayNumber}
      </div>
    </div>
  );
}
