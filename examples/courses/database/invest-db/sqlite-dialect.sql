-- ==============================================================================
-- SQLite: Dialeto e Peculiaridades do SQL no Domínio InvestApp
-- ==============================================================================

-- 1. Ativação de Chaves Estrangeiras e Modo WAL via PRAGMA
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- 2. Tabela com Modo STRICT (tipagem rígida introduzida no SQLite 3.37+)
CREATE TABLE IF NOT EXISTS asset_price (
  ticker      TEXT PRIMARY KEY,
  price       REAL NOT NULL,
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
) STRICT;

-- 3. Upsert com ON CONFLICT DO UPDATE
INSERT INTO asset_price (ticker, price)
VALUES ('VALE3', 65.20)
ON CONFLICT (ticker) DO UPDATE SET
  price = excluded.price,
  updated_at = datetime('now');

-- 4. Funções de Data e Hora (strftime, datetime, date)
-- O SQLite não possui tipo DATE nativo; guarda como TEXT ISO-8601 ou INTEGER Unix
SELECT
  ticker,
  price,
  strftime('%d/%m/%Y %H:%M:%S', updated_at) AS data_formatada,
  date(updated_at, '+30 days') AS vencimento_simulado
FROM asset_price;

-- 5. Suporte a JSON Nativo com Operadores e json_extract
CREATE TABLE IF NOT EXISTS user_settings (
  user_id   INTEGER PRIMARY KEY,
  profile   TEXT CHECK (json_valid(profile))
);

INSERT INTO user_settings (user_id, profile)
VALUES (1, '{"theme": "dark", "notifications": {"email": true, "sms": false}}');

SELECT
  user_id,
  profile ->> '$.theme' AS tema_escolhido,
  json_extract(profile, '$.notifications.email') AS notifica_email
FROM user_settings;

-- 6. Tabelas Otimizadas WITHOUT ROWID
-- Elimina a coluna oculta rowid para economizar espaço em chaves compostas
CREATE TABLE IF NOT EXISTS portfolio_item (
  user_id     INTEGER NOT NULL,
  asset_code  TEXT NOT NULL,
  quantity    INTEGER NOT NULL,
  PRIMARY KEY (user_id, asset_code)
) WITHOUT ROWID;
