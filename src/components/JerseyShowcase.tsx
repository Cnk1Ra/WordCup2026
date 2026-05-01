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
      className={`${jerseyFont.variable} relative grid grid-cols-2 rounded-[2rem] overflow-hidden border border-border`}
      style={{ background: product.hex + "1f", aspectRatio: "5 / 4" }}
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
      <div className="relative overflow-hidden">
        <Image
          src={product.front}
          alt={`${product.name} — frente`}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          priority
          className="object-cover scale-[1.02]"
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
      <div className="relative overflow-hidden">
        <Image
          src={product.back}
          alt={`${product.name} — costas`}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover scale-[1.02]"
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
            fontSize: "clamp(18px, 4vw, 38px)",
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
            top: "18%",
            left: "42%",
            color: textColor,
            fontSize: "clamp(110px, 22vw, 240px)",
            lineHeight: 1,
            letterSpacing: "0.04em",
            fontWeight: 400,
            WebkitTextStroke: `2.5px ${accent}`,
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
        className="absolute -translate-x-1/2 text-center"
        style={{
          top: "40%",
          left: "34%",
          color: textColor,
          fontSize: "clamp(26px, 6vw, 56px)",
          lineHeight: 1,
          letterSpacing: "0.02em",
          fontWeight: 400,
          WebkitTextStroke: `1.5px ${accent}`,
          paintOrder: "stroke fill",
          textShadow:
            "0 1px 0 rgba(0,0,0,0.22), 0 2px 4px rgba(0,0,0,0.14)",
          filter: "contrast(1.1)",
        }}
      >
        {displayNumber}
      </div>
    </div>
  );
}
