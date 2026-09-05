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
title: "MonitorApp: API em memória"
description: "Segunda etapa do MonitorApp: CRUD de hosts sobre um array, front-end no Vite consumindo a API por proxy, e a primeira aparição do problema das duas origens."
---

<!-- _class: lead -->

# MonitorApp: API em memória

Segunda etapa do MonitorApp: CRUD de hosts sobre um array, front-end no Vite consumindo a API por proxy, e a primeira aparição do problema das duas origens.

---

## Objetivo

- Entender o papel de **MonitorApp: API em memória** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/monitor-app-api`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US02 — Manter o inventário de hosts · RF01, RNF05, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK02.1 · Instalar dependências e criar `back/src/index.js` (Servidor Express), TK02.2 · Criar `back/src/data/hosts.js` (Armazenamento em memória), TK02.3 · Criar `back/src/routes.js` (Endpoints do recurso `/api/hosts`)
- **Executando**
- **Testando**
- **Conceitos abordados**
- **Próxima etapa**

---

## Contexto da Aula

- Etapa 2 de 13 · Nível Iniciante · Node.js · Express.js · JavaScript vanilla
- O front estático da etapa anterior ganha comportamento e passa a conversar com um servidor Express que nasce agora, em `back/`.
- Nada de banco, nada de autenticação: só o ciclo requisição/resposta, a primeira integração real entre tela e API e a decisão de arquitetura que define...
- APIs RESTful e HTTP: veja Rotas e Arquivos Estáticos, Middlewares no Express e Requisições e Respostas
- Origens diferentes: veja CORS

---

## Requisitos, histórias e critérios

- Épico EP01 · Inventário e Observação › Feature FT02 · CRUD de hosts

---

## Requisitos, histórias e critérios: Tabela

- RF01 Gestão de Hosts: o CRUD completo sobre um array em memória | parcial: falta persistir
- RNF05 Origens Separadas: `cors` no servidor e proxy `/api` no Vite | atendido

---

## US02 — Manter o inventário de hosts · RF01, RNF05

- Como responsável pela rede,
- quero cadastrar, consultar, editar e remover os endereços que acompanho,
- para manter o inventário atualizado sem depender de uma planilha.

---

## US02 — Manter o inventário de hosts · RF01, RNF05: Exemplo

```txt
Cenário: CA02.1 - Listar os hosts
  Quando envio GET /api/hosts
  Então recebo o status 200
  E o corpo é uma lista de hosts
Cenário: CA02.2 - Filtrar pelo nome
  Dado que existe um host chamado "Google DNS"
  Quando envio GET /api/hosts?name=Google
  Então recebo o status 200
  E a lista traz apenas os hosts cujo nome contém "Google"
Cenário: CA02.3 - Cadastrar um host
  Quando envio POST /api/hosts com nome e endereço
  Então recebo o status 201
