import { vi } from 'vitest';
import { auth } from '@/server/auth';
import { prisma } from '@/server/prisma';
import { createUser } from '@/server/users';

// #region helpers
/** Sessão simulada (ver `setup.ts`): o `auth()` devolve o usuário escolhido pelo teste. */
const authMock = vi.mocked(auth as unknown as () => Promise<unknown>);

export function actAs(user: { id: string; role?: 'INVESTOR' | 'ADMIN' } | null) {
  authMock.mockResolvedValue(user ? { user: { id: user.id, role: user.role ?? 'INVESTOR' } } : null);
}

export async function resetTables() {
  await prisma.user.deleteMany();
  authMock.mockReset();
}

export async function createAccounts() {
  const ana = await createUser({ name: 'Ana', email: 'ana@example.com', password: 'segredo123' });
  const bia = await createUser({ name: 'Bia', email: 'bia@example.com', password: 'segredo123' });
  return { ana, bia };
}

export function jsonRequest(method: string, body: unknown) {
  return new Request('http://localhost/api', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export const params = (id: string) => ({ params: Promise.resolve({ id }) });
// #endregion
