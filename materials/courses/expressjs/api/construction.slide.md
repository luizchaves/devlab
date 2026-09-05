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
title: "Express.js: Construção de API"
description: "Do requisito ao endpoint: modelagem de recursos, definição do contrato, implementação em camadas, teste com arquivos .http e integração com um front-end web."
---

<!-- _class: lead -->

# Express.js: Construção de API

Do requisito ao endpoint: modelagem de recursos, definição do contrato, implementação em camadas, teste com arquivos .http e integração com um front-end web.

---

## Objetivo

- Ao final você saberá conduzir a construção de uma API do requisito ao endpoint: identificar recursos, definir o contrato antes de implementar,...

---

## Mapa da Aula

- **Objetivo**
- **Do requisito ao recurso**
- **O contrato antes do código**
- **A ordem de implementação**
- **Servir o front-end junto ou separado**
- **A camada de serviço no front-end**
- **A estrutura resultante**
- **Verificando o contrato**

---

## Contexto da Aula

- As aulas anteriores apresentaram as peças isoladas.
- Esta mostra a ordem em que elas se encaixam quando se parte de um requisito em texto e se chega a uma API funcionando com um front-end consumindo.

---

## Do requisito ao recurso

- Um requisito costuma vir como frase.
- O primeiro trabalho é extrair dele os substantivos (que viram recursos) e os verbos (que viram operações):
- "O usuário cadastra investimentos, cada um pertencente a uma categoria e a uma corretora,
- e consegue listar, filtrar por nome, editar e excluir os seus."
- Palavras como *seus*, *próprios*, *apenas o dono* mudam a arquitetura: elas exigem autenticação em toda rota e filtro por usuário no model.

---

## Do requisito ao recurso: Tabela 1

- usuário: `/users` | dono dos demais recursos
- investimento: `/investments` | recurso principal
- categoria: `/categories` | tabela de apoio, provavelmente só leitura
- corretora: `/brokers` | tabela de apoio

---

## Do requisito ao recurso: Tabela 2

- cadastra: `POST /investments`
- listar: `GET /investments`
- filtrar por nome: `GET /investments?name=`
- editar: `PUT /investments/:id`
- excluir: `DELETE /investments/:id`
- "os seus": autenticação + posse

---

## O contrato antes do código

- Definir a tabela de endpoints antes de implementar tem um efeito prático imediato: o front-end pode começar em paralelo, e as decisões difíceis...
- A tabela acima cabe em um arquivo `requests.http` executável e em um `openapi.yaml`, como mostra a aula de Documentação de API.
- O que não vale é o contrato existir só na cabeça de quem implementou o servidor.

---

## O contrato antes do código: Tabela

- GET: `/investments` |: | `200` | `401`
- GET: `/investments/:id` |: | `200` | `401`, `404`
- POST: `/investments` | `{ name, amount, … }` | `201` | `401`, `415`, `422`
- PUT: `/investments/:id` | `{ name, amount, … }` | `200` | `401`, `404`, `415`, `422`
- DELETE: `/investments/:id` |: | `204` | `401`, `404`

---

## A ordem de implementação

- Com o contrato definido, a construção percorre as camadas de dentro para fora: cada etapa testável antes da seguinte:
- Tipos: declare o que entra e o que sai. É o contrato em código.
- Model: implemente `create`, `read`, `readById`, `update` e `remove`. Nenhuma
- referência a `req` ou `res` aqui.
- Controller: leia a requisição, chame o model, escolha o status. Lance `HttpError`

---

## Servir o front-end junto ou separado

- Há duas formas de ligar a interface à API, e a escolha muda o que precisa ser configurado:
- O front-end chama `fetch('/api/investments')`: caminho relativo, mesma origem, sem CORS.
- O front-end chama `fetch('http://localhost:3000/api/investments')` e o navegador exige os cabeçalhos de CORS.
- Servir o front de `public/` elimina uma variável inteira do problema.
- Separe as origens quando o front passar a ter build próprio (Vite, React) ou quando os dois forem publicados separadamente.

---

## Servir o front-end junto ou separado: Tabela

- CORS: não é necessário | obrigatório
- Deploy: um serviço | dois serviços independentes
- Ferramentas de front-end: build precisa gerar em `public/` | servidor de desenvolvimento próprio
- Cookie de sessão: simples | exige `credentials` e `SameSite`

