// #region types
export type AssetCategory = 'renda_fixa' | 'acoes' | 'fiis' | 'etfs' | 'fi_infra' | 'fundos' | 'cripto';
export type Currency = 'BRL' | 'USD';
export type TransactionType = 'buy' | 'sell' | 'update';

/** Lançamento como o cliente o vê: números já convertidos e data em `AAAA-MM-DD`. */
export type TransactionFact = {
  id: string;
  type: TransactionType;
  quantity: number;
  price: number;
  transactionDate: string;
  receiptPath: string | null;
};

/** Ativo com o que a carteira e a tela do ativo precisam, incluindo os lançamentos. */
export type AssetWithTransactions = {
  id: string;
  ticker: string;
  name: string;
  category: AssetCategory;
  currency: Currency;
  issuer: string | null;
  broker: { id: string; name: string } | null;
  currentPrice: number | null;
  transactions: TransactionFact[];
  /** Histórico de proventos (fase 8); vazio para categorias sem proventos por cota. */
  dividends: { id: string; rate: number; exDate: string; paymentDate: string }[];
};

export const CATEGORIES: AssetCategory[] = ['renda_fixa', 'acoes', 'fiis', 'etfs', 'fi_infra', 'fundos', 'cripto'];

export const CATEGORY_LABELS: Record<AssetCategory, string> = {
  renda_fixa: 'Renda Fixa',
  acoes: 'Ações',
  fiis: 'FII',
  etfs: 'ETF',
  fi_infra: 'FI-Infra',
  fundos: 'Fundos',
  cripto: 'Cripto',
};

/** Categorias com cotação de mercado; as demais valem o próprio saldo. */
export const QUOTED_CATEGORIES: AssetCategory[] = ['acoes', 'fiis', 'etfs', 'fi_infra', 'cripto'];
export const BALANCE_CATEGORIES: AssetCategory[] = ['renda_fixa', 'fundos'];
// #endregion

// #region summarize
export type PositionSummary = {
  quantity: number;
  cost: number;
  averagePrice: number;
  value: number | null;
  realized: number;
  unrealized: number | null;
  returnPct: number | null;
  currency: Currency;
  costBRL: number;
  valueBRL: number | null;
  realizedBRL: number;
};

/**
 * Indicadores de uma posição a partir dos fatos: recebe o ativo com os
 * lançamentos e devolve números. Sem fetch, sem React: função pura.
 *
 * Venda baixa o custo pelo preço médio, não pelo preço de venda: o que sai da
 * carteira é o custo daquela quantidade; a diferença vira resultado realizado.
 * Um lançamento `update` redefine posição e custo pelo saldo informado.
 */
export function summarize(
  asset: Pick<AssetWithTransactions, 'transactions' | 'currentPrice' | 'currency' | 'category'>,
  { usdRate = 1 } = {}
): PositionSummary {
  let quantity = 0;
  let cost = 0;
  let realized = 0;

  const sorted = [...asset.transactions].sort((a, b) => a.transactionDate.localeCompare(b.transactionDate));

  for (const t of sorted) {
    if (t.type === 'update') {
      quantity = t.quantity;
      cost = t.quantity * t.price;
      realized = 0;
    } else if (t.type === 'buy') {
      quantity += t.quantity;
      cost += t.quantity * t.price;
    } else {
      const averagePrice = quantity ? cost / quantity : 0;
      realized += t.quantity * (t.price - averagePrice);
      cost -= t.quantity * averagePrice;
      quantity -= t.quantity;
    }
  }

  // Ativo por saldo (renda fixa, fundos) vale o próprio saldo, sem depender de
  // cotação; posição zerada vale zero mesmo sem cotação (ordena antes de tudo).
  const byBalance = BALANCE_CATEGORIES.includes(asset.category);
  const closed = quantity <= 0.000001;
  const value = byBalance ? cost : closed ? 0 : asset.currentPrice == null ? null : quantity * asset.currentPrice;
  const rate = asset.currency === 'USD' && usdRate > 0 ? usdRate : 1;

  return {
    quantity,
    cost,
    averagePrice: quantity ? cost / quantity : 0,
    value,
    realized,
    unrealized: value == null ? null : value - cost,
    returnPct: value == null || cost === 0 ? null : (value - cost) / cost,
    currency: asset.currency,
    costBRL: cost * rate,
    valueBRL: value == null ? null : value * rate,
    realizedBRL: realized * rate,
  };
}
// #endregion

// #region totals
export type PortfolioTotals = {
  cost: number;
  value: number;
  realized: number;
  unrealized: number;
  returnPct: number | null;
  activeAssets: number;
};

