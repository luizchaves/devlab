import { beforeEach, describe, expect, it } from 'vitest';
import { prisma } from '@/server/prisma';
import { actAs, createAccounts, jsonRequest, params, resetTables } from './helpers';
import { POST as postAsset } from '../../app/api/assets/route';
import { GET as getReceipt, POST as postReceipt } from '../../app/api/transactions/[id]/receipt/route';
import { POST as postTransaction } from '../../app/api/transactions/route';

beforeEach(resetTables);

async function createTransaction() {
  const { asset } = await (await postAsset(jsonRequest('POST', { ticker: 'CDB-BB', name: 'CDB BB', category: 'renda_fixa' }))).json();
  const { transaction } = await (
    await postTransaction(jsonRequest('POST', { assetId: asset.id, type: 'buy', quantity: 1, price: 1000, transactionDate: '2026-03-01' }))
  ).json();
  return transaction as { id: string };
}

function upload(transactionId: string, file: File) {
  const form = new FormData();
  form.append('file', file);
  return postReceipt(new Request('http://localhost/api', { method: 'POST', body: form }), params(transactionId));
}

const pdf = () => new File([new TextEncoder().encode('%PDF-1.4 nota de corretagem')], 'nota.pdf', { type: 'application/pdf' });

describe('comprovantes', () => {
  it('CA05.1, CA05.5 — o dono envia para a própria pasta e o lançamento guarda só o path', async () => {
    const { ana } = await createAccounts();
    actAs(ana);
    const tx = await createTransaction();

    const response = await upload(tx.id, pdf());
    const { receiptPath } = await response.json();

    expect(response.status).toBe(201);
    expect(receiptPath).toMatch(new RegExp(`^${ana.id}/${tx.id}/[0-9a-f-]{36}\\.pdf$`));
    expect(receiptPath).not.toMatch(/^https?:/);
    expect((await prisma.transaction.findUniqueOrThrow({ where: { id: tx.id } })).receiptPath).toBe(receiptPath);
  });

  it('CA05.2 — tipo fora da lista e arquivo acima do limite são recusados sem tocar o bucket', async () => {
    const { ana } = await createAccounts();
    actAs(ana);
    const tx = await createTransaction();

    const exe = await upload(tx.id, new File([new Uint8Array([0x4d, 0x5a])], 'virus.exe', { type: 'application/x-msdownload' }));
    expect(exe.status).toBe(400);
    expect((await exe.json()).error).toBe('Envie um PDF, PNG ou JPG.');

    const big = await upload(tx.id, new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'grande.pdf', { type: 'application/pdf' }));
    expect(big.status).toBe(400);
    expect((await prisma.transaction.findUniqueOrThrow({ where: { id: tx.id } })).receiptPath).toBeNull();
  });

  it('CA05.3 — o dono recebe uma URL assinada de 60 s, que entrega o arquivo', async () => {
    const { ana } = await createAccounts();
    actAs(ana);
    const tx = await createTransaction();
    await upload(tx.id, pdf());

    const response = await getReceipt(new Request('http://localhost'), params(tx.id));
    const { url, expiresIn } = await response.json();

    expect(response.status).toBe(200);
    expect(expiresIn).toBe(60);
    expect(url).toContain('/storage/v1/object/sign/receipts/');
    expect(url).toContain('token=');

    const file = await fetch(url);
    expect(file.status).toBe(200);
    expect(await file.text()).toContain('%PDF');
  });

  it('CA05.4 — outra conta não envia nem assina o comprovante, sem confirmar que existe', async () => {
    const { ana, bia } = await createAccounts();
    actAs(ana);
    const tx = await createTransaction();
    await upload(tx.id, pdf());

    actAs(bia);
    expect((await upload(tx.id, pdf())).status).toBe(404);
    expect((await getReceipt(new Request('http://localhost'), params(tx.id))).status).toBe(404);
  });

  it('lançamento sem comprovante responde 404 ao pedir a URL', async () => {
    const { ana } = await createAccounts();
    actAs(ana);
    const tx = await createTransaction();

    expect((await getReceipt(new Request('http://localhost'), params(tx.id))).status).toBe(404);
  });
});
