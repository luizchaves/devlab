---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Prisma"
description: "Modelagem declarativa e acesso a dados com o Prisma ORM em uma API Express: schema, migrations, client único, consultas equivalentes ao SQL e seed."
---

<!-- _class: lead -->

# Express.js: Prisma

Modelagem declarativa e acesso a dados com o Prisma ORM em uma API Express: schema, migrations, client único, consultas equivalentes ao SQL e seed.

---

## Objetivo

- Ao final você saberá declarar um schema, gerar e aplicar migrations, usar uma instância única do client e reescrever a camada de model com consultas do...

---

## Projeto de Referência

- Projeto executável: `examples/courses/express/projects/prisma`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Objetivo**
- **O que um ORM troca**
- **Instalação**
- **O schema**
- **Configurando a conexão**
- **Migrations**
- **Uma instância do client**
- **Consultas**

---

## Contexto da Aula

- O Prisma é um ORM: você descreve o modelo de dados em um arquivo, ele gera um cliente JavaScript com autocomplete e traduz as suas chamadas para o SQL...

---

## O que um ORM troca

- Nenhuma ferramenta é grátis. O que se ganha e o que se perde ao sair do SQL puro:
- O Prisma não dispensa entender `JOIN`, índice e plano de execução: ele apenas evita escrever a mesma consulta cinquenta vezes.
- Quando algo ficar lento, o diagnóstico volta a ser em SQL.

---

## O que um ORM troca: Tabela

- Modelagem: `CREATE TABLE` à mão | schema declarativo
- Evolução do banco: scripts próprios | migrations versionadas e geradas
- Autocomplete e tipos: nenhum: tudo é string | client tipado a partir do schema
- Relacionamentos: `JOIN` escrito à mão | `include` / `select`
- Troca de banco: reescrever o SQL | mudar o `provider`
- Consulta complexa: controle total | pode exigir `$queryRaw`

---

## Instalação

- Instale o CLI como dependência de desenvolvimento:
- Instale o cliente:
- Inicialize o projeto Prisma:
- O `init` cria `prisma/schema.prisma` e acrescenta `DATABASE_URL` ao `.env`.

---

## O schema

- O schema tem três blocos: de onde vem o banco, o que gerar e como são os dados.
- Compare com o `CREATE TABLE` da aula anterior: é a mesma modelagem, declarada de forma mais curta.

---

## Configurando a conexão

- A URL do banco vive no ambiente, nunca no schema versionado:
- Versione apenas o `.env.example`. O arquivo real guarda credenciais e é ignorado pelo `.gitignore`: como visto em Configuração.
- O projeto de exemplo usa Prisma 6.
- A partir do Prisma 7 a configuração mudou: a `url` sai do `schema.prisma` e vai para um `prisma.config.ts`, e o `PrismaClient` passa a exigir um...
- O modelo de dados e as consultas permanecem os mesmos.

---

## Configurando a conexão: Exemplo 1

```txt
DATABASE_URL="file:./dev.db"
PORT=3000
```

---

## Configurando a conexão: Exemplo 2

```ts
  import 'dotenv/config';
  import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
  import { PrismaClient } from '#generated/prisma/client.ts';
  const adapter = new PrismaBetterSqlite3({ url: `${process.env.DATABASE_URL}` });
  export const prisma = new PrismaClient({ adapter });
```

---

## Migrations

- Uma migration é um arquivo SQL versionado que descreve uma mudança de estrutura.
- O histórico delas é o que permite reconstruir o banco do zero em qualquer máquina.
- Gera o arquivo de migration, aplica e regenera o client. É o comando de projeto real: o histórico fica versionado.
- Sincroniza o banco com o schema sem gerar histórico. Rápido e idempotente: bom para protótipo e sala de aula, ruim para produção.
- Em desenvolvimento é o botão de recomeçar; apontado para produção, é perda total.

---

## Migrations: Exemplo 1

```bash
    npx prisma migrate dev --name init
```

---

## Migrations: Exemplo 2

```bash
    npx prisma db push
```

---

## Uma instância do client

- O `PrismaClient` gerencia um pool de conexões. A aplicação inteira precisa compartilhar uma instância:
- Cada `new PrismaClient()` abre o próprio pool.
- Instanciar dentro de um controller esgota as conexões do banco em poucos minutos de uso: e o sintoma (timeouts intermitentes) não aponta para a causa.

---

## Consultas

