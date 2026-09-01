---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "MonitorApp: TypeScript em camadas"
description: "Terceira etapa do MonitorApp: migração da API para TypeScript com separação em rotas, controllers e models, tipos do domínio e tratamento de erros centralizado."
---

<!-- _class: lead -->

# MonitorApp: TypeScript em camadas

Terceira etapa do MonitorApp: migração da API para TypeScript com separação em rotas, controllers e models, tipos do domínio e tratamento de erros centralizado.

---

## Objetivo

- Entender o papel de **MonitorApp: TypeScript em camadas** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/monitor-app-typescript`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US03 — Mudar o código sem medo · RNF06, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK03.1 · Criar `tsconfig.json` (Configuração do TypeScript), TK03.2 · Converter o entrypoint para `src/index.ts` (Montagem do app), TK03.3 · Declarar os tipos em `src/types/Host.d.ts` (O formato do domínio)
- **Executando**
- **Conceitos abordados**
- **Próxima etapa**

---

## Contexto da Aula

- Etapa 3 de 13 · Nível Intermediário · TypeScript · Arquitetura em camadas
- O `routes.js` da etapa 2 fazia tudo: lia a requisição, validava campo, mexia no array e montava a resposta.
- Funciona com cinco rotas e um recurso.
- A partir da etapa 7 serão quatro recursos e quatro entidades: e é agora, antes de o domínio crescer, que o arquivo único se divide em camadas e ganha...
- O comportamento visível não muda: os mesmos caminhos, os mesmos status codes, o mesmo front. O que muda é onde cada decisão mora.

---

## Requisitos, histórias e critérios

- Épico EP04 · Fundação Técnica › Feature FT09 · Arquitetura em camadas e tipos

---

## Requisitos, histórias e critérios: Tabela

- RNF06 Manutenibilidade & Tipagem: tipos do domínio, camadas e erro centralizado | atendido
- RF01 Gestão de Hosts: o mesmo CRUD, agora tipado | inalterado por fora

---

## US03 — Mudar o código sem medo · RNF06

- Como pessoa desenvolvedora,
- quero tipos estáticos e responsabilidades separadas por camada,
- para alterar uma parte do sistema sem quebrar as outras por engano.

---

## US03 — Mudar o código sem medo · RNF06: Exemplo

```txt
Cenário: CA03.1 - O projeto verifica os tipos
  Quando executo npm run typecheck
  Então o comando termina sem nenhum erro
Cenário: CA03.2 - O servidor é todo TypeScript
  Quando procuro arquivos .js dentro de back/src
  Então não encontro nenhum
Cenário: CA03.3 - O roteador só declara rotas
  Dado o arquivo hosts.routes.ts
  Então ele contém apenas caminho, middlewares e handler
  E nenhuma regra de negócio
