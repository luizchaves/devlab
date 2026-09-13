import type { PrismaClient } from '../generated/prisma/client.ts';
import { hashPassword } from './password.ts';

// #region seed
/**
 * Seed público mínimo (RF08.1, CA03.13): um administrador demonstrativo, uma
 * corretora e a posição fictícia `Tesouro Reserva 2036` valendo R$ 1. Nada
 * aqui é dado real de carteira (CA03.14).
 */
export async function seed(prisma: PrismaClient) {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { role: 'ADMIN' },
    create: {
      email: 'admin@example.com',
      name: 'Administrador Demo',
      passwordHash: hashPassword('admin12345'),
      role: 'ADMIN',
    },
  });

  const broker = await prisma.broker.upsert({
    where: { userId_name: { userId: admin.id, name: 'Inter' } },
    update: {},
    create: { userId: admin.id, name: 'Inter' },
  });

  const asset = await prisma.asset.upsert({
    where: { userId_ticker: { userId: admin.id, ticker: 'TESOURO-RESERVA-2036' } },
    update: { brokerId: broker.id },
    create: {
      userId: admin.id,
      brokerId: broker.id,
      ticker: 'TESOURO-RESERVA-2036',
      name: 'Tesouro Reserva 2036',
      category: 'renda_fixa',
      issuer: 'Tesouro Nacional',
      currency: 'BRL',
    },
  });

  await prisma.transaction.deleteMany({ where: { assetId: asset.id } });
  await prisma.transaction.create({
    data: {
      userId: admin.id,
      assetId: asset.id,
      type: 'update',
      quantity: 1,
      price: 1,
      transactionDate: new Date('2026-01-02T00:00:00Z'),
    },
  });

  return { admin, broker, asset };
}
// #endregion
