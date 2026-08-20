#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const slidesDir = join(projectRoot, 'slides');
const outputDir = join(projectRoot, 'public', 'slides');

function listMarkdownFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return listMarkdownFiles(full);
    return entry.name.endsWith('.md') ? [full] : [];
  });
}

if (!existsSync(slidesDir)) {
  console.log('slides/ não encontrado. Nenhum slide gerado.');
  process.exit(0);
}

const slideFiles = listMarkdownFiles(slidesDir);

if (slideFiles.length === 0) {
  console.log('Nenhum arquivo .md encontrado em slides/.');
  process.exit(0);
}

for (const slideFile of slideFiles) {
  const rel = relative(slidesDir, slideFile).replace(/\.md$/, '.html');
  const outputFile = join(outputDir, rel);

  mkdirSync(dirname(outputFile), { recursive: true });

  const result = spawnSync('marp', ['--no-stdin', slideFile, '-o', outputFile], {
    shell: process.platform === 'win32',
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`${slideFiles.length} slide(s) gerado(s).`);
