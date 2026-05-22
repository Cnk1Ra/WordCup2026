-- Despesas: quem desembolsou o valor (qual sócio).
-- Permite calcular o split: cada sócio recebe (lucro/2) + valor que ele pagou
-- em despesas (recupera o desembolso + sua parte do lucro).

alter table expenses
  add column if not exists paid_by_admin_id uuid references admins(id) on delete set null,
  add column if not exists paid_by_name text;

create index if not exists idx_expenses_paid_by on expenses(paid_by_admin_id);
