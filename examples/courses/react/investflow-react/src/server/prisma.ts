import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';

// #region adapter
/**
 * A partir do Prisma 7, o client recebe um *driver adapter*: quem fala com o
 * banco é o driver `pg`, e não mais um binário próprio do Prisma. A string de
 * conexão aponta para o PostgreSQL da stack local do Supabase.
 */
export function createPrismaClient(url = process.env.DATABASE_URL) {
  const adapter = new PrismaPg({ connectionString: url }, { schema: schemaOf(url) });
  return new PrismaClient({ adapter });
}

/** O `?schema=` da URL separa dev, integração e e2e no mesmo banco. */
function schemaOf(url: string | undefined) {
  return url ? (new URL(url).searchParams.get('schema') ?? undefined) : undefined;
}

// Em desenvolvimento o Next recarrega os módulos a cada edição; guardar a
// instância em `globalThis` evita abrir um pool por recarga.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
// #endregion
