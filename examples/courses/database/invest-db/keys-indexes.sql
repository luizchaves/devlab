-- #region natural-surrogate
-- Chave natural: o valor já identifica a linha no mundo real, mas pode mudar
CREATE TABLE Country (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

-- Chave substituta: gerada pelo banco, estável, sem significado
CREATE TABLE Broker (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  country_code TEXT NOT NULL REFERENCES Country(code)
);

INSERT INTO Country VALUES ('BR', 'Brasil'), ('US', 'Estados Unidos');
INSERT INTO Broker (name, country_code) VALUES ('Tesouro Direto', 'BR'), ('Banco X', 'BR');

-- A chave natural muda de nome sem quebrar nada; mudar o código quebraria as referências
UPDATE Country SET name = 'República Federativa do Brasil' WHERE code = 'BR';
UPDATE Country SET code = 'BRA' WHERE code = 'BR';
-- #endregion natural-surrogate

-- #region constraints
-- UNIQUE composto: o mesmo nome pode existir em corretoras diferentes, nunca na mesma
CREATE TABLE Asset (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  broker_id INTEGER NOT NULL REFERENCES Broker(id),
  symbol    TEXT    NOT NULL,
  price     REAL    NOT NULL CHECK (price > 0),
  UNIQUE (broker_id, symbol)
);

INSERT INTO Asset (broker_id, symbol, price) VALUES (1, 'SELIC29', 100.0), (2, 'SELIC29', 101.0);

-- Mesma corretora e mesmo símbolo: recusado
INSERT INTO Asset (broker_id, symbol, price) VALUES (1, 'SELIC29', 99.0);

-- Preço zero: recusado pelo CHECK
INSERT INTO Asset (broker_id, symbol, price) VALUES (1, 'IPCA29', 0);
-- #endregion constraints

-- #region index
-- Um índice acelera a busca por uma coluna que não é chave
CREATE INDEX idx_post_category ON Post (category);

-- O planejador passa a usar o índice em vez de varrer a tabela
EXPLAIN QUERY PLAN SELECT title FROM Post WHERE category = 'Tecnologia';

-- Índices existentes na tabela, inclusive os criados por UNIQUE
SELECT name, sql FROM sqlite_master WHERE type = 'index' AND tbl_name IN ('Post', 'Asset');
-- #endregion index
