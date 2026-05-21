-- Gallery de imagens por produto (além das front_image/back_image que são
-- usadas pelo JerseyShowcase em produtos com personalização).
--
-- Use cases:
-- - Produto sem personalização: galleria livre, qualquer foto pode virar
--   "imagem do card" (a que aparece na vitrine).
-- - Produto com personalização (allows_personalization=true): front+back
--   continuam sendo o jersey limpo pra overlay; a galleria é decorativa.

create table product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  alt text,
  display_order int not null default 0,
  is_card boolean not null default false,
  created_at timestamptz not null default now()
);
create index idx_product_images_product on product_images(product_id, display_order);

-- Garante no máximo 1 imagem marcada como card por produto
create unique index idx_product_images_one_card
  on product_images(product_id) where is_card = true;

alter table product_images enable row level security;
create policy "product_images_public_read" on product_images
  for select using (true);
