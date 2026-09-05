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
title: "InvestApp: API em memória"
description: "Segunda etapa do InvestApp: CRUD de investimentos sobre um array, front-end estático servido por express.static e comportamento com JavaScript vanilla."
---

<!-- _class: lead -->

# InvestApp: API em memória

Segunda etapa do InvestApp: CRUD de investimentos sobre um array, front-end estático servido por express.static e comportamento com JavaScript vanilla.

---

## Objetivo

- Entender o papel de **InvestApp: API em memória** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/invest-app-api`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US02 — Manter a carteira pela aplicação · RF01, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK02.1 · Instalar dependências e criar `src/index.js` (Servidor Express), TK02.2 · Criar `src/data/investments.js` (Armazenamento em memória), TK02.3 · Criar `src/routes.js` (Endpoints do recurso `/api/investments`)
- **Executando**
- **Testando**
- **O front-end**
- **Conceitos abordados**

---

## Contexto da Aula

- Etapa 2 de 13 · Nível Iniciante · Node.js · Express.js · JavaScript vanilla
- O front estático da etapa anterior passa a ser servido pelo próprio Express e ganha comportamento com JavaScript vanilla.
- Nada de banco, nada de autenticação: só o ciclo requisição/resposta e a primeira integração real entre tela e API.
- APIs RESTful e HTTP: veja Rotas e Arquivos Estáticos, Middlewares no Express e Requisições e Respostas

---

## Requisitos, histórias e critérios

- Épico EP01 · Experiência e Carteira › Feature FT02 · CRUD de investimentos

---

## Requisitos, histórias e critérios: Tabela

- RF01 Gestão de Investimentos: o CRUD completo sobre um array em memória | parcial: falta persistir

---

## US02 — Manter a carteira pela aplicação · RF01

- Como investidor,
- quero cadastrar, consultar, editar e remover os meus investimentos,
- para manter a carteira atualizada sem depender de planilha.

---

## US02 — Manter a carteira pela aplicação · RF01: Exemplo

```txt
Cenário: CA02.1 - Listar os investimentos
  Quando envio GET /api/investments
  Então recebo o status 200
  E o corpo é uma lista de investimentos
Cenário: CA02.2 - Filtrar pelo nome
  Dado que existe um investimento chamado "Tesouro Selic 2029"
  Quando envio GET /api/investments?name=Tesouro
  Então recebo o status 200
  E a lista traz apenas os investimentos cujo nome contém "Tesouro"
Cenário: CA02.3 - Criar um investimento
  Quando envio POST /api/investments com nome e valor válidos
  Então recebo o status 201
