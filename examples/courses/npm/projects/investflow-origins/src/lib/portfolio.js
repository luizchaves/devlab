// #region summarize
/**
 * Indicadores de uma posicao a partir dos fatos: recebe o ativo com as
 * transacoes aninhadas e devolve numeros. Sem fetch, sem DOM: funcao pura.
 *
 * Venda baixa o custo pelo preco medio, nao pelo preco de venda: o que sai da
 * carteira e o custo daquela quantidade; a diferenca e resultado realizado.
 */
export function summarize(asset, { usdRate = 1 } = {}) {
  let quantity = 0;
  let cost = 0;
  let realized = 0;

  // O PostgREST devolve numeric como STRING, para nao perder precisao: converter e obrigatorio.
  const sorted = [...(asset.transactions ?? [])].sort((a, b) =>
    a.transaction_date.localeCompare(b.transaction_date)
  );

  for (const t of sorted) {
    const qty = Number(t.quantity);
    const price = Number(t.price);

    if (t.type === 'update') {
      quantity = qty;
      cost = qty * price;
      realized = 0;
    } else if (t.type === 'buy') {
      quantity += qty;
      cost += qty * price;
    } else if (t.type === 'sell') {
      const averagePrice = quantity ? cost / quantity : 0;
      realized += qty * (price - averagePrice);
      cost -= qty * averagePrice;
      quantity -= qty;
    }
  }

  const currentPrice = asset.current_price == null ? null : Number(asset.current_price);
  const value = currentPrice == null ? null : quantity * currentPrice;
  const isUsd = asset.currency === 'USD';
  const rate = isUsd ? (typeof usdRate === 'number' && usdRate > 0 ? usdRate : 1) : 1;

  return {
    quantity,
    cost,
    averagePrice: quantity ? cost / quantity : 0,
    value,
    realized,
    unrealized: value == null ? null : value - cost,
    returnPct: value == null || cost === 0 ? null : (value - cost) / cost,
    currency: asset.currency || 'BRL',
    isUsd,
    usdRate: rate,
    costBRL: isUsd ? cost * rate : cost,
    valueBRL: isUsd ? (value == null ? null : value * rate) : value,
    realizedBRL: isUsd ? realized * rate : realized,
    unrealizedBRL:
      isUsd && value != null ? (value - cost) * rate : value == null ? null : value - cost,
  };
}
// #endregion

// #region historical-brl
/**
 * Resultado de um ativo em USD medido em reais com o cambio de cada compra, e nao
 * com o cambio de hoje: e o que separa a valorizacao do ativo do efeito do dolar.
 * `rateMap` e 'AAAA-MM' -> cotacao USD/BRL do mes; mes sem taxa usa `latestRate`.
 */
export function summarizeInBRL(asset, { rateMap = new Map(), latestRate = 1 } = {}) {
  const rateOf = (date) => {
    const rate = Number(rateMap.get(date.slice(0, 7)));
    return rate > 0 ? rate : latestRate;
  };
  const isUsd = asset.currency === 'USD';
  let quantity = 0;
  let cost = 0;

  const sorted = [...(asset.transactions ?? [])].sort((a, b) =>
    a.transaction_date.localeCompare(b.transaction_date)
  );
  for (const t of sorted) {
    const qty = Number(t.quantity);
    const price = Number(t.price) * (isUsd ? rateOf(t.transaction_date) : 1);
    if (t.type === 'update') {
      quantity = qty;
      cost = qty * price;
    } else if (t.type === 'buy') {
      quantity += qty;
      cost += qty * price;
    } else if (t.type === 'sell') {
      const averagePrice = quantity ? cost / quantity : 0;
      cost -= qty * averagePrice;
      quantity -= qty;
    }
  }

  const currentPrice = asset.current_price == null ? null : Number(asset.current_price);
  const value = currentPrice == null ? null : quantity * currentPrice * (isUsd ? latestRate : 1);
  return {
    cost,
    value,
    unrealized: value == null ? null : value - cost,
    returnPct: value == null || cost === 0 ? null : (value - cost) / cost,
  };
}
// #endregion

// #region flows
/**
 * Fluxo liquido de aportes por mes ('AAAA-MM' -> compras menos vendas), em reais
 * pelo cambio do mes quando o ativo e em USD. E o fluxo que a matriz de
 * rentabilidade desconta da variacao do valor.
 */
