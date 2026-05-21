import type { Metadata } from "next";
import { STORE_INFO } from "@/lib/store-info";

export const metadata: Metadata = {
  title: "Trocas e Devoluções · SpaceFut",
};

export default function TrocasPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral">
      <h1 className="text-4xl font-black tracking-tight">
        Trocas e Devoluções
      </h1>
      <p className="text-foreground/55 text-sm">
        Atualizada em {new Date().toLocaleDateString("pt-BR")}
      </p>

      <p className="text-foreground/75 text-base mt-4">
        Resumo: você tem 7 dias após o recebimento pra trocar ou devolver,
        exceto camisas personalizadas (nome+número). Defeito de fabricação =
        substituímos sem custo.
      </p>

      <h2 className="text-xl font-bold mt-8">1. Direito de arrependimento (7 dias)</h2>
      <p>
        Conforme o Código de Defesa do Consumidor (art. 49), você pode desistir
        da compra em até <strong>7 dias corridos</strong> a partir do
        recebimento, sem precisar dar justificativa.
      </p>
      <p>Condições:</p>
      <ul>
        <li>Produto sem uso, com etiquetas e embalagem original;</li>
        <li>Sem rasgos, manchas ou alterações;</li>
        <li>
          <strong>Não se aplica a produtos personalizados</strong> (nome ou
          número), salvo defeito.
        </li>
      </ul>

      <h2 className="text-xl font-bold mt-8">2. Troca por tamanho</h2>
      <p>
        Se o tamanho não serviu, dá pra trocar em até 30 dias. Frete de retorno
        por sua conta; nós enviamos o novo sem custo (1 troca grátis por
        pedido).
      </p>

      <h2 className="text-xl font-bold mt-8">3. Defeito de fabricação</h2>
      <p>
        Se chegou com defeito ou diferente do anunciado, mande foto pra{" "}
        <a href={`mailto:${STORE_INFO.email_sac}`}>{STORE_INFO.email_sac}</a>{" "}
        ou WhatsApp {STORE_INFO.whatsapp_display} em até 30 dias.
        Substituímos sem custo de frete.
      </p>

      <h2 className="text-xl font-bold mt-8">4. Como solicitar</h2>
      <ol>
        <li>
          Envie email pra{" "}
          <a href={`mailto:${STORE_INFO.email_sac}`}>{STORE_INFO.email_sac}</a>{" "}
          com seu número de pedido (formato SF-XXXXXXXX-XXXX) e motivo.
        </li>
        <li>Recebemos seu pedido e enviamos código de postagem (Correios).</li>
        <li>Você posta o produto.</li>
        <li>
          Após receber e conferir (até 3 dias úteis), processamos a troca ou o
          estorno.
        </li>
      </ol>

      <h2 className="text-xl font-bold mt-8">5. Estorno</h2>
      <p>
        Cartão de crédito: estorno em até 2 faturas (regra da operadora). Pix:
        em até 5 dias úteis na conta de origem.
      </p>

      <h2 className="text-xl font-bold mt-8">6. Casos não aceitos</h2>
      <ul>
        <li>Produto fora do prazo de 7 dias (arrependimento) ou 30 (defeito);</li>
        <li>Produto personalizado, salvo defeito;</li>
        <li>Produto com sinais de uso;</li>
        <li>Acessórios ou embalagem em falta.</li>
      </ul>

      <p className="mt-8 text-sm text-foreground/65">
        Qualquer dúvida, fala com a gente: WhatsApp{" "}
        {STORE_INFO.whatsapp_display} ou{" "}
        <a href={`mailto:${STORE_INFO.email_sac}`}>{STORE_INFO.email_sac}</a>.
      </p>
    </article>
  );
}
