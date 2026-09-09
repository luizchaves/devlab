// Versão como um assistente costuma gerar a partir de "carregue os itens da API
// e devolva os nomes": o caminho feliz funciona, e a resposta de erro do
// servidor é consumida como se fosse a lista pedida.
export async function loadItems(url, fetchImpl = fetch) {
  const response = await fetchImpl(url);
  const data = await response.json();

  return data.map((item) => item.name);
}
