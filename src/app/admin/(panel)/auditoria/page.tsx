import { getSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

const ACTION_LABEL: Record<string, string> = {
  "product.create": "Produto criado",
  "product.update": "Produto editado",
  "product.delete": "Produto excluído",
  "product.bulk_import": "Import CSV",
  "category.create": "Categoria criada",
  "category.update": "Categoria editada",
  "category.delete": "Categoria excluída",
  "coupon.create": "Cupom criado",
  "coupon.activate": "Cupom ativado",
  "coupon.deactivate": "Cupom desativado",
  "coupon.delete": "Cupom excluído",
  "expense.create": "Despesa criada",
  "expense.delete": "Despesa excluída",
  "order.create_manual": "Pedido manual criado",
  "order.status_update": "Pedido — status alterado",
  "order.tracking_update": "Pedido — tracking atualizado",
  "home_section.enable": "Seção da home ativada",
  "home_section.disable": "Seção da home desativada",
  "home_section.update": "Seção da home editada",
};

const ACTION_TONE: Record<string, string> = {
  delete: "bg-red-50 text-red-700",
  create: "bg-emerald-50 text-emerald-700",
  update: "bg-blue-50 text-blue-700",
  enable: "bg-emerald-50 text-emerald-700",
  activate: "bg-emerald-50 text-emerald-700",
  disable: "bg-amber-50 text-amber-700",
  deactivate: "bg-amber-50 text-amber-700",
  bulk_import: "bg-violet-50 text-violet-700",
  status_update: "bg-blue-50 text-blue-700",
  tracking_update: "bg-blue-50 text-blue-700",
  create_manual: "bg-emerald-50 text-emerald-700",
};

function toneFor(action: string): string {
  const verb = action.split(".")[1] ?? "";
  return ACTION_TONE[verb] ?? "bg-muted text-foreground/70";
}

const PAGE_SIZE = 50;

type Props = {
  searchParams: Promise<{ page?: string; action?: string; admin?: string }>;
};

export default async function AuditoriaPage({ searchParams }: Props) {
  const { page: pageRaw, action, admin } = await searchParams;
  const page = Math.max(1, parseInt(pageRaw ?? "1", 10) || 1);
  const supabase = getSupabaseServer();

  let q = supabase
    .from("admin_audit_log")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (action) q = q.eq("action", action);
  if (admin) q = q.eq("admin_email", admin);

  const { data, count } = await q.range(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE - 1
  );

  const rows = data ?? [];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const { data: admins } = await supabase
    .from("admins")
    .select("email, name")
    .order("name");

  // Lista distinct de actions pra filtrar (extraída do que já existe no log)
  const { data: distinctActions } = await supabase
    .from("admin_audit_log")
    .select("action")
    .limit(500);
  const uniqueActions = Array.from(
    new Set((distinctActions ?? []).map((r) => r.action))
  ).sort();

  const formatter = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "medium",
  });

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <header>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Auditoria
        </h1>
        <p className="text-sm text-foreground/60 mt-1">
          Histórico de ações administrativas. {total} {total === 1 ? "registro" : "registros"}.
        </p>
      </header>

      <form className="flex flex-wrap gap-3 items-end bg-white border border-border rounded-2xl p-4">
        <label className="flex flex-col gap-1 text-xs font-medium">
          Ação
          <select
            name="action"
            defaultValue={action ?? ""}
            className="border border-border rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">Todas</option>
            {uniqueActions.map((a) => (
              <option key={a} value={a}>
                {ACTION_LABEL[a] ?? a}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium">
          Admin
          <select
            name="admin"
            defaultValue={admin ?? ""}
            className="border border-border rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">Todos</option>
            {(admins ?? []).map((a) => (
              <option key={a.email} value={a.email}>
                {a.name ?? a.email}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="px-4 py-2 bg-foreground text-white rounded-lg text-sm font-medium"
        >
          Filtrar
        </button>
        {(action || admin) && (
          <Link
            href="/admin/auditoria"
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted"
          >
            Limpar
          </Link>
        )}
      </form>

      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs font-semibold uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3">Quando</th>
                <th className="px-4 py-3">Quem</th>
                <th className="px-4 py-3">Ação</th>
                <th className="px-4 py-3">Descrição</th>
                <th className="px-4 py-3">IP</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-foreground/50"
                  >
                    Nenhum registro.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-t border-border align-top hover:bg-muted/30"
                >
                  <td className="px-4 py-3 whitespace-nowrap text-foreground/70">
                    {formatter.format(new Date(r.created_at))}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">
                    {r.admin_email}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${toneFor(r.action)}`}
                    >
                      {ACTION_LABEL[r.action] ?? r.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-md">
                    <div>{r.description ?? "—"}</div>
                    {r.metadata && Object.keys(r.metadata).length > 0 && (
                      <details className="mt-1 text-xs text-foreground/50">
                        <summary className="cursor-pointer">metadata</summary>
                        <pre className="mt-1 whitespace-pre-wrap break-all">
                          {JSON.stringify(r.metadata, null, 2)}
                        </pre>
                      </details>
                    )}
                  </td>
                  <td className="px-4 py-3 text-foreground/50 text-xs font-mono">
                    {r.ip ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-foreground/60">
            Página {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={{
                  pathname: "/admin/auditoria",
                  query: { ...(action ? { action } : {}), ...(admin ? { admin } : {}), page: page - 1 },
                }}
                className="px-3 py-1.5 border border-border rounded-lg hover:bg-muted"
              >
                Anterior
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={{
                  pathname: "/admin/auditoria",
                  query: { ...(action ? { action } : {}), ...(admin ? { admin } : {}), page: page + 1 },
                }}
                className="px-3 py-1.5 border border-border rounded-lg hover:bg-muted"
              >
                Próxima
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
