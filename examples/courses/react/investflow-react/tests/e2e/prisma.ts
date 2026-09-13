import { createPrismaClient } from '../../src/server/prisma.ts';
import { databaseUrlFor } from '../database.ts';

// Cliente apontado para o schema `e2e`: promoção a admin é operação de banco, nunca uma tela.
export const e2ePrisma = createPrismaClient(databaseUrlFor('e2e'));
