import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '@/server/prisma';
import { updateQuotes } from '@/server/quotes/update';
import { actAs, createAccounts, jsonRequest, params, resetTables } from './helpers';
import { POST as manualQuote } from '../../app/api/assets/[id]/quote/route';
import { POST as postAsset } from '../../app/api/assets/route';
import { POST as updateRoute } from '../../app/api/quotes/update/route';

beforeEach(resetTables);

async function createAsset(body: Record<string, unknown>) {
  const { asset } = await (await postAsset(jsonRequest('POST', body))).json();
  return asset as { id: string; ticker: string };
}

const midTrading = new Date('2026-09-09T17:30:00Z'); // quarta, 14h30 em São Paulo

describe('rodada de cotações (provedor fake)', () => {
  it('CA04.1, CA04.2 — atualiza os elegíveis, registra a falha por ticker e ignora renda fixa', async () => {
    const { ana } = await createAccounts();
    actAs(ana);
    const petr = await createAsset({ ticker: 'PETR4', name: 'Petrobras', category: 'acoes' });
    const xpto = await createAsset({ ticker: 'XPTO3', name: 'Desconhecida', category: 'acoes' });
    const cdb = await createAsset({ ticker: 'CDB-INTER', name: 'CDB Inter', category: 'renda_fixa' });

    const summary = await updateQuotes(ana.id, { now: midTrading });

    expect(summary).toMatchObject({ requested: 2, updated: 1, failed: [{ ticker: 'XPTO3', reason: 'not_found' }] });
    expect(Number((await prisma.asset.findUniqueOrThrow({ where: { id: petr.id } })).currentPrice)).toBe(38.42);
    expect((await prisma.asset.findUniqueOrThrow({ where: { id: xpto.id } })).currentPrice).toBeNull();
    expect(await prisma.quote.count({ where: { assetId: cdb.id } })).toBe(0);
    expect(await prisma.quoteRun.count()).toBe(1);
  });

  it('CA04.1 — rodar duas vezes no mesmo dia deixa uma linha por ativo no histórico', async () => {
    const { ana } = await createAccounts();
    actAs(ana);
    const petr = await createAsset({ ticker: 'PETR4', name: 'Petrobras', category: 'acoes' });

    await updateQuotes(ana.id, { now: midTrading });
    await updateQuotes(ana.id, { now: midTrading });

    expect(await prisma.quote.count({ where: { assetId: petr.id } })).toBe(1);
  });

  it('CA08.9 — com assetId, só aquele ativo é consultado e atualizado', async () => {
    const { ana } = await createAccounts();
    actAs(ana);
    const petr = await createAsset({ ticker: 'PETR4', name: 'Petrobras', category: 'acoes' });
    const vale = await createAsset({ ticker: 'VALE3', name: 'Vale', category: 'acoes' });

    const response = await updateRoute(jsonRequest('POST', { assetId: petr.id }));
    const summary = await response.json();

    expect(summary).toMatchObject({ requested: 1, updated: 1 });
    expect((await prisma.asset.findUniqueOrThrow({ where: { id: vale.id } })).currentPrice).toBeNull();
  });

  it('CA03.6, RNF01 — a rodada de uma conta não toca os ativos da outra', async () => {
    const { ana, bia } = await createAccounts();
    actAs(ana);
    const petr = await createAsset({ ticker: 'PETR4', name: 'Petrobras', category: 'acoes' });
    actAs(bia);
    await createAsset({ ticker: 'VALE3', name: 'Vale', category: 'acoes' });

    const summary = await updateQuotes(bia.id, { now: midTrading });

    expect(summary.requested).toBe(1);
    expect((await prisma.asset.findUniqueOrThrow({ where: { id: petr.id } })).currentPrice).toBeNull();
  });

  it('CA10.13 — cada rodada com câmbio grava a taxa USD/BRL do dia, sem duplicar', async () => {
    const { ana } = await createAccounts();
    actAs(ana);
    await createAsset({ ticker: 'AAPL', name: 'Apple', category: 'acoes', currency: 'USD' });

    await updateQuotes(ana.id, { now: midTrading });
    await updateQuotes(ana.id, { now: midTrading });

    const rates = await prisma.exchangeRate.findMany();
    expect(rates).toHaveLength(1);
    expect(Number(rates[0].rate)).toBe(5.2);
  });

  it('CA10.11 — cripto em real é convertida pelo par BRL=X da mesma rodada', async () => {
    const { ana } = await createAccounts();
    actAs(ana);
    const btc = await createAsset({ ticker: 'BTC', name: 'Bitcoin', category: 'cripto', currency: 'BRL' });

    await updateQuotes(ana.id, { now: midTrading });

    expect(Number((await prisma.asset.findUniqueOrThrow({ where: { id: btc.id } })).currentPrice)).toBe(65_000 * 5.2);
  });
});

describe('cotação manual', () => {
  it('CA08.11 — grava currentPrice e o histórico na data informada; outra conta não grava no ativo alheio', async () => {
    const { ana, bia } = await createAccounts();
    actAs(ana);
    const xpto = await createAsset({ ticker: 'XPTO3', name: 'Desconhecida', category: 'acoes' });

    const response = await manualQuote(jsonRequest('POST', { price: 25, quoteDate: '2026-03-10' }), params(xpto.id));
    expect(response.status).toBe(200);
    expect(Number((await prisma.asset.findUniqueOrThrow({ where: { id: xpto.id } })).currentPrice)).toBe(25);
    const quote = await prisma.quote.findFirstOrThrow({ where: { assetId: xpto.id } });
    expect(quote.quoteDate.toISOString().slice(0, 10)).toBe('2026-03-10');

    actAs(bia);
    const crossed = await manualQuote(jsonRequest('POST', { price: 1 }), params(xpto.id));
    expect(crossed.status).toBe(404);
    expect(Number((await prisma.asset.findUniqueOrThrow({ where: { id: xpto.id } })).currentPrice)).toBe(25);
  });

  it('CA08.12 — o saldo manual de renda fixa vira um lançamento update na data informada', async () => {
    const { ana } = await createAccounts();
    actAs(ana);
    const cdb = await createAsset({ ticker: 'CDB-INTER', name: 'CDB Inter', category: 'renda_fixa' });

    const response = await manualQuote(jsonRequest('POST', { balance: 1250.5, quoteDate: '2026-03-31' }), params(cdb.id));
    expect(response.status).toBe(200);

    const tx = await prisma.transaction.findFirstOrThrow({ where: { assetId: cdb.id } });
    expect(tx).toMatchObject({ type: 'update' });
    expect(Number(tx.quantity)).toBe(1250.5);
    expect(Number(tx.price)).toBe(1);
    expect(tx.transactionDate.toISOString().slice(0, 10)).toBe('2026-03-31');
  });

  it('valor negativo responde 400 com erro de campo', async () => {
    const { ana } = await createAccounts();
    actAs(ana);
    const xpto = await createAsset({ ticker: 'XPTO3', name: 'Desconhecida', category: 'acoes' });

    const response = await manualQuote(jsonRequest('POST', { price: -1 }), params(xpto.id));
    expect(response.status).toBe(400);
    expect((await response.json()).fieldErrors.price).toBeDefined();
  });
});
