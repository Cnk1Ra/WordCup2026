-- Audit log de ações admin. Toda ação sensível (criar/editar/excluir produto,
-- cupom, despesa, mudar status pedido, etc.) gera uma row.
-- Permite descobrir "quem fez o quê e quando" — essencial pra
-- compliance LGPD e debug pós-incidente.

create table admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references admins(id) on delete set null,
  admin_email text not null,
  action text not null,            -- ex: "product.update", "expense.create"
  entity_type text,                -- ex: "products", "expenses"
  entity_id text,                  -- id do registro afetado
  description text,                -- texto livre legível
  metadata jsonb,                  -- diff antes/depois, contexto extra
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);
create index idx_audit_log_admin on admin_audit_log(admin_id, created_at desc);
create index idx_audit_log_entity on admin_audit_log(entity_type, entity_id);
create index idx_audit_log_action on admin_audit_log(action, created_at desc);

alter table admin_audit_log enable row level security;
-- service_role bypassa; admins não leem direto (sem policy = sem read)
-- Acesso ao log é via /admin/audit (read via service_role) com check de role.
