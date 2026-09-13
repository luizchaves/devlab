import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '@/server/prisma';
import { actAs, createAccounts, jsonRequest, resetTables } from './helpers';
import { GET as adminMetrics } from '../../app/api/admin/metrics/route';
import { GET as analytics } from '../../app/api/analytics/route';
import { POST as postAsset } from '../../app/api/assets/route';
import { POST as postTransaction } from '../../app/api/transactions/route';

beforeEach(resetTables);

// A planilha de referência: 100 PETR4 a 30 em janeiro, 100 a 34 em fevereiro;
// cotações 31 (31/jan) e 33 (28/fev); março sem nada.
async function seedSpreadsheet() {
  const { asset } = await (await postAsset(jsonRequest('POST', { ticker: 'PETR4', name: 'Petrobras', category: 'acoes' }))).json();
  for (const [quantity, price, transactionDate] of [[100, 30, '2026-01-10'], [100, 34, '2026-02-10']] as const) {
    await postTransaction(jsonRequest('POST', { assetId: asset.id, type: 'buy', quantity, price, transactionDate }));
  }
  await prisma.asset.update({ where: { id: asset.id }, data: { currentPrice: 33 } });
  await prisma.quote.createMany({
    data: [
      { assetId: asset.id, price: 31, quoteDate: new Date('2026-01-31T00:00:00Z') },
      { assetId: asset.id, price: 33, quoteDate: new Date('2026-02-28T00:00:00Z') },
    ],
  });
  return asset as { id: string };
}

describe('GET /api/analytics', () => {
  it('CA06.2, CA06.1 — a série mensal reproduz a planilha e março fica de fora', async () => {
    const { ana } = await createAccounts();
    actAs(ana);
    await seedSpreadsheet();

    const body = await (await analytics()).json();

    expect(body.monthlyReturns.map((r: { month: string; value: number; netFlow: number; returnBrl: number }) => [r.month, r.value, r.netFlow, r.returnBrl])).toEqual([
      ['2026-01-01', 3100, 3000, 100],
      ['2026-02-01', 6600, 3400, 100],
    ]);
    expect(body.monthlyReturns.some((r: { month: string }) => r.month.startsWith('2026-03'))).toBe(false);
    expect(body.allocation).toEqual([{ category: 'acoes', value: 6600, share: 1 }]);
    expect(body.totals).toMatchObject({ cost: 6400, value: 6600 });
  });

  it('CA06.3 — cada conta vê só a própria série e distribuição', async () => {
    const { ana, bia } = await createAccounts();
    actAs(ana);
    await seedSpreadsheet();

    actAs(bia);
    const body = await (await analytics()).json();
    expect(body.monthlyReturns).toEqual([]);
    expect(body.allocation).toEqual([]);
  });
});

describe('GET /api/admin/metrics', () => {
  it('CA06.4, CA06.5 — investidor recebe 403; administrador recebe totais sem ticker nem posição', async () => {
    const { ana, bia } = await createAccounts();
    actAs(ana);
    await seedSpreadsheet();

    expect((await adminMetrics()).status).toBe(403);

    await prisma.user.update({ where: { id: bia.id }, data: { role: 'ADMIN' } });
    actAs({ id: bia.id, role: 'ADMIN' });
    const response = await adminMetrics();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.metrics).toMatchObject({ activeAccounts: 2, aum: 6600, lastQuoteRun: null });
    expect(body.checks).toMatchObject({ database: true, storage: true, jobs: false, quotes: false });
    // RNF05: o payload não carrega ticker, quantidade ou posição de ninguém.
    const text = JSON.stringify(body);
    expect(text).not.toMatch(/PETR4|ticker|quantity/i);
  });
});
