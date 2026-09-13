// #region queryParams
/**
 * Lê um parâmetro da query string da URL atual ou retorna o valor padrão.
 * @param {string} key
 * @param {string} defaultValue
 * @returns {string}
 */
export function getQueryParam(key, defaultValue = '') {
  if (typeof window === 'undefined') return defaultValue;
  const params = new URLSearchParams(window.location.search);
  const val = params.get(key);
  return val !== null && val !== undefined && val !== '' ? val : defaultValue;
}

/**
 * Lê múltiplos parâmetros da query string com valores padrão.
 * @param {Record<string, string>} schema Objeto com chaves e valores padrão
 * @returns {Record<string, string>}
 */
export function getQueryParams(schema = {}) {
  const result = {};
  for (const [key, defaultVal] of Object.entries(schema)) {
    result[key] = getQueryParam(key, defaultVal);
  }
  return result;
}

/**
 * Atualiza os parâmetros na URL via history.replaceState sem recarregar a página.
 * Se o valor for null, undefined, vazio ou igual ao default, o parâmetro é removido da URL para mantê-la limpa.
 * @param {Record<string, string | number | boolean | null | undefined>} updates
 * @param {Record<string, any>} defaults Valores padrão para omitir da URL
 */
export function setQueryParams(updates = {}, defaults = {}) {
  if (typeof window === 'undefined' || !window.history?.replaceState) return;

  const url = new URL(window.location.href);
  const params = url.searchParams;

  for (const [key, val] of Object.entries(updates)) {
    if (
      val === null ||
      val === undefined ||
      val === '' ||
      (defaults[key] !== undefined && String(val) === String(defaults[key]))
    ) {
      params.delete(key);
    } else {
      params.set(key, String(val));
    }
  }

  const newSearch = params.toString();
  const newRelativePath = url.pathname + (newSearch ? `?${newSearch}` : '') + url.hash;
  window.history.replaceState(window.history.state, '', newRelativePath);
}
// #endregion
