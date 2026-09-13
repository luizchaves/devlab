import { createPrismaClient } from '../src/server/prisma.ts';
import { seed } from '../src/server/seed.ts';

// `pnpm db:seed` roda este arquivo com o Node puro; a regra mora em `src/server/seed.ts`.
const prisma = createPrismaClient();
const { admin, asset } = await seed(prisma);

console.log(`Seed aplicado: ${admin.email} (${admin.role}), ativo ${asset.ticker}`);
await prisma.$disconnect();
