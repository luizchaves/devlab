/**
 * Configuracao compartilhada entre `astro.config.mjs` e os componentes.
 *
 * Altere estes valores (ou defina as variaveis de ambiente correspondentes no
 * CI) para publicar o site em outro usuario/repositorio. Veja o README.
 */

/** Origem do site publicado, sem caminho. */
export const SITE_URL = process.env.SITE_URL ?? 'https://lucachaves.github.io';

/** Caminho base. Use `/<repositorio>` no GitHub Pages de projeto, ou `/` em dominio proprio. */
export const BASE_PATH = process.env.BASE_PATH ?? '/classroom';

/** Repositorio usado nos links "Editar esta pagina" e "Ver codigo-fonte". */
export const REPO_URL = process.env.REPO_URL ?? 'https://github.com/lucachaves/classroom';

/** Branch usada nos links para o codigo-fonte. */
export const REPO_BRANCH = process.env.REPO_BRANCH ?? 'main';
