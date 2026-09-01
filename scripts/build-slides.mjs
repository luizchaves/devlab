#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { availableParallelism } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const materialsDir = join(projectRoot, 'materials');
const outputDir = join(projectRoot, 'public', 'slides');
const force = process.argv.includes('--force');

function listSlideFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return listSlideFiles(full);
    return entry.name.endsWith('.slide.md') ? [full] : [];
  });
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

function getBinaryPath(name) {
  const localBin = join(
    projectRoot,
    'node_modules',
    '.bin',
    name + (process.platform === 'win32' ? '.cmd' : '')
  );
  return existsSync(localBin) ? localBin : name;
}

function runMarp(slideFile, outputFile) {
  return new Promise((resolve, reject) => {
    const marpBin = getBinaryPath('marp');
    const child = spawn(marpBin, ['--no-stdin', '--html', slideFile, '-o', outputFile], {
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
        reject(new Error(`Falha ao gerar slide (${slideFile}):\n${stderr || `Código ${code}`}`));
      }
    });

    child.on('error', (err) => {
      reject(new Error(`Erro ao executar marp em ${slideFile}: ${err.message}`));
    });
  });
}

async function main() {
  if (!existsSync(materialsDir)) {
    console.log('materials/ não encontrado. Nenhum slide gerado.');
    process.exit(0);
  }

  const slideFiles = listSlideFiles(materialsDir);

  if (slideFiles.length === 0) {
    console.log('Nenhum arquivo *.slide.md encontrado em materials/.');
    process.exit(0);
  }

  const pending = [];
  let cachedCount = 0;

  for (const slideFile of slideFiles) {
    const rel = slideFile.endsWith('/index.slide.md')
      ? relative(materialsDir, slideFile).replace(/\.slide\.md$/, '.html')
      : relative(materialsDir, slideFile).replace(/\.slide\.md$/, '/index.html');
    const outputFile = join(outputDir, rel);

    if (!force && existsSync(outputFile)) {
      const sourceMtime = statSync(slideFile).mtimeMs;
      const targetMtime = statSync(outputFile).mtimeMs;
      if (targetMtime >= sourceMtime) {
        cachedCount++;
        continue;
      }
    }

    pending.push({ slideFile, outputFile });
  }

  if (pending.length === 0) {
    console.log(`✓ Todos os ${slideFiles.length} slide(s) estão em cache e atualizados.`);
    return;
  }

  const concurrency = Math.max(1, Math.min(availableParallelism?.() ?? 4, 16));

  await mapConcurrent(pending, concurrency, async ({ slideFile, outputFile }) => {
    mkdirSync(dirname(outputFile), { recursive: true });
    await runMarp(slideFile, outputFile);
  });

  const cacheMsg = cachedCount > 0 ? ` (${cachedCount} em cache)` : '';
  console.log(`${pending.length} slide(s) gerado(s)${cacheMsg} com concorrência ${concurrency}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