---

## Servir o front-end junto ou separado: Exemplo 1

```ts
    // O Express serve os arquivos estáticos e a API no mesmo host e porta.
    app.use(express.static('public'));
    app.use('/api', investmentRouter);
```

---

## Servir o front-end junto ou separado: Exemplo 2

```ts
    // O front-end roda em outro servidor (Vite, em outra porta ou domínio).
    app.use(cors({ origin: 'http://localhost:5173' }));
    app.use('/api', investmentRouter);
```

---

## A camada de serviço no front-end

- Espalhar `fetch` pelas telas repete URL, cabeçalho e tratamento de erro em todo lugar. Uma camada fina isola isso:
- Um `404` chega como resposta normal, com `response.ok === false`.
- Sem a verificação, o `.json()` seguinte tenta interpretar o corpo de erro como se fosse o recurso: e a tela mostra `undefined` em vez da mensagem.

---

## A camada de serviço no front-end: Exemplo

```js
const BASE_URL = '/api';
async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  if (!response.ok) {
    const { error } = await response.json().catch(() => ({ error: {} }));
    throw new Error(error.message ?? `Falha na requisição (${response.status})`);
  }
```

---

## A estrutura resultante

- Servindo os dois do mesmo lugar, o projeto reúne API e interface:

---

## Verificando o contrato

- Cada linha da tabela de contrato vira uma requisição. O caminho feliz:
- { "name": "Tesouro Selic 2029", "amount": 20000, "categoryId": "8f14e45f" }
- { "id": "b1c2d3", "name": "Tesouro Selic 2029", "amount": 20000, "categoryId": "8f14e45f" }
- E o caso de erro previsto no contrato, que é o que costuma faltar nos testes manuais:
- { "name": "Tesouro Selic 2029" }

---

## Exercício

- Parta do requisito abaixo e construa a API completa:
- "O usuário cadastra hosts para monitorar. Cada host tem nome e endereço, e pode ser
- listado, editado e removido. É possível filtrar hosts pelo nome."
- Extraia recursos e operações e escreva a tabela de contrato com status de sucesso e erro.
- Implemente na ordem tipos → model → controller → router → registro.

---

## Exercício: Tabela

- GET: `/hosts` |: | `200` | —
- GET: `/hosts?name=` |: | `200` | —
- GET: `/hosts/:id` |: | `200` | `404`
- POST: `/hosts` | `{ name, address }` | `201` | `415`, `422`, `409`
- PUT: `/hosts/:id` | `{ name, address }` | `200` | `404`, `415`, `422`
- DELETE: `/hosts/:id` |: | `204` | `404`

---

## Desafio

- Implemente o mesmo recurso nas duas topologias: front servido por `express.static` e front em um servidor Vite separado.
- Documente o que precisou mudar em cada lado: e o que aconteceu no navegador antes de configurar o CORS.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Do requisito ao endpoint: modelagem de recursos, definição do contrato, implementação em camadas, teste com arquivos.http e integração com um front-end...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Modelagem

- Como um requisito em texto vira uma lista de endpoints?
- Os substantivos viram recursos (caminhos) e os verbos viram operações (métodos HTTP).
- Palavras como "os seus" viram requisitos de autenticação e autorização.
- Por que definir o contrato antes de implementar?
- Porque o front-end pode trabalhar em paralelo e porque as decisões de status, formato de erro e paginação ficam explícitas enquanto ainda são baratas...

---

## Integração

- Por que implementar na ordem model → controller → router?
- Porque cada camada só depende da anterior: o model é testável sem servidor, o controller é testável com o model pronto, e o router só amarra o que já...
- Por que concentrar o `fetch` em uma camada de serviço no front-end?
- Porque URL base, cabeçalhos, token e tratamento de erro passam a existir em um lugar só.
- Mudar o prefixo da API ou acrescentar o cabeçalho de autenticação vira uma edição em um arquivo.

---

## Na prática

- A construção completa, etapa por etapa, está em InvestApp: API em memória e em MonitorApp: API em memória.

---

## Próxima aula

- SQL com Node.js: trocar o array em memória por um banco de verdade.

---

## Resumo da Aula

- **Express.js: Construção de API** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
