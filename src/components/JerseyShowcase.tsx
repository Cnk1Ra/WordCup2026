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
            top: "16%",
            left: "42%",
            color: textColor,
            fontSize: "14cqw",
            letterSpacing: "0.08em",
            fontWeight: 400,
            // Sem text-shadow pesada — fica carregado em mobile. Stroke fino
            // do accent já dá contorno suficiente.
            WebkitTextStroke: `0.3cqw ${accent}`,
            paintOrder: "stroke fill",
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          {displayName}
        </div>
      )}
      {displayNumber && (
        <div
          className="absolute -translate-x-1/2 text-center"
          style={{
            top: "28%",
            left: "42%",
            color: textColor,
            fontSize: "70cqw",
            lineHeight: 0.9,
            letterSpacing: "0.02em",
            fontWeight: 400,
            WebkitTextStroke: `1.5cqw ${accent}`,
            paintOrder: "stroke fill",
            // Sombra removida — número de camisa real não tem drop shadow,
            // e em mobile a sombra ficava muito pesada/escura.
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
          top: "42%",
          left: "34%",
          color: textColor,
          fontSize: "22cqw",
          lineHeight: 0.9,
          letterSpacing: "0.02em",
          fontWeight: 400,
          WebkitTextStroke: `0.6cqw ${accent}`,
          paintOrder: "stroke fill",
          transform: "translateX(-50%) scaleY(1.25)",
          transformOrigin: "top center",
        }}
      >
        {displayNumber}
      </div>
    </div>
  );
}
