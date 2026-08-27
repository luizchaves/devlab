---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "TypeScript: Migrando de JavaScript"
description: "Slides da aula de migração: allowJs, checkJs, JSDoc, ordem de renomeação, strict progressivo e travas contra regressão."
---

<!-- _class: lead -->

# TypeScript: Migrando de JavaScript

Estratégia incremental: preparar, verificar, renomear, endurecer e manter.

---

## Objetivo

Migrar sem parar o projeto:

- Planejar a migração em **fases**.
- Configurar `allowJs` e `checkJs`.
- Tipar JavaScript com **JSDoc** antes de renomear.
- Ligar **`strict`** por etapas.
- Impedir a **regressão** com travas na CI.

---

## Cinco Fases

```txt
1. Preparar   tsc + tsconfig permissivo
2. Verificar  checkJs + JSDoc
3. Renomear   .js -> .ts, das folhas ao topo
4. Endurecer  strict por etapas
5. Manter     CI, lint, sem novos .js
```

*Cada fase entrega valor sozinha: dá para parar em qualquer uma.*

---

## Fase 1: Preparar

```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": false,
    "strict": false,
    "noEmit": true
  },
  "include": ["src/**/*"]
}
```

- Permissivo **de propósito**: nada de mil erros no dia 1.
- Não troque o empacotador na mesma semana.

---

## Fase 2: Verificar o JS

| Marcador | Efeito |
| --- | --- |
| `// @ts-check` | Liga a verificação em um `.js` |
| `// @ts-nocheck` | Desliga no arquivo |
| `// @ts-expect-error` | Silencia e **exige** que haja erro |
| `// @ts-ignore` | Silencia para sempre — evitar |

*`@ts-expect-error` avisa quando o erro some; `@ts-ignore` não.*

---

## Tipando com JSDoc

```js
/**
 * @typedef {object} Course
 * @property {string} id
 * @property {number} hours
 */

/**
 * @param {Course[]} courses
 * @returns {number}
 */
export function totalHours(courses) {
  return courses.reduce((total, course) => total + course.hours, 0);
}
```

---

## Equivalências

| TypeScript | JSDoc |
| --- | --- |
| `interface X` | `@typedef {object} X` + `@property` |
| `const x: T` | `/** @type {T} */` |
| `function f(a: T): U` | `@param {T} a` + `@returns {U}` |
| `function f<T>()` | `@template T` |
| `value as T` | `/** @type {T} */ (value)` |

---

## Fase 3: Renomear

| Ordem | Comece por | Motivo |
| --- | --- | --- |
| 1º | Utilitários e funções puras | Sem dependências |
| 2º | Modelos de domínio | Definem o vocabulário |
| 3º | Serviços | Já consomem tipos prontos |
| 4º | Controllers e componentes | Muitas dependências |
| 5º | Ponto de entrada | Amarra tudo |

*Um arquivo por commit: revisão legível e reversão isolada.*

---

## Fase 4: Endurecer

| Etapa | Esforço | Ganho |
| --- | --- | --- |
| `noImplicitAny` | Médio | Fecha buracos na verificação |
| `strictFunctionTypes` | Baixo | Callbacks corretos |
| `strictNullChecks` | **Alto** | Evita a maioria dos erros de runtime |
| `strictPropertyInitialization` | Médio | Classes sem campo indefinido |

*`strictNullChecks` é a etapa que trava migrações — ligue por diretório.*

---

## Fase 5: Manter

| Trava | Como |
| --- | --- |
| Verificação obrigatória | `tsc --noEmit` bloqueando o merge |
| Sem novos `.js` | Regra de lint ou contagem na CI |
| `any` sob controle | `no-explicit-any` como aviso |
| Progresso visível | Script de relatório |

---

## Exercício

Migre um módulo seguindo as fases:

1. `src/inventory.js` com três funções sem tipos;
2. Adicione `// @ts-check` e tipe com JSDoc;
3. Rode `tsc --noEmit` e corrija;
4. Renomeie para `.ts` e converta o JSDoc;
5. Ligue `noImplicitAny` e depois `strictNullChecks`.

---

## Solução do Exercício

```js
// Fase 2
// @ts-check
/** @typedef {object} Item @property {string} sku @property {number} quantity */
/** @param {Item} item @returns {Item[]} */
export function add(item) { … }
```

```ts
// Fase 3
export interface Item { sku: string; quantity: number }
export function add(item: Item): Item[] { … }
```

---

## Resumo da Aula

- A migração é incremental porque `.js` e `.ts` convivem via `allowJs`.
- Comece permissivo: rigor no dia 1 costuma matar a migração.
- `// @ts-check` + JSDoc encontram erros reais **sem** renomear nada.
- Renomeie das folhas para a raiz, um arquivo por commit.
- `strictNullChecks` é a etapa cara — ligue por diretório.
- Sem trava na CI, a base volta a acumular `.js` e `any`.
