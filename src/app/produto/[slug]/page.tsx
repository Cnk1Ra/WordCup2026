import { notFound } from "next/navigation";
import { fetchProductBySlug } from "@/lib/products-queries";
import { ProductDetail } from "./ProductDetail";

export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
