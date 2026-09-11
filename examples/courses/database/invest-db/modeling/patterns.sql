-- standalone: padrões práticos de modelagem (soft delete, timestamps, colunas computadas, concorrência otimista, histórico de valores)

-- #region schema
-- 1. Usuário com Soft Delete e Índice Parcial de Unicidade
CREATE TABLE user_account (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT    NOT NULL,
  name       TEXT    NOT NULL,
  created_at TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT    NULL -- NULL significa ativo; data preenchida indica exclusão lógica
) STRICT;

-- Garante que e-mails sejam únicos apenas entre contas ativas (deleted_at IS NULL).
-- Se um usuário for excluído logicamente, o mesmo e-mail pode ser cadastrado novamente.
CREATE UNIQUE INDEX idx_user_active_email ON user_account (email) WHERE deleted_at IS NULL;

-- Trigger para manter updated_at sincronizado a cada alteração
CREATE TRIGGER trg_user_account_updated_at
AFTER UPDATE ON user_account
FOR EACH ROW
WHEN NEW.deleted_at IS OLD.deleted_at
BEGIN
  UPDATE user_account SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id; END;

-- 2. Itens de Pedido com Coluna Computada (STORED)
CREATE TABLE order_item (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id     INTEGER NOT NULL,
  product_name TEXT    NOT NULL,
  quantity     INTEGER NOT NULL CHECK (quantity > 0),
  unit_price   INTEGER NOT NULL CHECK (unit_price >= 0), -- em centavos
  -- Coluna gerada: calculada e persistida automaticamente no disco
  total_amount INTEGER GENERATED ALWAYS AS (quantity * unit_price) STORED
) STRICT;

-- 3. Produto com Controle de Concorrência Otimista (Optimistic Locking) e Status
CREATE TABLE product (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  price      INTEGER NOT NULL CHECK (price >= 0),
  stock      INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  status     TEXT    NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  version    INTEGER NOT NULL DEFAULT 1 -- incrementado a cada update para prevenir lost updates
) STRICT;

-- 4. Histórico Temporal de Preços (SCD Tipo 2 com vigência)
CREATE TABLE product_price_history (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id  INTEGER NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  price       INTEGER NOT NULL CHECK (price >= 0),
  valid_from  TEXT    NOT NULL, -- início da vigência do preço
  valid_to    TEXT    NULL      -- NULL indica o preço atual vigente
) STRICT;

-- Garante que exista apenas um preço ativo (valid_to IS NULL) por produto
CREATE UNIQUE INDEX idx_current_product_price ON product_price_history (product_id) WHERE valid_to IS NULL;
-- #endregion schema

-- #region demo-soft-delete
-- Inserção inicial de usuário
INSERT INTO user_account (email, name) VALUES ('carlos@example.com', 'Carlos Silva');

-- Exclusão lógica (soft delete)
UPDATE user_account SET deleted_at = CURRENT_TIMESTAMP WHERE email = 'carlos@example.com';

-- Novo cadastro com o mesmo e-mail: o índice parcial aceita porque o anterior foi excluído
INSERT INTO user_account (email, name) VALUES ('carlos@example.com', 'Carlos Silva (Nova Conta)');

-- Consulta de usuários ativos (padrão da aplicação)
SELECT id, email, name, deleted_at FROM user_account WHERE deleted_at IS NULL;
-- #endregion demo-soft-delete

-- #region demo-computed
-- Inserção de itens de pedido: total_amount é calculado automaticamente
INSERT INTO order_item (order_id, product_name, quantity, unit_price) VALUES
  (101, 'Teclado Mecânico', 2, 25000),
  (101, 'Mouse Ergonômico', 1, 15000);

-- Leitura com valor total em reais
SELECT product_name, quantity, unit_price / 100.0 AS price, total_amount / 100.0 AS total
FROM order_item
WHERE order_id = 101;
-- #endregion demo-computed

-- #region demo-concurrency
-- Inserção de produto para teste de concorrência
INSERT INTO product (name, price, stock, status, version) VALUES ('Monitor 4K', 200000, 10, 'published', 1);

-- Cliente A lê o produto na versão 1 e realiza a compra com sucesso
UPDATE product
SET stock = stock - 1, version = version + 1
WHERE id = 1 AND version = 1;

-- Cliente B tenta atualizar com base na versão antiga (1): nenhuma linha é afetada (conflito detectado)
UPDATE product
SET stock = stock - 1, version = version + 1
WHERE id = 1 AND version = 1;

-- Estado final do produto com versão incrementada
SELECT id, name, stock, status, version FROM product WHERE id = 1;
-- #endregion demo-concurrency

-- #region demo-history
-- Inserção de vigências de preço para o produto 1
INSERT INTO product_price_history (product_id, price, valid_from, valid_to) VALUES
  (1, 180000, '2026-01-01 00:00:00', '2026-06-01 00:00:00'),
  (1, 200000, '2026-06-01 00:00:00', NULL); -- preço atual

-- Consulta do preço vigente atual
SELECT product_id, price / 100.0 AS current_price, valid_from
FROM product_price_history
WHERE product_id = 1 AND valid_to IS NULL;

-- Consulta temporal: qual era o preço em 15 de março de 2026?
SELECT product_id, price / 100.0 AS historic_price
FROM product_price_history
WHERE product_id = 1
  AND '2026-03-15 10:00:00' >= valid_from
  AND ('2026-03-15 10:00:00' < valid_to OR valid_to IS NULL);
-- #endregion demo-history