- Cada método do client corresponde a um comando SQL. O comentário mostra o que é gerado:
- Filtros, ordenação, paginação e junções seguem a mesma forma declarativa:
- Em uma tabela de usuários, `select: { id: true, name: true, email: true }` garante que a coluna `password` nunca saia do banco.
- É a diferença entre esquecer de remover o campo e ele não existir na resposta: voltaremos a isso em Cadastro de Usuário.

---

## Consultas: Exemplo 1

```js
// SELECT * FROM User
const todos = await prisma.user.findMany();
// SELECT * FROM User WHERE id = 1
const um = await prisma.user.findUnique({ where: { id: 1 } });
// SELECT … LIMIT 1  — lança se não existir
const obrigatorio = await prisma.user.findUniqueOrThrow({ where: { id: 1 } });
// INSERT INTO User (name, email) VALUES (…)
const novo = await prisma.user.create({
  data: { name: 'Ana', email: 'ana@example.com' },
});
```

---

## Consultas: Exemplo 2

```js
const filtrados = await prisma.user.findMany({
  where: { name: { startsWith: 'A' } },
  orderBy: { name: 'asc' },
  take: 10, //  LIMIT 10
  skip: 20, //  OFFSET 20
});
// Equivalente a um JOIN: traz o usuário com os posts dele
const comPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true },
});
// Seleciona apenas algumas colunas — o resto nem sai do banco
```

---

## Seed

- O seed popula o banco com os dados mínimos para a aplicação funcionar: categorias, papéis, um usuário administrador.
- Rodar duas vezes não deve duplicar registros. `upsert` resolve: ele cria se não existir e atualiza se existir.

---

## Seed: Exemplo

```json
{
  "prisma": { "seed": "node prisma/seed.js" },
  "scripts": {
    "db:seed": "prisma db seed"
  }
}
```

---

## Estrutura do projeto

- Estrutura do projeto aparece como ponto central da aula, não apenas como item de índice.
- Modelagem declarativa e acesso a dados com o Prisma ORM em uma API Express: schema, migrations, client único, consultas equivalentes ao SQL e seed.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Executando

- Aplique o schema ao banco:
- Popule com dados iniciais:
- Inspecione visualmente, se quiser:
- Suba o servidor:

---

## Exercício

- No projeto `express-prisma`:
- Acrescente ao schema um model `Category` com `id`, `name` (`@unique`) e `color`.
- Relacione `Category` a `Post`: uma categoria tem vários posts.
- Rode `prisma migrate dev --name add_category` e observe o SQL gerado.
- Atualize o seed criando três categorias com `upsert`.

---

## Exercício: Exemplo 1

```txt
  model Category {
    id    Int    @id @default(autoincrement())
    name  String @unique
    color String
    posts Post[]
  }
  model Post {
    id         Int      @id @default(autoincrement())
    title      String
    published  Boolean  @default(false)
    authorId   Int
    author     User     @relation(fields: [authorId], references: [id])
    categoryId Int?
```

---

## Desafio

- Compare o SQL gerado por `include: { posts: true }` e por duas consultas separadas.
- Ative o log do client com `new PrismaClient({ log: ['query'] })` e observe quantas consultas cada abordagem dispara ao listar dez usuários com os posts...

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Modelagem declarativa e acesso a dados com o Prisma ORM em uma API Express: schema, migrations, client único, consultas equivalentes ao SQL e seed.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Schema e migrations

- Qual a diferença entre `migrate dev` e `db push`?
- Por que o histórico de migrations é versionado no Git?
- Porque é ele que permite reconstruir o banco do zero em qualquer máquina e aplicar as mesmas mudanças, na mesma ordem, em produção.

---

## Client e consultas

- Por que uma instância única do `PrismaClient`?
- Porque cada instância abre o próprio pool de conexões.
- Criar um client por requisição esgota o limite do banco, com sintoma de timeouts intermitentes.
- Qual a diferença entre `select` e `include`?
- Por que o seed precisa ser idempotente?

---

## Na prática

- A etapa correspondente do projeto é InvestApp: Prisma ORM.

---

## Próxima aula

- CRUD com Prisma: ligando o client aos controllers.

---

## Arquivos-Chave da Aula

- **prisma/schema.prisma**: `examples/courses/express/projects/prisma/prisma/schema.prisma`
- **src/lib/prisma.js**: `examples/courses/express/projects/prisma/src/lib/prisma.js`
- **prisma/seed.js**: `examples/courses/express/projects/prisma/prisma/seed.js`

---

## Resumo da Aula

- **Express.js: Prisma** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
