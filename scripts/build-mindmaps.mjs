#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mindmapsDir = join(projectRoot, 'mindmaps');
const outputDir = join(projectRoot, 'public', 'mindmaps');

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

function listMarkdownFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return listMarkdownFiles(full);
    return entry.name.endsWith('.md') ? [full] : [];
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

if (!existsSync(mindmapsDir)) {
  console.log('mindmaps/ não encontrado. Nenhum mapa mental gerado.');
  process.exit(0);
}

const mindmapFiles = listMarkdownFiles(mindmapsDir);

if (mindmapFiles.length === 0) {
  console.log('Nenhum arquivo .md encontrado em mindmaps/.');
  process.exit(0);
}

for (const mindmapFile of mindmapFiles) {
  const rel = relative(mindmapsDir, mindmapFile).replace(/\.md$/, '.html');
  const outputFile = join(outputDir, rel);

  mkdirSync(dirname(outputFile), { recursive: true });

  const result = spawnSync('markmap', [mindmapFile, '-o', outputFile, '--offline', '--no-open'], {
    shell: process.platform === 'win32',
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }

  addControls(outputFile);
}

console.log(`${mindmapFiles.length} mapa(s) mental(is) gerado(s).`);