Cenário: CA03.4 - O model não conhece HTTP
```

---

## Tasks da etapa

- TK03.1 · Criar `tsconfig.json`: modo `strict`, execução direta de `.ts` e o alias `@/*`.
- TK03.2 · Converter o entrypoint para `src/index.ts`: o app registra as camadas em ordem.
- TK03.3 · Declarar os tipos em `src/types/Host.d.ts`: o formato do domínio, uma vez só.
- TK03.4 · Criar `src/models/Host.ts`: a regra de negócio, assíncrona e sem HTTP.
- TK03.5 · Criar `src/controllers/hosts.controller.ts`: a tradução entre HTTP e model.

---

## Estrutura da aplicação

- O `back/` deixa de ser três arquivos e passa a ser sete pastas, uma por responsabilidade.
- O nome de cada pasta é a pergunta que ela responde: `routes/` diz onde, `controllers/` diz como entra e sai por HTTP, `models/` diz o que a regra faz,...
- O `front/` não é tocado.
- O diagrama a seguir percorre uma requisição por essas pastas, na ordem em que o Express as executa.
- As setas cheias são o caminho de sucesso; as pontilhadas, o de erro.

---

## O que muda nesta etapa

- O que muda nesta etapa aparece como ponto central da aula, não apenas como item de índice.
- Terceira etapa do MonitorApp: migração da API para TypeScript com separação em rotas, controllers e models, tipos do domínio e tratamento de erros...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## O que muda nesta etapa: Tabela

- manipulador de erro registrado no `router`: `notFoundHandler` e `errorHandler` registrados no app
- nenhuma verificação estática: `npm run typecheck`

---

## Descrição das tarefas

- Descrição das tarefas aparece como ponto central da aula, não apenas como item de índice.
- Terceira etapa do MonitorApp: migração da API para TypeScript com separação em rotas, controllers e models, tipos do domínio e tratamento de erros...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## TK03.1 · Criar `tsconfig.json` (Configuração do TypeScript)

- Três opções deste arquivo merecem atenção.
- A `"strict": true` da linha 8 é a que dá valor ao resto: sem ela, `undefined` passaria despercebido em metade das funções.
- A `"allowImportingTsExtensions": true` da linha 13 permite escrever `import … from './x.ts'` com a extensão real do arquivo: é o que o Node moderno...
- E o bloco `paths` da linha 15 cria o alias `@/*`, que evita a escada de `../../` entre camadas.
- O `"noEmit": true` deixa explícito o papel do `tsc` aqui: ele verifica, não compila.

---

## TK03.1 · Criar `tsconfig.json` (Configuração do TypeScript): Exemplo

```bash
npm install tsx
npm install -D typescript @types/node @types/express @types/morgan @types/cors
```

---

## TK03.2 · Converter o entrypoint para `src/index.ts` (Montagem do app)

- O arquivo ficou mais curto que o da etapa 2, e a ordem dos `app.use` é o que ele comunica: os middlewares gerais primeiro, as rotas no meio, e os dois...
- Essa posição não é estética.
- O `notFoundHandler` só pode responder depois que todas as rotas tiveram a chance de casar com o caminho, e o `errorHandler` é reconhecido pelo Express...

---

## TK03.3 · Declarar os tipos em `src/types/Host.d.ts` (O formato do...

- Dois tipos, e a diferença entre eles é o ponto da tarefa.
- Separar os dois evita o erro mais comum desta camada: aceitar um objeto pela metade em uma função que promete devolver um recurso inteiro.

---

## TK03.4 · Criar `src/models/Host.ts` (A regra de negócio)

- O model concentra as cinco operações e nada mais. Repare no que ele não importa: não há `Request`, não há `Response`, não há `HttpError`.
- Ele lança `Error` comum: linhas 8, 30 e 46, entre outras: e cabe ao controller decidir se aquilo é um `400` ou um `404`.
- As funções são `async` mesmo manipulando um array em memória, o que hoje é desnecessário.
- É uma escolha deliberada: da etapa 6 em diante toda operação passa a ser realmente assíncrona, e a assinatura já está pronta.
- Nenhum controller vai precisar mudar.

---

## TK03.5 · Criar `src/controllers/hosts.controller.ts` (A camada HTTP)

- O controller é a única camada que fala HTTP.
- Cada função segue a mesma forma em três passos: lê o que precisa da requisição, chama o model, escolhe o status da resposta.
- O `create` das linhas 7 a 17 mostra o padrão inteiro.
- A linha 9 faz o *cast* de `req.body` para `HostInput`: nesta etapa é apenas uma promessa ao compilador, e é exatamente essa promessa não verificada que...
- A linha 15 converte qualquer falha do model em `HttpError('Unable to create host', 400)`.

---

## TK03.6 · Criar `src/errors/HttpError.ts` e os manipuladores de erro

- O `HttpError` é a peça que liga as duas camadas anteriores: uma subclasse de `Error` com um campo `code`. Nada mais.
- O `errorHandlers.ts` traduz.
- As linhas 10 a 12 tratam o caso mais sutil: quando o corpo chega com JSON malformado, quem lança é o próprio `express.json()`, e o erro é um...
- As linhas 14 a 16 convertem o `HttpError` no status guardado, e o final do arquivo transforma qualquer outra exceção em `500`, registrando o `stack` no...
- O `requireJsonContentType.ts` é o segundo middleware da etapa, e existe para o mesmo tipo de falha: um cliente que envia corpo sem declarar...

---

## TK03.7 · Criar `src/routes/hosts.routes.ts` (O mapa de caminhos)

- O resultado das seis tarefas anteriores cabe em cinco linhas legíveis.
- Este arquivo é hoje a melhor documentação do recurso: método, caminho, middlewares e handler, na ordem em que rodam.
- Ele vai crescer duas vezes no projeto: na etapa 4, quando o `validate(schema)` entrar antes do handler, e na etapa 10, quando o `isAuthenticated`...
- Nas duas vezes a mudança será só de composição.
- O array em memória acompanha a migração: o `hosts.ts` declara `Host[]` na linha 3, e é esse tipo que as cinco funções do model prometem devolver.

---

## Executando

- Instale as dependências novas:
- Verifique os tipos e suba a API:
- Suba o front, que não mudou:
- A pasta `front/` não aparece no diff: o contrato HTTP não mudou, então a tela nem percebeu a refatoração.
- É o melhor indicador de que as camadas ficaram no lugar certo.

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/monitor-app-typescript/back
   npm install
```

---

## Executando: Exemplo 2

```bash
   npm run typecheck
   npm run dev
```

---

## Conceitos abordados

- Modo `strict` e o alias de import `@/*`
- Separação em router, controller e model
- Tipo do recurso completo versus tipo da entrada
- Model assíncrono desde antes de precisar ser

---

## Próxima etapa

- MonitorApp: Validação: schemas Zod para corpo, query e parâmetros, e a regra que define o que é um endereço válido.

---

## Arquivos-Chave da Aula

- **back/tsconfig.json**: `examples/courses/expressjs/projects/monitor-app-typescript/back/tsconfig.json` (linhas marcadas `8,13,15-17`)
- **back/src/index.ts**: `examples/courses/expressjs/projects/monitor-app-typescript/back/src/index.ts` (linhas marcadas `16-20`)
- **back/src/types/Host.d.ts**: `examples/courses/expressjs/projects/monitor-app-typescript/back/src/types/Host.d.ts`
- **back/src/models/Host.ts**: `examples/courses/expressjs/projects/monitor-app-typescript/back/src/models/Host.ts` (linhas marcadas `6-16`)
- **back/src/controllers/hosts.controller.ts**: `examples/courses/expressjs/projects/monitor-app-typescript/back/src/controllers/hosts.controller.ts` (linhas marcadas `7-17,31-41`)
- **back/src/errors/HttpError.ts**: `examples/courses/expressjs/projects/monitor-app-typescript/back/src/errors/HttpError.ts`

---

## Resumo da Aula

- **MonitorApp: TypeScript em camadas** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
