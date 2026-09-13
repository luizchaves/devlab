import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const hook = process.argv[2];

const hookScripts = {
  'pre-commit': ['lint', 'typecheck'],
  'pre-push': ['test', 'build'],
};

const scriptsToRun = hookScripts[hook];
if (!scriptsToRun) {
  console.error(`Unknown hook: ${hook}`);
  process.exit(1);
}

const packageDirs = ['', 'back', 'front'].filter((dir) =>
  existsSync(join(projectRoot, dir, 'package.json'))
);
let ran = 0;

function packageManagerFor(packageDir) {
  if (existsSync(join(packageDir, 'pnpm-lock.yaml'))) {
    return { bin: 'pnpm', args: ['run'] };
  }

  if (existsSync(join(packageDir, 'package-lock.json'))) {
    return { bin: 'npm', args: ['run'] };
  }

  return { bin: 'pnpm', args: ['run'] };
}

for (const dir of packageDirs) {
  const packageDir = join(projectRoot, dir);
  const packageJsonPath = join(packageDir, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const availableScripts = packageJson.scripts ?? {};
  const selectedScripts = scriptsToRun.filter((script) => availableScripts[script]);

  if (selectedScripts.length === 0) {
    continue;
  }

  const label = dir || basename(projectRoot);
  const manager = packageManagerFor(packageDir);

  for (const script of selectedScripts) {
    console.log(`[husky:${hook}] ${label}: ${manager.bin} run ${script}`);
    const result = spawnSync(manager.bin, [...manager.args, script], {
      cwd: packageDir,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    if (result.status !== 0) {
      console.error(`[husky:${hook}] Failed in ${relative(projectRoot, packageDir) || '.'}: ${script}`);
      process.exit(result.status ?? 1);
    }

    ran += 1;
  }
}

if (ran === 0) {
  console.log(`[husky:${hook}] No matching package scripts found.`);
}
