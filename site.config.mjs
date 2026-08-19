import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Configuracao compartilhada entre `astro.config.mjs`, scripts e componentes.
 *
 * Os valores podem ser sobrescritos por variaveis de ambiente. Sem variaveis,
 * o caminho base usa o nome do pacote em `package.json`, o que reduz edicoes ao
 * renomear o repositorio.
 */

function getPackageName() {
  if (process.env.npm_package_name) return process.env.npm_package_name;

  try {
    const packageJson = JSON.parse(readFileSync(resolve(process.cwd(), 'package.json'), 'utf-8'));
    return packageJson.name;
  } catch {
    return 'devlab';
  }
}

const [repositoryOwnerFromName, repositoryNameFromName] = (
  process.env.GITHUB_REPOSITORY ?? ''
).split('/');
const repositoryOwner =
  process.env.GITHUB_REPOSITORY_OWNER ||
  repositoryOwnerFromName ||
  process.env.REPO_OWNER ||
  'luizchaves';
const repositoryName = repositoryNameFromName || getPackageName();
const githubServerUrl = process.env.GITHUB_SERVER_URL || 'https://github.com';

function normalizeBasePath(path) {
  if (!path || path === '/') return '/';
  return `/${path.replace(/^\/+/, '').replace(/\/+$/, '')}`;
}

const defaultBasePath =
  repositoryName === `${repositoryOwner}.github.io` ? '/' : `/${repositoryName}`;

/** Origem do site publicado, sem caminho. */
export const SITE_URL = process.env.SITE_URL ?? `https://${repositoryOwner}.github.io`;

/** Caminho base. Use `/<repositorio>` no GitHub Pages de projeto, ou `/` em dominio proprio. */
export const BASE_PATH = normalizeBasePath(process.env.BASE_PATH ?? defaultBasePath);

/** Repositorio usado nos links "Editar esta pagina" e "Ver codigo-fonte". */
export const REPO_URL =
  process.env.REPO_URL ?? `${githubServerUrl}/${repositoryOwner}/${repositoryName}`;

/** Branch usada nos links para o codigo-fonte. */
export const REPO_BRANCH =
  process.env.REPO_BRANCH || process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || 'main';
