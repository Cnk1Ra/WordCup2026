import Link from "next/link";
import Image from "next/image";
import { BASE_PRICE_BRL, formatBRL, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group flex flex-col gap-3"
    >
      <div
        className="relative aspect-square rounded-card overflow-hidden border border-border"
        style={{ background: product.hex + "1a" }}
      >
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 rounded-full bg-foreground text-white text-[11px] font-bold px-3 py-1">
            {product.badge}
          </span>
        )}
        <div className="absolute inset-0 grid place-items-center p-6">
          <Image
            src={product.front}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>
      <div className="px-1 flex flex-col gap-0.5">
        <p className="text-[11px] uppercase tracking-wider text-foreground/50 font-semibold">
          {product.team} · {product.gender}
        </p>
        <h3 className="text-sm font-semibold leading-tight line-clamp-2">
          {product.shortName}
        </h3>
        <p className="text-sm font-bold mt-1">{formatBRL(BASE_PRICE_BRL)}</p>
      </div>
    </Link>
  );
}
