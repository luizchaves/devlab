import { describe, expect, it, vi } from 'vitest';

vi.mock('../../src/lib/session', () => ({
  requireSession: async () => ({ user: { id: 'user-1', role: 'INVESTOR' } }),
}));

vi.mock('../../src/lib/prisma', () => ({
  prisma: {
    asset: {
      findMany: async () => [],
    },
  },
}));

describe('/api/portfolio', () => {
  it('returns demo portfolio when the authenticated user has no assets', async () => {
    const route = await import('../../app/api/portfolio/route');
    const response = await route.GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.assets.length).toBeGreaterThan(0);
    expect(body.total).toBeGreaterThan(0);
  });
});
