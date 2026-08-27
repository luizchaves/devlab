---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "TypeScript: Manipulação de Tipos"
description: "Slides da aula de manipulação de tipos: keyof, tipos mapeados, condicionais, infer, template literal types e limites de complexidade."

---


<!-- _class: lead -->

# TypeScript: Manipulação de Tipos

`keyof`, tipos mapeados, condicionais, `infer` e template literals.


---


## Objetivo

Escrever os recursos que constroem os utility types:

- Consultar tipos com **`keyof`**, **`T[K]`** e **`typeof`**.
- Escrever **tipos mapeados** com modificadores e renomeação.
- Usar **condicionais** e **`infer`**.
- Montar **template literal types**.
- Reconhecer quando a complexidade deixou de compensar.


---


## Operadores de Consulta

```ts
type UserKeys = keyof User;            // "id" | "name" | "age"
type UserId = User["id"];              // string
type Config = typeof config;           // tipo de um valor existente

const LEVELS = ["debug", "info"] as const;
type Level = (typeof LEVELS)[number];  // "debug" | "info"
```


---


## Tipos Mapeados

```ts
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type Getters<T> = {
  [K in keyof T]: () => T[K];
};
```

| Modificador | Efeito |
| --- | --- |
| `?` / `-?` | Adiciona / remove opcional |
| `readonly` / `-readonly` | Adiciona / remove somente leitura |


---


## Renomeando com `as`

```ts
type Prefixed<T, P extends string> = {
  [K in keyof T as `${P}${Capitalize<string & K>}`]: T[K];
};

// Filtrar: chaves mapeadas para never desaparecem
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};
```


---


## Tipos Condicionais

```ts
type IsString<T> = T extends string ? true : false;

type MyExclude<T, U> = T extends U ? never : T;
type MyNonNullable<T> = T extends null | undefined ? never : T;
```

*É um `if` avaliado pelo compilador, no espaço dos tipos.*


---


## Distributividade

```ts
type ToArray<T> = T extends unknown ? T[] : never;

type A = ToArray<string | number>;   // string[] | number[]  (distribuiu)

type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never;
type B = ToArrayNonDist<string | number>;   // (string | number)[]
```

*`Exclude` só funciona porque distribui: cada membro é testado isoladamente.*


---


## `infer`

```ts
type ElementOf<T> = T extends (infer U)[] ? U : never;
type MyReturnType<F> = F extends (...args: never[]) => infer R ? R : never;
type Head<T> = T extends [infer H, ...unknown[]] ? H : never;

type Unwrap<T> = T extends Promise<infer U> ? Unwrap<U> : T;   // recursivo
```


---


## Template Literal Types

```ts
type Method = "get" | "post";
type Resource = "users" | "courses";

type Endpoint = `${Uppercase<Method>} /${Resource}`;
// "GET /users" | "GET /courses" | "POST /users" | "POST /courses"

type ResourceOf<T> = T extends `${string} /${infer R}` ? R : never;
```

*Combinações explodem rápido: 10 × 20 já são 200 membros.*


---


## Quando Parar

| Pergunta | Se "não"… |
| --- | --- |
| Um utility type resolve? | Use o pronto |
| A próxima pessoa entende em 30s? | Simplifique |
| O ganho supera a manutenção? | Duplique um tipo simples |
| A mensagem de erro é compreensível? | Nomeie intermediários |


---


## Exercício

Crie `src/form-types.ts`:

1. `FormValues<T>` transformando primitivos em `string`;
2. `FormErrors<T>` com as mesmas chaves, opcionais;
3. `Touched<T>` com valores `boolean`;
4. `FieldNames<T>` com template literal (`"field:name"`…);
5. `Handlers<T>` gerando `onNameChange`, `onAgeChange`…


---


## Solução do Exercício

```ts
type FormValues<T> = {
  [K in keyof T]: T[K] extends Primitive ? string : FormValues<T[K]>;
};

type FieldNames<T> = `field:${string & keyof T}`;

type Handlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;
};
```


---

## Resumo da Aula (Parte 1)

- `keyof`, `T[K]` e `typeof` extraem informação de tipos e valores existentes.
- Tipo mapeado percorre chaves; `-?` e `-readonly` removem modificadores.
- `as` renomeia chaves, e mapear para `never` as remove.

---

## Resumo da Aula (Parte 2)

- Condicionais **distribuem** sobre uniões quando o tipo testado é um parâmetro nu.
- `infer` captura partes do tipo dentro de um condicional.
- Complexidade cobra manutenção: pare quando a legibilidade cair.