"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  Users,
  Settings,
  Wallet,
  BarChart3,
  Menu,
  X,
  LogOut,
  ExternalLink,
  Tag,
  LayoutTemplate,
  Ticket,
} from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/browser";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Shirt },
  { href: "/admin/categorias", label: "Categorias", icon: Tag },
  { href: "/admin/cupons", label: "Cupons", icon: Ticket },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/clientes", label: "Clientes", icon: Users },
  { href: "/admin/financeiro", label: "Financeiro", icon: Wallet },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/home", label: "Editar home", icon: LayoutTemplate },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function AdminShell({
  children,
  admin,
}: {
  children: React.ReactNode;
  admin: { email: string; name: string | null; role: string };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    const supabase = getSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-white border-r border-border h-screen sticky top-0">
        <div className="p-5 border-b border-border">
          <Link href="/admin" className="block">
            <Image
              src="/logo-spacefut.png"
              alt="SpaceFut"
              width={897}
              height={270}
              className="h-7 w-auto"
            />
            <p className="text-[10px] uppercase tracking-wider text-foreground/50 font-bold mt-1">
              Painel admin
            </p>
          </Link>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  active
                    ? "bg-foreground text-white"
                    : "text-foreground/70 hover:bg-muted"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border flex flex-col gap-2">
          <div className="px-3 py-2">
            <p className="text-xs font-bold truncate">
              {admin.name || admin.email.split("@")[0]}
            </p>
            <p className="text-[11px] text-foreground/55 truncate">
              {admin.email}
            </p>
            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-brand-green">
              {admin.role}
            </span>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-foreground/70 hover:bg-muted transition"
          >
            <ExternalLink className="size-4" />
            Visualizar loja
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-foreground/70 hover:bg-muted transition"
          >
            <LogOut className="size-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-border flex items-center justify-between">
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="block"
              >
                <Image
                  src="/logo-spacefut.png"
                  alt="SpaceFut"
                  width={897}
                  height={270}
                  className="h-7 w-auto"
                />
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2">
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex-1 p-3 flex flex-col gap-1">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active =
                  pathname === href ||
                  (href !== "/admin" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                      active
                        ? "bg-foreground text-white"
                        : "text-foreground/70 hover:bg-muted"
                    }`}
                  >
                    <Icon className="size-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-border">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-foreground/70 hover:bg-muted transition"
              >
                <LogOut className="size-4" />
                Sair
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar mobile */}
        <header className="lg:hidden bg-white border-b border-border px-4 h-14 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="p-2 -ml-2">
            <Menu className="size-5" />
          </button>
          <Image
            src="/logo-spacefut.png"
            alt="SpaceFut"
            width={897}
            height={270}
            className="h-6 w-auto"
          />
          <div className="size-9" />
        </header>

        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
