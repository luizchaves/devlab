-- Sprint 7 (TK07-1, TK07-4): duas leituras novas dos mesmos fatos. Nenhuma tabela nova.

-- #region allocation_by_origin
-- Valor atual por ativo com as tres dimensoes de origem. Agrupar fica para o
-- front: a mesma linha alimenta o treemap por corretora, categoria ou emissor.
create view public.allocation_by_origin with (security_invoker = true) as
select a.user_id,
       a.id as asset_id,
       a.ticker,
       coalesce(b.name, 'Sem corretora') as broker,
       a.category,
       coalesce(a.issuer, 'Sem emissor') as issuer,
       case
         when a.category in ('renda_fixa', 'fundos') then greatest(public.position_at(a.id, current_date), 0)
         else greatest(public.position_at(a.id, current_date), 0) * coalesce(a.current_price, 0) * (case when a.currency = 'USD' then public.get_usd_rate(current_date) else 1.0 end)
       end as value
from public.assets a
left join public.brokers b on b.id = a.broker_id;

grant select on public.allocation_by_origin to authenticated, service_role;
-- #endregion

-- #region portfolio_evolution
-- Mes a mes, por ativo: o que foi aportado ate ali (compras menos vendas, ao
-- preco de cada transacao) e o que a posicao valia na ultima cotacao do mes.
-- A distancia entre as duas linhas e o resultado acumulado. Mes sem cotacao
-- nao gera linha: lacuna, nao zero.
create view public.portfolio_evolution with (security_invoker = true) as
with months as (
  select a.id as asset_id, a.user_id, date_trunc('month', q.quote_date)::date as month,
         max(q.quote_date) as last_quote_date
  from public.assets a
  join public.quotes_history q on q.asset_id = a.id
  group by a.id, a.user_id, 3
)
select m.user_id,
       m.asset_id,
       m.month,
       case
         when public.position_at(m.asset_id, (m.month + interval '1 month - 1 day')::date) <= 0.000001 then 0
         else coalesce((
           select sum(case when t.type = 'buy' then t.quantity * t.price when t.type = 'sell' then -t.quantity * t.price else 0 end)
           from public.transactions t
           where t.asset_id = m.asset_id and t.transaction_date <= (m.month + interval '1 month - 1 day')::date
         ), 0) * (case when a.currency = 'USD' then public.get_usd_rate(m.month) else 1.0 end)
       end as invested,
       public.position_at(m.asset_id, (m.month + interval '1 month - 1 day')::date)
         * (select price from public.quotes_history where asset_id = m.asset_id and quote_date = m.last_quote_date)
         * (case when a.currency = 'USD' then public.get_usd_rate(m.month) else 1.0 end) as value
from months m
join public.assets a on a.id = m.asset_id;

grant select on public.portfolio_evolution to authenticated, service_role;
-- #endregion
