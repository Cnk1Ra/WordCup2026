import type { MetadataRoute } from "next";
import { getSupabaseServer } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://word-cup2026.vercel.app";

  const supabase = getSupabaseServer();
  const [productsRes, categoriesRes] = await Promise.all([
    supabase
      .from("products")
      .select("slug, updated_at")
      .eq("is_active", true)
      .not("front_image", "is", null),
    supabase
      .from("categories")
      .select("slug, updated_at")
      .eq("is_active", true),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/sobre`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contato`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/trocas`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/termos`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/privacidade`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const productRoutes: MetadataRoute.Sitemap = (productsRes.data ?? []).map(
    (p) => ({
      url: `${baseUrl}/produto/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    })
  );

  const categoryRoutes: MetadataRoute.Sitemap = (categoriesRes.data ?? []).map(
    (c) => ({
      url: `${baseUrl}/colecao/${c.slug}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : undefined,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  );

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
