// #region summarize
/**
 * Indicadores de uma posicao a partir dos fatos: recebe o ativo com as
 * transacoes aninhadas e devolve numeros. Sem fetch, sem DOM: funcao pura.
 *
 * Venda baixa o custo pelo preco medio, nao pelo preco de venda: o que sai da
 * carteira e o custo daquela quantidade; a diferenca e resultado realizado.
 */
export function summarize(asset) {
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

    if (t.type === 'buy') {
      quantity += qty;
      cost += qty * price;
    } else {
      const averagePrice = quantity ? cost / quantity : 0;
      realized += qty * (price - averagePrice);
      cost -= qty * averagePrice;
      quantity -= qty;
    }
  }

  const currentPrice = asset.current_price == null ? null : Number(asset.current_price);
  const value = currentPrice == null ? null : quantity * currentPrice;

  return {
    quantity,
    cost,
    averagePrice: quantity ? cost / quantity : 0,
    value,
    realized,
    unrealized: value == null ? null : value - cost,
    returnPct: value == null || cost === 0 ? null : (value - cost) / cost,
  };
}
// #endregion

// #region totals
/** Soma as posicoes da carteira. Ativos sem cotacao entram no custo, nao no valor. */
export function totals(assets) {
  return assets.reduce(
    (acc, asset) => {
      const s = summarize(asset);
      acc.cost += s.cost;
      acc.value += s.value ?? 0;
      acc.realized += s.realized;
      return acc;
    },
    { cost: 0, value: 0, realized: 0 }
  );
}
// #endregion

// #region format
export const formatBRL = (n) =>
  n == null ? '—' : n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatPct = (n) =>
  n == null
    ? '—'
    : `${n >= 0 ? '+' : ''}${(n * 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`;

export const CATEGORY_LABELS = {
  renda_fixa: 'Renda Fixa',
  acoes: 'Ações',
  fiis: 'FIIs',
  fundos: 'Fundos',
  cripto: 'Cripto',
};

export const CATEGORY_BADGES = {
  renda_fixa: 'badge-renda-fixa',
  acoes: 'badge-acoes',
  fiis: 'badge-fiis',
  fundos: 'badge-fundos',
  cripto: 'badge-cripto',
};
// #endregion
