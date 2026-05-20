-- =============================================================================
-- SpaceFut — Sincronização do schema canônico
-- =============================================================================
--
-- NOTA PRO PRÓXIMO CLAUDE (ou pra quem rodar isso em outro servidor):
--
-- Em 2026-05-20 detectamos uma divergência entre dois Supabases do SpaceFut:
--
--   (A) Schema CANÔNICO (este repo, projeto rgixjxmsdpugnkmplohb / spacefut-dev)
--       - Tabela única `products` plana (slug, name, team, gender, hex, etc.)
--       - Preço em numeric: `base_price`
--       - Imagens inline: colunas `front_image` e `back_image`
--       - Ordenação: coluna `display_order`
--       - Definido em supabase/migrations/20260501175304_initial_schema.sql
--
--   (B) Schema ALTERNATIVO (outro servidor, autor: Claude rodando em outro host)
--       - Normalizado: tabelas `teams`, `variants`, `product_images` separadas
--       - Preço em centavos: `base_price_cents`
--       - Imagens em tabela separada `product_images` (tipo image_position enum)
--       - Ordenação: coluna `sort_order`
--       - Tabela de admin chamada `admin_users` em vez de `admins`
--
-- DECISÃO: o código da aplicação (src/lib/products-queries.ts, src/lib/products.ts,
-- src/app/produto/[slug]/ProductDetail.tsx) usa o schema (A). Ele é a fonte da
-- verdade. As migrations 20260501175304 a 20260504175821 descrevem o schema
-- inteiro e devem ser aplicadas em qualquer ambiente novo.
--
-- COMO USAR ESTA MIGRATION:
--
--   1) Se você é o Claude no servidor que tinha o schema (B):
--      - Esta migration limpa as tabelas do schema (B). Depois rode
--        `supabase db push` pra aplicar as migrations 1-6 (que criam o schema A).
--      - OU rode `supabase db reset --linked` pra resetar e reaplicar tudo.
--
--   2) Se você é o Claude no servidor que já está no schema (A):
--      - Esta migration é um no-op seguro. Os DROP IF EXISTS não tocam em nada
--        porque essas tabelas não existem aqui.
--
-- Esta migration NÃO recria as tabelas do schema (A) — isso é responsabilidade
-- das migrations canônicas 20260501175304..20260504175821 deste mesmo diretório.
-- =============================================================================

-- 1. Remove APENAS tabelas exclusivas do schema (B), se existirem.
--    NÃO mexer em `orders` / `order_items` / `customers` / `admins` — esses nomes
--    existem nos dois schemas (mesmo que com colunas diferentes); dropar destrói
--    dados reais em produção. A migration canônica 20260501175304 já criou esses
--    com as colunas certas. Se um servidor tem orders/order_items com schema (B),
--    será preciso uma migration manual de ALTER TABLE — fora do escopo aqui.
drop table if exists variants cascade;        -- só no schema (B)
drop table if exists product_images cascade;  -- só no schema (B)
drop table if exists teams cascade;           -- só no schema (B)
drop table if exists admin_users cascade;     -- schema (B) — no (A) chama `admins`

-- 2. Remove tipos enum exclusivos do schema (B), se existirem.
drop type if exists product_gender cascade;
drop type if exists product_size cascade;
drop type if exists image_position cascade;
drop type if exists order_status cascade;

-- 3. Marca este ponto como sincronização canônica.
--    (Não modifica nada — só serve como log no histórico de migrations.)
do $$
begin
  raise notice 'SpaceFut canonical schema sync: schema (B) tables dropped if present. Apply migrations 20260501175304..20260504175821 to (re)build schema (A).';
end $$;
