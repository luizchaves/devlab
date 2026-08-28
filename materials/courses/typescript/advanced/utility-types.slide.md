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
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "TypeScript: Utility Types"
description: "Slides da aula de utility types: Partial, Pick, Omit, Record, Exclude, Extract, ReturnType, Awaited e composição de tipos derivados."

---


<!-- _class: lead -->

# TypeScript: Utility Types

Derivar tipos a partir de outros, com uma única fonte da verdade.


---


## Objetivo

Evitar manter quatro versões do mesmo tipo em sincronia:

- Aplicar os utilitários de **objeto**: `Partial`, `Pick`, `Omit`, `Record`.
- Aplicar os de **união**: `Exclude`, `Extract`, `NonNullable`.
- Aplicar os de **função**: `ReturnType`, `Parameters`, `Awaited`.
- **Compor** utilitários entre si.
- Reconhecer o limite de legibilidade.


---


## Objeto

| Utilitário | Produz |
| --- | --- |
| `Partial<T>` | Todas opcionais |
| `Required<T>` | Todas obrigatórias |
| `Readonly<T>` | Todas somente leitura |
| `Pick<T, K>` | Só as chaves listadas |
| `Omit<T, K>` | Todas **menos** as listadas |
| `Record<K, V>` | Objeto com chaves `K` e valores `V` |


---


## Projeções de um Tipo

```ts
type UserUpdate = Partial<User>;
type PublicUser = Omit<User, "password">;
type Credentials = Pick<User, "email" | "password">;
type UsersById = Record<string, PublicUser>;

function updateUser(id: string, changes: Partial<Omit<User, "id" | "createdAt">>) { … }
```

*`Omit` envelhece melhor que `Pick`: campos novos entram automaticamente.*


---


## `Record` e Exaustividade

```ts
type Level = "debug" | "info" | "error";

const colors: Record<Level, string> = {
  debug: "#9e9e9e",
  info: "#42a5f5",
  error: "#f44336",
};

// Faltar uma chave é erro de compilação
```

*Valor novo na união faz todos os mapas falharem — como o `never` no `switch`.*


---


## União

| Utilitário | Produz |
| --- | --- |
| `Exclude<T, U>` | Membros de `T` que **não** são `U` |
| `Extract<T, U>` | Membros de `T` que **são** `U` |
| `NonNullable<T>` | `T` sem `null` e `undefined` |

```ts
type Visible = Exclude<Status, "removido">;
type Name = NonNullable<string | null | undefined>;   // string
```


---


## Função e Promise

```ts
type Session = ReturnType<typeof createSession>;
type SessionArgs = Parameters<typeof createSession>;
type Users = Awaited<ReturnType<typeof loadUsers>>;

function retry(...args: SessionArgs): Session {
  return createSession(...args);
}
```

*O `typeof` aqui é o do espaço de tipos: consulta o tipo de um valor existente.*


---


## String

```ts
type Event = "click" | "focus";

type Upper = Uppercase<Event>;                 // "CLICK" | "FOCUS"
type HandlerName = `on${Capitalize<Event>}`;   // "onClick" | "onFocus"

const handlers: Record<HandlerName, () => void> = {
  onClick: () => {},
  onFocus: () => {},
};
```


---


## Compondo

```ts
type CreateUser = Omit<User, "id" | "createdAt">;
type UpdateUser = Partial<Omit<User, "id" | "createdAt" | "password">>;
type UserResponse = Readonly<Omit<User, "password">>;

// Tornar opcionais apenas algumas chaves
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```

*Acima de dois ou três níveis, dê um nome ao tipo intermediário.*


---


## Exercício

Crie `src/api-types.ts`:

1. `interface Article` com oito campos;
2. `CreateArticle` sem os campos gerados pelo servidor;
3. `UpdateArticle` parcial, sem `id`, `slug` e `createdAt`;
4. `ArticleSummary` somente leitura com três campos;
5. `ApiResult<T>` como união discriminada.


---


## Solução do Exercício

```ts
type CreateArticle = Omit<Article, "id" | "createdAt">;
type UpdateArticle = Partial<Omit<Article, "id" | "slug" | "createdAt">>;
type ArticleSummary = Readonly<Pick<Article, "slug" | "title" | "tags">>;
type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

function create(input: CreateArticle): ApiResult<Article> {
  if (!input.title.trim()) return { ok: false, error: "título obrigatório" };
  return { ok: true, data: { id: crypto.randomUUID(), createdAt: new Date(), ...input } };
}
```


---

## Resumo da Aula (Parte 1)

- Utility types derivam tipos: uma fonte da verdade, várias projeções.
- `Omit` resiste melhor a campos novos do que `Pick`.
- `Record<Uniao, V>` obriga a cobrir todas as chaves — exaustividade em mapas.

---

## Resumo da Aula (Parte 2)

- `Exclude` e `Extract` filtram uniões; `NonNullable` remove nulos.
- `ReturnType`, `Parameters` e `Awaited` extraem tipos de funções existentes.
- Composição é poderosa até virar ilegível: nomeie tipos intermediários.