/** Soma as posições em reais. Ativo sem cotação entra pelo custo, para não sumir do total. */
export function totals(assets: AssetWithTransactions[], { usdRate = 1 } = {}): PortfolioTotals {
  const acc = { cost: 0, value: 0, realized: 0, activeAssets: 0 };

  for (const asset of assets) {
    const s = summarize(asset, { usdRate });
    acc.cost += s.costBRL;
    acc.value += s.valueBRL ?? s.costBRL;
    acc.realized += s.realizedBRL;
    if (s.quantity > 0.000001 || asset.transactions.length === 0) acc.activeAssets += 1;
  }

  return {
    ...acc,
    unrealized: acc.value - acc.cost,
    returnPct: acc.cost === 0 ? null : (acc.value - acc.cost) / acc.cost,
  };
}
// #endregion

// #region duration
export type Duration = {
  text: string;
  subtitle: string;
  days: number;
  isClosed: boolean;
};

/**
 * Tempo da posição: aberta conta do primeiro aporte até hoje; encerrada, até a
 * última venda (CA08.16).
 */
export function investmentDuration(transactions: TransactionFact[], referenceDate = new Date()): Duration {
  if (transactions.length === 0) {
    return { text: '—', subtitle: 'Sem lançamentos', days: 0, isClosed: false };
  }

  const sorted = [...transactions].sort((a, b) => a.transactionDate.localeCompare(b.transactionDate));
  const first = new Date(`${sorted[0].transactionDate}T12:00:00`);
  const lastDate = sorted[sorted.length - 1].transactionDate;

  let quantity = 0;
  for (const t of sorted) {
    if (t.type === 'update') quantity = t.quantity;
    else quantity += t.type === 'buy' ? t.quantity : -t.quantity;
  }
  const isClosed = quantity <= 0.000001;
  const end = isClosed ? new Date(`${lastDate}T12:00:00`) : new Date(referenceDate);

  const days = Math.max(0, Math.floor((end.getTime() - first.getTime()) / 86_400_000));
  let months = (end.getFullYear() - first.getFullYear()) * 12 + (end.getMonth() - first.getMonth());
  if (end.getDate() < first.getDate()) months -= 1;
  months = Math.max(0, months);

  const years = Math.floor(months / 12);
  const rest = months % 12;
  const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

  let text: string;
  if (years > 0 && rest > 0) text = `${plural(years, 'ano', 'anos')} e ${plural(rest, 'mês', 'meses')}`;
  else if (years > 0) text = plural(years, 'ano', 'anos');
  else if (rest > 0) text = plural(rest, 'mês', 'meses');
  else text = plural(days, 'dia', 'dias');

  const format = (date: Date) => date.toLocaleDateString('pt-BR');
  const subtitle = isClosed ? `Encerrado em ${format(end)}` : `Início em ${format(first)}`;

  return { text, subtitle, days, isClosed };
}
// #endregion

// #region position-at
/**
 * Posição do ativo em uma data: o último `update` até ali, mais as compras e
 * vendas posteriores a ele. É a `position_at()` do banco vanilla, em memória.
 */
export function positionAt(transactions: TransactionFact[], date: string): number {
  const upTo = transactions.filter((t) => t.transactionDate <= date).sort((a, b) => a.transactionDate.localeCompare(b.transactionDate));
  let quantity = 0;
  for (const t of upTo) {
    if (t.type === 'update') quantity = t.quantity;
    else quantity += t.type === 'buy' ? t.quantity : -t.quantity;
  }
  return quantity;
}

/** Custo acumulado até a data, pelas mesmas regras de `summarize`. */
export function costAt(transactions: TransactionFact[], date: string): number {
  return summarize({ transactions: transactions.filter((t) => t.transactionDate <= date), currentPrice: null, currency: 'BRL', category: 'acoes' }).cost;
}
// #endregion

// #region historical-brl
/**
 * Resultado de um ativo em USD medido em reais com o câmbio de cada compra,
 * e não com o de hoje: é o que separa a valorização do ativo do efeito do
 * dólar (CA10.6). `rateOf` devolve a taxa do mês; o valor atual usa `latestRate`.
 */
export function summarizeInBRL(asset: Pick<AssetWithTransactions, 'transactions' | 'currentPrice' | 'currency' | 'category'>, { rateOf, latestRate }: { rateOf: (month: string) => number; latestRate: number }) {
  const isUsd = asset.currency === 'USD';
  let quantity = 0;
  let cost = 0;
  for (const t of [...asset.transactions].sort((a, b) => a.transactionDate.localeCompare(b.transactionDate))) {
    const price = t.price * (isUsd ? rateOf(t.transactionDate.slice(0, 7)) : 1);
    if (t.type === 'update') {
      quantity = t.quantity;
      cost = t.quantity * price;
    } else if (t.type === 'buy') {
      quantity += t.quantity;
      cost += t.quantity * price;
    } else {
      const averagePrice = quantity ? cost / quantity : 0;
      cost -= t.quantity * averagePrice;
      quantity -= t.quantity;
    }
  }
  const byBalance = BALANCE_CATEGORIES.includes(asset.category);
  const value = byBalance ? cost : asset.currentPrice == null ? null : quantity * asset.currentPrice * (isUsd ? latestRate : 1);
  return { cost, value, unrealized: value == null ? null : value - cost, returnPct: value == null || cost === 0 ? null : (value - cost) / cost };
}
// #endregion
