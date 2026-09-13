import type { z } from 'zod';
import { BALANCE_CATEGORIES } from '@/core/portfolio';
import { manualQuoteSchema } from '@/core/quotes';
import { prisma } from '../prisma';
import { HttpError } from '../session';
import { createTransaction } from '../transactions';

// #region manual
/**
 * Quando o provedor não responde, o dono informa o valor (CA08.10). Ativo
 * cotado grava `currentPrice` e uma linha no histórico na data informada
 * (CA08.11); ativo por saldo vira um lançamento `update` (CA08.12). Ativo de
 * outra conta responde 404.
 */
export async function setManualQuote(userId: string, assetId: string, input: z.output<typeof manualQuoteSchema>) {
  const asset = await prisma.asset.findFirst({ where: { id: assetId, userId }, select: { id: true, category: true } });
  if (!asset) throw new HttpError(404, 'Ativo não encontrado.');

  const quoteDate = input.quoteDate ?? new Date().toISOString().slice(0, 10);

  if (BALANCE_CATEGORIES.includes(asset.category)) {
    if (input.balance == null) throw new HttpError(400, 'Informe o saldo.');
    await createTransaction(userId, { assetId: asset.id, type: 'update', quantity: input.balance, price: 1, transactionDate: quoteDate, yieldRate: null });
    return { kind: 'balance' as const, quoteDate };
  }

  if (input.price == null) throw new HttpError(400, 'Informe a cotação.');
  const date = new Date(`${quoteDate}T00:00:00Z`);
  await prisma.$transaction([
    prisma.asset.update({ where: { id: asset.id }, data: { currentPrice: input.price } }),
    prisma.quote.upsert({
      where: { assetId_quoteDate: { assetId: asset.id, quoteDate: date } },
      update: { price: input.price },
      create: { assetId: asset.id, price: input.price, quoteDate: date },
    }),
  ]);
  return { kind: 'price' as const, quoteDate };
}
// #endregion
