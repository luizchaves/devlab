import { describe, expect, it } from 'vitest';
import { filterAssets, footerTotals, isAssetActive } from './organize';
import type { AssetWithTransactions, TransactionFact } from './portfolio';

const tx = (type: TransactionFact['type'], quantity: number, price: number, transactionDate: string): TransactionFact => ({ id: `${type}-${transactionDate}`, type, quantity, price, transactionDate, receiptPath: null });
const asset = (id: string, transactions: TransactionFact[], currentPrice: number | null = 40): AssetWithTransactions => ({ id, ticker: id, name: id, category: 'acoes', currency: 'BRL', issuer: null, broker: null, currentPrice, transactions, dividends: [] });

const open = asset('OPEN', [tx('buy', 10, 30, '2026-01-10')]);
const closed = asset('CLOSED', [tx('buy', 10, 30, '2026-01-10'), tx('sell', 10, 35, '2026-02-10')]);
const fresh = asset('FRESH', []);

describe('organização da carteira', () => {
  it('CA08.13 — "ativas" esconde os zerados; "todos" os mostra; sem lançamento conta como ativo', () => {
    expect(isAssetActive(fresh)).toBe(true);
    expect(isAssetActive(closed)).toBe(false);
    expect(filterAssets([open, closed, fresh], 'active').map((a) => a.id)).toEqual(['OPEN', 'FRESH']);
    expect(filterAssets([open, closed, fresh], 'all')).toHaveLength(3);
  });

  it('CA08.15 — o rodapé soma só as posições abertas e pondera a rentabilidade pelo custo', () => {
    const other = asset('OTHER', [tx('buy', 10, 100, '2026-01-10')], 90);
    const footer = footerTotals([open, closed, fresh, other])!;
    expect(footer.cost).toBe(1300);
    expect(footer.value).toBe(1300); // 400 + 900
    expect(footer.returnPct).toBe(0);
    expect(footerTotals([closed, fresh])).toBeNull();
  });
});
