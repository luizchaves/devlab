-- Sprint 4 (TK04-7): resumo operacional de cada execucao de update-quotes.

-- #region quote_runs
create table public.quote_runs (
  id uuid primary key default gen_random_uuid(),
  ran_at timestamptz not null default now(),
  requested integer not null,
  updated integer not null,
  failed jsonb not null default '[]'::jsonb
);

-- So a Edge Function grava (chave de servico). Ninguem le pela chave anonima;
-- a Sprint 6 abre a leitura para role = 'admin'.
grant all on public.quote_runs to service_role;
alter table public.quote_runs enable row level security;
-- #endregion
