---
marp: true
theme: default
paginate: true
style: |
  section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 70px;
    font-size: 1.5rem;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    position: absolute;
    bottom: 24px;
    right: 32px;
    padding: 0;
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "Web APIs: Fetch API"
description: "Slides completos do tópico Web APIs: Fetch API."
---

<!-- _class: lead -->

# Web APIs: Fetch API

Natureza Assíncrona e Event Loop · A Função `fetch` e a Classe `Response` · Do Disparo até a Tela: Ciclo de Vida na Interface · Operações CRUD com `fetch`

---

## Objetivo

- Explicar a natureza assíncrona do `fetch()` e a relação dele com o *event loop*.
- Percorrer o fluxo `fetch()` -> `Response` -> leitura do corpo -> renderização na tela.
- Justificar por que status `404` ou `500` não rejeitam a Promise e exigem a checagem explícita de `response.ok`.
- Implementar as quatro operações CRUD com `method`, `headers` e `body`.
- Montar parâmetros de consulta com `URLSearchParams` em vez de concatenar strings.
- Cancelar requisições em andamento com `AbortController` e tratar o erro `AbortError`.

---

## Mapa do Tópico

- **Natureza Assíncrona e Event Loop**.
- **A Função `fetch` e a Classe `Response`**.
- **Do Disparo até a Tela: Ciclo de Vida na Interface**.
- **Operações CRUD com `fetch`**.
- **Montando Query Strings com `URLSearchParams`**.
- **Entendendo o CORS (Cross-Origin Resource Sharing)**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## Natureza Assíncrona e Event Loop

A comunicação com servidores remotos via rede é uma operação de entrada e saída (*I/O*) não bloqueante.

- O método `fetch()` não trava a execução da página nem paralisa a interface do usuário enquanto aguarda os dados do servidor.
- Em vez disso, ele delega a tarefa de rede para o navegador e retorna uma Promise.
- Quando a resposta do servidor chega, o navegador envia o resultado para a fila de *microtasks* do Event Loop.

---

## A Função `fetch` e a Classe `Response`

A função `fetch()` aceita uma URL de destino e um objeto opcional de opções de configuração.

- O fluxo central é `fetch()` -> `Response` -> checagem de `ok` -> leitura do corpo.

---

## A Função `fetch` e a Classe `Response`: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
fetch(url, options)
```

---

## Do Disparo até a Tela: Ciclo de Vida na Interface

Uma chamada de rede em uma interface gráfica não termina quando a resposta chega.

- Ela passa por quatro momentos distintos, e cada um deles pode falhar de uma forma diferente: a requisição pode não sair por queda de conexão.
- O diagrama a seguir separa esses quatro momentos e mapeia onde cada tipo de falha se manifesta.

---

## Do Disparo até a Tela: Ciclo de Vida na Interface: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
async function carregarItens() {
  try {
    const response = await fetch('/api/itens');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const dados = await response.json();
    renderizarNaTela(dados);
  } catch (error) {
    exibirMensagemErro(error.message);
  }
}
```

---

## Operações CRUD com `fetch`

A Fetch API suporta todos os verbos e operações do ciclo CRUD (*Create, Read, Update, Delete*) através da configuração do objeto de opções.

- `method: 'POST'`.
- `headers: { 'Content-Type': 'application/json' }`.
- `body: JSON.stringify(dados)`.

---

## Operações CRUD com `fetch`: Casos

- **Leitura de Dados (GET)**: A requisição do tipo GET é o padrão do `fetch` caso nenhum segundo parâmetro seja fornecido.
- **Envio de Dados (POST)**: Para enviar dados em formato JSON para uma API, três configurações no objeto de opções são obrigatórias.
- **Atualização (PUT e PATCH) e Remoção (DELETE)**: As operações de alteração e exclusão seguem o mesmo padrão de configuração do `POST`.

---

## Montando Query Strings com `URLSearchParams`

Evite concatenar strings manualmente para passar parâmetros de filtro e paginação na URL.

- ---.
- Trate estados de sucesso, erro e ausência de suporte.

---

## Montando Query Strings com `URLSearchParams`: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
const parametros = new URLSearchParams({
  page: 1,
  limit: 10,
  busca: 'desenvolvimento web'
});

