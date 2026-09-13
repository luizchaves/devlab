import { vi } from 'vitest';

// O NextAuth lê cookies da requisição; nos testes de integração a sessão é
// simulada: `actAs()` em `helpers.ts` decide quem está autenticado.
vi.mock('@/server/auth', () => ({ auth: vi.fn() }));
