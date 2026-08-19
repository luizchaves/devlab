#!/usr/bin/env node
import { rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicExamplesDir = join(projectRoot, 'public', 'examples');

rmSync(publicExamplesDir, { recursive: true, force: true });
console.log('public/examples/ limpo.');
