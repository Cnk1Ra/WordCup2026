-- Hierarquia de categorias: parent_id permite subcategorias.
-- Top-level: Brasileirão, Seleção Brasileira, etc. + categorias-pai como "Clubes Internacionais".
-- Subcategorias-filhas: Premiere League, La Liga, Serie A (filhas de Clubes Internacionais).

alter table categories
  add column if not exists parent_id uuid references categories(id) on delete set null;

create index if not exists idx_categories_parent on categories(parent_id);
