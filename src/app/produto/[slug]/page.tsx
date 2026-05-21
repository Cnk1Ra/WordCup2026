import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchProductBySlug } from "@/lib/products-queries";
import { BASE_PRICE_BRL } from "@/lib/products";
import { ProductDetail } from "./ProductDetail";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) return { title: "Produto · SpaceFut" };

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://word-cup2026.vercel.app";

  return {
    title: `${product.name} · SpaceFut`,
    description: `${product.shortName} — versão torcedor, personalize com nome e número. Frete fixo R$ 5.`,
    openGraph: {
      title: product.name,
      description: product.shortName,
      images: product.front ? [{ url: product.front, alt: product.name }] : [],
      type: "website",
      url: `${baseUrl}/produto/${product.slug}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://word-cup2026.vercel.app";
  const price = product.basePrice ?? BASE_PRICE_BRL;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortName,
    image: [product.front, product.back].filter(Boolean),
    sku: product.slug,
    brand: { "@type": "Brand", name: "SpaceFut" },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/produto/${product.slug}`,
      priceCurrency: "BRL",
      price: price.toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetail product={product} />
    </>
  );
}