```

---

## Tasks da etapa

- TK02.1 · Instalar dependências e criar `back/src/index.js`: servidor Express com Morgan e o middleware `cors`.
- TK02.2 · Criar `back/src/data/hosts.js`: armazenamento inicial em memória (array em JS).
- TK02.3 · Criar `back/src/routes.js`: as cinco rotas do recurso e a classe `HttpError`.
- TK02.4 · Configurar o proxy e o Tailwind em `front/vite.config.js`: `/api` repassado para o Express, e os utilitários compilados em vez de gerados no...
- TK02.5 · Criar `front/js/services/api.js` e `front/js/index.js`: integração do front, isolando o `fetch` em uma camada.

---

## Estrutura da aplicação

- A pasta `back/` nasce nesta etapa, ao lado do `front/` que já existia.
- São dois projetos Node independentes, com dois `package.json` e dois `npm install`: e é essa separação que faz o MonitorApp precisar de CORS desde o...

---

## O que muda nesta etapa?

- A etapa 1 desenhou as telas com dados escritos à mão no HTML.
- Esta etapa mantém a mesma interface: cabeçalho, cartões de host e formulário: e troca esses dados fixos por respostas da API.

---

## O que muda nesta etapa?: Tabela

- três cartões escritos no HTML: `` vazia, preenchida por `GET /api/hosts`
- métricas com números fixos: métricas calculadas a partir da resposta
- formulário com `type="button"`, sem envio: `form.onsubmit` disparando `POST /api/hosts`
- nenhum arquivo `.js` de aplicação: `front/js/index.js`, `services/api.js` e `lib/format.js`
- nenhum servidor: `back/src/index.js`, `routes.js` e `data/hosts.js`
- Tailwind pelo Play CDN, montado no navegador: Tailwind compilado pelo Vite a partir de `css/tailwind.css`

---

## Descrição das tarefas

- Descrição das tarefas aparece como ponto central da aula, não apenas como item de índice.
- Segunda etapa do MonitorApp: CRUD de hosts sobre um array, front-end no Vite consumindo a API por proxy, e a primeira aparição do problema das duas...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## TK02.1 · Instalar dependências e criar `back/src/index.js`...

- O arquivo monta o app registrando middlewares em ordem.
- A linha 9 liga o log de requisições com `morgan('tiny')`, e o `express.json()` da linha 21 transforma o corpo JSON de `POST` e `PUT` em `req.body`.
- O `server.use('/api', router)` da linha 23 prefixa todas as rotas do `routes.js`, de onde vem o caminho final `/api/hosts`.
- O trecho destacado nas linhas 11 a 19 é o coração desta etapa e o que separa o MonitorApp do InvestApp.
- Como o front é servido por outro processo, em outra porta, o navegador trata as duas como origens diferentes e bloqueia a resposta antes que ela chegue...

---

## TK02.1 · Instalar dependências e criar `back/src/index.js`...: Exemplo

```bash
npm install express cors morgan
```

---

## TK02.2 · Criar `back/src/data/hosts.js` (Armazenamento em memória)

- O arquivo inteiro é um `export const hosts` com dois registros de exemplo.
- Cada objeto já tem a forma que a API vai devolver: `id` como UUID, `name` e `address`.
- Repare que os dois endereços são de tipos diferentes: `8.8.8.8` é um IPv4 e `www.ifpb.edu.br` é um nome de domínio.
- Os dois são válidos, e a etapa 4 vai formalizar essa regra em um schema.
- Como é um array exportado por um módulo ES, todas as rotas manipulam a mesma referência: o `push` de uma rota é visível na leitura da outra.

---

## TK02.3 · Criar `back/src/routes.js` (Endpoints do recurso...

- Este é o arquivo mais longo da etapa, e vale lê-lo em quatro partes.
- A classe `HttpError` das linhas 6 a 11 estende `Error` e acrescenta o campo `code`.
- É ela que permite escrever `throw new HttpError('Host not found', 404)` no meio de uma rota e ainda assim responder com o status certo.
- O bloco destacado nas linhas 15 a 27 é o `POST /hosts` e serve de modelo para as demais rotas: lê `name` e `address` de `req.body` (linha 16), rejeita...
- As leituras vêm em seguida: o `GET /hosts` das linhas 29 a 39 aceita o filtro opcional `req.query.name` (linha 30) e devolve o array inteiro quando ele...

---

## TK02.3 · Criar `back/src/routes.js` (Endpoints do recurso...: Tabela

- GET: `/api/hosts` |: | `200` | —
- GET: `/api/hosts?name=` |: | `200` | —
- GET: `/api/hosts/:id` |: | `200` | `404`
- POST: `/api/hosts` | `{ name, address }` | `201` | `400`
- PUT: `/api/hosts/:id` | `{ name, address }` | `200` | `400`, `404`
- DELETE: `/api/hosts/:id` |: | `204` | `404`

---

## TK02.4 · Configurar o proxy em `front/vite.config.js` (As duas...

- Este é o ponto em que o MonitorApp mostra a sua arquitetura.
- Em desenvolvimento existem dois servidores: o Vite em `localhost:5173`, que entrega HTML, CSS e JavaScript, e o Express em `localhost:3000`, que...
- Para o navegador, porta diferente é origem diferente.
- O bloco destacado nas linhas 12 a 16 resolve isso em desenvolvimento: tudo que começa com `/api` é repassado pelo próprio Vite para o Express.
- Como a requisição sai do navegador para a mesma origem da página, nenhum preflight de CORS acontece, e o `fetch` do front pode escrever apenas...

---

## TK02.5 · Criar `front/js/services/api.js` e `front/js/index.js`...

- O front é dividido em três responsabilidades, e essa separação é o ponto didático da etapa: um único arquivo conhece `fetch`, e a tela conversa apenas...
- O `services/api.js` é essa camada fina.
- As quatro funções: `create`, `read`, `update` e `remove`: montam a URL a partir da constante `domain = '/api'` da linha 1 e diferem apenas no método e...
- O `read` da linha 19 é o caso mais simples, sem objeto `config`; o `create` da linha 3 mostra o trio que sempre acompanha um envio de JSON: `method:...
- Já o `remove` da linha 43 não chama `res.json()`, porque a rota responde `204 No Content`, sem corpo.

