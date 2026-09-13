import type { AssetData } from '@/core/assets';
import { normalizeTicker } from '@/core/assets';
import type { AssetWithTransactions } from '@/core/portfolio';
import { QUOTED_CATEGORIES } from '@/core/portfolio';
import { Prisma } from '@/generated/prisma/client';
import { findOrCreateBroker } from './brokers';
import { prisma } from './prisma';
import { decimal, isoDate } from './serialize';
import { HttpError } from './session';

// Tudo que a carteira e a tela do ativo precisam, em uma consulta.
const assetInclude = {
  broker: { select: { id: true, name: true } },
  transactions: {
    orderBy: [{ transactionDate: 'asc' }, { createdAt: 'asc' }],
    select: { id: true, type: true, quantity: true, price: true, transactionDate: true, receiptPath: true },
  },
  dividends: { orderBy: { exDate: 'desc' }, select: { id: true, rate: true, exDate: true, paymentDate: true } },
} satisfies Prisma.AssetInclude;

type AssetRow = Prisma.AssetGetPayload<{ include: typeof assetInclude }>;

function findRaw(userId: string, id: string) {
  return prisma.asset.findFirst({ where: { id, userId }, include: assetInclude });
}

export function toAssetDto(row: AssetRow): AssetWithTransactions {
  return {
    id: row.id,
    ticker: row.ticker,
    name: row.name,
    category: row.category,
    currency: row.currency,
    issuer: row.issuer,
    broker: row.broker,
    currentPrice: decimal(row.currentPrice),
    transactions: row.transactions.map((t) => ({
      id: t.id,
      type: t.type,
      quantity: Number(t.quantity),
      price: Number(t.price),
      transactionDate: isoDate(t.transactionDate),
      receiptPath: t.receiptPath,
    })),
    dividends: row.dividends.map((d) => ({ id: d.id, rate: Number(d.rate), exDate: isoDate(d.exDate), paymentDate: isoDate(d.paymentDate) })),
  };
}

// #region list
/**
 * O filtro por dono é o `where: { userId }`: não há RLS, então cada consulta
 * de `src/server/` recebe o id da sessão e o aplica (RNF01).
 */
export async function listAssets(userId: string): Promise<AssetWithTransactions[]> {
  const rows = await prisma.asset.findMany({ where: { userId }, include: assetInclude, orderBy: { ticker: 'asc' } });
  return rows.map(toAssetDto);
}

/**
 * Busca por id ou por ticker (sem diferenciar maiúsculas). Ativo de outra
 * conta, ou inexistente, devolve `null`: quem chama responde 404 sem
 * confirmar que ele existe (CA03.10).
 */
export async function getAsset(userId: string, idOrTicker: string): Promise<AssetWithTransactions | null> {
  const key = idOrTicker.trim();
  if (!key) return null;

  const row =
    (await findRaw(userId, key)) ??
    (await prisma.asset.findFirst({
      where: { userId, ticker: { equals: key.toUpperCase(), mode: 'insensitive' } },
      include: assetInclude,
    }));

  return row ? toAssetDto(row) : null;
}
// #endregion

// #region create
export class TickerInUseError extends HttpError {
  constructor() {
    super(409, 'Você já tem esse ticker.');
  }
}

export async function createAsset(userId: string, input: AssetData): Promise<AssetWithTransactions> {
  const broker = await findOrCreateBroker(userId, input.brokerName);
  const ticker = normalizeTicker(input.ticker, input.category, input.name);

  const exists = await prisma.asset.findUnique({ where: { userId_ticker: { userId, ticker } } });
  if (exists) throw new TickerInUseError();

  const row = await prisma.asset.create({
    data: {
      userId,
      ticker,
      name: input.name,
      category: input.category,
      currency: input.category === 'renda_fixa' ? 'BRL' : input.currency,
      issuer: input.issuer || null,
      brokerId: broker?.id ?? null,
    },
    include: assetInclude,
  });
  return toAssetDto(row);
}
// #endregion

// #region mutate
/**
 * Editar ticker, nome, categoria, corretora ou emissor não toca nos
 * lançamentos (CA03.11). Ao sair de uma categoria cotada, a cotação é apagada.
 */
export async function updateAsset(userId: string, id: string, input: AssetData): Promise<AssetWithTransactions> {
  const current = await findRaw(userId, id);
  if (!current) throw new HttpError(404, 'Ativo não encontrado.');

  const broker = await findOrCreateBroker(userId, input.brokerName);
  const ticker = normalizeTicker(input.ticker, input.category, input.name) || current.ticker;

  if (ticker !== current.ticker) {
    const exists = await prisma.asset.findUnique({ where: { userId_ticker: { userId, ticker } } });
    if (exists) throw new TickerInUseError();
  }

  const row = await prisma.asset.update({
    where: { id },
    data: {
      ticker,
      name: input.name,
      category: input.category,
      currency: input.category === 'renda_fixa' ? 'BRL' : input.currency,
      issuer: input.issuer || null,
      brokerId: broker?.id ?? null,
      currentPrice: QUOTED_CATEGORIES.includes(input.category) ? undefined : null,
    },
    include: assetInclude,
  });
  return toAssetDto(row);
}

/** O `onDelete: Cascade` do schema leva os lançamentos junto (CA03.12). */
export async function deleteAsset(userId: string, id: string): Promise<void> {
  const { count } = await prisma.asset.deleteMany({ where: { id, userId } });
  if (count === 0) throw new HttpError(404, 'Ativo não encontrado.');
}
// #endregion
