-- Sprint 6 (TK06-5, TK06-6): metricas agregadas e leitura de quote_runs, so para admin.

-- #region is_admin
-- Uma unica definicao de "e admin", reutilizada por funcoes e policies.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
grant execute on function public.is_admin() to authenticated, service_role;
-- #endregion

-- #region admin_metrics
-- UMA linha: contas, AUM (a soma de todas as carteiras) e a ultima execucao de
-- cotacoes. A agregacao acontece dentro da funcao: devolver uma linha por
-- conta para o JavaScript somar ja teria exposto o patrimonio de cada pessoa.
-- O exists fica por fora da agregacao, como na Sprint 5.
create function public.admin_metrics()
returns table (active_accounts bigint, aum numeric, last_quote_run timestamptz)
language sql
security definer
set search_path = public
as $$
  select active_accounts, aum, last_quote_run
  from (
    select
      (select count(*) from public.profiles) as active_accounts,
      (select coalesce(sum(public.position_at(a.id, current_date) * coalesce(a.current_price, 0)), 0)
         from public.assets a) as aum,
      (select max(ran_at) from public.quote_runs) as last_quote_run
  ) m
  where public.is_admin();
$$;

revoke execute on function public.admin_metrics() from public, anon;
grant execute on function public.admin_metrics() to authenticated, service_role;
-- #endregion

-- #region quote_runs_policy
grant select on public.quote_runs to authenticated;

create policy "quote_runs: admin le" on public.quote_runs
  for select using (public.is_admin());
-- #endregion

-- #region ping
-- Sonda barata para o status do painel: responde sem tocar em tabela de dominio.
create function public.ping()
returns text
language sql
stable
as $$ select 'pong'::text $$;
grant execute on function public.ping() to authenticated, service_role;
-- #endregion
