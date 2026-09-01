---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "InvestApp: Cadastro de Usuário"
description: "Sétima etapa do InvestApp: model User com hash Argon2id nativo, relação entre usuário e investimento, rota pública de cadastro e a tela de signup."
---

<!-- _class: lead -->

# InvestApp: Cadastro de Usuário

Sétima etapa do InvestApp: model User com hash Argon2id nativo, relação entre usuário e investimento, rota pública de cadastro e a tela de signup.

---

## Objetivo

- Entender o papel de **InvestApp: Cadastro de Usuário** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/invest-app-prismajs-user`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US08 — Ter uma carteira própria · RF02, RNF02, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK08.1 · Modificar `prisma/schema.prisma` (Model User e relação em Investment), TK08.2 · Criar `src/utils/password.ts` e `src/models/User.ts` (Hash da senha), TK08.3 · Criar a rota `POST /api/users` (Auto-cadastro)
- **A migration**
- **Executando**
- **Testando**
- **O diff que importa**

---

## Contexto da Aula

- Etapa 8 de 13 · Nível Avançado · TypeScript · Express.js · Prisma · `node:crypto`
- O InvestApp deixa de ser de uma pessoa só.
- Esta etapa acrescenta o model `User`, liga cada investimento a um dono e guarda a senha do único jeito aceitável: como hash.
- Gestão de Usuários: veja Cadastro de Usuários e Armazenamento Seguro de Senhas

---

## Requisitos, histórias e critérios

- Épico EP02 · Identidade e Acesso › Feature FT04 · Cadastro de investidor

---

## Requisitos, histórias e critérios: Tabela

- RF02 Cadastro de Usuários: entidade `User`, rota pública de cadastro e a tela ligada à API | atendido
- RNF02 Criptografia & Segurança: hash Argon2id no formato PHC, gerado dentro do model | atendido

---

## US08 — Ter uma carteira própria · RF02, RNF02

- Como visitante,
- quero criar uma conta com nome, e-mail e senha,
- para ter uma carteira que seja só minha.

---

## US08 — Ter uma carteira própria · RF02, RNF02: Exemplo

```txt
Cenário: CA08.1 - Cadastro bem-sucedido
  Quando envio POST /api/users com nome, e-mail e senha válidos
  Então recebo o status 201
  E o corpo traz id, nome e e-mail
  Mas o corpo não traz o campo password
Cenário: CA08.2 - E-mail é único
  Dado um usuário já cadastrado com "maria@email.com"
  Quando envio POST /api/users com o mesmo e-mail
  Então recebo o status 409
Cenário: CA08.3 - Confirmação de senha
  Quando envio o cadastro com password e confirmationPassword diferentes
  Então recebo o status 400
