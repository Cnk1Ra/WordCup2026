import "server-only";

// Templates HTML inline (sem React Email pra evitar dep extra). Estilo
// inline porque clients de email (Gmail, Outlook) suportam pouca coisa.
// Paleta: verde Brasil + amarelo, segue a marca SpaceFut.

const BRAND_GREEN = "#009c3b";
const BRAND_YELLOW = "#fedd00";
const TEXT = "#0a0a0a";
const MUTED = "#666666";
const BORDER = "#ececec";
const BG = "#fafaf7";

const SITE = "https://spacefut.shop";

function formatBRL(v: number): string {
  return v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

type OrderItem = {
  product_name: string;
  size: string;
  quantity: number;
  unit_price: number;
  personalization?: { name?: string | null; number?: string | null } | null;
};

type Order = {
  number: string;
  total: number;
  subtotal: number;
  shipping: number;
  customer_name: string | null;
  customer_email: string;
  status: string;
  tracking_code?: string | null;
  shipping_address?: {
    line1?: string;
    line2?: string | null;
    city?: string;
    state?: string;
    postal_code?: string;
  } | null;
  order_items?: OrderItem[];
};

function shell(content: string, preheader = ""): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>SpaceFut</title>
</head>
<body style="margin:0;padding:0;background:${BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:${TEXT};">
<div style="display:none;font-size:1px;color:${BG};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:24px;overflow:hidden;border:1px solid ${BORDER};">
<tr><td style="background:${BRAND_GREEN};padding:24px;text-align:center;">
<div style="display:inline-block;background:${BRAND_YELLOW};color:${BRAND_GREEN};font-weight:900;font-size:28px;letter-spacing:1px;padding:8px 18px;border-radius:12px;font-family:Impact,'Arial Black',sans-serif;">SF</div>
<div style="color:#fff;font-size:14px;margin-top:10px;font-weight:600;">SpaceFut · Materiais Esportivos</div>
</td></tr>
<tr><td style="padding:28px 28px 8px 28px;">
${content}
</td></tr>
<tr><td style="padding:20px 28px 28px 28px;border-top:1px solid ${BORDER};color:${MUTED};font-size:12px;line-height:1.5;">
Precisa de ajuda? Responde este email ou entra em contato em <a href="mailto:contato@spacefut.shop" style="color:${BRAND_GREEN};text-decoration:none;">contato@spacefut.shop</a>.<br>
<a href="${SITE}" style="color:${BRAND_GREEN};text-decoration:none;">spacefut.shop</a> · Belo Horizonte · MG
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function itemsTable(items: OrderItem[]): string {
  if (!items || items.length === 0) return "";
  const rows = items
    .map((it) => {
      const perso =
        it.personalization && (it.personalization.name || it.personalization.number)
          ? `<div style="color:${MUTED};font-size:12px;margin-top:2px;">Personalização: ${it.personalization.name ?? ""}${it.personalization.number ? ` · #${it.personalization.number}` : ""}</div>`
          : "";
      return `<tr>
<td style="padding:12px 0;border-bottom:1px solid ${BORDER};">
<div style="font-weight:600;font-size:14px;">${escape(it.product_name)}</div>
<div style="color:${MUTED};font-size:12px;margin-top:2px;">Tam. ${escape(it.size)} · Qtd. ${it.quantity}</div>
${perso}
</td>
<td style="padding:12px 0;border-bottom:1px solid ${BORDER};text-align:right;font-weight:600;font-size:14px;vertical-align:top;white-space:nowrap;">${formatBRL(it.unit_price * it.quantity)}</td>
</tr>`;
    })
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">${rows}</table>`;
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// --- Templates específicos ---

export function orderConfirmationEmail(order: Order): {
  subject: string;
  html: string;
  text: string;
} {
  const name = order.customer_name?.split(" ")[0] ?? "Torcedor";
  const itemCount = order.order_items?.length ?? 0;
  const addr = order.shipping_address;
  const addrLine = addr
    ? `${addr.line1 ?? ""}${addr.line2 ? `, ${addr.line2}` : ""} — ${addr.city ?? ""}/${addr.state ?? ""} CEP ${addr.postal_code ?? ""}`
    : "";

  const content = `
<h1 style="margin:0 0 8px 0;font-size:22px;font-weight:900;">Pedido confirmado, ${escape(name)}!</h1>
<p style="margin:0 0 20px 0;color:${MUTED};font-size:14px;line-height:1.5;">Recebemos seu pagamento e já estamos preparando sua camisa.</p>

<div style="background:${BG};border-radius:14px;padding:16px;margin-bottom:18px;">
<div style="font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:0.5px;">Número do pedido</div>
<div style="font-size:18px;font-weight:900;margin-top:2px;">${escape(order.number)}</div>
</div>

${itemsTable(order.order_items ?? [])}

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;font-size:14px;">
<tr><td style="color:${MUTED};">Subtotal</td><td style="text-align:right;">${formatBRL(order.subtotal)}</td></tr>
<tr><td style="color:${MUTED};">Frete</td><td style="text-align:right;">${formatBRL(order.shipping)}</td></tr>
<tr><td style="font-weight:900;font-size:16px;padding-top:8px;">Total</td><td style="text-align:right;font-weight:900;font-size:16px;padding-top:8px;">${formatBRL(order.total)}</td></tr>
</table>

${
  addrLine
    ? `<div style="margin-top:24px;padding:14px 16px;background:${BG};border-radius:14px;">
<div style="font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Endereço de entrega</div>
<div style="font-size:13px;line-height:1.5;">${escape(addrLine)}</div>
</div>`
    : ""
}

<div style="margin-top:24px;text-align:center;">
<a href="${SITE}/pedido/${order.number}?email=${encodeURIComponent(order.customer_email)}" style="display:inline-block;background:${TEXT};color:#fff;font-weight:700;padding:14px 28px;border-radius:999px;text-decoration:none;font-size:14px;">Acompanhar pedido</a>
</div>

<p style="margin-top:24px;color:${MUTED};font-size:13px;line-height:1.5;text-align:center;">Aviso o código de rastreio assim que despacharmos.</p>
`;

  const text = `Pedido confirmado!

Numero: ${order.number}
Total: ${formatBRL(order.total)}
${itemCount} ${itemCount === 1 ? "item" : "itens"}

Acompanhe: ${SITE}/pedido/${order.number}?email=${encodeURIComponent(order.customer_email)}`;

  return {
    subject: `Pedido ${order.number} confirmado · SpaceFut`,
    html: shell(content, `Recebemos seu pagamento — pedido ${order.number}`),
    text,
  };
}

export function orderShippedEmail(order: Order): {
  subject: string;
  html: string;
  text: string;
} {
  const name = order.customer_name?.split(" ")[0] ?? "Torcedor";
  const tracking = order.tracking_code;

  const content = `
<h1 style="margin:0 0 8px 0;font-size:22px;font-weight:900;">Sua camisa tá a caminho! 📦</h1>
<p style="margin:0 0 20px 0;color:${MUTED};font-size:14px;line-height:1.5;">Pedido <strong>${escape(order.number)}</strong> despachado, ${escape(name)}.</p>

${
  tracking
    ? `<div style="background:${BG};border-radius:14px;padding:16px;margin-bottom:18px;">
<div style="font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:0.5px;">Código de rastreio</div>
<div style="font-size:18px;font-weight:900;margin-top:2px;font-family:monospace;letter-spacing:0.5px;">${escape(tracking)}</div>
<a href="https://www.linkcorreios.com.br/?id=${encodeURIComponent(tracking)}" style="display:inline-block;margin-top:10px;color:${BRAND_GREEN};font-size:13px;font-weight:600;text-decoration:none;">Rastrear nos Correios →</a>
</div>`
    : ""
}

<div style="margin-top:8px;text-align:center;">
<a href="${SITE}/pedido/${order.number}?email=${encodeURIComponent(order.customer_email)}" style="display:inline-block;background:${TEXT};color:#fff;font-weight:700;padding:14px 28px;border-radius:999px;text-decoration:none;font-size:14px;">Ver pedido</a>
</div>
`;

  const text = `Sua camisa esta a caminho!

Pedido: ${order.number}
${tracking ? `Codigo de rastreio: ${tracking}\nRastrear: https://www.linkcorreios.com.br/?id=${encodeURIComponent(tracking)}\n` : ""}
Acompanhe: ${SITE}/pedido/${order.number}?email=${encodeURIComponent(order.customer_email)}`;

  return {
    subject: `Pedido ${order.number} enviado · SpaceFut`,
    html: shell(content, `Pedido ${order.number} despachado`),
    text,
  };
}

export function orderDeliveredEmail(order: Order): {
  subject: string;
  html: string;
  text: string;
} {
  const name = order.customer_name?.split(" ")[0] ?? "Torcedor";

  const content = `
<h1 style="margin:0 0 8px 0;font-size:22px;font-weight:900;">Pedido entregue 🎉</h1>
<p style="margin:0 0 20px 0;color:${MUTED};font-size:14px;line-height:1.5;">Obrigado por escolher a SpaceFut, ${escape(name)}! Esperamos que tu vista com orgulho.</p>

<div style="background:${BG};border-radius:14px;padding:16px;margin-bottom:24px;text-align:center;">
<div style="font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:0.5px;">Pedido</div>
<div style="font-size:18px;font-weight:900;margin-top:2px;">${escape(order.number)}</div>
</div>

<p style="margin:0;color:${MUTED};font-size:13px;line-height:1.6;text-align:center;">Tem foto vestindo a camisa? Marca <strong>@spacefut</strong> que a gente compartilha. E se algo não tá certo, responde este email — resolvemos rápido.</p>

<div style="margin-top:24px;text-align:center;">
<a href="${SITE}" style="display:inline-block;background:${TEXT};color:#fff;font-weight:700;padding:14px 28px;border-radius:999px;text-decoration:none;font-size:14px;">Ver mais camisas</a>
</div>
`;

  const text = `Pedido ${order.number} entregue!

Obrigado por escolher a SpaceFut.

Ver mais: ${SITE}`;

  return {
    subject: `Pedido ${order.number} entregue · SpaceFut`,
    html: shell(content, `Pedido ${order.number} entregue`),
    text,
  };
}

// Notificação interna pros admins quando entra pedido novo. Layout diferente
// (mais informativo, com link pro admin panel) — não é cliente que recebe.
export function orderCancelledEmail(
  order: Order,
  reason?: string
): { subject: string; html: string; text: string } {
  const name = order.customer_name?.split(" ")[0] ?? "Torcedor";
  const wasPaid = order.status !== "pending";

  const content = `
<h1 style="margin:0 0 8px 0;font-size:22px;font-weight:900;">Pedido cancelado</h1>
<p style="margin:0 0 20px 0;color:${MUTED};font-size:14px;line-height:1.5;">Olá ${escape(name)}, o pedido <strong>${escape(order.number)}</strong> foi cancelado.</p>

${
  reason
    ? `<div style="background:${BG};border-radius:14px;padding:14px 16px;margin-bottom:18px;">
<div style="font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Motivo</div>
<div style="font-size:13px;line-height:1.5;">${escape(reason)}</div>
</div>`
    : ""
}

${
  wasPaid
    ? `<div style="background:${BG};border-radius:14px;padding:16px;margin-bottom:18px;">
<div style="font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:0.5px;">Reembolso</div>
<div style="font-size:18px;font-weight:900;margin-top:4px;">${formatBRL(order.total)}</div>
<p style="margin:8px 0 0 0;color:${MUTED};font-size:12px;line-height:1.5;">Volta pro seu cartão em <strong>5 a 10 dias úteis</strong> (depende do banco). Se for crédito, pode aparecer como crédito na próxima fatura.</p>
</div>`
    : ""
}

<p style="margin:0;color:${MUTED};font-size:13px;line-height:1.6;">Qualquer dúvida, responde este email que a gente resolve rápido.</p>
`;

  const text = `Pedido ${order.number} cancelado.
${reason ? `\nMotivo: ${reason}\n` : ""}${wasPaid ? `Reembolso de ${formatBRL(order.total)} processado — volta pro cartao em 5 a 10 dias uteis.` : ""}`;

  return {
    subject: `Pedido ${order.number} cancelado · SpaceFut`,
    html: shell(content, `Pedido ${order.number} cancelado`),
    text,
  };
}

export function newOrderAdminEmail(order: Order): {
  subject: string;
  html: string;
  text: string;
} {
  const addr = order.shipping_address;
  const addrLine = addr
    ? `${addr.line1 ?? ""}${addr.line2 ? `, ${addr.line2}` : ""}<br>${addr.city ?? ""}/${addr.state ?? ""} · CEP ${addr.postal_code ?? ""}`
    : "Sem endereço";

  const itemsHtml = (order.order_items ?? [])
    .map(
      (it) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid ${BORDER};font-size:13px;"><strong>${escape(it.product_name)}</strong><br><span style="color:${MUTED};font-size:12px;">Tam ${escape(it.size)} · Qtd ${it.quantity}${
          it.personalization && (it.personalization.name || it.personalization.number)
            ? ` · ${it.personalization.name ?? ""}${it.personalization.number ? ` #${it.personalization.number}` : ""}`
            : ""
        }</span></td><td style="padding:8px 0;border-bottom:1px solid ${BORDER};text-align:right;font-weight:600;font-size:13px;white-space:nowrap;vertical-align:top;">${formatBRL(it.unit_price * it.quantity)}</td></tr>`
    )
    .join("");

  const content = `
<div style="background:${BRAND_YELLOW};color:${TEXT};padding:10px 14px;border-radius:10px;font-weight:900;font-size:13px;margin-bottom:16px;display:inline-block;">🛒 NOVO PEDIDO</div>

<h1 style="margin:0 0 4px 0;font-size:24px;font-weight:900;">${escape(order.number)}</h1>
<p style="margin:0 0 20px 0;color:${MUTED};font-size:14px;">${formatBRL(order.total)} · ${(order.order_items ?? []).length} ${(order.order_items ?? []).length === 1 ? "item" : "itens"}</p>

<div style="background:${BG};border-radius:14px;padding:16px;margin-bottom:18px;">
<div style="font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Cliente</div>
<div style="font-size:14px;font-weight:600;">${escape(order.customer_name ?? "Sem nome")}</div>
<div style="font-size:13px;color:${MUTED};margin-top:2px;"><a href="mailto:${escape(order.customer_email)}" style="color:${MUTED};text-decoration:none;">${escape(order.customer_email)}</a></div>
</div>

<div style="background:${BG};border-radius:14px;padding:16px;margin-bottom:18px;">
<div style="font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Entrega</div>
<div style="font-size:13px;line-height:1.5;">${addrLine}</div>
</div>

<div style="font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:0.5px;margin:8px 0 4px 0;">Itens</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${itemsHtml}</table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;font-size:13px;">
<tr><td style="color:${MUTED};">Subtotal</td><td style="text-align:right;">${formatBRL(order.subtotal)}</td></tr>
<tr><td style="color:${MUTED};">Frete</td><td style="text-align:right;">${formatBRL(order.shipping)}</td></tr>
<tr><td style="font-weight:900;font-size:15px;padding-top:6px;">Total</td><td style="text-align:right;font-weight:900;font-size:15px;padding-top:6px;">${formatBRL(order.total)}</td></tr>
</table>

<div style="margin-top:24px;text-align:center;">
<a href="${SITE}/admin/pedidos" style="display:inline-block;background:${TEXT};color:#fff;font-weight:700;padding:14px 28px;border-radius:999px;text-decoration:none;font-size:14px;">Abrir no admin</a>
</div>

<p style="margin-top:24px;color:${MUTED};font-size:12px;line-height:1.5;text-align:center;">Não responda este email — é uma notificação interna automática.</p>
`;

  const text = `NOVO PEDIDO ${order.number}

Cliente: ${order.customer_name ?? "?"} (${order.customer_email})
Total: ${formatBRL(order.total)}
Itens: ${(order.order_items ?? []).length}

Endereço: ${addr ? `${addr.line1 ?? ""} - ${addr.city ?? ""}/${addr.state ?? ""} ${addr.postal_code ?? ""}` : "?"}

Admin: ${SITE}/admin/pedidos`;

  return {
    subject: `🛒 Pedido ${order.number} · ${formatBRL(order.total)} · SpaceFut`,
    html: shell(content, `Novo pedido ${order.number} de ${formatBRL(order.total)}`),
    text,
  };
}

export function orderRefundedEmail(order: Order): {
  subject: string;
  html: string;
  text: string;
} {
  const name = order.customer_name?.split(" ")[0] ?? "Torcedor";

  const content = `
<h1 style="margin:0 0 8px 0;font-size:22px;font-weight:900;">Reembolso processado</h1>
<p style="margin:0 0 20px 0;color:${MUTED};font-size:14px;line-height:1.5;">Olá ${escape(name)}, o reembolso do pedido <strong>${escape(order.number)}</strong> foi processado com sucesso.</p>

<div style="background:${BG};border-radius:14px;padding:16px;margin-bottom:18px;">
<div style="font-size:11px;font-weight:700;color:${MUTED};text-transform:uppercase;letter-spacing:0.5px;">Valor reembolsado</div>
<div style="font-size:20px;font-weight:900;margin-top:2px;">${formatBRL(order.total)}</div>
</div>

<p style="margin:0;color:${MUTED};font-size:13px;line-height:1.6;">O valor volta pro seu cartão em <strong>5 a 10 dias úteis</strong> (depende do seu banco). Se for cartão de crédito, pode vir como crédito na próxima fatura.</p>

<p style="margin-top:16px;color:${MUTED};font-size:13px;line-height:1.6;">Qualquer dúvida, responde este email.</p>
`;

  const text = `Reembolso processado.

Pedido: ${order.number}
Valor: ${formatBRL(order.total)}

Volta pro cartao em 5 a 10 dias uteis.`;

  return {
    subject: `Reembolso do pedido ${order.number} · SpaceFut`,
    html: shell(content, `Reembolso de ${formatBRL(order.total)} processado`),
    text,
  };
}
