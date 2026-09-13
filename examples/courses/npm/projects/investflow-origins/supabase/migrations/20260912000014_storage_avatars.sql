-- Bucket público para fotos de avatar e suporte na tabela profiles.

-- #region bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2 * 1024 * 1024,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 2 * 1024 * 1024,
  allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
-- #endregion

-- #region table
alter table public.profiles add column if not exists avatar_url text;
grant select, update (full_name, avatar_url) on public.profiles to authenticated;
-- #endregion

-- #region policies
create policy "avatars: leitura publica" on storage.objects
  for select
  using (bucket_id = 'avatars');

create policy "avatars: dono envia" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars: dono atualiza" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "avatars: dono remove" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
-- #endregion
