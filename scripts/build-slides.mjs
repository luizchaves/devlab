#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const materialsDir = join(projectRoot, 'materials');
const outputDir = join(projectRoot, 'public', 'slides');

function listSlideFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return listSlideFiles(full);
    return entry.name.endsWith('.slide.md') ? [full] : [];
  });
}

if (!existsSync(materialsDir)) {
  console.log('materials/ não encontrado. Nenhum slide gerado.');
  process.exit(0);
}

const slideFiles = listSlideFiles(materialsDir);

if (slideFiles.length === 0) {
  console.log('Nenhum arquivo *.slide.md encontrado em materials/.');
  process.exit(0);
}

for (const slideFile of slideFiles) {
  const rel = slideFile.endsWith('/index.slide.md')
    ? relative(materialsDir, slideFile).replace(/\.slide\.md$/, '.html')
    : relative(materialsDir, slideFile).replace(/\.slide\.md$/, '/index.html');
  const outputFile = join(outputDir, rel);

  mkdirSync(dirname(outputFile), { recursive: true });

  const result = spawnSync('marp', ['--no-stdin', '--html', slideFile, '-o', outputFile], {
    shell: process.platform === 'win32',
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`${slideFiles.length} slide(s) gerado(s).`);
