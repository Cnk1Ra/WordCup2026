-- SpaceFut initial schema

-- Products: catálogo editável pelo admin
create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  short_name text not null,
  team text not null,
  edition text not null,
  gender text not null check (gender in ('Masculina', 'Feminina')),
  color text not null,
  hex text not null,
  accent_hex text not null,
  text_color text not null,
  front_image text not null,
  back_image text not null,
  base_price numeric(10,2) not null default 150,
  description text,
  badge text,
  is_active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_products_active on products(is_active, display_order);

-- Inventory: estoque por SKU + tamanho
create table inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  size text not null check (size in ('P', 'M', 'G', 'GG', 'XGG')),
  quantity int not null default 0 check (quantity >= 0),
  updated_at timestamptz not null default now(),
  unique (product_id, size)
);

-- Customers: dados de quem comprou
create table customers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  phone text,
  document text,
  address jsonb,
  total_orders int not null default 0,
  total_spent numeric(10,2) not null default 0,
  created_at timestamptz not null default now(),
  unique (email)
);

-- Orders: pedidos
create table orders (
  id uuid primary key default gen_random_uuid(),
  number text unique not null,
  customer_id uuid references customers(id),
  customer_email text not null,
  customer_name text,
  customer_phone text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'producing', 'shipping', 'delivered', 'cancelled', 'refunded')),
  subtotal numeric(10,2) not null,
  shipping numeric(10,2) not null,
  total numeric(10,2) not null,
  shipping_address jsonb,
  shipping_region text,
  promised_delivery_days int,
  has_made_to_order_items boolean not null default false,
  stripe_session_id text,
  stripe_payment_intent text,
  notes text,
  tracking_code text,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz
);
create index idx_orders_status on orders(status, created_at desc);
create index idx_orders_customer on orders(customer_id);

-- Order items: itens de cada pedido
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  product_name text not null,
  size text not null,
  quantity int not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  was_in_stock boolean not null default true,
  personalization jsonb
);
create index idx_order_items_order on order_items(order_id);

-- Shipping rules: regras de prazo por região (admin edita)
create table shipping_rules (
  id uuid primary key default gen_random_uuid(),
  region_slug text unique not null,
  region_name text not null,
  match_cep_prefixes text[] not null default '{}',
  match_cities text[] not null default '{}',
  days_in_stock int not null,
  days_made_to_order int not null,
  shipping_cost numeric(10,2) not null default 5,
  is_default boolean not null default false,
  display_order int not null default 0
);

-- Admins: usuários com acesso ao painel
create table admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text unique not null,
  name text,
  role text not null default 'admin' check (role in ('admin', 'owner')),
  created_at timestamptz not null default now()
);

-- Site settings: textos editáveis (hero, copy, etc)
create table site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at trigger
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at before update on products
  for each row execute function set_updated_at();
create trigger inventory_updated_at before update on inventory
  for each row execute function set_updated_at();
create trigger site_settings_updated_at before update on site_settings
  for each row execute function set_updated_at();

-- RLS: ativar em todas, política liberada via service role
alter table products enable row level security;
alter table inventory enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table shipping_rules enable row level security;
alter table admins enable row level security;
alter table site_settings enable row level security;

-- Public read: produtos ativos, estoque, regras de frete e settings
create policy "products_public_read" on products for select using (is_active = true);
create policy "inventory_public_read" on inventory for select using (true);
create policy "shipping_rules_public_read" on shipping_rules for select using (true);
create policy "site_settings_public_read" on site_settings for select using (true);

-- Seed shipping rules iniciais
insert into shipping_rules (region_slug, region_name, match_cities, days_in_stock, days_made_to_order, shipping_cost, is_default, display_order) values
  ('sabara', 'Sabará', array['Sabará', 'Sabara'], 1, 5, 5, false, 1),
  ('bh', 'Belo Horizonte', array['Belo Horizonte', 'BH'], 2, 6, 5, false, 2),
  ('default', 'Outras regiões do Brasil', '{}', 7, 12, 5, true, 99);
