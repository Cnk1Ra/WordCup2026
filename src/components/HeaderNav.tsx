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

  // Top 4 categorias ficam visíveis. O resto vai pro "Outros" dropdown.
  const top = tree.slice(0, 4);
  const rest = tree.slice(4);

  function renderNode(parent: CategoryNode) {
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
  }

  return (
    <nav className="hidden md:flex items-center gap-5 text-sm font-medium relative">
      <Link
        href="/"
        className="hover:text-brand-green whitespace-nowrap"
        onMouseEnter={() => setOpenSlug(null)}
      >
        Todas
      </Link>
      {top.map(renderNode)}

      {rest.length > 0 && (
        <div
          className="relative"
          onMouseEnter={() => setOpenSlug("__outros__")}
          onMouseLeave={() => setOpenSlug(null)}
        >
          <button
            type="button"
            className={`inline-flex items-center gap-1 hover:text-brand-green whitespace-nowrap ${
              openSlug === "__outros__" ? "text-brand-green" : ""
            }`}
          >
            Outros
            <ChevronDown className="size-3.5" />
          </button>
          {openSlug === "__outros__" && (
            <div
              className="absolute right-0 top-full pt-3 z-50"
              onMouseEnter={() => setOpenSlug("__outros__")}
            >
              <div className="rounded-2xl bg-white border border-border shadow-xl p-3 min-w-[280px] flex flex-col gap-0.5">
                {rest.map((parent) => (
                  <div key={parent.id} className="mb-1.5 last:mb-0">
                    <Link
                      href={`/colecao/${parent.slug}`}
                      className="px-3 py-2 rounded-xl text-sm font-bold hover:bg-muted flex items-center justify-between"
                    >
                      <span>{parent.name}</span>
                      <span className="text-[11px] text-foreground/45 font-medium">
                        {parent.productCount}
                      </span>
                    </Link>
                    {parent.children.length > 0 && (
                      <div className="ml-3 pl-3 border-l border-border flex flex-col gap-0.5 mt-0.5">
                        {parent.children.map((child) => (
                          <Link
                            key={child.id}
                            href={`/colecao/${child.slug}`}
                            className="px-3 py-1.5 rounded-xl text-xs hover:bg-muted flex items-center justify-between text-foreground/75"
                          >
                            <span>{child.name}</span>
                            <span className="text-[10px] text-foreground/40">
                              {child.productCount}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
