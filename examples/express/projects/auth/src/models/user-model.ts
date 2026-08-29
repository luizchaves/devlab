import { randomUUID } from 'node:crypto';
import type { User, UserWithPassword } from '#types/index.ts';
import { hashPassword } from '#utils/password.ts';

/**
 * Store em memoria — trocavel por Prisma sem mexer em controllers.
 *
 * A senha e gravada ja como hash: o texto em claro nunca chega a este array.
 */
const users: UserWithPassword[] = [];

/** Remove a senha antes de qualquer coisa sair do model. */
function toPublic({ password: _password, ...user }: UserWithPassword): User {
  return user;
}

export function create({
  name,
  email,
  password,
  role = 'user',
}: {
  name: string;
  email: string;
  password: string;
  role?: User['role'];
}): User {
  const user: UserWithPassword = {
    id: randomUUID(),
    name,
    email,
    role,
    password: hashPassword(password),
  };

  users.push(user);

  return toPublic(user);
}

export function findAll(): User[] {
  return users.map(toPublic);
}

export function findById(id: string): User | undefined {
  const user = users.find((candidate) => candidate.id === id);

  return user && toPublic(user);
}

/** Unico ponto que devolve o hash — usado apenas no login. */
export function findByEmailWithPassword(email: string): UserWithPassword | undefined {
  return users.find((candidate) => candidate.email === email);
}

export function existsByEmail(email: string): boolean {
  return users.some((candidate) => candidate.email === email);
}

// Usuario de demonstracao, para o projeto responder logo apos subir.
create({ name: 'Ana', email: 'ana@example.com', password: 'senha-secreta', role: 'admin' });
