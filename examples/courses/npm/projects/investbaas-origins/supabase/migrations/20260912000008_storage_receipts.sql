-- Sprint 5 (TK05-1, TK05-2, TK05-7): bucket privado de comprovantes.

-- #region bucket
-- Criado por migration, e nao pelo painel, para ser reproduzivel. public = false
-- e a linha que importa: so quem passa por uma policy le, e so por URL assinada.
-- Limite de tamanho e lista de tipos valem para qualquer cliente, inclusive um curl.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'receipts',
  'receipts',
  false,
  5 * 1024 * 1024,
  array['application/pdf', 'image/png', 'image/jpeg']
);
-- #endregion

-- #region policies
-- O Storage guarda cada objeto como uma linha de storage.objects, e o RLS vale
-- ali como em qualquer tabela. A regra e uma so: o primeiro segmento do path
-- e o auth.uid() de quem chama. Nao ha policy de update: comprovante nao se
-- edita, substitui-se por outro upload.
create policy "receipts: dono envia" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "receipts: dono le" on storage.objects
  for select to authenticated
  using (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "receipts: dono remove" on storage.objects
  for delete to authenticated
  using (bucket_id = 'receipts' and (storage.foldername(name))[1] = auth.uid()::text);
-- #endregion

-- #region stats
-- Contagem agregada para o admin: quantos comprovantes existem e quando foi o
-- ultimo upload, sem listar um arquivo sequer. security definer para ler
-- storage.objects inteiro; o exists restringe a role = 'admin'.
create function public.admin_receipts_stats()
returns table (total bigint, last_upload timestamptz)
language sql
security definer
set search_path = public, storage
as $$
  -- A agregacao vai por fora do exists: count(*) sempre devolve uma linha, e um
  -- investidor receberia (0, null) em vez de nada.
  select total, last_upload
  from (
    select count(*) as total, max(created_at) as last_upload
    from storage.objects
    where bucket_id = 'receipts'
  ) stats
  where exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

revoke execute on function public.admin_receipts_stats() from public, anon;
grant execute on function public.admin_receipts_stats() to authenticated, service_role;
-- #endregion
