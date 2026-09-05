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
title: "InvestApp: TypeScript em camadas"
description: "Terceira etapa do InvestApp: migração para TypeScript e reorganização em routes, controllers, models, middlewares e errors, com HttpError e tratamento centralizado."
---

<!-- _class: lead -->

# InvestApp: TypeScript em camadas

Terceira etapa do InvestApp: migração para TypeScript e reorganização em routes, controllers, models, middlewares e errors, com HttpError e tratamento centralizado.

---

## Objetivo

- Entender o papel de **InvestApp: TypeScript em camadas** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/invest-app-typescript`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US03 — Mudar o código sem medo · RNF06, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK03.1 · Instalar pacotes e criar `tsconfig.json` (Configuração do compilador TypeScript), TK03.2 · Modificar `src/index.js` → `src/index.ts` (Entrypoint em TypeScript), TK03.3 · Criar `src/types/Investment.d.ts` (Definição dos tipos do domínio)
- **Executando**
- **Testando**
- **O diff que importa**
- **Conceitos abordados**

---

## Contexto da Aula

- Etapa 3 de 13 · Nível Intermediário · TypeScript · Express 5
- Duas mudanças de uma vez, e ambas estruturais: o projeto passa a TypeScript e o `routes.js` único se desdobra em camadas.
- TypeScript e Arquitetura: veja TypeScript no Express e Arquitetura MVC no Express

---

## Requisitos, histórias e critérios

- Épico EP04 · Fundação Técnica › Feature FT09 · Arquitetura em camadas e tipos
- Nenhum requisito funcional entra aqui: a aplicação faz exatamente o mesmo que na etapa 2.
- O que muda é como ela é escrita: e o interessado nisso é quem mantém o código.

---

## Requisitos, histórias e critérios: Tabela

- RNF06 Manutenibilidade & Tipagem: tipos do domínio e separação em rotas, controllers, models e middlewares | atendido

---

## US03 — Mudar o código sem medo · RNF06

- Como pessoa que mantém a aplicação,
- quero tipos no domínio e cada responsabilidade em uma camada,
- para que o compilador aponte a quebra antes que ela chegue à produção.

---

## US03 — Mudar o código sem medo · RNF06: Exemplo

```txt
Cenário: CA03.1 - O compilador valida o projeto inteiro
  Quando executo npm run typecheck
  Então o comando termina sem nenhum erro
Cenário: CA03.2 - A migração é completa
  Quando procuro arquivos JavaScript em src/
  Então não existe nenhum arquivo .js
Cenário: CA03.3 - O arquivo de rotas só declara rotas
  Quando abro src/routes/investments.routes.ts
  Então cada linha traz apenas método, caminho, middleware e controller
  E nenhum corpo de handler aparece ali
