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
title: "Guia de Referência: TypeScript"
description: "Slides de referência rápida do TypeScript: anotações, tipos especiais, objetos e tuplas, estreitamento, generics, utility types, tipos mapeados e opções do tsconfig."

---


<!-- _class: lead -->

# Guia de Referência: TypeScript

A sintaxe do sistema de tipos em uma passada.


---


## Legenda

- **`T`, `U`, `K`**: parâmetros de tipo.
- **`prop?`**: propriedade ou parâmetro opcional.
- **Apagável**: some na compilação, sem efeito em runtime.
- **Emite código**: existe durante a execução.
- **`5.x`**: versão a partir da qual o recurso existe.


---


## Anotações e Asserções

```ts
const x: T = valor;              // anotação explícita
type Nome = T;                   // apelido de tipo
interface Nome { /* ... */ }     // forma de objeto

valor as T          // afirma sem verificar — RISCO ALTO
valor as const      // congela em literal e readonly
valor satisfies T   // verifica sem alargar          (5.0)
valor!              // remove null/undefined — RISCO ALTO
```


---


## Primitivos e Especiais

| Tipo | Comportamento |
| :--- | :--- |
| `string`, `number`, `boolean` | Sempre minúsculos |
| `bigint`, `symbol` | Casos específicos |
| `null`, `undefined` | Tipos próprios sob `strictNullChecks` |
| `any` | Desliga a verificação e **propaga** |
| `unknown` | Exige estreitar antes de usar |
| `never` | Tipo vazio; exaustividade |
| `void` | Retorno descartado |


---


## Objetos

```ts
{ prop: T }             // obrigatória
{ prop?: T }            // opcional: adiciona undefined
{ readonly prop: T }    // apagável: não congela em runtime
{ [key: string]: T }    // assinatura de índice

interface A extends B, C { /* ... */ }
```


---


## Arrays e Tuplas

```ts
T[]  |  Array<T>              // equivalentes
readonly T[]                  // bloqueia push/pop/atribuição

[T, U]                        // tupla: posição fixa
[nome: T, idade: U]           // nomes só documentam
[T, ...U[]]                   // início fixo, cauda variável
```


---


## Uniões e Estreitamento

```ts
A | B        // ou            A & B        // e

typeof x === "string"    // primitivos
x instanceof Classe      // protótipo, não interface
"prop" in objeto         // presença de propriedade
Array.isArray(x)         // único jeito confiável

function isT(x: unknown): x is T          // predicate
function assertT(x: unknown): asserts x is T
```


---


## Funções

```ts
(a: T, b?: U, ...rest: V[]) => R

interface F { (a: T): R }        // assinatura de chamada
interface C { new (a: T): R }    // assinatura de construção

function f(a: T): R;             // sobrecarga
function f(this: T, ...)         // this é apagável
```


---


## Generics

```ts
function f<T>(x: T): T

<T extends U>     // restrição
<T = U>           // valor padrão
<const T>         // preserva literais            (5.0)
NoInfer<T>        // bloqueia como fonte          (5.4)
```


---


## Operadores de Tipo

```ts
keyof T                          // união das chaves
typeof valor                     // tipo de um VALOR
T[K]                             // acesso indexado
T[number]                        // união dos elementos

(typeof OBJ)[keyof typeof OBJ]   // valores de um objeto as const
```


---


## Mapeados

```ts
{ [K in keyof T]: T[K] }              // base de todo utility type
{ [K in keyof T]?: T[K] }             // adiciona opcional
{ -readonly [K in keyof T]: T[K] }    // remove modificador
{ [K in keyof T as Nova]: T[K] }      // remapeia a chave   (4.1)
```


---


## Condicionais e Template Literals

```ts
T extends U ? X : Y                   // distribui sobre união
T extends (infer U)[] ? U : never     // infer captura
[T] extends [U] ? X : Y               // desliga a distribuição

type H = `on${Capitalize<E>}`                        // (4.1)
Uppercase | Lowercase | Capitalize | Uncapitalize
```


