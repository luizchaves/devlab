-- Criação de banco de dados analítico
CREATE DATABASE IF NOT EXISTS invest_olap;

USE invest_olap;

-- Tabela colunar principal com motor MergeTree
CREATE TABLE IF NOT EXISTS transacoes_investimentos (
    id UInt64,
    usuario_id UInt32,
    ativo LowCardinality(String),
    tipo_ativo LowCardinality(String),
    quantidade Decimal(18, 4),
    preco_unitario Decimal(18, 2),
    valor_total Decimal(18, 2),
    data_operacao DateTime,
    corretora LowCardinality(String),
    pais LowCardinality(FixedString(2))
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(data_operacao)
ORDER BY (tipo_ativo, ativo, data_operacao, usuario_id);

-- Carga inicial de dados simulados
INSERT INTO transacoes_investimentos VALUES
(1, 101, 'PETR4', 'Ações', 100, 38.50, 3850.00, '2026-01-15 10:30:00', 'XP Investimentos', 'BR'),
(2, 102, 'VALE3', 'Ações', 50, 68.20, 3410.00, '2026-01-16 11:15:00', 'BTG Pactual', 'BR'),
(3, 101, 'Tesouro Selic 2029', 'Renda Fixa', 1, 14250.00, 14250.00, '2026-02-01 09:00:00', 'NuInvest', 'BR'),
(4, 103, 'IVVB11', 'ETF', 20, 310.00, 6200.00, '2026-02-10 14:45:00', 'XP Investimentos', 'BR'),
(5, 104, 'AAPL', 'BDR', 15, 95.00, 1425.00, '2026-02-15 16:00:00', 'Avenue', 'US'),
(6, 102, 'PETR4', 'Ações', 200, 39.10, 7820.00, '2026-03-01 10:05:00', 'BTG Pactual', 'BR'),
(7, 105, 'KNRI11', 'FII', 40, 155.00, 6200.00, '2026-03-05 13:20:00', 'XP Investimentos', 'BR'),
(8, 101, 'VALE3', 'Ações', 80, 67.50, 5400.00, '2026-03-10 15:30:00', 'NuInvest', 'BR');

-- View materializada com agregação contínua
CREATE TABLE IF NOT EXISTS resumo_diario_ativos (
    data_operacao Date,
    ativo LowCardinality(String),
    total_operacoes UInt32,
    volume_financeiro Decimal(18, 2)
) ENGINE = SummingMergeTree((total_operacoes, volume_financeiro))
ORDER BY (data_operacao, ativo);

CREATE MATERIALIZED VIEW IF NOT EXISTS mv_resumo_diario TO resumo_diario_ativos AS
SELECT
    toDate(data_operacao) AS data_operacao,
    ativo,
    count() AS total_operacoes,
    sum(valor_total) AS volume_financeiro
FROM transacoes_investimentos
GROUP BY data_operacao, ativo;
