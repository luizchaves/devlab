// Versão corrigida: o status é conferido antes de o corpo ser consumido, e a
// falha de aplicação passa a percorrer o mesmo caminho da falha de rede.
export async function loadItems(url, fetchImpl = fetch) {
  const response = await fetchImpl(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ao carregar ${url}`);
  }

  const data = await response.json();

  return data.map((item) => item.name);
}
