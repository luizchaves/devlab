#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { availableParallelism } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const materialsDir = join(projectRoot, 'materials');
const outputDir = join(projectRoot, 'public', 'mindmaps');
const force = process.argv.includes('--force');

const controlsStyle = `<style>
.mindmap-level-controls {
  align-items: center;
  background: color-mix(in srgb, white 92%, transparent);
  border: 1px solid #d4d4d8;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgb(24 24 27 / 12%);
  color: #27272a;
  display: flex;
  font: 600 13px/1 ui-sans-serif, system-ui, sans-serif;
  gap: 6px;
  left: 14px;
  padding: 8px;
  position: fixed;
  top: 14px;
  z-index: 10;
}
.mindmap-level-controls span {
  padding: 0 4px;
}
.mindmap-level-controls button {
  appearance: none;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: inherit;
  cursor: pointer;
  font: inherit;
  min-width: 30px;
  padding: 6px 8px;
}
.mindmap-level-controls button:hover {
  background: #f4f4f5;
}
.mindmap-level-controls button[aria-pressed="true"] {
  background: #18181b;
  color: white;
}
.markmap-dark .mindmap-level-controls {
  background: color-mix(in srgb, #27272a 92%, transparent);
  border-color: #52525b;
  color: #f4f4f5;
}
.markmap-dark .mindmap-level-controls button:hover {
  background: #3f3f46;
}
.markmap-dark .mindmap-level-controls button[aria-pressed="true"] {
  background: #f4f4f5;
  color: #18181b;
}
</style>`;

const controlsMarkup = `<div class="mindmap-level-controls" aria-label="Níveis abertos do mapa mental">
  <span>Níveis</span>
  <button type="button" data-mindmap-level="2" aria-pressed="true">2</button>
  <button type="button" data-mindmap-level="3" aria-pressed="false">3</button>
  <button type="button" data-mindmap-level="4" aria-pressed="false">4</button>
  <button type="button" data-mindmap-level="0" aria-pressed="false">Todos</button>
</div>`;

const controlsScript = `<script>
(() => {
  const defaultLevel = 2;
  const buttons = () => Array.from(document.querySelectorAll('[data-mindmap-level]'));
  const clone = (value) => JSON.parse(JSON.stringify(value));

  function setActive(level) {
    for (const button of buttons()) {
      button.setAttribute('aria-pressed', String(Number(button.dataset.mindmapLevel) === level));
    }
  }

  async function applyLevel(level) {
    if (!window.mm || !window.__mindmapSourceData) return;

    const expandLevel = level === 0 ? 99 : level;

    await window.mm.setData(clone(window.__mindmapSourceData), {
      ...(window.__mindmapSourceOptions || {}),
      initialExpandLevel: expandLevel,
    });
    await window.mm.fit();
    setActive(level);
  }

  function install() {
    for (const button of buttons()) {
      button.addEventListener('click', () => applyLevel(Number(button.dataset.mindmapLevel)));
    }
    setActive(defaultLevel);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install);
  } else {
    install();
  }
})();
</script>`;

function listMindmapFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return listMindmapFiles(full);
    return entry.name.endsWith('.mindmap.md') ? [full] : [];
  });
}

function getBinaryPath(name) {
  const localBin = join(
    projectRoot,
    'node_modules',
    '.bin',
    name + (process.platform === 'win32' ? '.cmd' : '')
  );
  return existsSync(localBin) ? localBin : name;
}

async function mapConcurrent(items, limit, fn) {
  let index = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const i = index++;
      await fn(items[i], i);
    }
  });
  await Promise.all(workers);
}

function runMarkmap(mindmapFile, outputFile) {
  return new Promise((resolve, reject) => {
    const markmapBin = getBinaryPath('markmap');
    const child = spawn(markmapBin, [mindmapFile, '-o', outputFile, '--offline', '--no-open'], {
      shell: process.platform === 'win32',
      stdio: ['ignore', 'ignore', 'pipe'],
    });

    let stderr = '';
    child.stderr?.on('data', (data) => {
      stderr += data;
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(
          new Error(`Falha ao gerar mapa mental (${mindmapFile}):\n${stderr || `Código ${code}`}`)
        );
      }
    });

    child.on('error', (err) => {
      reject(new Error(`Erro ao executar markmap em ${mindmapFile}: ${err.message}`));
    });
  });
}

function addControls(outputFile) {
  let html = readFileSync(outputFile, 'utf-8');

  html = html.replace('</head>', `${controlsStyle}\n</head>`);
  html = html.replace('<body>', `<body>\n${controlsMarkup}`);

  const initNeedle = 'const markmap = getMarkmap();';
  const initReplacement = `${initNeedle}
              window.__mindmapSourceData = JSON.parse(JSON.stringify(root2));
              window.__mindmapSourceOptions = { ...jsonOptions };`;

  if (!html.includes(initReplacement)) {
    html = html.replace(initNeedle, initReplacement);
  }

  html = html.replace('</body>', `${controlsScript}\n</body>`);

  writeFileSync(outputFile, html);
}

async function main() {
  if (!existsSync(materialsDir)) {
    console.log('materials/ não encontrado. Nenhum mapa mental gerado.');
    process.exit(0);
  }

  const mindmapFiles = listMindmapFiles(materialsDir);

  if (mindmapFiles.length === 0) {
    console.log('Nenhum arquivo *.mindmap.md encontrado em materials/.');
    process.exit(0);
  }

  const pending = [];
  let cachedCount = 0;

  for (const mindmapFile of mindmapFiles) {
    const rel = mindmapFile.endsWith('/index.mindmap.md')
      ? relative(materialsDir, mindmapFile).replace(/\.mindmap\.md$/, '.html')
      : relative(materialsDir, mindmapFile).replace(/\.mindmap\.md$/, '/index.html');
    const outputFile = join(outputDir, rel);

    if (!force && existsSync(outputFile)) {
      const sourceMtime = statSync(mindmapFile).mtimeMs;
      const targetMtime = statSync(outputFile).mtimeMs;
      if (targetMtime >= sourceMtime) {
        cachedCount++;
        continue;
      }
    }

    pending.push({ mindmapFile, outputFile });
  }

  if (pending.length === 0) {
    console.log(
      `✓ Todos os ${mindmapFiles.length} mapa(s) mental(is) estão em cache e atualizados.`
    );
    return;
  }

  const concurrency = Math.max(1, Math.min(availableParallelism?.() ?? 4, 16));

  await mapConcurrent(pending, concurrency, async ({ mindmapFile, outputFile }) => {
    mkdirSync(dirname(outputFile), { recursive: true });
    await runMarkmap(mindmapFile, outputFile);
    addControls(outputFile);
  });

  const cacheMsg = cachedCount > 0 ? ` (${cachedCount} em cache)` : '';
  console.log(
    `${pending.length} mapa(s) mental(is) gerado(s)${cacheMsg} com concorrência ${concurrency}.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
