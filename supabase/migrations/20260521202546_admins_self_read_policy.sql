-- Permite que o usuário autenticado leia a própria linha na tabela `admins`.
-- Sem essa policy, getCurrentAdmin() (que roda com a JWT do usuário, não com
-- service_role) retornava null mesmo com auth.getUser() OK, e o layout do
-- painel redirecionava de volta pra /admin/login.

create policy "admins_self_read" on admins
  for select
  using (
    auth.uid() = user_id
    or auth.jwt() ->> 'email' = email
  );