---


## Utility Types: Objeto

| Tipo | Faz |
| :--- | :--- |
| `Partial<T>` | Tudo opcional (não recursivo) |
| `Required<T>` | Remove a opcionalidade |
| `Readonly<T>` | Tudo somente leitura (não recursivo) |
| `Pick<T, K>` | Mantém as chaves `K` — **valida** `K` |
| `Omit<T, K>` | Remove as chaves `K` — **não valida** |
| `Record<K, T>` | Objeto de chaves `K` e valores `T` |


---


## Utility Types: União, Função, Promise

| Tipo | Faz |
| :--- | :--- |
| `Exclude<T, U>` | Remove membros da **união** |
| `Extract<T, U>` | Mantém membros da união |
| `NonNullable<T>` | Tira `null` e `undefined` |
| `Parameters<F>` | Parâmetros como **tupla** |
| `ReturnType<F>` | Tipo de retorno |
| `InstanceType<C>` | Tipo da instância |
| `Awaited<T>` | Desembrulha `Promise` recursivamente |


---


## O Que NÃO É Nativo?

```ts
DeepPartial   DeepReadonly   Mutable   Nullable   ValueOf
```

- Comuns em código de projeto e em sugestões de IA.
- **Nenhum deles existe na biblioteca padrão.**
- Sem definição no arquivo, o código não compila.


---


## Classes

| Sintaxe | Runtime |
| :--- | :--- |
| `public`, `private`, `protected` | **Apagável** |
| `#campo` | **Emite código**, realmente privado |
| `constructor(private nome: T)` | **Emite código** |
| `abstract` | Apagável |
| `implements I` | Apagável: verifica, não herda |
| `override` (4.3) | Apagável |


---


## Módulos e Declarações

```ts
import type { T } from "./m";    // some na compilação
export type { T };

declare module "pacote" { }      // tipa pacote sem tipos
declare global { }               // precisa estar num módulo
declare const x: T;              // afirma sem emitir
export {};                       // torna o arquivo um módulo
```


---


## Comentários de Controle

```ts
// @ts-expect-error   suprime E falha se o erro sumir
// @ts-ignore         suprime, e cala quando o erro some
// @ts-nocheck        desliga o arquivo inteiro
// @ts-check          liga a verificação num .js
```

*Prefira sempre `@ts-expect-error`: ele avisa quando deixa de ser necessário.*


---


## `tsconfig.json`: Rigor

| Opção | Efeito |
| :--- | :--- |
| `strict` | Liga o conjunto (padrão a partir do 6.0) |
| `strictNullChecks` | Separa `null` e `undefined` |
| `noImplicitAny` | Erro onde cairia em `any` |
| `strictFunctionTypes` | Contravariância (não vale para métodos) |
| `useUnknownInCatchVariables` | `catch` vira `unknown` |
| `noUncheckedIndexedAccess` | Índice devolve `T \| undefined` — **fora do `strict`** |


---


## `tsconfig.json`: Módulos e Emissão

| Opção | Efeito |
| :--- | :--- |
| `target`, `module`, `moduleResolution` | Saída, formato e resolução |
| `verbatimModuleSyntax` (5.0) | Emite os imports como escritos |
| `erasableSyntaxOnly` (5.8) | Proíbe `enum` e `namespace` |
| `noEmit` | Só verifica — é o modo do CI |
| `paths`, `baseUrl` | Apelidos **só** para a verificação |


---

## Resumo (Parte 1)

- Anote as fronteiras; deixe a inferência resolver o meio.
- `as` e `!` mentem para o compilador; `satisfies` verifica de graça.
- `unknown` no lugar de `any` em tudo que vem de fora.

---

## Resumo (Parte 2)

- `Pick` valida a chave, `Omit` não.
- Modificadores de acesso e `readonly` são apagáveis; `#campo` não é.
- `noUncheckedIndexedAccess` fica fora do `strict` e vale a pena ligar.
