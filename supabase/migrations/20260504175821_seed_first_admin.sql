-- Seed do primeiro admin (Fabricio - dono)
-- O email precisa estar registrado em admins ANTES do primeiro login.
-- O usuário em si (auth.users) é criado quando ele clica no link mágico.
insert into admins (email, name, role)
values ('fabrcarvalho02@gmail.com', 'Fabricio', 'owner')
on conflict (email) do update
set name = excluded.name, role = excluded.role;