```

---

## Tasks da etapa

- As tarefas abaixo implementam US02 e são a ordem sugerida de execução. Cada uma tem a sua seção detalhada logo em seguida.
- TK02.1 · Instalar dependências e criar `src/index.js`: Inicializa o servidor Express com logger Morgan e servidor de arquivos estáticos.
- TK02.2 · Criar `src/data/investments.js`: Armazenamento inicial em memória (array em JS).
- TK02.3 · Criar `src/routes.js`: Implementação das 5 rotas do recurso CRUD de investimentos.
- TK02.4 · Criar `public/js/services/api.js` e `public/js/index.js`: Integração do front-end com a API, isolando o `fetch` em uma única camada.

---

## Estrutura da aplicação

- O front-end desta etapa vive dentro de `public/` e é servido pelo próprio Express através do middleware `express.static('public')`.
- Ao mesmo tempo, as rotas sob `/api/investments` expõem os dados dinâmicos a partir de um array em memória.
- Como front e API compartilham a mesma origem, o navegador não precisa de CORS para conversar com o servidor: o middleware `cors` continua registrado...

---

## O que muda nesta etapa

- A etapa 1 desenhou as telas com dados escritos à mão no HTML.
- Esta etapa mantém a mesma interface: cabeçalho, cartões de ativo e formulário: e troca esses dados fixos por respostas da API.
- As quatro telas da etapa 1 vêm junto, sem reescrita: elas mudam de lugar (para `public/`) e o `index.html` ganha comportamento.

---

## O que muda nesta etapa: Tabela

- páginas HTML abertas direto do disco: as mesmas páginas em `public/`, servidas por `express.static`
- três cartões escritos no HTML: cartões gerados em JavaScript a partir de `GET /api/investments`
- formulário com `type="button"`, sem envio: `form.onsubmit` disparando `POST /api/investments`
- formulário dentro de um ``: painel lateral e diálogo de remoção, abertos por JavaScript
- utilitários do Tailwind pelo Play CDN: `css/app.css` compilado pela CLI do Tailwind
- nenhum arquivo `.js`: `public/js/index.js`, `services/api.js` e `lib/format.js`

---

## Descrição das tarefas

- Abaixo estão detalhadas as tarefas de implementação desta etapa, com orientações e trechos de código.

---

## TK02.1 · Instalar dependências e criar `src/index.js` (Servidor...

- O arquivo monta o app registrando middlewares em ordem.
- A linha 8 liga o log de requisições com `morgan('tiny')`, e as linhas 10 a 18 configuram o `cors`: necessário apenas quando o cliente vem de outra...
- O trecho destacado nas linhas 20 a 27 é o coração da etapa.
- O `express.json()` da linha 20 transforma o corpo JSON de `POST` e `PUT` em `req.body`; o `express.static` das linhas 24 e 25 serve o front-end direto...
- São dois middlewares de estático, e a ordem entre eles importa. Em desenvolvimento só o da linha 25 atua, entregando `public/` como está.

---

## TK02.1 · Instalar dependências e criar `src/index.js` (Servidor...: Exemplo

```bash
npm install express cors morgan
```

---

## TK02.2 · Criar `src/data/investments.js` (Armazenamento em memória)

- O arquivo inteiro é um `export const investments` com dois registros de exemplo.
- Cada objeto já tem a forma que a API vai devolver: `id` como UUID (linhas 3 e 8), `name` e `value`.
- Repare que o `id` é uma string, e não um número sequencial.
- Essa escolha antecipa o comportamento do banco de dados das etapas 6 e 6 e evita que o front-end passe a depender de um contador que só existiria em...
- Como é um array exportado por um módulo ES, todas as rotas manipulam a mesma referência: o `push` de uma rota é visível na leitura da outra.

---

## TK02.3 · Criar `src/routes.js` (Endpoints do recurso...

- Este é o arquivo mais longo da etapa, e vale lê-lo em quatro partes.
- A classe `HttpError` das linhas 5 a 10 estende `Error` e acrescenta o campo `code`.
- É ela que permite escrever `throw new HttpError('Investment not found', 404)` no meio de uma rota e ainda assim responder com o status certo.
- O bloco destacado nas linhas 14 a 28 é o `POST /investments` e serve de modelo para as demais rotas: lê `name` e `value` de `req.body` (linha 15),...
- As leituras vêm em seguida: o `GET /investments` das linhas 30 a 40 aceita o filtro opcional `req.query.name` (linha 31) e devolve o array inteiro...

---

## TK02.3 · Criar `src/routes.js` (Endpoints do recurso...: Tabela

- GET: `/api/investments` |: | `200` | —
- GET: `/api/investments?name=` |: | `200` | —
- GET: `/api/investments/:id` |: | `200` | `404`
- POST: `/api/investments` | `{ name, value }` | `201` | `400`
- PUT: `/api/investments/:id` | `{ name, value }` | `200` | `400`, `404`
- DELETE: `/api/investments/:id` |: | `204` | `404`

---

## TK02.4 · Criar `public/js/services/api.js` e `public/js/index.js`...

- O front é dividido em duas responsabilidades, e essa separação é o ponto didático da etapa: um único arquivo conhece `fetch`, e a tela conversa apenas...
- O `services/api.js` é essa camada fina.
- As quatro funções: `create`, `read`, `update` e `remove`: montam a URL a partir da constante `domain = '/api'` da linha 1 e diferem apenas no método e...
- O `read` da linha 20 é o caso mais simples, sem objeto `config`; o `create` da linha 3 mostra o trio que sempre acompanha um envio de JSON: `method:...
- Já o `remove` da linha 45 não chama `res.json()`, porque a rota responde `204 No Content`, sem corpo.

---

## TK02.5 · Criar `requests.http` (Especificação executável da API)