```

---

## Tasks da etapa

- As tarefas abaixo implementam US08 e são a ordem sugerida de execução. Cada uma tem a sua seção detalhada logo em seguida.
- TK08.1 · Modificar `prisma/schema.prisma`: Inclusão da entidade `User` e relacionamento com `Investment`.
- TK08.2 · Criar `src/utils/password.ts` e `src/models/User.ts`: Hash Argon2id com `node:crypto` e `select` sem o hash.
- TK08.3 · Criar a rota `POST /api/users`: Controller, schema e roteador do auto-cadastro.
- TK08.4 · Modificar `public/js/signup.js`: Conexão do formulário HTML com o endpoint de registro.

---

## Estrutura da aplicação

- O `User` repete o conjunto de camadas que as entidades da etapa 7 já tinham: tipo, model, schema, controller e rota: e acrescenta uma pasta que ainda...
- É lá que mora o hash de senha, e é lá que o JWT da etapa 9 vai entrar.

---

## O que muda nesta etapa

- A etapa acrescenta uma nova entidade `User` ao schema do Prisma, o model correspondente `User.js`, a rota `POST /api/users` e duas telas de front-end:...

---

## Descrição das tarefas

- Abaixo estão detalhadas as tarefas de implementação desta etapa, com orientações e trechos de código.

---

## TK08.1 · Modificar `prisma/schema.prisma` (Model User e relação em...

- O schema muda em dois pontos, e os dois estão destacados.
- O primeiro são as linhas 20 e 21, dentro do `model Investment`: a relação `user` e a chave estrangeira `userId`, no mesmo par de linhas que `category`...
- O `onDelete: Cascade` da linha 20 é a diferença importante: apagar um usuário apaga junto os investimentos dele, o que evita registros órfãos apontando...
- O segundo é o `model User` das linhas 33 a 39.
- São quatro campos, e dois deles carregam decisões: o `email` da linha 36 é `@unique`, e é essa restrição que permite ao banco recusar um cadastro...

---

## TK08.2 · Criar `src/utils/password.ts` e `src/models/User.ts`...

- Nenhuma dependência nova: o hash é feito com `node:crypto`, importado na linha 10.
- O Node traz o Argon2id embutido, que é o algoritmo recomendado hoje para senha: mais resistente a ataque com GPU do que os anteriores, porque o custo...
- As constantes das linhas 14 a 23 são esse custo declarado: 64 MiB de memória, 3 passagens e 4 threads.
- São os números que tornam cada tentativa de quebra cara.
- O `hashPassword` da linha 33 gera um sal novo a cada chamada (linha 34) e devolve tudo junto em uma string no formato PHC:

---

## TK08.2 · Criar `src/utils/password.ts` e `src/models/User.ts`...: Exemplo

```txt
$argon2id$v=19$m=65536,t=3,p=4$1x8S8vrkIM+oF8Y...$RdescudvJCsgt3ub...
```

---

## TK08.3 · Criar a rota `POST /api/users` (Auto-cadastro)

- A camada de usuário nasce completa, no mesmo formato das demais: schema, controller e roteador.
- O schema começa pelas regras de formato: nome com no mínimo 3 caracteres, `email()` e senha de no mínimo 8.
- O `refine` das linhas 12 a 17 é a novidade: ele valida uma regra que envolve dois campos ao mesmo tempo, conferindo que `confirmationPassword` bate com...
- O `path` no final é o que faz o erro apontar para o campo de confirmação, e não para o formulário inteiro.
- O controller descarta o `confirmationPassword` na desestruturação da linha 8: ele serviu à validação e não existe no schema do Prisma.

---

## TK08.4 · Modificar `public/js/signup.js` (Submissão do formulário)

- O front continua em JavaScript vanilla: o TypeScript da etapa 3 vale para o servidor, não para o navegador: e reaproveita a mesma camada `API` da etapa 2.
- Nenhum `fetch` aparece aqui.
- O `handleSubmit` segue o padrão já conhecido: `event.preventDefault()` para a página não recarregar, e `Object.fromEntries(new FormData(form))` para...
- Repare que o `confirmationPassword` vai junto: é exatamente o campo que o `refine` do schema confere no servidor.
- Quando a resposta traz o `email`, o cadastro deu certo e o front redireciona para a tela de login.

---

## TK08.5 · Ligar o investimento ao dono (`userId` no model, no tipo...

- Criar a entidade `User` não basta: o `schema.prisma` da TK08.1 declarou que todo `Investment` pertence a um `User`, e essa relação é obrigatória.
- Sem mais nada, a rota de criação da etapa 7 passa a falhar: o banco recusa um investimento sem dono.
- Quatro arquivos mudam por causa disso, e todos pelo mesmo motivo.
- O tipo é o primeiro.
- O `userId` da linha 12 entra no `Investment`, e a versão opcional da linha 24 entra no `InvestmentInput`: opcional porque quem envia o formulário não...

---

## A migration

- As duas mudanças do schema: o model novo e a chave estrangeira: viram uma migration só: `prisma/migrations/20241012023426_create_user/migration.sql`,...
- Ela cria a tabela `User`, recria `Investment` com a coluna `userId` e o índice único do e-mail.
- Como toda migration, é arquivo gerado: entra no versionamento para que outra máquina chegue ao mesmo banco, mas não se edita depois de aplicada.
- As duas migrations anteriores, da etapa 7, continuam intactas ao lado dela: é isso que torna o histórico cumulativo.
- Acrescentar uma coluna `NOT NULL` sem valor padrão quebra a migration se já houver investimentos.

---

## A migration: Exemplo

```bash
npx prisma migrate dev --name add_user_model
```

---

## Executando

- Entre na pasta desta etapa e instale:
- Recrie o banco com o schema novo e popule categorias e usuário padrão:
- Suba o servidor e abra a tela de cadastro em http://localhost:3000/signup.html:

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/invest-app-prismajs-user
   npm install
   cp .env.example .env
```

