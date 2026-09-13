-- Sprint 9: Taxas de Câmbio (USDBRL) para suporte a ativos internacionais em Dólar.

-- #region exchange_rates
create table if not exists public.exchange_rates (
  id uuid primary key default gen_random_uuid(),
  from_currency text not null default 'USD',
  to_currency text not null default 'BRL',
  rate numeric(14, 4) not null check (rate > 0),
  rate_date date not null,
  created_at timestamptz not null default now(),
  unique (from_currency, to_currency, rate_date)
);

grant select on public.exchange_rates to authenticated, anon;
grant all on public.exchange_rates to service_role;

alter table public.exchange_rates enable row level security;

drop policy if exists "exchange_rates: leitura para autenticados e anon" on public.exchange_rates;
create policy "exchange_rates: leitura para autenticados e anon" on public.exchange_rates
  for select using (true);

create index if not exists exchange_rates_date_idx on public.exchange_rates (from_currency, to_currency, rate_date desc);
-- #endregion

-- #region get_usd_rate
-- Retorna a taxa USDBRL mais próxima na data informada (ou anterior).
create or replace function public.get_usd_rate(p_date date default current_date)
returns numeric
language sql
stable
as $$
  select coalesce(
    (
      select rate from public.exchange_rates
      where from_currency = 'USD' and to_currency = 'BRL' and rate_date <= p_date
      order by rate_date desc
      limit 1
    ),
    (
      select rate from public.exchange_rates
      where from_currency = 'USD' and to_currency = 'BRL'
      order by rate_date asc
      limit 1
    ),
    1.0
  );
$$;

grant execute on function public.get_usd_rate(date) to authenticated, anon, service_role;
-- #endregion
