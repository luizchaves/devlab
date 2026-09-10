// #region build-info
// import.meta.env.BASE_URL é resolvido no build, e vale '/' ou '/<repositorio>/'
// conforme a plataforma de publicação. Todo caminho montado em tempo de execução
// precisa passar por ele, senão o link quebra em subdiretório.
const buildInfo = document.querySelector('#build-info');

buildInfo.textContent = `Base: ${import.meta.env.BASE_URL} · modo: ${import.meta.env.MODE}`;
// #endregion build-info

// #region asset-path
const investments = [
  { name: 'Tesouro Selic 2029', value: 10000 },
  { name: 'Tesouro IPCA 2029', value: 25000 },
];

const list = document.querySelector('#investments');

for (const investment of investments) {
  const item = document.createElement('li');

  item.textContent = `${investment.name}: ${investment.value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })}`;

  list.append(item);
}
// #endregion asset-path
