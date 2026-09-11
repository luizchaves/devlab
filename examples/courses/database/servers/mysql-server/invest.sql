-- #region table
CREATE TABLE investment (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(120) NOT NULL,
  value      DECIMAL(14, 2) NOT NULL CHECK (value >= 0),
  category   ENUM('Pré', 'Pós') NOT NULL,
  notes      JSON,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;
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

-- #region json
-- JSON_EXTRACT lê um caminho; JSON_UNQUOTE remove as aspas do resultado
SELECT name, JSON_UNQUOTE(JSON_EXTRACT(notes, '$.broker')) AS broker
FROM investment
WHERE JSON_EXTRACT(notes, '$.fgc') = true;
-- #endregion json

-- #region enum
-- Um valor fora do ENUM é recusado no modo estrito, padrão no MySQL 8
INSERT INTO investment (name, value, category) VALUES ('Fundo Z', 1000, 'Híbrido');
-- #endregion enum
