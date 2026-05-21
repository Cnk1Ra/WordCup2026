-- =============================================================================
-- SpaceFut — Compatibilidade com import estilo Shopify
-- =============================================================================
--
-- Afrouxa o schema de `products` pra aceitar produtos genéricos importados via
-- CSV no formato Shopify. Campos hyper-específicos do catálogo Brasil original
-- (team, color, hex, accent_hex, text_color, front_image, back_image) viram
-- NULLABLE — o admin completa depois.
--
-- Adiciona campos Shopify-style: vendor, product_type, tags, SEO, compare_at_price.

-- 1. Tornar campos hyper-específicos opcionais
alter table products alter column team           drop not null;
alter table products alter column color          drop not null;
alter table products alter column hex            drop not null;
alter table products alter column accent_hex     drop not null;
alter table products alter column text_color     drop not null;
alter table products alter column front_image    drop not null;
alter table products alter column back_image     drop not null;
alter table products alter column short_name     drop not null;
alter table products alter column edition        drop not null;

-- 2. Tornar gender opcional (Shopify nem sempre traz)
alter table products alter column gender         drop not null;

-- 3. Novos campos Shopify-style
alter table products add column if not exists vendor             text;
alter table products add column if not exists product_type       text;
alter table products add column if not exists tags               text[] not null default '{}';
alter table products add column if not exists seo_title          text;
alter table products add column if not exists seo_description    text;
alter table products add column if not exists compare_at_price   numeric(10,2);
alter table products add column if not exists status             text not null default 'active'
  check (status in ('active', 'draft', 'archived'));

-- 4. Índices úteis pra busca/filtro futuro
create index if not exists idx_products_vendor  on products(vendor) where vendor is not null;
create index if not exists idx_products_status  on products(status, display_order);
create index if not exists idx_products_tags    on products using gin(tags);
