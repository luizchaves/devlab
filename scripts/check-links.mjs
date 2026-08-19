#!/usr/bin/env node
/**
 * Validação de links internos do site já construído.
 *
 * Roda sobre `dist/`, depois do `astro build`. Percorre cada página, resolve
 * todo link interno (relativo ou absoluto) contra a URL real da página e
 * verifica se o destino existe — página, arquivo estático ou âncora.
 *
 * Por que um script e não o `starlight-links-validator`: aquele plugin ignora
 * links relativos (`errorOnRelativeLinks: false`) ou os rejeita por serem
 * relativos (`true`). Como este projeto usa links relativos justamente para
 * sobreviver ao `base` do GitHub Pages, ele não validaria praticamente nada.
 *
 * Uso: `pnpm check:links` (ou `pnpm validate`, que já o inclui).
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { BASE_PATH } from '../site.config.mjs';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(projectRoot, 'dist');
const base = BASE_PATH === '/' ? '' : BASE_PATH.replace(/\/$/, '');

if (!existsSync(distDir)) {
  console.error('dist/ não encontrado. Rode `pnpm build` antes de `pnpm check:links`.');
  process.exit(1);
}

/** Todos os arquivos .html gerados. */
function listHtmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });
}

const htmlFiles = listHtmlFiles(distDir);

/** URL pública de uma página. `index.html` vira diretorio; outros `.html` preservam o nome. */
function pageUrl(file) {
  const segments = relative(distDir, file).split(sep).filter(Boolean);
  const fileName = segments.at(-1);

  if (fileName === 'index.html') {
    const dirSegments = segments.slice(0, -1);
    return `${base}/${dirSegments.length ? `${dirSegments.join('/')}/` : ''}`;
  }

  return `${base}/${segments.join('/')}`;
}

// Índice de âncoras por página, para validar fragmentos (#secao).
const anchorsByUrl = new Map();
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf-8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
  anchorsByUrl.set(pageUrl(file), ids);
}

/** O caminho aponta para uma página, um arquivo estático ou nada? */
function resolveTarget(pathname) {
  if (!pathname.startsWith(base)) return { kind: 'fora-do-base' };

  const rel = pathname.slice(base.length).replace(/^\//, '');

  if (anchorsByUrl.has(`${base}/${rel}`)) return { kind: 'page', url: `${base}/${rel}` };

  const asFile = join(distDir, rel);
  if (existsSync(asFile) && statSync(asFile).isFile()) return { kind: 'asset' };

  const asIndex = join(distDir, rel, 'index.html');
  if (existsSync(asIndex)) return { kind: 'page', url: `${base}/${rel.replace(/\/?$/, '/')}` };

  return { kind: 'missing' };
}

const problems = [];
let checked = 0;

for (const file of htmlFiles) {
  const from = pageUrl(file);
  const html = readFileSync(file, 'utf-8');

  for (const match of html.matchAll(/\shref="([^"]+)"/g)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(href)) continue;

    let url;
    try {
      url = new URL(href, `http://local${from}`);
    } catch {
      continue;
    }
    if (url.origin !== 'http://local') continue;

    checked += 1;
    const target = resolveTarget(url.pathname);

    if (target.kind === 'missing' || target.kind === 'fora-do-base') {
      problems.push({ from, href, resolved: url.pathname, reason: 'destino inexistente' });
      continue;
    }

    // Fragmento: a âncora precisa existir na página de destino.
    if (url.hash && target.kind === 'page') {
      const anchor = decodeURIComponent(url.hash.slice(1));
      if (anchor && !anchorsByUrl.get(target.url)?.has(anchor)) {
        problems.push({
          from,
          href,
          resolved: url.pathname,
          reason: `âncora #${anchor} não existe`,
        });
      }
    }
  }
}

console.log(`${htmlFiles.length} páginas · ${checked} links internos verificados`);

if (problems.length === 0) {
  console.log('Nenhum link quebrado.');
  process.exit(0);
}

console.error(`\n${problems.length} link(s) quebrado(s):\n`);
for (const problem of problems) {
  console.error(`  ${problem.from}`);
  console.error(`    ${problem.href}  →  ${problem.resolved}  (${problem.reason})\n`);
}
process.exit(1);
