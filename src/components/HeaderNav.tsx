"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

type CategoryNode = {
  id: string;
  slug: string;
  name: string;
  productCount: number;
  children: CategoryNode[];
};

export function HeaderNav({ tree }: { tree: CategoryNode[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <nav className="hidden md:flex items-center gap-5 text-sm font-medium relative">
      <Link
        href="/"
        className="hover:text-brand-green whitespace-nowrap"
        onMouseEnter={() => setOpenSlug(null)}
      >
        Todas
      </Link>
      {tree.map((parent) => {
        const hasChildren = parent.children.length > 0;
        if (!hasChildren) {
          return (
            <Link
              key={parent.id}
              href={`/colecao/${parent.slug}`}
              onMouseEnter={() => setOpenSlug(null)}
              className="hover:text-brand-green whitespace-nowrap"
            >
              {parent.name}
            </Link>
          );
        }
        const isOpen = openSlug === parent.slug;
        return (
          <div
            key={parent.id}
            className="relative"
            onMouseEnter={() => setOpenSlug(parent.slug)}
            onMouseLeave={() => setOpenSlug(null)}
          >
            <Link
              href={`/colecao/${parent.slug}`}
              className={`inline-flex items-center gap-1 hover:text-brand-green whitespace-nowrap ${
                isOpen ? "text-brand-green" : ""
              }`}
            >
              {parent.name}
              <ChevronDown className="size-3.5" />
            </Link>
            {isOpen && (
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50"
                onMouseEnter={() => setOpenSlug(parent.slug)}
              >
                <div className="rounded-2xl bg-white border border-border shadow-xl p-3 min-w-[240px] flex flex-col gap-0.5">
                  <Link
                    href={`/colecao/${parent.slug}`}
                    className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-foreground/55 hover:text-foreground"
                  >
                    Ver tudo em {parent.name}
                  </Link>
                  <div className="h-px bg-border my-1" />
                  {parent.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/colecao/${child.slug}`}
                      className="px-3 py-2 rounded-xl text-sm hover:bg-muted flex items-center justify-between"
                    >
                      <span>{child.name}</span>
                      <span className="text-[11px] text-foreground/45">
                        {child.productCount}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