---

## Executando: Exemplo 2

```bash
   npx prisma migrate deploy
   npx prisma db seed
```

---

## Testando

- Nesta seção, testamos a rota de cadastro de investidores (`POST /api/users`).
- A criação do usuário envia os dados no corpo da requisição.
- A senha é criptografada com Argon2id antes da gravação no banco, e o payload de retorno expurga o campo de senha por segurança, respondendo com status...
- { "name": "Maria", "email": "maria@email.com", "password": "senha123" }
- { "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", "name": "Maria", "email": "maria@email.com" }

---

## Testando: Exemplo 1

```txt
  ### Cadastrar novo investidor com Argon2id
  POST http://localhost:3000/api/users
  Content-Type: application/json
  {
    "name": "Maria",
    "email": "maria@email.com",
    "password": "senha123"
  }
```

---

## Testando: Exemplo 2

```bash
npx prisma studio
```

---

## O diff que importa

- Aparecem quatro coisas: a migration do `User`, o `src/models/User.js`, a rota `POST /api/users` e o `public/js/signup.js`.
- Nenhuma linha de autenticação ainda: cadastrar e autenticar são problemas diferentes, e esta etapa resolve só o primeiro.
- O padrão da alteração no schema é sempre o mesmo par de linhas. Compare o `model Investment` das duas etapas:
- Duas linhas a mais, e nada mais muda no model.
- O peso da alteração está na migration que ela gera: e é sobre isso que o aviso do `userId` obrigatório fala.

---

## O diff que importa: Exemplo

```bash
git diff --no-index -- \
  examples/courses/expressjs/projects/invest-app-prismajs-relation \
  examples/courses/expressjs/projects/invest-app-prismajs-user || true
```

---

## Conceitos abordados

- Migration que acrescenta um model e uma chave estrangeira
- Hash de senha com Argon2id do `node:crypto`, sem dependência externa
- Formato PHC: parâmetros de custo e salt viajando junto do hash
- Comparação em tempo constante com `timingSafeEqual`
- A senha removida da resposta antes de sair da rota

---

## Próxima etapa

- InvestApp: Autenticação: login, token e investimentos por dono.

---

## Arquivos-Chave da Aula

- **prisma/schema.prisma**: `examples/courses/expressjs/projects/invest-app-prismajs-user/prisma/schema.prisma` (linhas marcadas `20-21,33-39`)
- **src/utils/password.ts**: `examples/courses/expressjs/projects/invest-app-prismajs-user/src/utils/password.ts` (linhas marcadas `10,14-23,33-46`)
- **src/models/User.ts**: `examples/courses/expressjs/projects/invest-app-prismajs-user/src/models/User.ts` (linhas marcadas `3,9,18,41-49`)
- **src/schemas/user.schema.ts**: `examples/courses/expressjs/projects/invest-app-prismajs-user/src/schemas/user.schema.ts` (linhas marcadas `12-17`)
- **src/controllers/users.controller.ts**: `examples/courses/expressjs/projects/invest-app-prismajs-user/src/controllers/users.controller.ts` (linhas marcadas `8-10,17-19`)
- **src/routes/users.routes.ts**: `examples/courses/expressjs/projects/invest-app-prismajs-user/src/routes/users.routes.ts` (linhas marcadas `11`)

---

## Resumo da Aula

- **InvestApp: Cadastro de Usuário** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
