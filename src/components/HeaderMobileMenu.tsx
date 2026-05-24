"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";

type NavNode = {
  slug: string;
  name: string;
  children?: { slug: string; name: string }[];
};

export function HeaderMobileMenu({ tree }: { tree: NavNode[] }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Lock body scroll quando o menu tá aberto. Sem isso, no iOS dá pra rolar
  // a página por trás do overlay com o gesto de touch — sensação de "bugado".
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Fecha com ESC (acessibilidade)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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
            className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white flex flex-col"
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
              {tree.map((parent) => {
                const hasChildren = parent.children && parent.children.length > 0;
                const isExpanded = expanded === parent.slug;
                if (!hasChildren) {
                  return (
                    <Link
                      key={parent.slug}
                      href={`/colecao/${parent.slug}`}
                      onClick={() => setOpen(false)}
                      className="px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted"
                    >
                      {parent.name}
                    </Link>
                  );
                }
                return (
                  <div key={parent.slug}>
                    <button
                      onClick={() => setExpanded(isExpanded ? null : parent.slug)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-muted flex items-center justify-between"
                    >
                      <span>{parent.name}</span>
                      {isExpanded ? (
                        <ChevronDown className="size-4" />
                      ) : (
                        <ChevronRight className="size-4" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="ml-3 pl-3 border-l border-border flex flex-col gap-0.5 my-1">
                        <Link
                          href={`/colecao/${parent.slug}`}
                          onClick={() => setOpen(false)}
                          className="px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-foreground/55 hover:bg-muted"
                        >
                          Ver tudo em {parent.name}
                        </Link>
                        {parent.children!.map((child) => (
                          <Link
                            key={child.slug}
                            href={`/colecao/${child.slug}`}
                            onClick={() => setOpen(false)}
                            className="px-3 py-2 rounded-xl text-sm hover:bg-muted"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {tree.length === 0 && (
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
