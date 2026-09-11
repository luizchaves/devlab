-- #region table
CREATE TABLE investment (
  id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       TEXT NOT NULL,
  value      NUMERIC(14, 2) NOT NULL CHECK (value >= 0),
  category   TEXT NOT NULL,
  notes      JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- #endregion table

-- #region seed
INSERT INTO investment (name, value, category, notes) VALUES
  ('Tesouro Selic 2029', 10000.00, 'Pós', '{"broker": "Tesouro Direto", "liquidity": "D+1"}'),
  ('Tesouro IPCA 2029', 25000.50, 'Pós', '{"broker": "Tesouro Direto", "liquidity": "D+1"}'),
  ('CDB Banco X', 5000.00, 'Pré', '{"broker": "Banco X", "fgc": true}');
-- #endregion seed

-- #region queries
SELECT id, name, value, category FROM investment;

SELECT category, SUM(value) AS total FROM investment GROUP BY category ORDER BY category;
-- #endregion queries

-- #region jsonb
-- O operador ->> extrai um campo do JSONB como texto; @> testa se o documento contém o par
SELECT name, notes ->> 'broker' AS broker
FROM investment
WHERE notes @> '{"fgc": true}';
-- #endregion jsonb
