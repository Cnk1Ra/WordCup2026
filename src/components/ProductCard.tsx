import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import {
  BASE_PRICE_BRL,
  formatBRL,
  type Product,
} from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const price = product.basePrice ?? BASE_PRICE_BRL;
  const compare = product.comparePrice;
  const hasImage = !!product.front;

  return (
    <Link
      href={`/produto/${product.slug}`}
      className="group flex flex-col gap-3"
    >
      <div className="relative aspect-[3/4] rounded-card overflow-hidden border border-border bg-white transition-all duration-300 group-hover:border-foreground/40 group-hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)]">
        {product.badge && (
          <span className="absolute top-3 left-3 z-20 rounded-full bg-foreground text-white text-[11px] font-bold px-3 py-1">
            {product.badge}
          </span>
        )}

        {product.allowsPersonalization && (
          <span className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 rounded-full bg-brand-yellow text-foreground text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
            <Sparkles className="size-3" />
            Personalize
          </span>
        )}

        {hasImage ? (
          <Image
            src={product.front}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-foreground/30 text-xs uppercase tracking-wider">
            sem imagem
          </div>
        )}
      </div>

      <div className="px-1 flex flex-col gap-0.5">
        {(product.team || product.gender) && (
          <p className="text-[11px] uppercase tracking-wider text-foreground/50 font-semibold">
            {[product.team, product.gender].filter(Boolean).join(" · ")}
          </p>
        )}
        <h3 className="text-sm font-semibold leading-tight line-clamp-2 group-hover:text-brand-green transition-colors">
          {product.shortName}
        </h3>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-sm font-bold">{formatBRL(price)}</p>
          {compare && compare > price && (
            <p className="text-xs text-foreground/45 line-through">
              {formatBRL(compare)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
