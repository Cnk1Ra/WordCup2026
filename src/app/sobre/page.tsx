import type { Metadata } from "next";
import { STORE_INFO } from "@/lib/store-info";

export const metadata: Metadata = {
  title: "Sobre · SpaceFut",
  description:
    "Camisas oficiais da Seleção Brasileira para a Copa 2026. Personalização com nome e número.",
};

export default function SobrePage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral">
      <h1 className="text-4xl font-black tracking-tight">Sobre a SpaceFut</h1>
      <p className="text-foreground/70 mt-2">
        Camisas oficiais da Seleção pra Copa 2026, com personalização rápida e
        envio direto pra todo o Brasil.
      </p>

      <h2 className="text-xl font-bold mt-8">Nossa história</h2>
      <p>
        A SpaceFut nasceu em {new Date().getFullYear()} pra atender torcedores
        que querem vestir a Seleção sem complicação: catálogo enxuto, preço
        justo, personalização com nome e número, e frete fixo de R$ 5 pra todo
        o Brasil.
      </p>

      <h2 className="text-xl font-bold mt-8">Onde estamos</h2>
      <p>{STORE_INFO.address}. Atendemos em todo o território nacional.</p>

      <h2 className="text-xl font-bold mt-8">Dados da empresa</h2>
      <ul>
        <li>Razão social: {STORE_INFO.legal_name}</li>
        <li>CNPJ: {STORE_INFO.cnpj}</li>
        <li>Contato: {STORE_INFO.email_sac}</li>
        <li>WhatsApp: {STORE_INFO.whatsapp_display}</li>
      </ul>
    </article>
  );
}
