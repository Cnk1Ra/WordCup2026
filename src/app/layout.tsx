import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { PromoBanner } from "@/components/PromoBanner";
import { PublicChromeGate } from "@/components/PublicChromeGate";
import { STORE_INFO } from "@/lib/store-info";
import { fetchPromoBanner } from "@/lib/site-settings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpaceFut · Camisas Oficiais Copa 2026",
  description:
    "Camisas oficiais da Seleção Brasileira para a Copa 2026. Personalize com seu nome e número. Frete fixo R$ 5.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const promo = await fetchPromoBanner();
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CartProvider>
          <PublicChromeGate>
            {promo.enabled && (
              <PromoBanner
                message={promo.message}
                link={promo.link}
                version={promo.message}
              />
            )}
            <Header />
          </PublicChromeGate>
          <main className="flex-1">{children}</main>
          <PublicChromeGate>
          <footer className="mt-16 border-t border-border bg-white">
            <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-foreground/70 flex flex-col gap-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="col-span-2 sm:col-span-1 flex flex-col gap-3">
                  <Image
                    src="/logo-spacefut.png"
                    alt="SpaceFut"
                    width={897}
                    height={270}
                    className="h-10 w-auto self-start"
                  />
                  <p className="text-xs text-foreground/55 max-w-[20rem]">
                    Camisas oficiais Copa 2026 · Frete fixo R$ 5,00 pra todo o
                    Brasil.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground/55">
                    Loja
                  </p>
                  <Link href="/" className="text-sm hover:text-foreground">
                    Camisas
                  </Link>
                  <Link href="/sobre" className="text-sm hover:text-foreground">
                    Sobre
                  </Link>
                  <Link href="/faq" className="text-sm hover:text-foreground">
                    Perguntas frequentes
                  </Link>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground/55">
                    Ajuda
                  </p>
                  <Link href="/contato" className="text-sm hover:text-foreground">
                    Contato
                  </Link>
                  <Link href="/trocas" className="text-sm hover:text-foreground">
                    Trocas e devoluções
                  </Link>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground/55">
                    Legal
                  </p>
                  <Link
                    href="/privacidade"
                    className="text-sm hover:text-foreground"
                  >
                    Privacidade
                  </Link>
                  <Link href="/termos" className="text-sm hover:text-foreground">
                    Termos de uso
                  </Link>
                </div>
              </div>

              <div className="border-t border-border pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-foreground/50">
                <p>
                  © {new Date().getFullYear()} {STORE_INFO.brand_name} ·{" "}
                  {STORE_INFO.legal_name} · CNPJ {STORE_INFO.cnpj}
                </p>
                <Link
                  href="/admin"
                  className="text-foreground/40 hover:text-foreground/70 underline-offset-2 hover:underline self-start sm:self-auto"
                >
                  Admin
                </Link>
              </div>
            </div>
          </footer>
          </PublicChromeGate>
        </CartProvider>
      </body>
    </html>
  );
}
