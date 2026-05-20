import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <header>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Analytics
        </h1>
        <p className="text-sm text-foreground/60">
          Tráfego, leads, funil de conversão e atribuição de campanhas.
        </p>
      </header>
      <div className="rounded-3xl bg-white border border-border p-12 text-center flex flex-col items-center gap-3">
        <BarChart3 className="size-10 text-foreground/30" />
        <h2 className="font-bold">Em construção</h2>
        <p className="text-sm text-foreground/60 max-w-md">
          Próxima fase: tabelas <code>sessions</code> e <code>events</code>{" "}
          captando page views, add-to-cart, checkout, purchase. UTM tracking,
          Meta Pixel e GA4 conectados.
        </p>
      </div>
    </div>
  );
}
