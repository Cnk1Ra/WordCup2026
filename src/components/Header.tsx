import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { fetchCategoryTree } from "@/lib/categories-queries";
import { CartBadge } from "./CartBadge";
import { HeaderMobileMenu } from "./HeaderMobileMenu";
import { HeaderNav } from "./HeaderNav";

export async function Header() {
  const tree = await fetchCategoryTree();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <HeaderMobileMenu
          tree={tree.map((p) => ({
            slug: p.slug,
            name: p.name,
            children: p.children.map((c) => ({ slug: c.slug, name: c.name })),
          }))}
        />
        <Link href="/" className="flex items-center" aria-label="SpaceFut">
          <Image
            src="/logo-spacefut.png"
            alt="SpaceFut"
            width={897}
            height={270}
            priority
            className="h-9 w-auto"
          />
        </Link>
        <HeaderNav tree={tree} />
        <div className="flex items-center gap-1">
          <Link
            href="/buscar"
            aria-label="Buscar"
            className="p-2 rounded-full hover:bg-muted"
          >
            <Search className="size-5" />
          </Link>
          <CartBadge />
        </div>
      </div>
    </header>
  );
}
