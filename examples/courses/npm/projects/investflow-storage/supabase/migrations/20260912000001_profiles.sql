-- Sprint 2 (TK02-6): perfil publico vinculado a auth.users.
--
-- auth.users pertence ao Supabase e nao recebe colunas de dominio. Nome de
-- exibicao e papel moram em public.profiles, com o MESMO id.

-- #region table
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role text not null default 'investor' check (role in ('investor', 'admin')),
  created_at timestamptz not null default now()
);
-- #endregion

-- #region grants
-- Duas camadas, e as duas explicitas. O GRANT decide QUAIS operacoes e QUAIS
-- colunas cada papel alcanca; a policy RLS decide QUAIS linhas. Uma conta
-- autenticada le o proprio perfil e edita so o nome: sem o grant por coluna,
-- qualquer pessoa poderia se promover a admin pelo SDK. Anonimo nao ve nada.
grant select, update (full_name) on public.profiles to authenticated;
grant all on public.profiles to service_role;
-- #endregion

-- #region rls
-- Ligado antes da primeira policy: sem policy, a tabela fica fechada para todos.
alter table public.profiles enable row level security;

create policy "profiles: dono le" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: dono edita" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
-- #endregion

-- #region trigger
-- security definer: roda com os privilegios de quem criou a funcao, e nao do
-- usuario recem-cadastrado, que ainda nao tem policy de insert. O search_path
-- fixo fecha a brecha classica dessa opcao (objeto homonimo em outro schema).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
-- #endregion
