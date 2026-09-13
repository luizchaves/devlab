import { beforeEach, describe, expect, it, vi } from 'vitest';
import { receivedDividends } from '@/core/dividends';
import { prisma } from '@/server/prisma';
import { actAs, createAccounts, jsonRequest, params, resetTables } from './helpers';
import { POST as sync } from '../../app/api/assets/[id]/dividends/sync/route';
import { GET as getAsset } from '../../app/api/assets/[id]/route';
import { POST as postAsset } from '../../app/api/assets/route';
import { POST as postTransaction } from '../../app/api/transactions/route';

beforeEach(resetTables);

async function createAsset(body: Record<string, unknown>) {
  const { asset } = await (await postAsset(jsonRequest('POST', body))).json();
  return asset as { id: string };
}

describe('proventos', () => {
  it('CA09.1, CA09.3, CA09.5 — sincroniza o histórico do dono sem duplicar e credita pela data ex', async () => {
    const { ana, bia } = await createAccounts();
    actAs(ana);
    const hglg = await createAsset({ ticker: 'HGLG11', name: 'CSHG Logística', category: 'fiis' });
    await postTransaction(jsonRequest('POST', { assetId: hglg.id, type: 'buy', quantity: 100, price: 150, transactionDate: '2026-01-10' }));

    const first = await (await sync(new Request('http://localhost'), params(hglg.id))).json();
    const second = await (await sync(new Request('http://localhost'), params(hglg.id))).json();
    expect(first).toEqual({ count: 3 });
    expect(second).toEqual({ count: 3 });
    expect(await prisma.dividend.count({ where: { assetId: hglg.id } })).toBe(3);

    const { asset } = await (await getAsset(new Request('http://localhost'), params(hglg.id))).json();
    expect(asset.dividends).toHaveLength(3);
    const received = receivedDividends(asset);
    expect(received.map((d) => d.total)).toEqual([110, 110]);

    // CA09.1: outra conta não sincroniza nem lê o histórico alheio.
    actAs(bia);
    expect((await sync(new Request('http://localhost'), params(hglg.id))).status).toBe(404);
    expect((await getAsset(new Request('http://localhost'), params(hglg.id))).status).toBe(404);
  });

  it('CA09.2 — categoria sem proventos por cota recebe aviso e nada é gravado', async () => {
    const { ana } = await createAccounts();
    actAs(ana);
    const cdb = await createAsset({ ticker: 'CDB-BB', name: 'CDB BB', category: 'renda_fixa' });

    const result = await (await sync(new Request('http://localhost'), params(cdb.id))).json();
    expect(result).toEqual({ count: 0, message: 'Categoria sem proventos por cota.' });
    expect(await prisma.dividend.count()).toBe(0);
  });

  it('CA09.4 — provedor fora do ar responde erro sem apagar o histórico já gravado', async () => {
    const { ana } = await createAccounts();
    actAs(ana);
    const hglg = await createAsset({ ticker: 'HGLG11', name: 'CSHG Logística', category: 'fiis' });
    await sync(new Request('http://localhost'), params(hglg.id));

    vi.stubEnv('QUOTES_PROVIDER', 'yahoo');
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'));
    try {
      const response = await sync(new Request('http://localhost'), params(hglg.id));
      expect(response.status).toBe(502);
    } finally {
      fetchSpy.mockRestore();
      vi.unstubAllEnvs();
    }
    expect(await prisma.dividend.count({ where: { assetId: hglg.id } })).toBe(3);
  });
});
