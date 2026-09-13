import type { Role } from '@/generated/prisma/client';
import { hashPassword, verifyPassword } from './password';
import { prisma } from './prisma';

export type PublicUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarPath: string | null;
  createdAt: Date;
};

const publicFields = {
  id: true,
  email: true,
  name: true,
  role: true,
  avatarPath: true,
  createdAt: true,
} as const;

export class EmailInUseError extends Error {
  constructor() {
    super('E-mail já cadastrado.');
    this.name = 'EmailInUseError';
  }
}

// #region create
/** Cria a conta; o e-mail já chega normalizado pelo schema de `core/auth`. */
export async function createUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<PublicUser> {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new EmailInUseError();

  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash: hashPassword(input.password),
    },
    select: publicFields,
  });
}
// #endregion

// #region verify
/**
 * Devolve o usuário se e-mail e senha conferem; `null` em qualquer outro caso.
 * E-mail inexistente e senha errada terminam no mesmo `null` (CA02.2).
 */
export async function verifyCredentials(email: string, password: string): Promise<PublicUser | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatarPath: user.avatarPath,
    createdAt: user.createdAt,
  };
}
// #endregion

export function findUserById(id: string): Promise<PublicUser | null> {
  return prisma.user.findUnique({ where: { id }, select: publicFields });
}
