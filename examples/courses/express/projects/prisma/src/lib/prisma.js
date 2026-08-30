import { PrismaClient } from '@prisma/client';

/**
 * Uma unica instancia do PrismaClient para toda a aplicacao.
 * Criar um cliente por requisicao esgotaria o pool de conexoes.
 */
const prisma = new PrismaClient();

export default prisma;
