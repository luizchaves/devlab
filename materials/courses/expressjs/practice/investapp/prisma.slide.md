---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "InvestApp: Prisma ORM"
description: "Sexta etapa do InvestApp: migração da camada de dados do SQL escrito à mão para o Prisma, com schema declarativo, migrations versionadas e relações com Category e Broker."
---

<!-- _class: lead -->

# InvestApp: Prisma ORM

Sexta etapa do InvestApp: migração da camada de dados do SQL escrito à mão para o Prisma, com schema declarativo, migrations versionadas e relações com Category e Broker.

---

## Objetivo

- Entender o papel de **InvestApp: Prisma ORM** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/invest-app-prismajs-relation`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US07 — Enxergar como a carteira está distribuída · RF01, RNF03, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK07.1 · Instalar Prisma e criar `prisma/schema.prisma` (Schema declarativo), TK07.2 · Substituir `src/database/database.ts` (Client com driver adapter), TK07.3 · Modificar `src/models/Investment.ts` (De SQL para ORM)
- **O model, antes e depois**
- **Migrations**
- **Executando**
- **Testando**

---

## Contexto da Aula

- Etapa 7 de 13 · Nível Avançado · TypeScript · Express.js · Prisma · SQLite
- O SQL escrito à mão dá lugar a um schema declarativo.
- E, com o ORM, o InvestApp ganha as relações que faltavam: cada investimento passa a ter categoria e corretora.
- Todo o modelo desta etapa cabe em um único arquivo declarativo: três entidades e duas relações um-para-muitos.
- O `schema.prisma` que produz esse diagrama é comentado linha a linha no passo 1:

---

## Requisitos, histórias e critérios

- Épico EP01 · Experiência e Carteira › Feature FT03 · Classificação por categoria e corretora

---

## Requisitos, histórias e critérios: Tabela

- RNF03 Persistência Relacional: schema declarativo, migrations versionadas e integridade referencial | atendido
- RF01 Gestão de Investimentos: investimento passa a ter categoria e corretora | atendido

---

## US07 — Enxergar como a carteira está distribuída · RF01, RNF03

- Como investidor,
- quero classificar cada ativo por categoria e corretora,
- para enxergar como o meu patrimônio está distribuído.

---

## US07 — Enxergar como a carteira está distribuída · RF01, RNF03: Exemplo

```txt
Cenário: CA07.1 - Reconstruir o banco via migrations
  Quando rodo npx prisma migrate deploy
  Então a estrutura inteira é recriada no SQLite a partir das migrations
Cenário: CA07.2 - A listagem já traz as relações
  Quando busco os investimentos
  Então cada registro inclui a sua categoria e a sua corretora
Cenário: CA07.3 - Corretora é criada se não existir
  Quando crio um investimento informando uma corretora que ainda não existe
  Então recebo o status 201
  E a corretora passa a existir para os próximos investimentos
Cenário: CA07.4 - Categoria precisa existir
```

---

## Tasks da etapa

- As tarefas abaixo implementam US07 e são a ordem sugerida de execução. Cada uma tem a sua seção detalhada logo em seguida.
- TK07.1 · Instalar Prisma e criar `prisma/schema.prisma`: Declaração do schema ORM com tabelas e relacionamentos.
- TK07.2 · Substituir `src/database/database.ts`: Conexão singleton reutilizável do `PrismaClient`.
- TK07.3 · Modificar `src/models/Investment.ts`: Substituição de SQL cru por consultas autocompletadas do ORM.
- TK07.4 · Remover `src/database/migration.ts`, `seeders.ts` e `load.ts`: Remoção da camada SQL manual legada.

---

## Estrutura da aplicação

- A pasta `prisma/` passa a ser o centro de gravidade dos dados: é ali que ficam o schema, o histórico de migrations e os dados iniciais.

---

## O que muda nesta etapa

- Comparando com a etapa anterior, o SQL manual é substituído pelo Prisma ORM.
- A pasta `prisma/` assume a responsabilidade do esquema declarativo e migrations versionadas.
- Além disso, a aplicação ganha os modelos `Category` e `Broker`, relacionando investimentos a categorias e corretoras de custódia com integridade...

---

## Descrição das tarefas

- Abaixo estão detalhadas as tarefas de implementação desta etapa, com orientações e trechos de código.

---

## TK07.1 · Instalar Prisma e criar `prisma/schema.prisma` (Schema...

- O arquivo abre com dois blocos de configuração: o `generator client` das linhas 4 a 6, que define o que será gerado a partir do schema, e o `datasource...
- O `model Investment` das linhas 12 a 22 é o mesmo investimento das etapas anteriores, agora descrito em vez de criado por SQL.
- A linha 13 substitui o `AUTOINCREMENT` da etapa 6 por `@id @default(uuid())`, e o `@default(now())` da linha 17 transfere ao banco a responsabilidade...
- O trecho destacado nas linhas 18 a 21 é a novidade da etapa.
- Cada relação aparece em duas linhas: o campo escalar `categoryId` (linha 19), que vira a coluna de chave estrangeira no banco, e o campo de relação...

