-- Cupons de desconto. Admin cria, cliente aplica no carrinho.
create table coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  description text,
  type text not null check (type in ('percentage', 'fixed')),
  value numeric(10,2) not null check (value > 0),
  min_subtotal numeric(10,2) not null default 0,
  max_uses int,
  uses int not null default 0,
  starts_at timestamptz,
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_coupons_active on coupons(is_active, expires_at);

create trigger coupons_updated_at before update on coupons
  for each row execute function set_updated_at();

alter table coupons enable row level security;
-- service_role bypassa RLS, então admin escreve normalmente. Public não lê.

-- Coluna de cupom em orders
alter table orders add column if not exists coupon_code text;
alter table orders add column if not exists discount numeric(10,2) not null default 0;
