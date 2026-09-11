-- ==============================================================================
-- PostgreSQL: Dialeto e Recursos Avançados do SQL no Domínio InvestApp
-- ==============================================================================

-- 1. Cláusula RETURNING em Inserções e Atualizações
-- Permite obter IDs gerados e valores calculados sem fazer um segundo SELECT
INSERT INTO investment (name, value, category, notes)
VALUES ('Fundo Imobiliário XP Malls', 8500.00, 'FIIs', '{"broker": "XP", "ticker": "XPML11"}')
RETURNING id, name, created_at;

-- 2. Upsert com ON CONFLICT DO UPDATE
-- Tenta inserir e, se violar uma restrição UNIQUE, atualiza a linha existente
CREATE TABLE IF NOT EXISTS asset_price (
  ticker      TEXT PRIMARY KEY,
  price       NUMERIC(10, 2) NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO asset_price (ticker, price)
VALUES ('VALE3', 65.20)
ON CONFLICT (ticker)
DO UPDATE SET
  price = EXCLUDED.price,
  updated_at = now()
RETURNING ticker, price, updated_at;

-- 3. Operadores Avançados de JSONB com Indexação GIN
-- @> testa contenção; -> extrai objeto JSON; ->> extrai valor textual; ? testa existência de chave
SELECT name, notes ->> 'broker' AS corretora
FROM investment
WHERE notes ? 'ticker' AND notes @> '{"broker": "XP"}';

-- 4. Busca Case-Insensitive com ILIKE e Deduplicação com DISTINCT ON
-- DISTINCT ON devolve a primeira linha de cada grupo definido na ordenação
SELECT DISTINCT ON (category)
  category, name, value, created_at
FROM investment
WHERE name ILIKE '%tesouro%' OR name ILIKE '%fundo%'
ORDER BY category, value DESC;

-- 5. Tipos de Dados em Arrays Nativos e Funções
CREATE TABLE IF NOT EXISTS investor_tags (
  user_id  INTEGER PRIMARY KEY,
  tags     TEXT[] NOT NULL,
  scores   INTEGER[] NOT NULL
);

INSERT INTO investor_tags (user_id, tags, scores)
VALUES (1, ARRAY['conservador', 'renda-fixa', 'longo-prazo'], '{90, 85, 95}');

-- Consulta se o array contém o elemento 'conservador'
SELECT user_id, tags
FROM investor_tags
WHERE 'conservador' = ANY(tags);