---

## TK07.1 · Instalar Prisma e criar `prisma/schema.prisma` (Schema...: Exemplo

```bash
npm install prisma @prisma/client @prisma/adapter-better-sqlite3
npx prisma init --datasource-provider sqlite
```

---

## TK07.2 · Substituir `src/database/database.ts` (Client com driver...

- O arquivo que na etapa 6 abria o SQLite à mão e envolvia a API síncrona em promessas encolheu para catorze linhas.
- A novidade do Prisma 7 está na linha 9: o client recebe um driver adapter.
- Até a versão 6, o Prisma embarcava um binário próprio para falar com o banco; agora quem conversa com o SQLite é um driver Node comum, e o Prisma se...
- Na prática isso significa instalação mais leve e o mesmo driver que o resto do ecossistema usa.
- A linha 12 cria uma instância de `PrismaClient` e a linha 14 a exporta; todos os models importam essa mesma instância.

---

## TK07.3 · Modificar `src/models/Investment.ts` (De SQL para ORM)

- As cinco funções continuam com os mesmos nomes e as mesmas assinaturas tipadas, exportadas na linha 92.
- Nenhuma linha de controller precisou mudar. O que desapareceu foram as strings de SQL e o `mapRow`.
- O `include` das linhas 8 a 11 é o que substitui o `JOIN` escrito à mão: declarado uma vez, no topo, e reutilizado em todas as consultas: é isso que...
- O trecho destacado nas linhas 13 a 37 é o `create` e mostra as duas formas de ligar um registro a outro.
- Em `category` (linha 31), o `connect` exige que a categoria já exista e recebe o id.

---

## TK07.4 · Substituir os scripts de banco pelo `prisma db seed`

- Os dois scripts que criavam a tabela e carregavam os dados na etapa 6 saem do projeto.
- O `CREATE TABLE` agora é gerado pelo `prisma migrate` a partir do schema, e a carga inicial passa a ser o `src/database/seed.ts`, registrado no...
- O seeder ficou mais curto e mais seguro: o `upsert` das linhas 14 a 18 grava a categoria se ela não existir e não faz nada se já existir: rodar o seed...
- O `$disconnect` das linhas 23 e 26 é obrigatório em um script avulso: sem ele, o processo não termina.
- O `prisma.config.ts` lê a conexão de `process.env.DATABASE_URL`.

---

## TK07.5 · Criar os recursos `Category` e `Broker` (Duas entidades,...

- O `schema.prisma` da TK07.1 declarou `Category` e `Broker`, e o formulário do front passou a ter um `` de categoria.
- Falta o que alimenta esse `select`: as duas entidades precisam existir como recurso HTTP, e cada uma percorre as mesmas cinco camadas que `Investment`...
- São dez arquivos, mas apenas dois padrões: o de `Category` e o de `Broker` são idênticos, com o nome trocado.
- Ambas as entidades são somente leitura pela API: quem as cria é o `seed.ts` da TK07.4, e no caso da corretora também o `connectOrCreate` do model de...
- O model tem duas funções.

---

## TK07.5 · Criar os recursos `Category` e `Broker` (Duas entidades,...: Tabela

- Tipo: `types/Category.d.ts` | `types/Broker.d.ts` | a forma da entidade no TypeScript
- Model: `models/Category.ts` | `models/Broker.ts` | as consultas ao Prisma, sem HTTP
- Controller: `controllers/categories.controller.ts` | `controllers/brokers.controller.ts` | traduz a consulta em resposta e erro
- Schema: `schemas/category.schema.ts` | `schemas/broker.schema.ts` | valida `params` e `query`
- Rota: `routes/categories.routes.ts` | `routes/brokers.routes.ts` | liga o caminho ao controller

---

## TK07.6 · Mostrar categoria e corretora no front

- As relações só existem de verdade quando aparecem na tela.
- O formulário ganha quatro campos e o cartão ganha quatro informações: e é a primeira vez na trilha que o front pede dados a duas rotas diferentes.
- No `index.html`, os campos das linhas 94 a 123 completam o formulário.
- Três são texto ou data comuns; o interessante é o `` da linha 107, que nasce vazio.
- Ele não pode ter opções escritas à mão: as categorias vivem no banco, e o `value` de cada opção precisa ser o `id` que a API vai receber em `categoryId`.

