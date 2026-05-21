import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { fetchActiveCategoriesWithCount } from "@/lib/categories-queries";
import { CartBadge } from "./CartBadge";
import { HeaderMobileMenu } from "./HeaderMobileMenu";

export async function Header() {
  const categories = await fetchActiveCategoriesWithCount();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <HeaderMobileMenu categories={categories.map(c => ({ slug: c.slug, name: c.name }))} />
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
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium overflow-x-auto scrollbar-none max-w-[60vw]">
          <Link href="/" className="hover:text-brand-green whitespace-nowrap">
            Todas
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/colecao/${c.slug}`}
              className="hover:text-brand-green whitespace-nowrap"
            >
              {c.name}
            </Link>
          ))}
        </nav>
        <CartBadge />
      </div>
    </header>
  );
}
