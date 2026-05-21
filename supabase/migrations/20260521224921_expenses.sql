-- Despesas: gastos manuais que entram no calculo de lucro do dashboard.

create table expenses (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  category text not null default 'outros' check (category in (
    'anuncios', 'fornecedor', 'frete', 'taxas', 'salarios', 'software', 'outros'
  )),
  amount numeric(10,2) not null check (amount > 0),
  occurred_at date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_expenses_date on expenses(occurred_at desc);
create index idx_expenses_category on expenses(category);

create trigger expenses_updated_at before update on expenses
  for each row execute function set_updated_at();

alter table expenses enable row level security;
-- service_role bypassa, admin acessa via service_role; public nao le.