---

## O model, antes e depois

- O contrato das funções não muda: `create`, `read`, `readById`, `update` e `remove`, todas com as mesmas assinaturas tipadas.
- O corpo, sim: compare a leitura por id nas duas etapas.
- Duas diferenças cabem na linha 46. A string SQL sumiu: o `findUnique` recebe um objeto e o Prisma gera a consulta.
- E o `include` que acompanha traz `category` e `broker` resolvidos na mesma ida ao banco: na etapa 6, isso teria exigido escrever um `JOIN` com apelidos...

---

## Migrations

- O `prisma migrate dev` escreve, em `prisma/migrations/`, uma pasta por alteração do schema, com o `migration.sql` que o Prisma gerou e um...
- Nesta etapa são duas: a `20230826214323_init`, que cria a tabela de investimentos, e a `20241011213516_create_category_broker`, que acrescenta...
- Esses arquivos não são escritos à mão: nem devem ser editados depois de aplicados.
- Eles entram no versionamento porque são o histórico que faz o banco de outra máquina chegar ao mesmo estado que o seu.

---

## Migrations: Exemplo

```bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma studio
```

---

## Executando

- Entre na pasta desta etapa e instale:
- Crie o banco a partir do schema e popule as categorias:
- Suba o servidor:
- Inspecione os dados no navegador:

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/invest-app-prismajs-relation
   npm install
   cp .env.example .env
```

---

## Executando: Exemplo 2

```bash
   npx prisma migrate dev
   npx prisma db seed
```

---

## Testando

- Nesta seção, testamos a listagem de investimentos persistidos com Prisma ORM trazendo os relacionamentos `category` e `broker`.
- A consulta `GET /api/investments` retorna a coleção de investimentos com suas entidades associadas pré-carregadas via `include` do Prisma e status `200...
- [ { "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", "name": "Tesouro Selic 2029", "value": 20000, "interest": "100% Selic", "category": { "id": "8f14",...

---

## Testando: Exemplo

```txt
  ### Listar investimentos com Prisma ORM e relacionamentos
  GET http://localhost:3000/api/investments
```

---

## O diff que importa

- O primeiro diff é grande: os models foram reescritos de ponta a ponta.
- O segundo é curto: as rotas continuam chamando `Investment.create`, `Investment.read` e `Investment.readById` com os mesmos argumentos.
- É a segunda vez no projeto que a camada de dados é trocada inteira sem que as camadas acima percebam, e é exatamente isso que a separação em camadas...
- O arquivo do banco é binário e muda a cada requisição.
- O que se versiona é a pasta `prisma/migrations/`: ela reconstrói o banco inteiro em qualquer máquina com `npx prisma migrate dev`.

---

## O diff que importa: Exemplo

```bash
git diff --no-index -- \
  examples/courses/expressjs/projects/invest-app-db-simple/src/models \
  examples/courses/expressjs/projects/invest-app-prismajs-relation/src/models || true
git diff --no-index -- \
  examples/courses/expressjs/projects/invest-app-db-simple/src/routes.js \
  examples/courses/expressjs/projects/invest-app-prismajs-relation/src/routes.js || true
```

---

## Conceitos abordados

- Schema declarativo e geração do client tipado
- Migrations versionadas e o histórico em `prisma/migrations/`
- Instância única do `PrismaClient` com driver adapter (Prisma 7)
- Relações um-para-muitos, `connect`, `connectOrCreate` e `include`
- Carga inicial de dados com `prisma db seed`

---

## Próxima etapa

- InvestApp: Cadastro de Usuário: o model `User` e o hash de senha.

---

## Arquivos-Chave da Aula

- **prisma/schema.prisma**: `examples/courses/expressjs/projects/invest-app-prismajs-relation/prisma/schema.prisma` (linhas marcadas `18-21`)
- **prisma.config.ts**: `examples/courses/expressjs/projects/invest-app-prismajs-relation/prisma.config.ts` (linhas marcadas `5,13,16,18`)
- **src/database/database.ts**: `examples/courses/expressjs/projects/invest-app-prismajs-relation/src/database/database.ts` (linhas marcadas `1,9,12,14`)
- **src/models/Investment.ts**: `examples/courses/expressjs/projects/invest-app-prismajs-relation/src/models/Investment.ts` (linhas marcadas `8-11,13-37`)
- **src/database/seed.ts**: `examples/courses/expressjs/projects/invest-app-prismajs-relation/src/database/seed.ts` (linhas marcadas `13-19,23,26`)
- **prisma/seeders.json**: `examples/courses/expressjs/projects/invest-app-prismajs-relation/prisma/seeders.json`

---

## Resumo da Aula

- **InvestApp: Prisma ORM** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
