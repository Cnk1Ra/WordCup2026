import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NovoForm from "./NovoForm";

export const dynamic = "force-dynamic";

export default function NovoProdutoPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <header className="flex flex-col gap-2">
        <Link
          href="/admin/produtos"
          className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground self-start"
        >
          <ArrowLeft className="size-4" />
          Produtos
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Novo produto
          </h1>
          <p className="text-sm text-foreground/60">
            Crie um rascunho. Os detalhes (imagens, estoque, descrição) você completa depois.
          </p>
        </div>
      </header>

      <NovoForm />
    </div>
  );
}
