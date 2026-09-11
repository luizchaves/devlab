-- ==============================================================================
-- Apache Cassandra: Modelagem Orientada a Consultas e Operações CQL no InvestApp
-- ==============================================================================

-- 1. Criação do Keyspace (Equivalente ao Banco/Database)
CREATE KEYSPACE IF NOT EXISTS invest
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

USE invest;

-- 2. Tabela de Transações de Investimento por Usuário
-- Partition Key: user_id (determina o nó que guarda o dado)
-- Clustering Key: transaction_time (determina a ordenação física dentro do nó)
CREATE TABLE IF NOT EXISTS user_transactions (
    user_id uuid,
    transaction_time timestamp,
    transaction_id uuid,
    asset_code text,
    operation_type text, -- 'BUY', 'SELL', 'DIVIDEND'
    amount decimal,
    unit_price decimal,
    PRIMARY KEY ((user_id), transaction_time, transaction_id)
) WITH CLUSTERING ORDER BY (transaction_time DESC, transaction_id ASC);

-- 3. Tabela de Posição de Carteira por Ativo (Modelagem Desnormalizada)
CREATE TABLE IF NOT EXISTS asset_investors (
    asset_code text,
    user_id uuid,
    user_name text,
    shares_count int,
    total_invested decimal,
    last_updated timestamp,
    PRIMARY KEY ((asset_code), user_id)
);

-- 4. Inserção de Registros com Geração de UUIDs e Timestamp
INSERT INTO user_transactions (user_id, transaction_time, transaction_id, asset_code, operation_type, amount, unit_price)
VALUES (
    a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d,
    '2024-03-01 10:30:00+0000',
    uuid(),
    'VALE3',
    'BUY',
    6500.00,
    65.00
) USING TTL 31536000; -- Expiração automática em 1 ano (365 dias)

INSERT INTO user_transactions (user_id, transaction_time, transaction_id, asset_code, operation_type, amount, unit_price)
VALUES (
    a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d,
    '2024-03-05 14:15:00+0000',
    uuid(),
    'TESOURO_SELIC',
    'BUY',
    3500.00,
    150.00
);

-- 5. Consultas Eficientes por Chave de Partição
-- Consulta direta na partição exata do usuário com intervalo de datas
SELECT transaction_time, asset_code, operation_type, amount
FROM user_transactions
WHERE user_id = a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d
  AND transaction_time >= '2024-03-01 00:00:00+0000'
  AND transaction_time <= '2024-03-31 23:59:59+0000';