const url = `https://api.com/produtos?${parametros.toString()}`;
// Resultado: https://api.com/produtos?page=1&limit=10&busca=desenvolvimento+web

const resposta = await fetch(url);
```

---

## Entendendo o CORS (Cross-Origin Resource Sharing)

O CORS é um mecanismo de segurança implementado pelos navegadores que restringe requisições HTTP feitas via scripts.

- O navegador compara origem e cabeçalhos antes de entregar a resposta ao JavaScript.
- com)"] -- "fetch('https://api.

---

## Cancelando Requisições com `AbortController`

Em buscas dinâmicas com digitação ou ao trocar rapidamente de página.

- ---.
- Trate estados de sucesso, erro e ausência de suporte.

---

## Exemplo Interativo com Interface HTML

O exemplo interativo do tópico consome endpoints `GET` e `POST` com estados de carregamento.

- <HtmlPreview path="examples/courses/web-api/browser-web-apis/fetch.
- html" height="26rem" label="fetch.
- O código-fonte integral do exemplo ilustra o tratamento de eventos e a manipulação do DOM.

---

## Quando usar, e quando não usar?

A Fetch API é nativa, não adiciona dependências ao projeto e atende à grande maioria das necessidades de comunicação cliente-servidor.

- **Requisições comuns em qualquer projeto**: Sem dependência, disponível no navegador e no Node.js.
- **Muitas chamadas com a mesma base e cabeçalhos**: Concentra configuração e tratamento de erro sem dependências.
- **Interceptadores globais de requisição e resposta**: Tratamento automático de 4xx/5xx e transformação de dados.
- **Barra de progresso de upload**: `fetch()` não expõe evento de progresso no upload de arquivos.
- **Cache, revalidação e estado em componentes**: Gerenciamento de cache e sincronização reativa de tela.

---

## Executando

1. Abra o navegador com <kbd>F12</kbd> e acesse a aba Console.
2. Cole o código a seguir e pressione <kbd>Enter</kbd>.
3. Veja o objeto com os dados de endereço formatados no console.

---

## Executando: Comando

```js
const res = await fetch('https://viacep.com.br/ws/58015430/json/');
   const dados = await res.json();
   console.table(dados);
```

---

## Exercício Prático

1. Por que uma requisição `fetch()` que retorna o código de status HTTP `404 Not Found` não cai no bloco `catch` de um `try/catch`?
2. Quais são as três configurações fundamentais necessárias para enviar dados em formato JSON utilizando o método `POST` no `fetch`?
3. O que é e para que serve o `AbortController`?
4. Porque a Fetch API considera como "rejeição" apenas falhas físicas de rede (sem conexão, falha de DNS ou erro de CORS).
5. As três configurações.

---

## Desafio

Escreva uma função `buscarComRetry(url, tentativas)` que tente realizar um `fetch(url)` até o número máximo de tentativas especificado.

1. Adicione tratamento de erro ou permissão.
2. Separe responsabilidades em funções pequenas.
3. Valide no navegador e documente o resultado.

---

## Perguntas de revisão

1. Qual propriedade da interface `Response` retorna `true` apenas se o código de status HTTP estiver na faixa de `200` a `299`?
2. O que acontece ao chamar o método `response.json()` em uma resposta com código HTTP `204 No Content`?
3. Por que `response.json()` retorna uma Promise em vez de devolver o objeto JavaScript imediatamente?
4. Como cancelar uma requisição `fetch()` em andamento caso a ação do usuário seja interrompida?
5. Quais são os três estados visuais fundamentais que uma interface deve representar durante uma chamada assíncrona?

---

## Resumo do Tópico

- **Natureza Assíncrona e Event Loop**: revise o papel desse eixo no uso da API.
- **A Função `fetch` e a Classe `Response`**: revise o papel desse eixo no uso da API.
- **Do Disparo até a Tela: Ciclo de Vida na Interface**: revise o papel desse eixo no uso da API.
- **Operações CRUD com `fetch`**: revise o papel desse eixo no uso da API.
- **Montando Query Strings com `URLSearchParams`**: revise o papel desse eixo no uso da API.
