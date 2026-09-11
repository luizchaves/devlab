-- ==============================================================================
-- MySQL: Dialeto e Recursos Específicos do SQL no Domínio InvestApp
-- ==============================================================================

-- 1. Upsert com ON DUPLICATE KEY UPDATE
CREATE TABLE IF NOT EXISTS asset_price (
  ticker      VARCHAR(20) PRIMARY KEY,
  price       DECIMAL(10, 2) NOT NULL,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB;

INSERT INTO asset_price (ticker, price)
VALUES ('VALE3', 65.20)
ON DUPLICATE KEY UPDATE
  price = VALUES(price);

-- 2. Cláusulas REPLACE INTO e INSERT IGNORE
-- INSERT IGNORE ignora erros de chave duplicada silenciosamente sem abortar o script
INSERT IGNORE INTO asset_price (ticker, price)
VALUES ('VALE3', 66.00);

-- REPLACE INTO remove a linha antiga e insere uma nova com a mesma chave primária
REPLACE INTO asset_price (ticker, price)
VALUES ('VALE3', 65.80);

-- 3. Tipos ENUM e SET Nativos com Validação Estrita
CREATE TABLE IF NOT EXISTS investor_preferences (
  user_id     INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  risk_level  ENUM('Baixo', 'Médio', 'Alto') NOT NULL DEFAULT 'Baixo',
  channels    SET('Email', 'SMS', 'Push', 'WhatsApp') NOT NULL
) ENGINE = InnoDB;

INSERT INTO investor_preferences (name, risk_level, channels)
VALUES ('Lucas Chaves', 'Médio', 'Email,WhatsApp,Push');

-- Consulta utilizando operadores do tipo SET
SELECT name, risk_level, channels
FROM investor_preferences
WHERE FIND_IN_SET('WhatsApp', channels) > 0;

-- 4. Manipulação de JSON Nativo com Operadores e Funções
-- O operador -> extrai JSON bruto; ->> extrai valor sem aspas (unquote)
SELECT
  id,
  name,
  notes->>'$.broker' AS corretora,
  JSON_CONTAINS(notes, 'true', '$.fgc') AS tem_fgc
FROM investment
WHERE notes IS NOT NULL;
