import type { Metadata } from "next";
import { STORE_INFO } from "@/lib/store-info";

export const metadata: Metadata = {
  title: "Política de Privacidade · SpaceFut",
};

export default function PrivacidadePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral">
      <h1 className="text-4xl font-black tracking-tight">
        Política de Privacidade
      </h1>
      <p className="text-foreground/55 text-sm">
        Atualizada em {new Date().toLocaleDateString("pt-BR")}
      </p>

      <h2 className="text-xl font-bold mt-8">1. Quem somos</h2>
      <p>
        Esta Política descreve como a {STORE_INFO.brand_name} (
        {STORE_INFO.legal_name}, CNPJ {STORE_INFO.cnpj}) trata os dados pessoais
        dos visitantes e clientes da loja, em conformidade com a Lei Geral de
        Proteção de Dados (Lei 13.709/2018 — LGPD).
      </p>

      <h2 className="text-xl font-bold mt-8">2. Dados que coletamos</h2>
      <ul>
        <li>
          <strong>Dados de cadastro:</strong> nome, email, telefone, CPF (se
          aplicável).
        </li>
        <li>
          <strong>Dados de entrega:</strong> endereço completo informado no
          checkout.
        </li>
        <li>
          <strong>Dados de pagamento:</strong> processados pelo Stripe; não
          armazenamos número de cartão.
        </li>
        <li>
          <strong>Dados de navegação:</strong> cookies, IP, dispositivo,
          páginas visitadas (Google Analytics, Meta Pixel — opcional).
        </li>
      </ul>

      <h2 className="text-xl font-bold mt-8">3. Pra que usamos</h2>
      <ul>
        <li>Processar pedidos e entregar produtos.</li>
        <li>Comunicar status do pedido e SAC.</li>
        <li>Cumprir obrigações fiscais e legais.</li>
        <li>Melhorar a loja, com base agregada e anônima.</li>
        <li>
          Marketing (apenas com seu consentimento — você pode descadastrar a
          qualquer momento).
        </li>
      </ul>

      <h2 className="text-xl font-bold mt-8">4. Com quem compartilhamos</h2>
      <ul>
        <li>
          <strong>Stripe</strong> — processamento de pagamento.
        </li>
        <li>
          <strong>Transportadora</strong> — envio do pedido (Correios/Loggi).
        </li>
        <li>
          <strong>Supabase</strong> — armazenamento dos dados (banco e
          imagens), com criptografia em repouso e em trânsito.
        </li>
        <li>
          <strong>Google Analytics / Meta Pixel</strong> — analytics agregado.
        </li>
      </ul>
      <p>Não vendemos dados pessoais a terceiros.</p>

      <h2 className="text-xl font-bold mt-8">5. Por quanto tempo guardamos</h2>
      <p>
        Dados de pedido: 5 anos (obrigação fiscal — Receita Federal). Dados de
        marketing: até você descadastrar. Cookies: conforme política do
        navegador.
      </p>

      <h2 className="text-xl font-bold mt-8">6. Seus direitos (LGPD)</h2>
      <p>Você pode, a qualquer momento, solicitar:</p>
      <ul>
        <li>Confirmação da existência de tratamento;</li>
        <li>Acesso aos seus dados;</li>
        <li>Correção de dados incorretos;</li>
        <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
        <li>Portabilidade;</li>
        <li>Revogação do consentimento.</li>
      </ul>
      <p>
        Pra exercer: envie pedido por email pra{" "}
        <a href={`mailto:${STORE_INFO.email_sac}`}>{STORE_INFO.email_sac}</a>.
        Respondemos em até 15 dias.
      </p>

      <h2 className="text-xl font-bold mt-8">7. Cookies</h2>
      <p>
        Usamos cookies pra manter você logado, lembrar o carrinho e medir
        audiência. Você pode desabilitar nas configurações do navegador, mas
        algumas funções da loja podem deixar de funcionar.
      </p>

      <h2 className="text-xl font-bold mt-8">8. Contato</h2>
      <p>
        Encarregado de Proteção de Dados (DPO): {STORE_INFO.legal_name}.
        <br />
        Email: <a href={`mailto:${STORE_INFO.email_sac}`}>
          {STORE_INFO.email_sac}
        </a>
      </p>
    </article>
  );
}
