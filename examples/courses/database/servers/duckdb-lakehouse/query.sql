-- #region extensions
INSTALL iceberg;
LOAD iceberg;
INSTALL httpfs;
LOAD httpfs;
-- #endregion

-- #region setup-s3
-- Configuração de credenciais para leitura de Object Storage (MinIO ou S3)
SET s3_endpoint = '127.0.0.1:9000';
SET s3_use_ssl = false;
SET s3_url_style = 'path';
SET s3_access_key_id = 'admin';
SET s3_secret_access_key = 'admin123';
-- #endregion

-- #region analytics-parquet
-- Consulta analítica direta sobre múltiplos arquivos Parquet particionados
SELECT 
    symbol,
    date_trunc('month', quote_date) AS month,
    avg(close_price) AS avg_close,
    max(high_price) AS max_high,
    min(low_price) AS min_low,
    sum(volume) AS total_volume
FROM read_parquet('s3://invest-lakehouse/market_data/year=2026/*/*.parquet')
GROUP BY symbol, month
ORDER BY symbol, month;
-- #endregion

-- #region time-travel
-- Consulta de viagem no tempo (Time Travel) sobre tabela Iceberg
SELECT * FROM iceberg_scan('s3://invest-lakehouse/iceberg/transactions', snapshot_id => 4829104810928301923)
WHERE amount > 50000;
-- #endregion
