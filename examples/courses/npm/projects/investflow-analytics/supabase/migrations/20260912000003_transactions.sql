-- Sprint 3 (TK03-2): a transacao e um fato imutavel. Um erro vira outra
-- transacao; a posicao e sempre derivada daqui.

-- #region transactions
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  -- Repetido de proposito: a policy compara auth.uid() com uma coluna da
  -- PROPRIA tabela, sem join.
  user_id uuid not null references public.profiles (id) on delete cascade,
  asset_id uuid not null references public.assets (id) on delete cascade,
  type text not null check (type in ('buy', 'sell')),
  quantity numeric(18, 8) not null check (quantity > 0),
  price numeric(14, 4) not null check (price >= 0),
  transaction_date date not null default current_date,
  receipt_path text,
  created_at timestamptz not null default now()
);
-- #endregion
