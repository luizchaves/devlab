#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicExamplesDir = join(projectRoot, 'public', 'examples');
const distExamplesDir = join(projectRoot, 'dist', 'examples');

if (!existsSync(publicExamplesDir)) {
  console.log('public/examples/ não encontrado. Nenhum preview público sincronizado.');
  process.exit(0);
}

mkdirSync(distExamplesDir, { recursive: true });
cpSync(publicExamplesDir, distExamplesDir, {
  recursive: true,
  force: true,
});

console.log('Previews públicos sincronizados em dist/examples/.');