---

## TK02.6 · Criar `back/requests.http` (Especificação executável)

- O arquivo é uma documentação executável: cada bloco separado por `###` vira um botão *Send Request* na extensão REST Client do VS Code.
- O trecho destacado nas linhas 1 a 13 mostra o mecanismo que torna o arquivo encadeável.
- A linha 1 define a variável `@host` com a base da API; a linha 6 nomeia a requisição com `# @name createdHost`; e a linha 2 captura o `id` da resposta...
- É por isso que, mais adiante, a linha 34 consegue escrever `GET {{host}}/hosts/{{createdHostId}}` sem que você precise copiar um UUID à mão.
- O restante do arquivo, recolhido, exercita justamente os caminhos de erro do contrato: criação sem `address` para provocar `400`, leitura por um id...

---

## Executando

- Como são dois projetos, são dois terminais.
- Suba o front:
- Abra http://localhost:5173: o painel já consome a API.
- Execute o `requests.http` pela extensão
- REST Client.

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/monitor-app-api/back
   npm install
   npm run dev
```

---

## Executando: Exemplo 2

```bash
   cd examples/courses/expressjs/projects/monitor-app-api/front
   npm install
   npm run dev
```

---

## Testando

- Nesta seção, testamos os endpoints de inventário do MonitorApp em memória.
- O cadastro de um novo host monitorado via `POST /api/hosts` recebe o nome e o endereço de destino (IP ou domínio) e devolve o objeto criado com um UUID...
- { "name": "Google DNS", "address": "8.8.8.8" }
- { "id": "e4cfb6bb-4431-42a9-b660-d5701b2f49cd", "name": "Google DNS", "address": "8.8.8.8" }
- A consulta com filtro na query string (`GET /api/hosts?name=Google`) retorna a lista contendo apenas os servidores correspondentes e status `200 OK`:

---

## Testando: Exemplo 1

```txt
  ### Cadastrar novo host no MonitorApp
  POST http://localhost:3000/api/hosts
  Content-Type: application/json
  {
    "name": "Google DNS",
    "address": "8.8.8.8"
  }
```

---

## Testando: Exemplo 2

```txt
  ### Listar hosts com filtro por nome
  GET http://localhost:3000/api/hosts?name=Google
```

---

## Conceitos abordados

- Rotas com método e caminho, e o prefixo `/api`
- CORS no servidor e proxy no cliente: as duas metades do mesmo problema
- Filtro por query string
- Status codes de sucesso e de erro
- As aulas correspondentes são Fundamentos, Rotas, CORS e Construção de API.

---

## Próxima etapa

- MonitorApp: TypeScript em camadas: tipos, controllers e erros centralizados.

---

## Arquivos-Chave da Aula

- **back/src/index.js**: `examples/courses/expressjs/projects/monitor-app-api/back/src/index.js` (linhas marcadas `11-19`)
- **back/src/data/hosts.js**: `examples/courses/expressjs/projects/monitor-app-api/back/src/data/hosts.js`
- **back/src/routes.js**: `examples/courses/expressjs/projects/monitor-app-api/back/src/routes.js` (linhas marcadas `15-27`)
- **front/vite.config.js**: `examples/courses/expressjs/projects/monitor-app-api/front/vite.config.js` (linhas marcadas `12-16`)
- **back/src/index.js**: `examples/courses/expressjs/projects/monitor-app-api/back/src/index.js`
- **front/css/tailwind.css**: `examples/courses/expressjs/projects/monitor-app-api/front/css/tailwind.css` (linhas marcadas `11-12`)

---

## Resumo da Aula

- **MonitorApp: API em memória** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
