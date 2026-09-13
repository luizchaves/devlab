import { beforeEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@/server/prisma';
import { createUser, EmailInUseError, verifyCredentials } from '@/server/users';

// O NextAuth lê cookies da requisição; aqui a sessão é simulada por módulo.
const authMock = vi.hoisted(() => vi.fn());
vi.mock('@/server/auth', () => ({ auth: authMock }));

beforeEach(async () => {
  await prisma.user.deleteMany();
  authMock.mockReset();
});

describe('contas', () => {
  it('CA02.1 — um cadastro válido cria o usuário com papel de investidor e senha em hash', async () => {
    const user = await createUser({ name: 'Ana', email: 'ana@example.com', password: 'segredo123' });
    const stored = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });

    expect(user.role).toBe('INVESTOR');
    expect(stored.passwordHash).toMatch(/^scrypt\$/);
    expect(stored.passwordHash).not.toContain('segredo123');
  });

  it('recusa e-mail repetido', async () => {
    await createUser({ name: 'Ana', email: 'ana@example.com', password: 'segredo123' });

    await expect(
      createUser({ name: 'Outra', email: 'ana@example.com', password: 'outrasenha' })
    ).rejects.toBeInstanceOf(EmailInUseError);
  });

  it('CA02.2 — credenciais válidas devolvem o usuário; senha errada e e-mail inexistente devolvem o mesmo null', async () => {
    await createUser({ name: 'Ana', email: 'ana@example.com', password: 'segredo123' });

    await expect(verifyCredentials('ana@example.com', 'segredo123')).resolves.toMatchObject({
      email: 'ana@example.com',
    });
    await expect(verifyCredentials('ana@example.com', 'errada123')).resolves.toBeNull();
    await expect(verifyCredentials('ninguem@example.com', 'segredo123')).resolves.toBeNull();
  });
});

describe('GET /api/me', () => {
  it('CA02.4 — sem sessão responde 401', async () => {
    authMock.mockResolvedValue(null);
    const { GET } = await import('../../app/api/me/route');

    const response = await GET();
    expect(response.status).toBe(401);
  });

  it('CA02.3 — com sessão devolve o perfil sem o hash da senha', async () => {
    const user = await createUser({ name: 'Ana', email: 'ana@example.com', password: 'segredo123' });
    authMock.mockResolvedValue({ user: { id: user.id, role: 'INVESTOR' } });
    const { GET } = await import('../../app/api/me/route');

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.user).toMatchObject({ id: user.id, email: 'ana@example.com', name: 'Ana' });
    expect(body.user).not.toHaveProperty('passwordHash');
  });
});
