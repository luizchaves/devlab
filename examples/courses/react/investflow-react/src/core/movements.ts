import type { AssetWithTransactions, TransactionFact } from './portfolio';

// #region types
/** Um lançamento com o ativo ao lado, como o extrato mostra (CA09.14). */
export type Movement = TransactionFact & { assetId: string; ticker: string; name: string; currency: 'BRL' | 'USD'; total: number };

export type MovementKpis = { netInvested: number; totalBuys: number; totalSells: number; count: number };
// #endregion

// #region list
/** Extrato de compras e vendas (o `update` não é movimentação), do mais recente ao mais antigo. */
export function movements(assets: AssetWithTransactions[], { rateOf = () => 1 }: { rateOf?: (month: string) => number } = {}): Movement[] {
  const list: Movement[] = [];
  for (const asset of assets) {
    for (const t of asset.transactions) {
      if (t.type === 'update') continue;
      const rate = asset.currency === 'USD' ? rateOf(t.transactionDate.slice(0, 7)) : 1;
      list.push({ ...t, assetId: asset.id, ticker: asset.ticker, name: asset.name, currency: asset.currency, total: t.quantity * t.price * rate });
    }
  }
  return list.sort((a, b) => b.transactionDate.localeCompare(a.transactionDate));
}

/** KPIs de fluxo: aportado líquido, compras, vendas e a contagem (CA09.12). */
export function movementKpis(list: Movement[]): MovementKpis {
  const totalBuys = list.filter((m) => m.type === 'buy').reduce((sum, m) => sum + m.total, 0);
  const totalSells = list.filter((m) => m.type === 'sell').reduce((sum, m) => sum + m.total, 0);
  return { netInvested: totalBuys - totalSells, totalBuys, totalSells, count: list.length };
}

/** Aportes líquidos agrupados por mês, na janela pedida (CA09.13). */
export function monthlyMovements(list: Movement[], range: 'all' | '2y' | '1y', now = new Date()): { month: string; buys: number; sells: number }[] {
  const from = range === 'all' ? '' : new Date(Date.UTC(now.getUTCFullYear() - (range === '2y' ? 2 : 1), now.getUTCMonth(), 1)).toISOString().slice(0, 7);
  const map = new Map<string, { month: string; buys: number; sells: number }>();
  for (const m of list) {
    const month = m.transactionDate.slice(0, 7);
    if (month < from) continue;
    const acc = map.get(month) ?? { month, buys: 0, sells: 0 };
    if (m.type === 'buy') acc.buys += m.total;
    else acc.sells += m.total;
    map.set(month, acc);
  }
  return [...map.values()].sort((a, b) => a.month.localeCompare(b.month));
}
// #endregion
