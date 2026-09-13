import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const root = new URL('../../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');

const PAGES = [
  'index',
  'signin',
  'signup',
  'dashboard',
  'analytics',
  'movements',
  'dividends',
  'origins',
  'asset',
  'admin',
  'profile',
];

// #region build
describe('build multipagina (TK11-8)', () => {
  it('CA11.12: vite build gera as onze paginas e o bundle nao leva a chave de servico', () => {
    execSync('npx vite build --logLevel error', {
      cwd: root,
      stdio: 'pipe',
      // A chave entra no ambiente de proposito: se vazasse para o bundle, o grep pegaria.
      env: { ...process.env, SUPABASE_SERVICE_ROLE_KEY: 'chave-que-nao-pode-vazar' },
    });

    for (const page of PAGES) {
      expect(existsSync(new URL(`dist/pages/${page}.html`, root)), page).toBe(true);
    }

    const bundle = readdirSync(new URL('dist/assets/', root))
      .map((file) => read(`dist/assets/${file}`))
      .join('\n');
    expect(bundle).not.toContain('chave-que-nao-pode-vazar');
    expect(bundle).not.toContain('SUPABASE_SERVICE_ROLE_KEY');
  }, 60_000);
});
// #endregion

// #region vercel
describe('vercel.json (TK11-8)', () => {
  const config = JSON.parse(read('vercel.json'));

  it('CA11.13: URLs limpas para as onze rotas', () => {
    expect(config.cleanUrls).toBe(true);
    const sources = config.rewrites.map((r) => r.source).sort();
    expect(sources).toEqual(
      ['/', ...PAGES.filter((p) => p !== 'index').map((p) => `/${p}`)].sort()
    );
    for (const rewrite of config.rewrites) {
      expect(rewrite.destination).toMatch(/^\/pages\/[a-z]+\.html$/);
    }
  });

  it('CA11.13: cabecalhos de seguranca em toda resposta', () => {
    const [rule] = config.headers;
    const headers = Object.fromEntries(rule.headers.map((h) => [h.key, h.value]));

    expect(rule.source).toBe('/(.*)');
    expect(headers).toEqual({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    });
  });

  it('CA11.13: .vercelignore deixa supabase, testes e docs fora do upload', () => {
    const ignored = read('.vercelignore').split('\n').filter(Boolean);
    expect(ignored).toEqual(expect.arrayContaining(['supabase', 'tests', 'docs', '*.test.js']));
  });
});
// #endregion
