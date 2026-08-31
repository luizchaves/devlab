---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Relações com Prisma"
description: "Modelagem de relacionamentos com Prisma em uma API Express: um-para-muitos, muitos-para-muitos, chave estrangeira, include e select aninhados, criação encadeada e comportamento na exclusão."
---

<!-- _class: lead -->

# Express.js: Relações com Prisma

Modelagem de relacionamentos com Prisma em uma API Express: um-para-muitos, muitos-para-muitos, chave estrangeira, include e select aninhados, criação encadeada e comportamento na exclusão.

---

## Objetivo

- Ao final você saberá modelar relações um-para-muitos e muitos-para-muitos, carregar dados relacionados com `include` e `select`, criar registros...

---

## Mapa da Aula

- **Objetivo**
- **O modelo de dados**
- **Um-para-muitos**
- **Muitos-para-muitos**
- **Carregando dados relacionados**
- **Filtrando por relação**
- **Criando registros ligados**
- **O que acontece na exclusão**

---

## Contexto da Aula

- Um investimento pertence a uma categoria, a uma corretora e a um usuário.
- Nenhuma entidade de um sistema real vive sozinha: esta aula trata de declarar essas ligações no schema e de consultá-las sem disparar cem consultas.

---

## O modelo de dados

- Antes do schema vem o diagrama. As cardinalidades definem onde fica a chave estrangeira:

---

## O modelo de dados: Tabela

- Um-para-muitos: no lado "muitos" | `Investment.categoryId`
- Muitos-para-muitos: em uma tabela de junção | `Host` ↔ `Tag`
- Um-para-um: em qualquer lado, com `@unique` | `User` ↔ `Profile`

---

## Um-para-muitos

- A relação é declarada nos dois models, mas só um deles guarda a coluna:

---

## Um-para-muitos: Exemplo

```txt
model Investment {
  id         String   @id @default(cuid())
  name       String
  amount     Int
  categoryId String                                              // a coluna real
  category   Category @relation(fields: [categoryId], references: [id])
}
model Category {
  id          String       @id @default(cuid())
  name        String       @unique
  investments Investment[]                                       // o lado virtual
}
```

---

## Muitos-para-muitos

- Quando os dois lados podem ter vários do outro, é preciso uma tabela de junção. O Prisma oferece as duas formas:
- O Prisma cria e gerencia a tabela `_HostToTag` sozinho. Simples: mas não dá para guardar nada além da ligação.
- Necessária assim que a ligação tiver dados próprios: quando foi criada, por quem, com qual peso.
- A forma implícita cobre o caso "apenas ligar A e B".
- No momento em que aparecer o primeiro atributo da ligação, a migração para a forma explícita é inevitável: e é uma migration de dados, não só de estrutura.

---

## Muitos-para-muitos: Exemplo 1

```txt
    model Host {
      id   String @id @default(cuid())
      name String
      tags Tag[]
    }
    model Tag {
      id    String @id @default(cuid())
      name  String @unique
      hosts Host[]
    }
```

---

## Muitos-para-muitos: Exemplo 2

```txt
    model Host {
      id   String    @id @default(cuid())
      tags HostTag[]
    }
    model Tag {
      id    String    @id @default(cuid())
      hosts HostTag[]
    }
    model HostTag {
      host      Host     @relation(fields: [hostId], references: [id])
      hostId    String
      tag       Tag      @relation(fields: [tagId], references: [id])
```

---

## Carregando dados relacionados