Cenário: CA03.4 - As camadas não vazam
```

---

## Tasks da etapa

- As tarefas abaixo implementam US03 e são a ordem sugerida de execução. Cada uma tem a sua seção detalhada logo em seguida.
- TK03.1 · Instalar pacotes e criar `tsconfig.json`: Configuração do compilador TypeScript e aliases de módulo.
- TK03.2 · Modificar `src/index.ts`: Entrypoint reescrito em TypeScript com middlewares tipados.
- TK03.3 · Criar `src/types/Investment.d.ts`: Interfaces de tipos do domínio (`Investment`, `InvestmentInput`).
- TK03.4 · Criar `src/models/Investment.ts`: Camada de dados desacoplada e assíncrona.

---

## Estrutura da aplicação

- O `src/` deixa de ser três arquivos e passa a ser sete pastas, uma por responsabilidade.
- O nome de cada pasta é a pergunta que ela responde: `routes/` diz onde, `controllers/` diz como entra e sai por HTTP, `models/` diz o que a regra faz,...
- O `public/` não é tocado.

---

## O que muda nesta etapa?

- Na etapa anterior, um único `routes.js` continha caminhos, validação, acesso aos dados e tratamento de erro.
- Nesta etapa, o projeto é convertido para TypeScript e separado no padrão MVC: cada responsabilidade ganha o seu módulo dedicado:

---

## Descrição das tarefas

- Abaixo estão detalhadas as tarefas de implementação desta etapa, com orientações e trechos de código.

---

## TK03.1 · Instalar pacotes e criar `tsconfig.json` (Configuração do...

- O arquivo é curto, e três opções destacadas explicam a etapa inteira.
- O `"strict": true` da linha 8 é o que liga a checagem que justifica a migração: sem ele, TypeScript aceitaria quase tudo que o JavaScript já aceitava.
- O `"target": "esnext"` da linha 6 libera a sintaxe moderna que o Node 22 já entende.
- E o bloco `paths` das linhas 15 a 17 mapeia `@/*` para `./src/*`, o que transforma um `../../models/Investment.ts` em `@/models/Investment.ts`.
- As demais opções sustentam o modo de execução escolhido: `allowImportingTsExtensions` (linha 13) permite importar com a extensão `.ts` no caminho, e...

---

## TK03.1 · Instalar pacotes e criar `tsconfig.json` (Configuração do...: Exemplo

```bash
npm install -D typescript @types/node @types/express @types/morgan tsx
```

---

## TK03.2 · Modificar `src/index.js` → `src/index.ts` (Entrypoint em...

- O entrypoint encolheu.
- Onde antes havia um `import router from './routes.js'` com todo o CRUD dentro, agora a linha 5 importa um roteador que só declara caminhos, e a linha 4...
- A ordem das três últimas linhas é a parte que mais importa e não é intercambiável.
- O `app.use('/api', investmentRoutes)` da linha 18 registra as rotas; o `notFoundHandler` da linha 20 precisa vir depois delas, porque só faz sentido...
- Repare também no alias `@/` das importações: é ele que o `paths` do `tsconfig.json` acabou de habilitar.

---

## TK03.3 · Criar `src/types/Investment.d.ts` (Definição dos tipos do...

- O arquivo declara duas interfaces, e a diferença entre elas é o ponto da aula.
- A `Investment` das linhas 1 a 5 descreve o registro como ele existe depois de salvo: todos os campos obrigatórios, incluindo o `id` da linha 2, que só...
- A `InvestmentInput` das linhas 7 a 10 descreve o que chega pela requisição: nenhum `id` e todos os campos opcionais, já que a mesma interface serve...
- Ter os dois tipos separados é o que impede um controller de tentar gravar um `id` vindo do cliente.
- Como o arquivo é `.d.ts`, ele só existe em tempo de compilação: nada dele sobra no código executado.

---

## TK03.4 · Criar `src/models/Investment.ts` (Camada Model)

- O model é a única camada que conhece a origem dos dados.
- Nesta etapa a origem ainda é o array em memória da etapa 2: o banco só entra na etapa 6 —, mas o contrato já é o definitivo: cinco funções assíncronas,...
- O trecho destacado nas linhas 5 a 15 é o `create` e mostra por que as funções são `async` mesmo operando sobre um array: quando a etapa 6 trocar o...
- É a promessa da separação em camadas, feita já aqui.
- O `read` da linha 17, o `readById` da linha 25, o `update` da linha 35 e o `remove` da linha 53 seguem o mesmo desenho: validam o que receberam, mexem...

---

## TK03.5 · Criar `src/controllers/investments.controller.ts` (Camada...

- O controller expõe `create`, `read`, `readById`, `update` e `remove`, todos com a assinatura tipada `(req: Request, res: Response)` importada na linha...
- O trecho destacado nas linhas 19 a 43 mostra as duas variações dessa assinatura.
- Em `read` (linha 19), o filtro sai de `req.query` com uma anotação explícita `as { name?: string }` na linha 21, porque o Express não sabe quais...
- Já em `readById` (linha 33), o genérico `Request` tipa `req.params`: a partir daí, o `id` da linha 35 é `string` sem nenhuma conversão.
- Repare no que não existe aqui: nenhum SQL e nenhum `res.status(...)` espalhado.

---

## TK03.6 · Criar `src/errors/HttpError.ts` e...

- A classe `HttpError` acrescenta um único campo à `Error` nativa: o `code` declarado na linha 2 e preenchido no construtor da linha 4, com `400` como...
- É pouco código, mas é o que permite a um controller escolher o status HTTP sem nunca tocar em `res`.
- Do outro lado está o middleware que traduz a exceção em resposta.
- O `errorHandler` das linhas 13 a 29 é reconhecido pelo Express justamente por ter quatro parâmetros; o teste `err instanceof HttpError` da linha 23...
- O `notFoundHandler` das linhas 5 a 11 completa o par: ele é registrado depois das rotas e responde `404` para qualquer caminho que ninguém reconheceu.

---

## TK03.7 · Modificar `src/routes.js` →...

- O roteador virou uma tabela legível: cada linha entre 7 e 11 declara método HTTP, caminho e o controller que responde: nada mais.
- Comparado com o `routes.js` da etapa 2, sumiram o corpo dos handlers, os `if` de validação e a classe de erro.
- As linhas 7 e 10 acrescentam a única peça a mais: o middleware `requireJson`, importado com apelido na linha 1, que roda antes do controller e barra...
- Ele só aparece em `POST` e `PUT`, os dois métodos que enviam corpo.
- O middleware acima cabe em poucas linhas úteis: se o cabeçalho não declarar `application/json`, ele lança um `HttpError` (linha 13); caso contrário,...

---

## Executando

- Entre na pasta desta etapa e instale:
- Suba em modo watch:
- Verifique os tipos:

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/invest-app-typescript
   npm install
```

---

## Executando: Exemplo 2

```bash
   npm run dev
```

---

## Testando

- Nesta seção, testamos a resposta padronizada de erros usando a classe `HttpError` em TypeScript.
- A busca por um investimento com ID inexistente (`GET /api/investments/999`) lança uma exceção `HttpError(400)` que é capturada pelo middleware de erro,...
- { "error": "Unable to find investment" }
- Já uma requisição de criação (`POST /api/investments`) sem o cabeçalho `Content-Type: application/json` é interceptada pela verificação de...
- { "error": "Content-Type must be application/json" }

---

## Testando: Exemplo 1

```txt
  ### Testar erro ao buscar investimento por ID inexistente
  GET http://localhost:3000/api/investments/999
```

---

## Testando: Exemplo 2

```txt
  ### Testar erro de Content-Type ausente
  POST http://localhost:3000/api/investments
  {
    "name": "Tesouro Selic",
    "value": 1000
  }
```

---

## O diff que importa

- Este diff deve mostrar só a migração de linguagem e a separação em camadas.
- Nenhuma funcionalidade nova deve aparecer aqui; isso mantém a refatoração separada da validação, que entra na próxima etapa.
- O padrão que se repete em todas as rotas é sempre o mesmo: o corpo do handler sai do arquivo de rotas e reaparece, tipado, no controller.
- Compare a rota de leitura por id nas duas etapas.
- Três diferenças resumem a etapa: a rota passou de quinze linhas para uma; o `req.params.id` deixou de ser `any` e virou `string` por causa do genérico...

---

## O diff que importa: Exemplo

```bash
git diff --no-index -- \
  examples/courses/expressjs/projects/invest-app-api/src \
  examples/courses/expressjs/projects/invest-app-typescript/src || true
```

---

## Conceitos abordados

- Migração de JavaScript para TypeScript em um projeto existente
- Separação em routes, controllers, models, middlewares e errors
- Middleware de `Content-Type`
- Tipos do domínio em `src/types/*.d.ts`

---

## Próxima etapa

- InvestApp: Validação: schemas antes dos dados chegarem aos handlers.
- As aulas correspondentes são TypeScript no Express, MVC e Tratamento de Erros.

---

## Arquivos-Chave da Aula

- **tsconfig.json**: `examples/courses/expressjs/projects/invest-app-typescript/tsconfig.json` (linhas marcadas `6,8,15-17`)
- **src/index.ts**: `examples/courses/expressjs/projects/invest-app-typescript/src/index.ts` (linhas marcadas `4-5,18-22`)
- **src/types/Investment.d.ts**: `examples/courses/expressjs/projects/invest-app-typescript/src/types/Investment.d.ts` (linhas marcadas `1-5,7-10`)
- **src/models/Investment.ts**: `examples/courses/expressjs/projects/invest-app-typescript/src/models/Investment.ts` (linhas marcadas `5-15,65`)
- **src/data/investments.ts**: `examples/courses/expressjs/projects/invest-app-typescript/src/data/investments.ts` (linhas marcadas `3`)
- **src/controllers/investments.controller.ts**: `examples/courses/expressjs/projects/invest-app-typescript/src/controllers/investments.controller.ts` (linhas marcadas `19-43`)

---

## Resumo da Aula

- **InvestApp: TypeScript em camadas** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
