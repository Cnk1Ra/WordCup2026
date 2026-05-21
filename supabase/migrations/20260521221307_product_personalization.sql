-- Flag pra marcar produtos que aceitam personalização (nome+número).
-- Por padrão FALSE — só os "Brasil" originais usam personalização.

alter table products
  add column if not exists allows_personalization boolean not null default false;

-- Ativa pra os 4 originais
update products
set allows_personalization = true
where slug in (
  'brasil-i-amarela-masculina',
  'brasil-i-amarela-feminina',
  'brasil-ii-azul-masculina',
  'brasil-ii-azul-feminina'
);
