-- Seed inicial dos 4 produtos da Coleção Brasil 2026

insert into products (
  slug, name, short_name, team, edition, gender, color,
  hex, accent_hex, text_color, front_image, back_image,
  base_price, description, badge, is_active, display_order
) values
  (
    'brasil-i-amarela-masculina',
    'SpaceFut Torcedor Brasil I — Masculina',
    'Brasil I — Masculina',
    'Coleção Brasil 2026', 'I', 'Masculina', 'Amarelo Estádio',
    '#FEDD00', '#009C3B', '#0A4A1F',
    '/images/products/brasil-i-front.jpg',
    '/images/products/brasil-i-back.jpg',
    150,
    'Camisa torcedor SpaceFut nas cores oficiais do Brasil para a Copa 2026. Tecido respirável de alta performance, gola V em ribana, punhos elásticos e cuts atléticos. Personalize com seu nome e número.',
    'Lançamento', true, 1
  ),
  (
    'brasil-i-amarela-feminina',
    'SpaceFut Torcedor Brasil I — Feminina',
    'Brasil I — Feminina',
    'Coleção Brasil 2026', 'I', 'Feminina', 'Amarelo Estádio',
    '#FEDD00', '#009C3B', '#0A4A1F',
    '/images/products/brasil-i-front.jpg',
    '/images/products/brasil-i-back.jpg',
    150,
    'Camisa torcedor SpaceFut nas cores oficiais do Brasil para a Copa 2026. Modelagem feminina, tecido respirável de alta performance, gola V em ribana e cuts atléticos. Personalize com seu nome e número.',
    'Lançamento', true, 2
  ),
  (
    'brasil-ii-azul-masculina',
    'SpaceFut Torcedor Brasil II — Masculina',
    'Brasil II — Masculina',
    'Coleção Brasil 2026', 'II', 'Masculina', 'Azul Estádio',
    '#1B2D5C', '#FEDD00', '#FFFFFF',
    '/images/products/brasil-ii-front.jpg',
    '/images/products/brasil-ii-back.jpg',
    150,
    'Camisa reserva SpaceFut na paleta azul/preto da edição II Copa 2026. Tecido respirável de alta performance, gola V em ribana, punhos elásticos e cuts atléticos. Personalize com seu nome e número.',
    null, true, 3
  ),
  (
    'brasil-ii-azul-feminina',
    'SpaceFut Torcedor Brasil II — Feminina',
    'Brasil II — Feminina',
    'Coleção Brasil 2026', 'II', 'Feminina', 'Azul Estádio',
    '#1B2D5C', '#FEDD00', '#FFFFFF',
    '/images/products/brasil-ii-front.jpg',
    '/images/products/brasil-ii-back.jpg',
    150,
    'Camisa reserva SpaceFut na paleta azul/preto da edição II Copa 2026. Modelagem feminina, tecido respirável de alta performance, gola V em ribana e cuts atléticos. Personalize com seu nome e número.',
    null, true, 4
  );

-- Inventory inicial: 0 unidades em todos os tamanhos (admin vai ajustar)
insert into inventory (product_id, size, quantity)
select p.id, s.size, 0
from products p
cross join (values ('P'), ('M'), ('G'), ('GG'), ('XGG')) s(size);

-- Site settings iniciais (textos editáveis pelo admin)
insert into site_settings (key, value) values
  ('hero', '{"badge":"Coleção Copa 2026","title_top":"Veste o Brasil.","title_bottom":"Faz história.","subtitle":"Camisas oficiais I e II da Seleção, masculinas e femininas. Personalize com seu nome e número.","cta_label":"Comprar agora"}'),
  ('personalization', '{"price_per_letter":2,"price_per_number":3,"name_max":12}'),
  ('shipping', '{"default_cost_brl":5,"default_label":"Frete fixo R$ 5,00 para todo o Brasil."}'),
  ('catalog_section', '{"eyebrow":"Coleção 2026","title":"Camisas da Seleção"}');
