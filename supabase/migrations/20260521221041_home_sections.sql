-- Sistema de sections da home estilo Shopify.
-- Admin reordena, ativa/desativa, edita cada seção. Home renderiza em ordem.

create table home_sections (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in (
    'hero_carousel',
    'trust_bar',
    'categories',
    'products_grid',
    'how_it_works',
    'faq'
  )),
  display_order int not null default 0,
  enabled boolean not null default true,
  data jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_home_sections_order on home_sections(display_order);

create trigger home_sections_updated_at before update on home_sections
  for each row execute function set_updated_at();

alter table home_sections enable row level security;
create policy "home_sections_public_read" on home_sections
  for select using (enabled = true);

-- Bucket pra imagens da home (banners, etc.)
insert into storage.buckets (id, name, public)
values ('home', 'home', true)
on conflict (id) do nothing;

create policy "home_public_read" on storage.objects
  for select using (bucket_id = 'home');

-- Seed: estado atual da home como sections
insert into home_sections (type, display_order, enabled, data) values
  (
    'hero_carousel',
    1,
    true,
    jsonb_build_object(
      'slides', jsonb_build_array(
        jsonb_build_object(
          'image', '/images/home/home-hero-stadium.png',
          'tag', 'Coleção Copa 2026',
          'title_1', 'Veste o Brasil.',
          'title_2', 'Faz história.',
          'description', 'Camisas oficiais I e II da Seleção, masculinas e femininas. Personalize com seu nome e número.',
          'cta_label', 'Comprar agora',
          'cta_link', '#camisas'
        )
      ),
      'autoplay_seconds', 6
    )
  ),
  (
    'trust_bar',
    2,
    true,
    jsonb_build_object(
      'items', jsonb_build_array(
        jsonb_build_object('icon', 'truck', 'title', 'Frete fixo R$ 5', 'subtitle', 'Em todo o Brasil'),
        jsonb_build_object('icon', 'shield', 'title', 'Pagamento seguro', 'subtitle', 'Cartão, Pix e boleto'),
        jsonb_build_object('icon', 'star', 'title', 'Personalização', 'subtitle', 'Nome e número por R$ 49,90')
      )
    )
  ),
  (
    'categories',
    3,
    true,
    jsonb_build_object('title', 'Coleções', 'subtitle', 'Por coleção')
  ),
  (
    'products_grid',
    4,
    true,
    jsonb_build_object('title', 'Camisas da Seleção', 'subtitle', 'Coleção 2026', 'limit', 12)
  ),
  (
    'how_it_works',
    5,
    true,
    jsonb_build_object(
      'title', 'Em 3 passos',
      'subtitle', 'Como funciona',
      'steps', jsonb_build_array(
        jsonb_build_object('title', 'Escolha sua camisa', 'description', 'Brasil I (amarela) ou II (azul), masculina ou feminina, do P ao XGG.'),
        jsonb_build_object('title', 'Personalize', 'description', 'Adicione seu nome e número favorito por R$ 49,90 extras.'),
        jsonb_build_object('title', 'Receba em casa', 'description', 'Frete fixo R$ 5 pra todo o Brasil. Pronto em poucos dias.')
      )
    )
  ),
  (
    'faq',
    6,
    true,
    jsonb_build_object('title', 'Perguntas frequentes', 'subtitle', 'Tudo que você precisa saber')
  );
