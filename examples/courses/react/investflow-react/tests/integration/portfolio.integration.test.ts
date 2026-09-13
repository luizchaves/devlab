import { beforeEach, describe, expect, it } from 'vitest';
import { summarize } from '@/core/portfolio';
import { prisma } from '@/server/prisma';
import { seed } from '@/server/seed';
import { actAs, createAccounts, jsonRequest, params, resetTables } from './helpers';
import { DELETE as deleteAsset, GET as getAsset, PATCH as patchAsset } from '../../app/api/assets/[id]/route';
import { GET as listAssets, POST as postAsset } from '../../app/api/assets/route';
import { DELETE as deleteTransaction, PATCH as patchTransaction } from '../../app/api/transactions/[id]/route';
import { POST as postTransaction } from '../../app/api/transactions/route';

beforeEach(resetTables);

async function createAsset(body: Record<string, unknown>) {
  const response = await postAsset(jsonRequest('POST', body));
  const json = await response.json();
  return { status: response.status, ...json };
}

describe('ativos', () => {
  it('CA03.1, CA03.7 — cria o ativo para o dono da sessão, com corretora nova; categoria fora do conjunto é recusada', async () => {
    const { ana } = await createAccounts();
    actAs(ana);

    const created = await createAsset({ ticker: 'petr4', name: 'Petrobras', category: 'acoes', brokerName: 'XP', issuer: 'Petrobras S.A.' });
    expect(created.status).toBe(201);
    expect(created.asset).toMatchObject({ ticker: 'PETR4', broker: { name: 'XP' }, issuer: 'Petrobras S.A.' });

    const stored = await prisma.asset.findUniqueOrThrow({ where: { id: created.asset.id } });
    expect(stored.userId).toBe(ana.id);
    expect(await prisma.broker.count({ where: { userId: ana.id, name: 'XP' } })).toBe(1);

    const rejected = await createAsset({ ticker: 'X', name: 'Imóvel', category: 'imoveis' });
    expect(rejected.status).toBe(400);
    expect(rejected.fieldErrors.category).toBeDefined();
  });

  it('ticker repetido responde 409 com mensagem', async () => {
    const { ana } = await createAccounts();
    actAs(ana);
    await createAsset({ ticker: 'PETR4', name: 'Petrobras', category: 'acoes' });

    const again = await createAsset({ ticker: 'petr4', name: 'De novo', category: 'acoes' });
    expect(again.status).toBe(409);
    expect(again.error).toBe('Você já tem esse ticker.');
  });

  it('CA03.4 — cada conta lê apenas os próprios ativos', async () => {
    const { ana, bia } = await createAccounts();
    actAs(ana);
    await createAsset({ ticker: 'PETR4', name: 'Petrobras', category: 'acoes' });
    actAs(bia);
    await createAsset({ ticker: 'VALE3', name: 'Vale', category: 'acoes' });

    const biaList = await (await listAssets()).json();
    expect(biaList.assets.map((a: { ticker: string }) => a.ticker)).toEqual(['VALE3']);

    actAs(ana);
    const anaList = await (await listAssets()).json();
    expect(anaList.assets.map((a: { ticker: string }) => a.ticker)).toEqual(['PETR4']);
  });

  it('CA03.10 — ativo de outra conta responde 404 por id e por ticker; edição e exclusão cruzadas também', async () => {
    const { ana, bia } = await createAccounts();
    actAs(ana);
    const { asset } = await createAsset({ ticker: 'PETR4', name: 'Petrobras', category: 'acoes' });

    actAs(bia);
    expect((await getAsset(new Request('http://localhost'), params(asset.id))).status).toBe(404);
    expect((await getAsset(new Request('http://localhost'), params('petr4'))).status).toBe(404);
    expect(
      (await patchAsset(jsonRequest('PATCH', { ticker: 'PETR4', name: 'Invadido', category: 'acoes' }), params(asset.id))).status
    ).toBe(404);
    expect((await deleteAsset(new Request('http://localhost'), params(asset.id))).status).toBe(404);

    const untouched = await prisma.asset.findUniqueOrThrow({ where: { id: asset.id } });
    expect(untouched.name).toBe('Petrobras');
  });

  it('CA03.11 — editar o ativo não perde os lançamentos', async () => {
    const { ana } = await createAccounts();
    actAs(ana);
    const { asset } = await createAsset({ ticker: 'PETR4', name: 'Petrobras', category: 'acoes' });
    await postTransaction(jsonRequest('POST', { assetId: asset.id, type: 'buy', quantity: 100, price: 30, transactionDate: '2026-01-10' }));

    const response = await patchAsset(
      jsonRequest('PATCH', { ticker: 'tesouro-2029', name: 'Tesouro Selic 2029', category: 'renda_fixa', brokerName: 'BTG', issuer: 'Tesouro Nacional' }),
      params(asset.id)
    );
    const { asset: updated } = await response.json();

    expect(response.status).toBe(200);
    expect(updated).toMatchObject({ ticker: 'TESOURO-2029', name: 'Tesouro Selic 2029', broker: { name: 'BTG' }, currency: 'BRL' });
    expect(updated.transactions).toHaveLength(1);
  });

  it('CA03.12 — excluir o ativo leva os lançamentos junto pelo cascade', async () => {
    const { ana } = await createAccounts();
    actAs(ana);
    const { asset } = await createAsset({ ticker: 'PETR4', name: 'Petrobras', category: 'acoes' });
    await postTransaction(jsonRequest('POST', { assetId: asset.id, type: 'buy', quantity: 100, price: 30, transactionDate: '2026-01-10' }));

    const response = await deleteAsset(new Request('http://localhost'), params(asset.id));

    expect(response.status).toBe(204);
    expect(await prisma.asset.count({ where: { userId: ana.id } })).toBe(0);
    expect(await prisma.transaction.count({ where: { userId: ana.id } })).toBe(0);
  });
});

