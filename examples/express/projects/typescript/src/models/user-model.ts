import type { User, UserInput } from '#types/user.ts';

/**
 * Model em memoria.
 *
 * O controller nunca toca neste array: conhece apenas as funcoes exportadas
 * aqui. Trocar por Prisma muda somente este arquivo.
 */
let users: User[] = [
  { id: 1, name: 'Ana', email: 'ana@example.com' },
  { id: 2, name: 'Bruno', email: 'bruno@example.com' },
];

let nextId = 3;

export function findAll(): User[] {
  return users;
}

export function findById(id: number): User | undefined {
  return users.find((user) => user.id === id);
}

export function findByEmail(email: string): User | undefined {
  return users.find((user) => user.email === email);
}

export function create({ name, email }: Required<UserInput>): User {
  const user: User = { id: nextId, name, email };

  nextId += 1;
  users.push(user);

  return user;
}

export function update(id: number, data: UserInput): User | undefined {
  const user = findById(id);

  if (!user) return undefined;

  if (data.name !== undefined) user.name = data.name;
  if (data.email !== undefined) user.email = data.email;

  return user;
}

export function remove(id: number): boolean {
  const sizeBefore = users.length;

  users = users.filter((user) => user.id !== id);

  return users.length < sizeBefore;
}
