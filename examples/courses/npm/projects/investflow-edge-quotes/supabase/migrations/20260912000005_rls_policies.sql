-- Sprint 3 (TK03-4, TK03-5, TK03-9): grants, RLS, policies e indices.

-- #region grants
-- Nesta versao do Supabase uma tabela nova nao concede nada a ninguem: cada
-- operacao e explicita. Anonimo nao alcanca tabela de dominio alguma.
grant select, insert, update, delete on public.brokers to authenticated;
grant select, insert, update, delete on public.assets to authenticated;
grant select, insert, update, delete on public.transactions to authenticated;
grant select on public.quotes_history to authenticated;
grant all on public.brokers, public.assets, public.transactions, public.quotes_history to service_role;
-- #endregion

-- #region enable
-- Ligado antes da primeira policy: sem policy, a tabela fica fechada para todos.
alter table public.brokers enable row level security;
alter table public.assets enable row level security;
alter table public.transactions enable row level security;
alter table public.quotes_history enable row level security;
-- #endregion

-- #region policies
-- Quatro operacoes, quatro regras. USING filtra as linhas que ja existem;
-- WITH CHECK julga a linha que esta tentando entrar.
create policy "brokers: dono le" on public.brokers for select using (auth.uid() = user_id);
create policy "brokers: dono insere" on public.brokers for insert with check (auth.uid() = user_id);
create policy "brokers: dono edita" on public.brokers for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "brokers: dono remove" on public.brokers for delete using (auth.uid() = user_id);

create policy "assets: dono le" on public.assets for select using (auth.uid() = user_id);
create policy "assets: dono insere" on public.assets for insert with check (auth.uid() = user_id);
create policy "assets: dono edita" on public.assets for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "assets: dono remove" on public.assets for delete using (auth.uid() = user_id);

create policy "transactions: dono le" on public.transactions for select using (auth.uid() = user_id);
create policy "transactions: dono insere" on public.transactions for insert with check (auth.uid() = user_id);
create policy "transactions: dono edita" on public.transactions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "transactions: dono remove" on public.transactions for delete using (auth.uid() = user_id);
-- #endregion

-- #region quotes-policy
-- quotes_history nao tem user_id: a leitura passa pelo ativo. Escrita sem
-- policy: so a Edge Function da Sprint 4 grava, com a chave de servico.
create policy "quotes: dono do ativo le" on public.quotes_history
  for select using (
    exists (
      select 1 from public.assets a
      where a.id = quotes_history.asset_id and a.user_id = auth.uid()
    )
  );
-- #endregion

-- #region indexes
-- Toda consulta filtra por user_id (o RLS faz isso em cada linha) e ordena
-- por ativo e data. Sem indice, o custo cresce com o numero de contas.
create index brokers_user_id_idx on public.brokers (user_id);
create index assets_user_id_idx on public.assets (user_id);
create index assets_broker_id_idx on public.assets (broker_id);
create index transactions_user_id_idx on public.transactions (user_id);
create index transactions_asset_date_idx on public.transactions (asset_id, transaction_date);
create index quotes_history_asset_date_idx on public.quotes_history (asset_id, quote_date desc);
-- #endregion
