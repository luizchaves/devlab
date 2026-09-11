-- standalone: modelo do InvestApp (carteira de investimentos por usuário)

-- #region schema
CREATE TABLE user (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL UNIQUE,
  created_at TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
) STRICT;

CREATE TABLE category (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT    NOT NULL UNIQUE
) STRICT;

CREATE TABLE investment (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES category(id),
  name        TEXT    NOT NULL,
  -- centavos em inteiro: sem erro de arredondamento
  amount      INTEGER NOT NULL CHECK (amount > 0),
  created_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
) STRICT;

-- Histórico: o valor de cada investimento em cada data, nunca sobrescrito
CREATE TABLE quote (
  investment_id INTEGER NOT NULL REFERENCES investment(id) ON DELETE CASCADE,
  quoted_on     TEXT    NOT NULL,
  amount        INTEGER NOT NULL CHECK (amount >= 0),
  PRIMARY KEY (investment_id, quoted_on)
) STRICT;

CREATE INDEX idx_investment_user ON investment (user_id);
-- #endregion schema

-- #region check
INSERT INTO user (name, email) VALUES ('Ana', 'ana@example.com');
INSERT INTO category (name) VALUES ('Pós'), ('Pré');
INSERT INTO investment (user_id, category_id, name, amount) VALUES
  (1, 1, 'Tesouro Selic 2029', 1000000),
  (1, 2, 'CDB Banco X', 500000);
INSERT INTO quote VALUES (1, '2026-09-01', 1010000), (1, '2026-09-10', 1015000), (2, '2026-09-10', 502000);

-- A carteira de Ana com a última cotação de cada investimento
SELECT investment.name, category.name AS category, MAX(quote.quoted_on) AS last_quote,
       quote.amount / 100.0 AS value
FROM investment
JOIN category ON category.id = investment.category_id
JOIN quote ON quote.investment_id = investment.id
WHERE investment.user_id = 1
GROUP BY investment.id;
-- #endregion check
