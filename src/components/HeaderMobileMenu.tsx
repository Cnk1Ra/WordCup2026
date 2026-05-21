"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function HeaderMobileMenu({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 -ml-2 rounded-full hover:bg-muted"
        aria-label="Menu"
      >
        <Menu className="size-5" />
      </button>

      {open && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpen(false)}
        >
          <aside
            className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <p className="font-black tracking-tight">Categorias</p>
              <button
                onClick={() => setOpen(false)}
                className="p-2 -mr-2 rounded-full hover:bg-muted"
                aria-label="Fechar"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="p-3 flex flex-col gap-1 overflow-y-auto">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-xl font-bold text-sm hover:bg-muted"
              >
                Todas as camisas
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/colecao/${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted"
                >
                  {c.name}
                </Link>
              ))}
              {categories.length === 0 && (
                <p className="px-3 py-2 text-xs text-foreground/55">
                  Nenhuma categoria criada.
                </p>
              )}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