export function monthlyFlows(asset, { rateMap = new Map(), latestRate = 1 } = {}) {
  const isUsd = asset.currency === 'USD';
  const flows = new Map();
  for (const t of asset.transactions ?? []) {
    const month = t.transaction_date.slice(0, 7);
    const rate = isUsd ? Number(rateMap.get(month)) || latestRate : 1;
    if (t.type === 'update') continue;
    const amount = Number(t.quantity) * Number(t.price) * rate;
    flows.set(month, (flows.get(month) ?? 0) + (t.type === 'buy' ? amount : -amount));
  }
  return flows;
}
// #endregion

// #region totals
/** Soma as posicoes da carteira convertidas em BRL. Ativos sem cotacao usam o saldo/custo como valor final. */
export function totals(assets, { usdRate = 1 } = {}) {
  return assets.reduce(
    (acc, asset) => {
      const s = summarize(asset, { usdRate });
      acc.cost += s.costBRL;
      acc.value += s.valueBRL ?? s.costBRL;
      acc.realized += s.realizedBRL;
      return acc;
    },
    { cost: 0, value: 0, realized: 0 }
  );
}
// #endregion

// #region duration
/**
 * Calcula o tempo decorrido do investimento (duração).
 * Se a posição ainda estiver aberta, calcula do primeiro aporte até a data de referência (hoje).
 * Se a posição foi liquidada (zerada), calcula do primeiro aporte até a última venda.
 */
export function investmentDuration(transactions, referenceDate = new Date()) {
  if (!transactions || transactions.length === 0) {
    return { text: '—', subtitle: 'Sem lançamentos', diffDays: 0, isClosed: false };
  }

  const sorted = [...transactions].sort((a, b) =>
    a.transaction_date.localeCompare(b.transaction_date)
  );

  const firstDateStr = sorted[0].transaction_date;
  const firstDate = new Date(`${firstDateStr}T12:00:00`);

  let currentQty = 0;
  for (const t of sorted) {
    if (t.type === 'update') currentQty = Number(t.quantity);
    else currentQty += t.type === 'buy' ? Number(t.quantity) : -Number(t.quantity);
  }
  const isClosed = currentQty <= 0.000001;

  const lastDateStr = sorted[sorted.length - 1].transaction_date;
  const endDate = isClosed ? new Date(`${lastDateStr}T12:00:00`) : new Date(referenceDate);

  const diffTime = Math.max(0, endDate.getTime() - firstDate.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let totalMonths =
    (endDate.getFullYear() - firstDate.getFullYear()) * 12 +
    (endDate.getMonth() - firstDate.getMonth());
  if (endDate.getDate() < firstDate.getDate()) {
    totalMonths -= 1;
  }
  totalMonths = Math.max(0, totalMonths);

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  let text = '';
  if (years > 0 && months > 0) {
    text = `${years} ${years === 1 ? 'ano' : 'anos'} e ${months} ${months === 1 ? 'mês' : 'meses'}`;
  } else if (years > 0) {
    text = `${years} ${years === 1 ? 'ano' : 'anos'}`;
  } else if (months > 0) {
    text = `${months} ${months === 1 ? 'mês' : 'meses'}`;
  } else {
    text = `${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`;
  }

  const firstDateFormatted = firstDate.toLocaleDateString('pt-BR');
  let subtitle = '';
  if (isClosed) {
    const lastDateFormatted = new Date(`${lastDateStr}T12:00:00`).toLocaleDateString('pt-BR');
    subtitle = `Encerrado em ${lastDateFormatted}`;
  } else {
    subtitle = `Início em ${firstDateFormatted}`;
  }

  return {
    text,
    subtitle,
    diffDays,
    isClosed,
    firstDate: firstDateStr,
    lastDate: lastDateStr,
  };
}
// #endregion

// #region format
export const formatBRL = (n) =>
  n == null ? '—' : n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatUSD = (n) =>
  n == null ? '—' : n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export const formatCurrency = (n, currency = 'BRL') =>
  currency === 'USD' ? formatUSD(n) : formatBRL(n);

export const formatPct = (n) =>
  n == null
    ? '—'
    : `${n >= 0 ? '+' : ''}${(n * 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`;

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const clean = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  const parts = clean.split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  return dateStr;
};

export const truncateText = (text, maxLength = 24) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
};

export const CATEGORY_LABELS = {
  renda_fixa: 'Renda Fixa',
  acoes: 'Ações',
  fiis: 'FII',
  etfs: 'ETF',
  fi_infra: 'FI-Infra',
  fundos: 'Fundos',
  cripto: 'Cripto',
};

export const CATEGORY_BADGES = {
  renda_fixa: 'badge-renda-fixa',
  acoes: 'badge-acoes',
  fiis: 'badge-fiis',
  etfs: 'badge-etfs',
  fi_infra: 'badge-fi-infra',
  fundos: 'badge-fundos',
  cripto: 'badge-cripto',
};
// #endregion
