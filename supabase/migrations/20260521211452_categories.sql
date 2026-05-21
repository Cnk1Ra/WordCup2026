-- Categorias do catálogo: editáveis pelo admin, usadas pra agrupar produtos
-- na home e em listagens. Many-to-many com products via product_categories.

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_categories_active on categories(is_active, display_order);

create trigger categories_updated_at before update on categories
  for each row execute function set_updated_at();

create table product_categories (
  product_id uuid not null references products(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  primary key (product_id, category_id)
);
create index idx_product_categories_category on product_categories(category_id);

-- RLS
alter table categories enable row level security;
alter table product_categories enable row level security;

create policy "categories_public_read" on categories
  for select using (is_active = true);

create policy "product_categories_public_read" on product_categories
  for select using (true);

-- Seed categorias iniciais
insert into categories (slug, name, description, display_order) values
  ('selecao-brasileira', 'Seleção Brasileira', 'Camisas oficiais da Seleção', 1),
  ('retro', 'Retrô', 'Camisas históricas e edições especiais', 2),
  ('infantil', 'Infantil', 'Kits e camisas para crianças', 3),
  ('outros', 'Outros', 'Demais produtos', 99);
