import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import nextConfig from '../../next.config';

const ROOT = join(import.meta.dirname, '..', '..');
const STATIC = join(ROOT, '.next', 'static');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

// #region build
/**
 * Roda contra o `next build` (RF22): o bundle do navegador não pode carregar
 * a service role nem o `AUTH_SECRET` (RNF02, RNF06), e toda resposta leva os
 * cabeçalhos de segurança. `pnpm test:build` faz o build antes.
 */
describe('publicação', () => {
  beforeAll(() => {
    if (!existsSync(STATIC)) execSync('pnpm build', { cwd: ROOT, stdio: 'inherit' });
  }, 300_000);

  it('CA11.12 — o bundle do navegador só leva variáveis públicas', () => {
    const files = walk(STATIC).filter((f) => f.endsWith('.js'));
    expect(files.length).toBeGreaterThan(0);
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
    const secret = process.env.AUTH_SECRET ?? '';
    for (const file of files) {
      const text = readFileSync(file, 'utf8');
      if (serviceRole) expect(text, file).not.toContain(serviceRole);
      if (secret) expect(text, file).not.toContain(secret);
      expect(text, file).not.toContain('SUPABASE_SERVICE_ROLE_KEY');
    }
  });

  it('CA11.13 — cabeçalhos de segurança em toda resposta', async () => {
    const [rule] = await nextConfig.headers!();
    expect(rule.source).toBe('/(.*)');
    const keys = rule.headers.map((h) => h.key);
    expect(keys).toEqual(expect.arrayContaining(['X-Frame-Options', 'X-Content-Type-Options', 'Referrer-Policy']));
  });
});
// #endregion
