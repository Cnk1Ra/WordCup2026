import type { Metadata } from "next";
import Image from "next/image";
import { Geist } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpaceFut · Camisas Oficiais Copa 2026",
  description:
    "Camisas oficiais da Seleção Brasileira para a Copa 2026. Personalize com seu nome e número. Frete fixo R$ 5.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="mt-16 border-t border-border bg-white">
            <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-foreground/70 flex flex-col gap-3">
              <div className="flex items-center">
                <Image
                  src="/logo-spacefut.png"
                  alt="SpaceFut"
                  width={897}
                  height={270}
                  className="h-8 w-auto"
                />
              </div>
              <p>Camisas oficiais Copa 2026 · Frete fixo R$ 5,00 para todo o Brasil.</p>
              <div className="flex items-center justify-between gap-4 pt-2">
                <p className="text-xs text-foreground/50">
                  © {new Date().getFullYear()} SpaceFut. Todos os direitos reservados.
                </p>
                <a
                  href="/admin"
                  className="text-xs text-foreground/40 hover:text-foreground/70 underline-offset-2 hover:underline"
                >
                  Admin
                </a>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
