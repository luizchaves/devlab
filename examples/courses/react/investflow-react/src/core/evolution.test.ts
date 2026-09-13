import { describe, expect, it } from 'vitest';
import { applyRange, fillContinuousMonths, filterMovementMonths, portfolioEvolution, totalsByMonth, type MonthPoint } from './evolution';
import { pathOf, scalePoints } from './line-chart';
import { allocationByOrigin, groupBy } from './origins';
import type { TransactionFact } from './portfolio';
import type { AssetWithQuotes } from './returns';
import { fitText, layout } from './treemap';

const tx = (type: TransactionFact['type'], quantity: number, price: number, transactionDate: string): TransactionFact => ({ id: `${type}-${transactionDate}`, type, quantity, price, transactionDate, receiptPath: null });

const petr: AssetWithQuotes = {
  id: 'a1', ticker: 'PETR4', name: 'Petrobras', category: 'acoes', currency: 'BRL', issuer: 'Petrobras', broker: { id: 'b1', name: 'XP' }, currentPrice: 33,
  transactions: [tx('buy', 100, 30, '2026-01-10'), tx('buy', 100, 34, '2026-02-10')],
  quotes: [{ price: 31, quoteDate: '2026-01-31' }, { price: 33, quoteDate: '2026-02-28' }],
};
const cdb: AssetWithQuotes = { ...petr, id: 'a2', ticker: 'CDB-BB', category: 'renda_fixa', currentPrice: null, issuer: 'Banco do Brasil', broker: { id: 'b2', name: 'Banco do Brasil' }, quotes: [], transactions: [tx('buy', 1, 1000, '2026-01-05')] };

describe('origens', () => {
  it('CA07.1, CA07.2 — uma linha por ativo com corretora, categoria, emissor e valor atual', () => {
    const rows = allocationByOrigin([petr, cdb]).sort((a, b) => a.ticker.localeCompare(b.ticker));
    expect(rows.map((r) => [r.ticker, r.broker, r.category, r.issuer, r.value])).toEqual([
      ['CDB-BB', 'Banco do Brasil', 'Renda Fixa', 'Banco do Brasil', 1000],
      ['PETR4', 'XP', 'Ações', 'Petrobras', 6600],
    ]);
    expect(groupBy(rows, 'broker')).toEqual([{ label: 'XP', value: 6600 }, { label: 'Banco do Brasil', value: 1000 }]);
    expect(groupBy(rows, 'category').map((g) => g.label)).toEqual(['Ações', 'Renda Fixa']);
  });

  it('CA07.1 — o treemap ocupa toda a área e cada bloco fica dentro dos limites', () => {
    const rects = layout([{ label: 'A', value: 6 }, { label: 'B', value: 3 }, { label: 'C', value: 1 }, { label: 'D', value: 0 }], 100, 60);
    expect(rects).toHaveLength(3);
    const area = rects.reduce((sum, r) => sum + r.w * r.h, 0);
    expect(area).toBeCloseTo(6000, 6);
    for (const r of rects) {
      expect(r.x).toBeGreaterThanOrEqual(-1e-9);
      expect(r.y).toBeGreaterThanOrEqual(-1e-9);
      expect(r.x + r.w).toBeLessThanOrEqual(100 + 1e-9);
      expect(r.y + r.h).toBeLessThanOrEqual(60 + 1e-9);
    }
    expect(fitText('Banco do Brasil', 40, 12)).toBe('Banco…');
    expect(fitText('XP', 40, 12)).toBe('XP');
  });
});

describe('evolução', () => {
  it('CA07.4, CA07.6 — reproduz aportado × valor da planilha, sem março', () => {
    const rows = portfolioEvolution([petr]);
    expect(rows.map((r) => [r.month, r.invested, r.value])).toEqual([
      ['2026-01-01', 3000, 3100],
      ['2026-02-01', 6400, 6600],
    ]);
  });

  it('CA07.5 — a série do ativo e a da carteira coincidem quando só ele tem cotação; o CDB entra pelo saldo', () => {
    const rows = portfolioEvolution([petr, cdb]);
    expect(totalsByMonth(rows).map((r) => [r.month, r.invested, r.value])).toEqual([
      ['2026-01-01', 4000, 4100],
      ['2026-02-01', 7400, 7600],
    ]);
    expect(totalsByMonth(rows.filter((r) => r.assetId === petr.id))).toEqual(totalsByMonth(portfolioEvolution([petr])));
  });

  it('posição zerada devolve aportado 0, como a view', () => {
    const sold: AssetWithQuotes = { ...petr, transactions: [tx('buy', 10, 10, '2026-01-10'), tx('sell', 10, 12, '2026-01-20')] };
    expect(portfolioEvolution([sold])[0]).toMatchObject({ invested: 0, value: 0 });
  });

  it('CA07.7 — modo contínuo preenche os meses intermediários com a última posição', () => {
    const sparse: MonthPoint[] = [{ month: '2026-01-01', invested: 1000, value: 1100 }, { month: '2026-04-01', invested: 2000, value: 2300 }];
    const continuous = fillContinuousMonths(sparse);
    expect(continuous.map((r) => r.month)).toEqual(['2026-01-01', '2026-02-01', '2026-03-01', '2026-04-01']);
    expect(continuous[2]).toEqual({ month: '2026-03-01', invested: 1000, value: 1100 });
  });

  it('CA07.7 — modo eventos deixa só os meses com movimentação', () => {
    const rows: MonthPoint[] = [
      { month: '2026-01-01', invested: 1000, value: 1050 },
      { month: '2026-02-01', invested: 1000, value: 1080 },
      { month: '2026-03-01', invested: 1500, value: 1600 },
      { month: '2026-04-01', invested: 1500, value: 1550 },
      { month: '2026-05-01', invested: 1200, value: 1300 },
    ];
    expect(filterMovementMonths(rows, ['2026-01', '2026-03', '2026-05']).map((r) => r.month)).toEqual(['2026-01-01', '2026-03-01', '2026-05-01']);
    expect(filterMovementMonths(rows).map((r) => r.month)).toEqual(['2026-01-01', '2026-03-01', '2026-05-01']);
  });

  it('CA07.8 — a janela recorta as séries a partir de hoje', () => {
    const rows: MonthPoint[] = ['2023-06-01', '2024-06-01', '2025-06-01', '2026-06-01'].map((month) => ({ month, invested: 1, value: 1 }));
    const now = new Date('2026-09-13T12:00:00Z');
    expect(applyRange(rows, '1y', now).map((r) => r.month)).toEqual(['2026-06-01']);
    expect(applyRange(rows, '2y', now).map((r) => r.month)).toEqual(['2025-06-01', '2026-06-01']);
    expect(applyRange(rows, 'all', now)).toHaveLength(4);
  });
});

describe('gráfico de linhas', () => {
  it('CA07.6 — um mês sem valor vira lacuna no caminho, não zero', () => {
    const scaled = scalePoints([{ name: 'Valor', color: '#000', points: [{ month: '2026-01-01', value: 10 }, { month: '2026-02-01', value: null }, { month: '2026-03-01', value: 20 }] }], { width: 100, height: 50, paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 });
    const points = scaled.series[0].points;
    expect(points[1].y).toBeNull();
    expect(pathOf(points)).toBe('M0.0 25.0 M100.0 0.0');
  });
});