- Por padrão, uma consulta traz apenas as colunas do próprio model. Trazer o relacionado é uma escolha explícita:
- A resposta com relações aninhadas é o que o front-end costuma precisar para renderizar sem uma segunda chamada:
- [ { "id": "b1c2", "name": "Tesouro Selic 2029", "amount": 20000, "category": { "id": "8f14", "name": "Pós-fixado", "color": "#6366f1" }, "broker": {...
- Espalhar `include` pelos controllers faz a mesma entidade sair com formatos diferentes dependendo da rota.
- Concentre a definição em uma constante no model:

---

## Carregando dados relacionados: Tabela

- Campos do próprio model: todos | só os listados
- Relacionamentos: acrescentados | acrescentados
- Coluna sensível (`password`): vem junto | fica de fora por construção
- Podem ser combinados: não no mesmo nível | —

---

## Carregando dados relacionados: Exemplo 1

```ts
const investments = await prisma.investment.findMany({
  include: {
    category: true,
    broker: true,
    user: { select: { id: true, name: true } },   // sem a senha
  },
});
```

---

## Carregando dados relacionados: Exemplo 2

```ts
const investments = await prisma.investment.findMany({
  select: {
    id: true,
    name: true,
    amount: true,
    category: { select: { name: true, color: true } },
  },
});
```

---

## Filtrando por relação

- O `where` navega pelos relacionamentos com três operadores:

---

## Filtrando por relação: Exemplo

```ts
// Investimentos cuja categoria se chama "Pós-fixado"
await prisma.investment.findMany({
  where: { category: { name: 'Pós-fixado' } },
});
// Usuários que têm ao menos um investimento acima de 10000
await prisma.user.findMany({
  where: { investments: { some: { amount: { gt: 10000 } } } },
});
// Usuários sem nenhum investimento
await prisma.user.findMany({
  where: { investments: { none: {} } },
});
```

---

## Criando registros ligados

- Há três formas de estabelecer a ligação na criação, e a escolha depende de o outro registro já existir:
- A forma com `connect` fica melhor quando a criação é aninhada em vários níveis.

---

## Criando registros ligados: Exemplo

```ts
// 1. O relacionado já existe: apenas ligue.
await prisma.investment.create({
  data: {
    name: 'CDB Inter',
    amount: 15000,
    category: { connect: { id: categoryId } },
  },
});
// 2. Criar os dois de uma vez, em uma transação implícita.
await prisma.user.create({
  data: {
    name: 'Ana',
    email: 'ana@example.com',
```

---

## O que acontece na exclusão

- Apagar uma categoria que tem investimentos não é uma decisão do banco: é uma decisão de produto, declarada no schema:
- Um `DELETE /users/1` com cascata pode remover milhares de linhas sem nenhum aviso.
- Use-o onde o filho realmente não faz sentido sem o pai, e prefira `Restrict` quando a exclusão precisar ser uma decisão consciente.

---

## O que acontece na exclusão: Exemplo

```txt
model Investment {
  // O usuário sai, os investimentos dele saem junto.
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId   String
  // A categoria não pode ser apagada enquanto houver investimentos nela.
  category Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  categoryId String
}
```

---

## O problema N+1

- Buscar a lista e depois o relacionado de cada item dispara uma consulta por registro: dez usuários viram onze consultas:
- É a forma mais direta de descobrir um N+1 escondido: e de confirmar que o `include` o resolveu.

---

## O problema N+1: Exemplo 1

```ts
const users = await prisma.user.findMany();
for (const user of users) {
  user.investments = await prisma.investment.findMany({
    where: { userId: user.id },
  });
}
```

---

## O problema N+1: Exemplo 2

```ts
const users = await prisma.user.findMany({
  include: { investments: true },
});
```

---

## Exercício

- No projeto `express-prisma`:
- Acrescente `Category` e relacione-a a `Post` (uma categoria, vários posts).
- Acrescente uma relação muitos-para-muitos entre `Post` e um novo model `Tag`.
- Defina `onDelete: Cascade` de `User` para `Post` e `onDelete: Restrict` de `Category` para
- Faça `GET /posts` devolver título, nome do autor, nome da categoria e as tags: sem a

---

## Exercício: Exemplo

```ts
  const include = {
    author: { select: { id: true, name: true } },
    category: { select: { name: true } },
    tags: { select: { name: true } },
  };
  export function findAll() {
    return prisma.post.findMany({ include });
  }
  export function create({ title, authorId, categoryId, tagIds }) {
    return prisma.post.create({
      data: {
        title,
```

---

## Desafio

- Implemente `GET /categories/summary` devolvendo, para cada categoria, o total investido e a quantidade de investimentos.
- Compare duas soluções: `include` com agregação em JavaScript e `prisma.investment.groupBy`. Meça quantas consultas cada uma dispara.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Modelagem de relacionamentos com Prisma em uma API Express: um-para-muitos, muitos-para-muitos, chave estrangeira, include e select aninhados, criação...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Modelagem

- Em uma relação um-para-muitos, qual lado guarda a chave estrangeira?
- O lado "muitos".
- Quando a relação muitos-para-muitos precisa ser explícita?
- Assim que a ligação tiver atributos próprios: data de criação, autor, peso. A forma implícita só armazena o par de identificadores.

---

## Consultas

- Qual a diferença entre `include` e `select`?
- O que é o problema N+1?
- Buscar uma lista e, para cada item, disparar outra consulta pelo relacionado: uma consulta mais N.
- O `include` resolve tudo em um número fixo de consultas.
- Por que `onDelete: Cascade` exige cuidado?

---

## Na prática

- A etapa correspondente do projeto é InvestApp: Prisma ORM, que acrescenta `Category` e `Broker` ao InvestApp.

---

## Próxima aula

- Senhas e Hash: como guardar uma senha sem poder lê-la de volta.

---

## Resumo da Aula

- **Express.js: Relações com Prisma** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
