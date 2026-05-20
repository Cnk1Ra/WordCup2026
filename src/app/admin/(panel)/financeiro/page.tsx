import { Wallet } from "lucide-react";

export default function FinanceiroPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <header>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Financeiro
        </h1>
        <p className="text-sm text-foreground/60">
          Controle de caixa, gastos com tráfego e reembolso de sócios.
        </p>
      </header>
      <div className="rounded-3xl bg-white border border-border p-12 text-center flex flex-col items-center gap-3">
        <Wallet className="size-10 text-foreground/30" />
        <h2 className="font-bold">Em construção</h2>
        <p className="text-sm text-foreground/60 max-w-md">
          Próxima fase: registrar gastos por categoria (ads, design, embalagem),
          marcar quem pagou (empresa ou sócio), reembolsos pendentes e ROAS
          (faturamento ÷ investimento em ads).
        </p>
      </div>
    </div>
  );
}
