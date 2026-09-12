-- Sprint 6 (TK06-1, TK06-4): leituras derivadas dos fatos, por investidor.

-- #region position
-- Posicao de um ativo em uma data: compras menos vendas ate ali. Reutilizada
-- pelas duas views abaixo e pela Sprint 7.
create function public.position_at(p_asset_id uuid, p_date date)
returns numeric
language sql
stable
as $$
  select coalesce(sum(case when type = 'buy' then quantity else -quantity end), 0)
  from public.transactions
  where asset_id = p_asset_id and transaction_date <= p_date;
$$;
grant execute on function public.position_at(uuid, date) to authenticated, service_role;
-- #endregion

-- #region monthly_returns
-- O retorno de um mes e a variacao do patrimonio DESCONTADOS os aportes: se a
-- carteira valia 10.000, recebeu 1.000 de compras e fechou em 11.500, o ganho
-- de mercado foi 500. Patrimonio do mes = posicao x ultima cotacao do mes.
--
-- security_invoker: a view roda com os privilegios de quem consulta, entao o
-- auth.uid() das policies de assets e transactions continua filtrando. Sem
-- isso ela rodaria como o dono (postgres) e devolveria a matriz de todo mundo.
create view public.monthly_returns with (security_invoker = true) as
with month_value as (
  select a.user_id,
         date_trunc('month', q.quote_date)::date as month,
         sum(public.position_at(a.id, q.quote_date) * q.price) as value
  from public.assets a
  join public.quotes_history q on q.asset_id = a.id
  where q.quote_date = (
    select max(quote_date) from public.quotes_history
    where asset_id = a.id and date_trunc('month', quote_date) = date_trunc('month', q.quote_date)
  )
  group by a.user_id, 2
),
month_flow as (
  select user_id,
         date_trunc('month', transaction_date)::date as month,
         sum(case when type = 'buy' then quantity * price else -quantity * price end) as net_flow
  from public.transactions
  group by user_id, 2
)
select v.user_id,
       v.month,
       v.value,
       coalesce(f.net_flow, 0) as net_flow,
       v.value
         - coalesce(lag(v.value) over (partition by v.user_id order by v.month), 0)
         - coalesce(f.net_flow, 0) as return_brl
from month_value v
left join month_flow f on f.user_id = v.user_id and f.month = v.month;

grant select on public.monthly_returns to authenticated, service_role;
-- #endregion

-- #region allocation
-- Distribuicao por classe: posicao atual x cotacao atual, por categoria.
create view public.allocation_by_category with (security_invoker = true) as
select a.user_id,
       a.category,
       sum(public.position_at(a.id, current_date) * coalesce(a.current_price, 0)) as value
from public.assets a
group by a.user_id, a.category;

grant select on public.allocation_by_category to authenticated, service_role;
-- #endregion
