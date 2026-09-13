-- Sprint 3 (TK03-1, TK03-10): corretoras e ativos.

-- #region brokers
-- Instituicao de custodia, por investidor. Nasce sozinha quando um ativo cita
-- um nome novo (TK03-10), como no InvestApp.
create table public.brokers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);
-- #endregion

-- #region assets
-- O instrumento que esta na carteira: o que e, de que categoria, onde esta
-- custodiado (broker_id), quem o emite ou administra (issuer) e a que preco esta.
-- numeric, nunca real: R$ 9,8750 nao existe em ponto flutuante binario.
create table public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  broker_id uuid references public.brokers (id) on delete set null,
  ticker text not null,
  name text not null,
  category text not null
    check (category in ('renda_fixa', 'acoes', 'fiis', 'fundos', 'cripto')),
  issuer text,
  current_price numeric(14, 4) check (current_price is null or current_price >= 0),
  created_at timestamptz not null default now(),
  -- Unico por dono, nao no sistema: duas contas podem ter PETR4.
  unique (user_id, ticker)
);
-- #endregion
