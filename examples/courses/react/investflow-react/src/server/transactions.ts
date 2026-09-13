import type { TransactionData } from '@/core/assets';
import type { TransactionFact } from '@/core/portfolio';
import { prisma } from './prisma';
import { isoDate } from './serialize';
import { HttpError } from './session';

const select = { id: true, type: true, quantity: true, price: true, transactionDate: true, receiptPath: true } as const;

function toDto(row: { id: string; type: TransactionFact['type']; quantity: unknown; price: unknown; transactionDate: Date; receiptPath: string | null }): TransactionFact {
  return {
    id: row.id,
    type: row.type,
    quantity: Number(row.quantity),
    price: Number(row.price),
    transactionDate: isoDate(row.transactionDate),
    receiptPath: row.receiptPath,
  };
}

// #region create
/**
 * O lançamento pertence ao dono do ativo: um `assetId` de outra conta
 * responde 404, e o `userId` gravado é sempre o da sessão (CA03.2, CA03.5).
 */
export async function createTransaction(userId: string, input: TransactionData): Promise<TransactionFact> {
  const asset = await prisma.asset.findFirst({ where: { id: input.assetId, userId }, select: { id: true } });
  if (!asset) throw new HttpError(404, 'Ativo não encontrado.');

  const row = await prisma.transaction.create({
    data: {
      userId,
      assetId: asset.id,
      type: input.type,
      quantity: input.quantity,
      price: input.price,
      transactionDate: new Date(`${input.transactionDate}T00:00:00Z`),
    },
    select,
  });
  return toDto(row);
}
// #endregion

// #region mutate
export async function updateTransaction(
  userId: string,
  id: string,
  input: Omit<TransactionData, 'assetId'>
): Promise<TransactionFact> {
  const current = await prisma.transaction.findFirst({ where: { id, userId }, select: { id: true } });
  if (!current) throw new HttpError(404, 'Lançamento não encontrado.');

  const row = await prisma.transaction.update({
    where: { id },
    data: {
      type: input.type,
      quantity: input.quantity,
      price: input.price,
      transactionDate: new Date(`${input.transactionDate}T00:00:00Z`),
    },
    select,
  });
  return toDto(row);
}

export async function deleteTransaction(userId: string, id: string): Promise<void> {
  const { count } = await prisma.transaction.deleteMany({ where: { id, userId } });
  if (count === 0) throw new HttpError(404, 'Lançamento não encontrado.');
}
// #endregion
