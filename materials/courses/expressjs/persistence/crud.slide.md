---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: CRUD com Prisma"
description: "Ligando o Prisma aos controllers e obtendo um CRUD completo e persistente."
---

<!-- _class: lead -->

# Express.js: CRUD com Prisma

Ligando o Prisma aos controllers e obtendo um CRUD completo e persistente.

---

## Objetivo

- Trocar a camada de dados sem tocar nas demais camadas, comprovando na prática o valor da separação feita em MVC.

---

## Mapa da Aula

- **Objetivo**
- **O que muda**
- **O controller completo**
- **As quatro operações**
- **Executando**
- **Testando o ciclo completo**: Listar, Buscar com os relacionamentos, Criar
- **Exercício**
- **Desafio**

---

## Contexto da Aula

- Esta é a última etapa da trilha: o mesmo CRUD da aula de MVC, agora gravando em banco.
- Note o que não muda: router, middlewares e o formato das respostas continuam idênticos.

---

## O que muda

- O model em memória desaparece; o controller passa a falar com o Prisma e a ser `async`:
- No Express 5, o erro lançado dentro de uma função `async` chega sozinho ao `errorHandler`.
- Foi por isso que centralizamos o tratamento de erros lá atrás.

---

## O que muda: Exemplo

```js
export function index(req, res) {
  res.json(User.findAll());
}
export async function index(req, res) {
  const users = await prisma.user.findMany({ orderBy: { id: 'asc' } });
  res.json(users);
}
```

---

## O controller completo

- O controller completo aparece como ponto central da aula, não apenas como item de índice.
- Ligando o Prisma aos controllers e obtendo um CRUD completo e persistente.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## As quatro operações

- As quatro operações aparece como ponto central da aula, não apenas como item de índice.
- Ligando o Prisma aos controllers e obtendo um CRUD completo e persistente.
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Executando

- Entre no projeto e instale:
- Crie o `.env` a partir do exemplo:
- Crie as tabelas e popule o banco:
- Suba o servidor:

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/prisma
```

---

## Executando: Exemplo 2

```bash
   cp .env.example .env
```

---

## Testando o ciclo completo

- Nesta seção, testamos o CRUD completo persistido em banco de dados via Prisma ORM.

---

## Listar

- O endpoint `GET /users` retorna a lista de todos os usuários cadastrados no banco de dados com status `200 OK`:
- [ { "id": 1, "name": "Ana", "email": "ana@example.com", "createdAt": "2026-03-10T12:00:00.000Z" } ]

---

## Listar: Exemplo

```txt
  ### Listar usuários com Prisma
  GET http://localhost:3000/users
```

---

## Buscar com os relacionamentos

- A busca por ID `GET /users/1` utiliza a instrução `include` do Prisma para carregar o usuário juntamente com seus relacionamentos (ex: posts),...
- { "id": 1, "name": "Ana", "email": "ana@example.com", "createdAt": "2026-03-10T12:00:00.000Z", "posts": [] }

---

## Buscar com os relacionamentos: Exemplo

```txt
  ### Buscar usuário por ID com relacionamentos
  GET http://localhost:3000/users/1
```

---

## Criar

- { "name": "Carla", "email": "carla@example.com" }
- { "id": 3, "name": "Carla", "email": "carla@example.com", "createdAt": "2026-03-10T12:05:00.000Z" }

---

## Remover

- Reinicie o servidor e liste novamente: os dados continuam lá. É isso que persistência significa.

---

## Exercício

- Implemente o CRUD completo de `Post`, seguindo a mesma estrutura: `post-controller.js` e `post-router.js`, montado em `/posts`.
- Ao criar um post, valide que o `authorId` informado existe e responda `400` caso não exista.

---

## Desafio

- O `POST /users` com um e-mail já cadastrado hoje resulta em `500`, porque o Prisma lança um erro de constraint `UNIQUE`.
- Trate esse caso no `errorHandler`, respondendo `409 Conflict` com uma mensagem clara.
- Dica: o erro tem `code === 'P2002'`.
- { "error": { "status": 409, "message": "E-mail já cadastrado" } }

---

## Na prática

- O projeto executável desta aula é Express + Prisma.

---

## Próxima aula

- Relações com Prisma: modelagem e consulta de dados relacionados.

---

## Arquivos-Chave da Aula

- **src/controllers/user-controller.js**: `examples/courses/expressjs/projects/prisma/src/controllers/user-controller.js` (linhas marcadas `4`)
- **store**: `examples/courses/expressjs/projects/prisma/src/controllers/user-controller.js`
- **index e show**: `examples/courses/expressjs/projects/prisma/src/controllers/user-controller.js`
- **update**: `examples/courses/expressjs/projects/prisma/src/controllers/user-controller.js`
- **destroy**: `examples/courses/expressjs/projects/prisma/src/controllers/user-controller.js`

---

## Resumo da Aula

- **Express.js: CRUD com Prisma** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
