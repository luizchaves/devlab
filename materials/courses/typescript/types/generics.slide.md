---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "TypeScript: Generics"
description: "Slides da aula de generics: parâmetros de tipo, restrições com extends, valores padrão, inferência, keyof e classes genéricas."

---


<!-- _class: lead -->

# TypeScript: Generics

Parâmetros de tipo, restrições, inferência e estruturas de dados reutilizáveis.


---


## Objetivo

Reutilizar código sem perder a informação de tipo:

- Declarar funções, interfaces e classes **genéricas**.
- Restringir parâmetros com **`extends`**.
- Definir **valores padrão** de parâmetro de tipo.
- Aproveitar a **inferência** a partir dos argumentos.
- Reconhecer quando um generic **não** se justifica.


---


## O Problema

```ts
// 1. Uma função por tipo: duplicação
function firstString(items: string[]): string | undefined { … }

// 2. any: aceita tudo, protege nada
function firstAny(items: any[]): any { … }

// 3. Generic: uma função, tipo preservado
function first<T>(items: T[]): T | undefined {
  return items[0];
}
```


---


## Inferência

```ts
const name = first(["a", "b"]);   // string | undefined
const value = first([1, 2, 3]);   // number | undefined

const pairResult = pair("ana", 32);   // [string, number]
```

- Quase nunca é preciso passar o tipo explicitamente.
- Só quando não há argumento de onde inferir: `first<string>([])`.


---


## Restrições

```ts
// Sem restrição, T pode ser qualquer coisa — inclusive sem .length
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

longest("banana", "kiwi");    // ok
// longest(10, 20);           // erro: number não tem length
```


---


## `keyof` em Generics

```ts
function getProperty<T, K extends keyof T>(object: T, key: K): T[K] {
  return object[key];
}

const userName = getProperty(user, "name");   // string
const userAge = getProperty(user, "age");     // number
// getProperty(user, "email");                // erro
```

*O retorno `T[K]` devolve exatamente o tipo daquela propriedade.*


---


## Restrições Comuns

| Restrição | Exige que `T` seja |
| --- | --- |
| `T extends object` | Um objeto |
| `T extends { id: string }` | Objeto com `id` |
| `K extends keyof T` | Chave existente em `T` |
| `T extends unknown[]` | Um array |
| `T extends (...args: never[]) => unknown` | Uma função |


---


## Valores Padrão

```ts
interface ApiResponse<T = unknown> {
  status: number;
  data: T;
}

const generic: ApiResponse = { status: 200, data: {} };
const typed: ApiResponse<string[]> = { status: 200, data: ["a"] };
```


---


## Interfaces e Classes

```ts
interface Repository<T, Id = string> {
  findById(id: Id): Promise<T | null>;
  save(entity: T): Promise<T>;
}

class Stack<T> {
  private readonly items: T[] = [];
  push(item: T): this { this.items.push(item); return this; }
  pop(): T | undefined { return this.items.pop(); }
}
```


---


## Quando Não Usar

```ts
// Desnecessário: T aparece só uma vez
function logValue<T>(value: T): void { console.log(value); }

// Melhor
function logValue(value: unknown): void { console.log(value); }
```

*Generic existe para **conectar** posições: entrada com saída, chave com valor.*


---


## Convenções de Nome

| Nome | Uso |
| --- | --- |
| `T` | Tipo principal |
| `U`, `V` | Tipos adicionais |
| `K` | Chave (`K extends keyof T`) |
| `E` | Erro ou elemento |
| `TItem`, `TResult` | Nomes descritivos em API pública |


---


## Exercício

Crie `src/cache.ts`:

1. `class Cache<K extends string | number, V>` com TTL;
2. `set(key, value, ttlMs?)` com padrão de 60 segundos;
3. `get(key)` removendo entradas expiradas;
4. `getOrSet(key, factory, ttlMs?)`;
5. Comprove que dois caches de tipos diferentes não se misturam.


---

## Solução do Exercício (Parte 1)

```ts
export class Cache<K extends string | number, V> {
  private readonly store = new Map<K, { value: V; expiresAt: number }>();

  set(key: K, value: V, ttlMs = 60_000): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

```

---

## Solução do Exercício (Parte 2)

```ts
  get(key: K): V | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) { this.store.delete(key); return undefined; }
    return entry.value;
  }
}
```

---

## Resumo da Aula (Parte 1)

- Generics preservam o tipo, ao contrário de `any`, e evitam duplicação.
- A inferência resolve a maioria das chamadas — anote só quando faltar argumento.
- `extends` estabelece o mínimo exigido de `T`.

---

## Resumo da Aula (Parte 2)

- `K extends keyof T` com retorno `T[K]` tipa acessos genéricos com precisão.
- Parâmetros de tipo aceitam valor padrão, como parâmetros de função.
- `T` usado uma única vez é sinal de generic desnecessário.