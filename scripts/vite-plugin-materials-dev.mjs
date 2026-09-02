import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(projectRoot, 'public');
const materialsDir = join(projectRoot, 'materials');

/** Prefixos de URL servidos a partir de `public/` que usam `index.html` por diretório. */
const MATERIAL_PREFIXES = ['/slides/', '/mindmaps/'];

/** Cliente do Vite injetado nas páginas de material para receber o recarregamento. */
const VITE_CLIENT_TAG = '<script type="module" src="/@vite/client"></script>';

/** Fontes em `materials/` e o script que regenera cada uma delas. */
const BUILDERS = [
  { suffix: '.slide.md', script: 'scripts/build-slides.mjs', label: 'slide' },
  { suffix: '.mindmap.md', script: 'scripts/build-mindmaps.mjs', label: 'mapa mental' },
];

/**
 * Remove o `base` do caminho da requisição.
 *
 * @param {string} pathname Caminho da URL, já decodificado.
 * @param {string} base Base configurada no Astro, sempre terminada em `/`.
 * @returns {string} Caminho relativo à raiz do site, iniciado por `/`.
 */
function stripBase(pathname, base) {
  if (base === '/' || !pathname.startsWith(base)) return pathname;
  return pathname.slice(base.length - 1);
}

/**
 * Resolve o arquivo de `public/` correspondente a uma URL de material.
 *
 * @param {string} pathname Caminho relativo à raiz do site.
 * @returns {string | null} Caminho absoluto do HTML existente ou `null`.
 */
function resolveMaterialFile(pathname) {
  if (!MATERIAL_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;

  const candidate = pathname.endsWith('/')
    ? join(publicDir, pathname, 'index.html')
    : join(publicDir, pathname);

  if (!candidate.endsWith('.html')) return null;
  if (!candidate.startsWith(publicDir + sep)) return null;
  if (!existsSync(candidate)) return null;

  return candidate;
}

/**
 * Executa um script de build de materiais e espera pelo término.
 *
 * @param {string} script Caminho do script relativo à raiz do projeto.
 * @returns {Promise<void>}
 */
function runBuilder(script) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(process.execPath, [join(projectRoot, script)], {
      cwd: projectRoot,
      stdio: ['ignore', 'ignore', 'pipe'],
    });

    let stderr = '';
    child.stderr?.on('data', (data) => {
      stderr += data;
    });

    child.on('close', (code) => {
      if (code === 0) resolveRun();
      else rejectRun(new Error(stderr || `Código ${code}`));
    });

    child.on('error', rejectRun);
  });
}

/**
 * Plugin de desenvolvimento para os materiais gerados em `public/`.
 *
 * Resolve `…/topico/` para `…/topico/index.html` (o servidor de desenvolvimento
 * não faz isso sozinho para arquivos estáticos) e regenera slides e mapas mentais
 * sempre que o arquivo de origem em `materials/` é salvo, recarregando a aba aberta.
 *
 * @returns {import('vite').Plugin}
 */
export default function materialsDev() {
  return {
    name: 'devlab:materials-dev',
    apply: 'serve',
    configureServer(server) {
      const base = server.config.base || '/';

      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next();

        let pathname;
        try {
          pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
        } catch {
          return next();
        }

        const file = resolveMaterialFile(stripBase(pathname, base));
        if (!file) return next();

        const html = readFileSync(file, 'utf8');
        const withClient = html.includes('</body>')
          ? html.replace('</body>', `${VITE_CLIENT_TAG}</body>`)
          : html + VITE_CLIENT_TAG;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store');
        res.end(req.method === 'HEAD' ? '' : withClient);
      });

      const pending = new Set();
      let timer = null;

      const rebuild = async () => {
        timer = null;
        const scripts = [...pending];
        pending.clear();

        for (const script of scripts) {
          const builder = BUILDERS.find((item) => item.script === script);
          try {
            await runBuilder(script);
            server.config.logger.info(`[materiais] ${builder?.label ?? script} atualizado`);
          } catch (error) {
            server.config.logger.error(
              `[materiais] falha ao gerar ${builder?.label ?? script}: ${error}`
            );
            return;
          }
        }

        (server.hot ?? server.ws).send({ type: 'full-reload', path: '*' });
      };

      const onChange = (file) => {
        if (!file.startsWith(materialsDir + sep)) return;

        const builder = BUILDERS.find((item) => file.endsWith(item.suffix));
        if (!builder) return;

        pending.add(builder.script);
        if (timer) clearTimeout(timer);
        timer = setTimeout(rebuild, 150);
      };

      server.watcher.add(materialsDir);
      server.watcher.on('change', onChange);
      server.watcher.on('add', onChange);
    },
  };
}
