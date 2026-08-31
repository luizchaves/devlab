import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

// #region adapter
/**
 * A partir do Prisma 7, o client recebe um *driver adapter*: quem fala com o
 * banco e o driver, e nao mais um binario proprio do Prisma. A string de
 * conexao vem do `prisma.config.ts` / `.env`.
 */
const adapter = new PrismaBetterSqlite3({ url: `${process.env.DATABASE_URL}` });

/** Uma unica instancia, compartilhada por todos os models. */
export const prisma = new PrismaClient({ adapter });
// #endregion
