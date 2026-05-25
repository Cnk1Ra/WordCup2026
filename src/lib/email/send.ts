import "server-only";
import { Resend } from "resend";

// Singleton — re-usa a mesma instância entre invocações.
let _resend: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export const EMAIL_FROM =
  process.env.EMAIL_FROM ?? "SpaceFut <pedidos@spacefut.shop>";
export const EMAIL_REPLY_TO =
  process.env.EMAIL_REPLY_TO ?? "contato@spacefut.shop";

type SendInput = {
  to: string | string[];
  subject: string;
  html: string;
  // Texto plano fallback pra clientes que bloqueiam HTML (recomendado).
  text?: string;
};

// Envia email via Resend. Não bloqueia o fluxo se RESEND_API_KEY não estiver
// configurado — apenas loga e segue. Pedidos não dependem de email pra
// funcionar; email é nice-to-have.
export async function sendEmail(
  input: SendInput
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY não configurada — pulando envio");
    return { ok: false, error: "no_api_key" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      replyTo: EMAIL_REPLY_TO,
      to: input.to,
      subject: input.subject,
      html: input.html,
      ...(input.text ? { text: input.text } : {}),
    });
    if (error) {
      console.warn("[email] erro Resend:", error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true, id: data?.id ?? "" };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn("[email] exception:", msg);
    return { ok: false, error: msg };
  }
}
