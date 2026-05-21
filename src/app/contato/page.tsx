import type { Metadata } from "next";
import { Mail, MessageCircle, MapPin, Clock } from "lucide-react";
import { STORE_INFO } from "@/lib/store-info";

export const metadata: Metadata = {
  title: "Contato · SpaceFut",
  description:
    "Fale com a SpaceFut: WhatsApp, email e SAC. Dúvidas sobre pedido, personalização e entrega.",
};

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-black tracking-tight">Contato</h1>
      <p className="text-foreground/70 mt-2">
        Estamos aqui pra ajudar — escolhe o canal mais rápido pra você.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <a
          href={`https://wa.me/${STORE_INFO.whatsapp}?text=Olá! Vim do site da SpaceFut.`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-2 hover:border-foreground transition"
        >
          <MessageCircle className="size-6 text-brand-green" />
          <p className="font-bold">WhatsApp</p>
          <p className="text-sm text-foreground/70">
            {STORE_INFO.whatsapp_display}
          </p>
          <p className="text-xs text-foreground/55">
            Atendimento mais rápido — seg a sex, 9h-18h.
          </p>
        </a>

        <a
          href={`mailto:${STORE_INFO.email_sac}`}
          className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-2 hover:border-foreground transition"
        >
          <Mail className="size-6 text-foreground" />
          <p className="font-bold">Email</p>
          <p className="text-sm text-foreground/70">{STORE_INFO.email_sac}</p>
          <p className="text-xs text-foreground/55">
            Respondemos em até 1 dia útil.
          </p>
        </a>

        <div className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-2">
          <MapPin className="size-6 text-foreground/60" />
          <p className="font-bold">Endereço</p>
          <p className="text-sm text-foreground/70">{STORE_INFO.address}</p>
        </div>

        <div className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-2">
          <Clock className="size-6 text-foreground/60" />
          <p className="font-bold">Horário</p>
          <p className="text-sm text-foreground/70">Segunda a sexta, 9h-18h</p>
        </div>
      </div>

      <div className="mt-12 rounded-3xl bg-muted p-6 text-sm text-foreground/70">
        <p className="font-bold text-foreground">Dados da empresa</p>
        <p className="mt-2">
          {STORE_INFO.legal_name} · CNPJ {STORE_INFO.cnpj}
        </p>
      </div>
    </div>
  );
}
