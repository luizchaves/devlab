import { hashPassword } from '../src/server/password.ts';
import { createPrismaClient } from '../src/server/prisma.ts';

// #region seed
/**
 * Seed público mínimo (RF08.1): um administrador demonstrativo. Nada aqui é
 * dado real; a posição fictícia entra na fase da carteira.
 */
const prisma = createPrismaClient();

const admin = await prisma.user.upsert({
  where: { email: 'admin@example.com' },
  update: {},
  create: {
    email: 'admin@example.com',
    name: 'Administrador Demo',
    passwordHash: hashPassword('admin12345'),
    role: 'ADMIN',
  },
});

console.log(`Seed aplicado: ${admin.email} (${admin.role})`);
await prisma.$disconnect();
// #endregion
