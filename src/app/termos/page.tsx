import type { Metadata } from "next";
import { STORE_INFO } from "@/lib/store-info";

export const metadata: Metadata = {
  title: "Termos de Uso · SpaceFut",
};

export default function TermosPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral">
      <h1 className="text-4xl font-black tracking-tight">Termos de Uso</h1>
      <p className="text-foreground/55 text-sm">
        Atualizado em {new Date().toLocaleDateString("pt-BR")}
      </p>

      <h2 className="text-xl font-bold mt-8">1. Aceitação</h2>
      <p>
        Ao usar a loja {STORE_INFO.brand_name} (operada por{" "}
        {STORE_INFO.legal_name}, CNPJ {STORE_INFO.cnpj}), você concorda com
        estes Termos. Se não concordar, não use o site nem faça pedidos.
      </p>

      <h2 className="text-xl font-bold mt-8">2. Cadastro e dados</h2>
      <p>
        Pra finalizar a compra, você precisa fornecer dados verdadeiros e
        completos. Você é responsável pela exatidão. Dados incorretos podem
        atrasar ou impossibilitar a entrega.
      </p>

      <h2 className="text-xl font-bold mt-8">3. Pedidos e pagamento</h2>
      <ul>
        <li>
          O pedido só é confirmado após aprovação do pagamento pelo Stripe.
        </li>
        <li>
          Reservamos o direito de cancelar pedidos com suspeita de fraude ou
          erro de preço.
        </li>
        <li>
          Preços e estoque podem mudar a qualquer momento, mas não afetam
          pedidos já confirmados.
        </li>
      </ul>

      <h2 className="text-xl font-bold mt-8">4. Personalização</h2>
      <p>
        Produtos com nome ou número personalizados são feitos sob encomenda. Por
        isso, <strong>não têm direito de troca ou devolução por arrependimento</strong>,
        salvo defeito de fabricação ou erro nosso (CDC, art. 49, parágrafo
        único).
      </p>

      <h2 className="text-xl font-bold mt-8">5. Prazo de entrega</h2>
      <p>
        Os prazos são contados em dias úteis a partir da confirmação do
        pagamento, conforme informado no checkout. Atrasos da transportadora
        estão fora do nosso controle, mas damos suporte pra rastrear e resolver.
      </p>

      <h2 className="text-xl font-bold mt-8">6. Direito de arrependimento</h2>
      <p>
        Conforme o Código de Defesa do Consumidor (art. 49), você pode desistir
        da compra em até <strong>7 dias corridos</strong> a partir do
        recebimento, exceto produtos personalizados. Veja detalhes na nossa{" "}
        <a href="/trocas">Política de Trocas e Devoluções</a>.
      </p>

      <h2 className="text-xl font-bold mt-8">7. Propriedade intelectual</h2>
      <p>
        Todo o conteúdo do site (textos, imagens, logo, design) é propriedade
        da {STORE_INFO.brand_name} ou usado sob licença. É proibido copiar,
        reproduzir ou usar sem autorização escrita.
      </p>

      <h2 className="text-xl font-bold mt-8">8. Limitação de responsabilidade</h2>
      <p>
        Nossa responsabilidade é limitada ao valor pago pelo pedido. Não
        respondemos por danos indiretos, perda de oportunidade ou lucros
        cessantes.
      </p>

      <h2 className="text-xl font-bold mt-8">9. Foro</h2>
      <p>
        Fica eleito o foro da comarca de Belo Horizonte/MG pra qualquer disputa,
        salvo direito do consumidor de optar pelo seu domicílio.
      </p>

      <h2 className="text-xl font-bold mt-8">10. Contato</h2>
      <p>
        Dúvidas: <a href={`mailto:${STORE_INFO.email_sac}`}>{STORE_INFO.email_sac}</a>{" "}
        ou WhatsApp {STORE_INFO.whatsapp_display}.
      </p>
    </article>
  );
}