- O arquivo é uma documentação executável: cada bloco separado por `###` vira um botão *Send Request* na extensão REST Client do VS Code.
- O trecho destacado nas linhas 1 a 13 mostra o mecanismo que torna o arquivo encadeável.
- A linha 1 define a variável `@host` com a base da API; a linha 6 nomeia a requisição com `# @name createdInvestment`; e a linha 2 captura o `id` da...
- É por isso que, mais adiante, a linha 34 consegue escrever `GET {{host}}/investments/{{createdInvestmentId}}` sem que você precise copiar um UUID à mão.
- O restante do arquivo, recolhido, exercita justamente os caminhos de erro do contrato: criação sem `value` para provocar `400`, leitura por um id...

---

## TK02.6 · Compilar o CSS com a CLI do Tailwind

- A etapa 1 montava o Tailwind no navegador com o Play CDN, que é o modo de protótipo: o compilador é baixado a cada carregamento de página.
- Agora existe servidor, e o CSS pode ser gerado uma vez e servido pronto.
- A entrada é o `public/css/tailwind.css`.
- Ele tem três linhas que importam: o `@import "tailwindcss"` traz o próprio framework, o `@source "../"` diz à CLI para varrer `public/` atrás das...
- Dois scripts no `package.json` fazem o trabalho: o `css` gera uma vez e o `css:watch` recompila a cada alteração das telas.

---

## TK02.6 · Compilar o CSS com a CLI do Tailwind: Exemplo

```bash
npm install -D tailwindcss @tailwindcss/cli
```

---

## Executando

- Entre no projeto local desta etapa:
- Instale e suba em modo watch:
- Abra http://localhost:3000: o front já consome a API.
- Execute o `request.http` pela extensão
- REST Client.

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/invest-app-api
```

---

## Executando: Exemplo 2

```bash
   npm install
   npm run dev
```

---

## Testando

- Nesta seção, testamos os endpoints da API do InvestApp em memória.
- O envio de um novo investimento via `POST /api/investments` inclui nome e valor em JSON e devolve o recurso criado com um identificador gerado (`id:...
- { "name": "Tesouro Selic 2029", "value": 20000 }
- { "id": 1, "name": "Tesouro Selic 2029", "value": 20000 }
- A busca filtrada com query string (`GET /api/investments?name=Tesouro`) retorna apenas os investimentos cujo nome atende ao termo pesquisado com status...

---

## Testando: Exemplo 1

```txt
  ### Criar novo investimento
  POST http://localhost:3000/api/investments
  Content-Type: application/json
  {
    "name": "Tesouro Selic 2029",
    "value": 20000
  }
```

---

## Testando: Exemplo 2

```txt
  ### Listar investimentos com filtro por nome
  GET http://localhost:3000/api/investments?name=Tesouro
```

---

## O front-end

- A interface continua vanilla: módulos pequenos, sem React, Vue ou framework de componentes.
- A regra que sustenta o front desta etapa é a separação em três arquivos, cada um com uma responsabilidade só.
- Essa divisão é o que permite trocar a origem da API, acrescentar um cabeçalho `Authorization` ou mudar o tratamento de erro em um único arquivo.
- Na etapa 9, quando o token JWT entrar, a alteração acontece só dentro de `services/api.js`.
- Tudo. O array vive na memória do processo: um `Ctrl+C` apaga os investimentos cadastrados.

---

## Conceitos abordados

- Rotas com método e caminho, e o prefixo `/api`
- Filtro por query string
- Status codes de sucesso e de erro
- As aulas correspondentes são Fundamentos, Rotas e Construção de API.

---

## Próxima etapa

- InvestApp: TypeScript em camadas: tipos, controllers e erros centralizados.

---

## Arquivos-Chave da Aula

- **src/index.js**: `examples/courses/expressjs/projects/invest-app-api/src/index.js` (linhas marcadas `20-27`)
- **src/data/investments.js**: `examples/courses/expressjs/projects/invest-app-api/src/data/investments.js`
- **src/routes.js**: `examples/courses/expressjs/projects/invest-app-api/src/routes.js` (linhas marcadas `14-28`)
- **public/js/services/api.js**: `examples/courses/expressjs/projects/invest-app-api/public/js/services/api.js` (linhas marcadas `1,20-26`)
- **public/js/index.js**: `examples/courses/expressjs/projects/invest-app-api/public/js/index.js` (linhas marcadas `74-118`)
- **public/index.html**: `examples/courses/expressjs/projects/invest-app-api/public/index.html` (linhas marcadas `40,47,52,58,99`)

---

## Resumo da Aula

- **InvestApp: API em memória** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
