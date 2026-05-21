import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://word-cup2026.vercel.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/carrinho", "/sucesso"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
