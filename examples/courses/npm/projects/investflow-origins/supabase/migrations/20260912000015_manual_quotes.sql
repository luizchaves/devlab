-- Sprint 8 (TK08-5): a cotacao informada a mao entra no historico. Ate aqui
-- quotes_history so recebia escrita da Edge Function (chave de servico); agora
-- o dono do ativo tambem grava, e a policy continua passando pelo ativo.

-- #region policy
grant insert, update on public.quotes_history to authenticated;

create policy "quotes: dono do ativo registra cotacao manual" on public.quotes_history
  for insert with check (
    exists (
      select 1 from public.assets a
      where a.id = quotes_history.asset_id and a.user_id = auth.uid()
    )
  );

create policy "quotes: dono do ativo corrige cotacao manual" on public.quotes_history
  for update using (
    exists (
      select 1 from public.assets a
      where a.id = quotes_history.asset_id and a.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.assets a
      where a.id = quotes_history.asset_id and a.user_id = auth.uid()
    )
  );
-- #endregion
