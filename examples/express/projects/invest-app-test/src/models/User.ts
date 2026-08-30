import prisma from '@/database/database.ts';
import type { PublicUser, UserInput } from '@/types/User.d.ts';
import { hashPassword } from '@/utils/password.ts';

/**
 * A senha nunca sai do banco: o `select` lista os campos publicos e omite o
 * hash. Assim nenhuma rota precisa lembrar de apaga-lo antes de responder.
 */
const select = { id: true, name: true, email: true, image: { select: { path: true } } };

async function create({ name, email, password }: UserInput): Promise<PublicUser> {
  if (!name || !email || !password) {
    throw new Error('Unable to create user');
  }

  // O hash e derivado aqui, dentro do model: qualquer origem que crie usuario
  // — rota, seeder, script — passa obrigatoriamente por este caminho.
  const hash = hashPassword(password);

  return await prisma.user.create({
    data: { name, email, password: hash },
    select,
  });
}

async function read(where?: { email?: string }): Promise<PublicUser[]> {
  return await prisma.user.findMany({ where, select });
}

async function readById(id: string): Promise<PublicUser> {
  const user = await prisma.user.findUnique({ where: { id }, select });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

/** A unica funcao que devolve o hash — usada so pelo login da etapa 8. */
async function readByEmailWithPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}

export default { create, read, readById, readByEmailWithPassword };
