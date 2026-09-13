-- Sprint 8: historico de proventos/dividendos por ativo e por data.

-- #region dividends_history
create table if not exists public.dividends_history (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets (id) on delete cascade,
  rate numeric(14, 4) not null check (rate >= 0),
  ex_date date not null,
  payment_date date not null,
  created_at timestamptz not null default now(),
  unique (asset_id, ex_date)
);

grant select, insert, update, delete on public.dividends_history to authenticated;
grant all on public.dividends_history to service_role;

alter table public.dividends_history enable row level security;

drop policy if exists "dividends: dono do ativo le" on public.dividends_history;
create policy "dividends: dono do ativo le" on public.dividends_history
  for select using (
    exists (
      select 1 from public.assets a
      where a.id = dividends_history.asset_id and a.user_id = auth.uid()
    )
  );

drop policy if exists "dividends: dono do ativo insere" on public.dividends_history;
create policy "dividends: dono do ativo insere" on public.dividends_history
  for insert with check (
    exists (
      select 1 from public.assets a
      where a.id = dividends_history.asset_id and a.user_id = auth.uid()
    )
  );

drop policy if exists "dividends: dono do ativo edita" on public.dividends_history;
create policy "dividends: dono do ativo edita" on public.dividends_history
  for update using (
    exists (
      select 1 from public.assets a
      where a.id = dividends_history.asset_id and a.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.assets a
      where a.id = dividends_history.asset_id and a.user_id = auth.uid()
    )
  );

drop policy if exists "dividends: dono do ativo remove" on public.dividends_history;
create policy "dividends: dono do ativo remove" on public.dividends_history
  for delete using (
    exists (
      select 1 from public.assets a
      where a.id = dividends_history.asset_id and a.user_id = auth.uid()
    )
  );

create index if not exists dividends_history_asset_date_idx on public.dividends_history (asset_id, payment_date desc);
-- #endregion