describe('lançamentos', () => {
  it('CA03.2, CA03.3 — a compra referencia o ativo, pertence ao investidor e a posição é reproduzível', async () => {
    const { ana } = await createAccounts();
    actAs(ana);
    const { asset } = await createAsset({ ticker: 'PETR4', name: 'Petrobras', category: 'acoes' });

    for (const [quantity, price, transactionDate] of [
      [100, 30, '2026-01-10'],
      [100, 34, '2026-02-10'],
    ]) {
      const response = await postTransaction(jsonRequest('POST', { assetId: asset.id, type: 'buy', quantity, price, transactionDate }));
      expect(response.status).toBe(201);
    }

    const stored = await prisma.transaction.findMany({ where: { assetId: asset.id } });
    expect(stored.every((t) => t.userId === ana.id)).toBe(true);

    const { asset: reloaded } = await (await getAsset(new Request('http://localhost'), params(asset.id))).json();
    const position = summarize(reloaded);
    expect(position).toMatchObject({ quantity: 200, cost: 6400, averagePrice: 32 });
  });

  it('CA03.5 — lançar em ativo de outra conta responde 404 e nada é gravado; editar lançamento alheio também', async () => {
    const { ana, bia } = await createAccounts();
    actAs(ana);
    const { asset } = await createAsset({ ticker: 'PETR4', name: 'Petrobras', category: 'acoes' });
    const own = await (await postTransaction(jsonRequest('POST', { assetId: asset.id, type: 'buy', quantity: 10, price: 30, transactionDate: '2026-01-10' }))).json();

    actAs(bia);
    const crossed = await postTransaction(jsonRequest('POST', { assetId: asset.id, type: 'buy', quantity: 1, price: 1, transactionDate: '2026-01-10' }));
    const edited = await patchTransaction(jsonRequest('PATCH', { type: 'sell', quantity: 10, price: 1, transactionDate: '2026-01-10' }), params(own.transaction.id));

    expect(crossed.status).toBe(404);
    expect(edited.status).toBe(404);
    expect(await prisma.transaction.count()).toBe(1);
  });

  it('recusa quantidade zero com erro de campo', async () => {
    const { ana } = await createAccounts();
    actAs(ana);
    const { asset } = await createAsset({ ticker: 'PETR4', name: 'Petrobras', category: 'acoes' });

    const response = await postTransaction(jsonRequest('POST', { assetId: asset.id, type: 'buy', quantity: 0, price: 30, transactionDate: '2026-01-10' }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.fieldErrors.quantity).toBeDefined();
  });
});

describe('seed público', () => {
  it('CA03.13, CA03.15 — cria o admin demonstrativo e a posição Tesouro Reserva 2036 valendo R$ 1', async () => {
    const { admin, asset } = await seed(prisma);
    expect(admin).toMatchObject({ email: 'admin@example.com', role: 'ADMIN' });

    actAs(admin);
    const { asset: loaded } = await (await getAsset(new Request('http://localhost'), params(asset.id))).json();
    expect(loaded).toMatchObject({ name: 'Tesouro Reserva 2036', broker: { name: 'Inter' } });
    expect(summarize(loaded).value).toBe(1);

    // Rodar de novo não duplica.
    await seed(prisma);
    expect(await prisma.transaction.count({ where: { assetId: asset.id } })).toBe(1);
  });
});

describe('edição e exclusão de lançamentos', () => {
  it('CA08.1, CA08.2 — editar recalcula a posição; excluir remove e recalcula; outra conta não alcança', async () => {
    const { ana, bia } = await createAccounts();
    actAs(ana);
    const { asset } = await createAsset({ ticker: 'XPTO3', name: 'Fora do provedor', category: 'acoes' });
    const first = (await (await postTransaction(jsonRequest('POST', { assetId: asset.id, type: 'buy', quantity: 100, price: 10, transactionDate: '2026-01-10' }))).json()).transaction;
    const second = (await (await postTransaction(jsonRequest('POST', { assetId: asset.id, type: 'buy', quantity: 100, price: 20, transactionDate: '2026-02-10' }))).json()).transaction;

    const edited = await patchTransaction(jsonRequest('PATCH', { type: 'buy', quantity: 200, price: 20, transactionDate: '2026-02-10' }), params(second.id));
    expect(edited.status).toBe(200);
    let { asset: reloaded } = await (await getAsset(new Request('http://localhost'), params(asset.id))).json();
    expect(summarize(reloaded)).toMatchObject({ quantity: 300, averagePrice: expect.closeTo(16.67, 2) });

    actAs(bia);
    expect((await deleteTransaction(new Request('http://localhost'), params(first.id))).status).toBe(404);

    actAs(ana);
    expect((await deleteTransaction(new Request('http://localhost'), params(second.id))).status).toBe(204);
    ({ asset: reloaded } = await (await getAsset(new Request('http://localhost'), params(asset.id))).json());
    expect(reloaded.transactions).toHaveLength(1);
    expect(summarize(reloaded).quantity).toBe(100);
  });
});
