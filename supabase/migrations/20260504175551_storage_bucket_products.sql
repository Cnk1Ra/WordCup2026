-- Storage bucket pra imagens de produtos (acesso público em leitura)
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- Policy: leitura pública (qualquer um pode ler imagens)
create policy "products_public_read" on storage.objects
  for select using (bucket_id = 'products');

-- Policy: upload/update/delete só via service_role (admin)
-- (sem policies pra insert/update/delete = só service_role consegue, que é o que queremos)
