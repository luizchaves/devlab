import { REPO_BRANCH, REPO_URL } from '../../site.config.mjs';

export { REPO_BRANCH, REPO_URL };

/** Prefixa um caminho interno com o `base` configurado no Astro. */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}` || '/';
}

/** URL do arquivo/diretorio no repositorio, para links "Ver codigo-fonte". */
export function repoUrl(path: string): string {
  const normalized = path.replace(/^\.?\//, '');
  return `${REPO_URL}/tree/${REPO_BRANCH}/${normalized}`;
}
