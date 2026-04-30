import type { Metadata } from "next";
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
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-xl bg-foreground text-white grid place-items-center font-black text-xs">
                  SF
                </div>
                <span className="font-bold text-foreground">SpaceFut</span>
              </div>
              <p>Camisas oficiais Copa 2026 · Frete fixo R$ 5,00 para todo o Brasil.</p>
              <p className="text-xs text-foreground/50">
                © {new Date().getFullYear()} SpaceFut. Todos os direitos reservados.
              </p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
