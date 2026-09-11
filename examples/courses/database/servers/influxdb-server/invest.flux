// ==============================================================================
// InfluxDB: Consultas Flux para Agregação Temporal no Domínio InvestApp
// ==============================================================================

// 1. Filtrar preços da VALE3 nas últimas 24 horas
from(bucket: "investments")
  |> range(start: -24h)
  |> filter(fn: (r) => r._measurement == "quotes" and r.ticker == "VALE3" and r._field == "price")

// 2. Média móvel e agregação por janela temporal de 1 hora (Downsampling)
from(bucket: "investments")
  |> range(start: -7d)
  |> filter(fn: (r) => r._measurement == "quotes" and r._field == "price")
  |> aggregateWindow(every: 1h, fn: mean, createEmpty: false)
  |> yield(name: "hourly_mean_price")

// 3. Mínimo, Máximo e Volume Total negociado por ativo
from(bucket: "investments")
  |> range(start: -30d)
  |> filter(fn: (r) => r._measurement == "quotes")
  |> group(columns: ["ticker", "_field"])
  |> sum()
