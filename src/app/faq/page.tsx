import type { Metadata } from "next";
import { STORE_INFO } from "@/lib/store-info";

export const metadata: Metadata = {
  title: "Perguntas Frequentes · SpaceFut",
};

const FAQS = [
  {
    q: "Como funciona a personalização?",
    a: "No carrinho, você marca a opção 'Personalizar' e adiciona nome (até 12 caracteres) e número (1 a 99). O custo é de R$ 49,90 por camisa. Personalização é feita sob encomenda — não tem direito de arrependimento, mas defeito a gente troca sem custo.",
  },
  {
    q: "Qual o prazo de entrega?",
    a: "Sabará/BH: 1-2 dias úteis após pagamento aprovado (camisa pronta) ou 5-6 dias se personalizada. Demais regiões: 7-12 dias. Você acompanha pelo email + página de pedido.",
  },
  {
    q: "Quanto custa o frete?",
    a: "R$ 5,00 fixo pra todo o Brasil.",
  },
  {
    q: "Quais formas de pagamento?",
    a: "Cartão de crédito (parcelado em até 12x), Pix e boleto, todos via Stripe.",
  },
  {
    q: "Posso trocar de tamanho?",
    a: "Sim, em até 30 dias do recebimento. Frete de retorno por sua conta; nós enviamos o novo sem custo (1 troca grátis por pedido). Mais detalhes na página de Trocas e Devoluções.",
  },
  {
    q: "Não recebi o pedido. O que faço?",
    a: `Verifica o código de rastreio na sua área de pedido. Se passou do prazo, fala com a gente via WhatsApp ${STORE_INFO.whatsapp_display} — investigamos com a transportadora.`,
  },
  {
    q: "É camisa oficial?",
    a: "Trabalhamos com versão torcedor (autorizada) com tecido dry-fit, escudo bordado e numeração de alta qualidade. Não é a versão de jogador, mas tem o mesmo acabamento estético.",
  },
  {
    q: "Posso comprar no atacado?",
    a: `Sim — pra pedidos acima de 10 unidades temos condição especial. Fala com a gente: ${STORE_INFO.email_sac}.`,
  },
];

export default function FAQPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-black tracking-tight">
        Perguntas Frequentes
      </h1>
      <p className="text-foreground/70 mt-2">
        Não achou o que procurava? Fala com a gente:{" "}
        <a className="underline" href={`mailto:${STORE_INFO.email_sac}`}>
          {STORE_INFO.email_sac}
        </a>
        .
      </p>

      <div className="mt-10 flex flex-col gap-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="rounded-2xl bg-white border border-border p-5 group"
          >
            <summary className="font-bold text-base cursor-pointer list-none flex items-center justify-between gap-3">
              <span>{f.q}</span>
              <span className="text-foreground/40 group-open:rotate-45 transition">
                +
              </span>
            </summary>
            <p className="text-foreground/75 mt-3 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </article>
  );
}
