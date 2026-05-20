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
        className="relative aspect-square rounded-card overflow-hidden border border-border transition-all duration-300 group-hover:border-foreground/40 group-hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)]"
        style={{ background: product.hex + "1a" }}
      >
        {product.badge && (
          <span className="absolute top-3 left-3 z-20 rounded-full bg-foreground text-white text-[11px] font-bold px-3 py-1">
            {product.badge}
          </span>
        )}

        <span
          className="absolute top-3 right-3 z-20 size-5 rounded-full border-2 border-white shadow-md"
          style={{ background: product.hex }}
          title={product.color}
          aria-label={`Cor: ${product.color}`}
        />

        <Image
          src={product.front}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain p-6 transition-opacity duration-500 group-hover:opacity-0"
        />

        <Image
          src={product.back}
          alt={`${product.name} - costas`}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-contain p-6 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        <span className="absolute bottom-3 right-3 z-20 rounded-full bg-white/90 backdrop-blur text-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Ver costas
        </span>
      </div>

      <div className="px-1 flex flex-col gap-0.5">
        <p className="text-[11px] uppercase tracking-wider text-foreground/50 font-semibold">
          {product.team} · {product.gender}
        </p>
        <h3 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-brand-green transition-colors">
          {product.shortName}
        </h3>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-sm font-bold">{formatBRL(BASE_PRICE_BRL)}</p>
          <p className="text-[11px] text-foreground/55">
            ou 4x de {formatBRL(BASE_PRICE_BRL / 4)}
          </p>
        </div>
      </div>
    </Link>
  );
}
