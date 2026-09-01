import { prisma } from '#database/prisma.ts';
import type { User } from '#types/user.ts';
import { hashPassword, verifyPassword } from '#utils/password.ts';

// #region public
/**
 * O `select` e a defesa: a coluna `password` nunca sai do banco.
 *
 * Nao e "lembrar de remover o campo antes de responder" — ele simplesmente nao
 * vem na consulta.
 */
const publicFields = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} as const;

function toUser(record: {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}): User {
  return { ...record, role: record.role as User['role'], createdAt: record.createdAt.toISOString() };
}
// #endregion

// #region create
export async function create(data: {
  name: string;
  email: string;
  password: string;
}): Promise<User> {
  const record = await prisma.user.create({
    // A senha e transformada em hash antes de chegar ao banco.
    data: { ...data, password: hashPassword(data.password) },
    select: publicFields,
  });

  return toUser(record);
}
// #endregion

export async function findById(id: string): Promise<User | undefined> {
  const record = await prisma.user.findUnique({ where: { id }, select: publicFields });

  return record ? toUser(record) : undefined;
}

export async function findByEmail(email: string): Promise<User | undefined> {
  const record = await prisma.user.findUnique({ where: { email }, select: publicFields });

  return record ? toUser(record) : undefined;
}

// #region authenticate
/**
 * Confere e-mail e senha.
 *
 * Esta e a unica funcao que le a coluna `password`, e ainda assim a senha nunca
 * sai daqui: o retorno e o usuario publico ou `undefined`.
 */
export async function authenticate(email: string, password: string): Promise<User | undefined> {
  const record = await prisma.user.findUnique({ where: { email } });

  if (!record || !verifyPassword(password, record.password)) {
    return undefined;
  }

  const { password: _password, ...user } = record;

  return toUser(user);
}
// #endregion
