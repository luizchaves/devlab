-- Sprint 3 (TK03-3): uma observacao de preco por ativo e por dia.

-- #region quotes_history
create table public.quotes_history (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid not null references public.assets (id) on delete cascade,
  price numeric(14, 4) not null check (price >= 0),
  quote_date date not null,
  created_at timestamptz not null default now(),
  -- A chave unica e o que torna a atualizacao da Sprint 4 idempotente.
  unique (asset_id, quote_date)
);
-- #endregion
