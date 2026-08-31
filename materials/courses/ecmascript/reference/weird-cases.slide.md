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
title: "JavaScript: Casos Bizarros e Quirks"
description: "Comportamentos estranhos do JavaScript: NaN, typeof null, 0.1+0.2, coerções bizarras e como evitá-los."
---

<!-- _class: lead -->

# JavaScript: Casos Bizarros e Quirks

Análise detalhada de comportamentos contraintuitivos: `NaN !== NaN`, `typeof null === "object"`, `0.1 + 0.2 !== 0.3`, coerções bizarras e regras de prevenção.

---

## Objetivos da Aula

- **Desmistificação**: Entender por que casos aparentando "mágica" têm explicação técnica.
- **Ponto Flutuante**: Compreender limites de precisão binária IEEE 754.
- **Coerção Implícita**: Analisar adições com objetos, arrays e strings.
- **Prevenção**: Aplicar linters e práticas para imunizar o código contra esses quirks.

---

## 1. `NaN !== NaN` e `typeof NaN === "number"`

```javascript
console.log(NaN === NaN);        // false!
console.log(typeof NaN);         // "number"
console.log(Number.isNaN(NaN));  // true (Maneira correta!)
```

- **Por quê?**: Na norma IEEE 754, qualquer comparação entre duas operações indefinidas (como $\sqrt{-1}$ e $0 / 0$) deve resultar em falso.
- **Solução**: Sempre use `Number.isNaN(val)` em vez do `==` ou `===`.

---

## 2. `typeof null === "object"`

```javascript
console.log(typeof null); // "object" (Bug mantido desde 1995!)
```

- **Por quê?**: Na primeira versão do JS (1995), valores eram representados com uma tag de tipo de 3 bits. Para objetos, a tag era `000`. Como `null` era um ponteiro nulo (endereço `0x00`), o motor o interpretou como objeto.
- **Solução**: Para testar `null`, use igualdade estrita `val === null`.

---

## 3. Coerções Bizarras com Arrays e Objetos

```javascript
console.log([] + []);      // ""     (Arrays viram strings vazias "")
console.log([] + {});      // "[object Object]"
console.log({} + []);      // 0 ou "[object Object]" (depende do contexto de bloco!)
console.log("5" - - "3");  // 8      (- - "3" vira +3 de number!)
console.log(true + true);  // 2      (booleans viram 1)
```

- **Regra de Ouro**: Nunca utilize operadores aritméticos (`+`, `-`) entre objetos ou arrays.

---

## 4. Array com Espaços Vazios (Sparse Arrays)

```javascript
const arr = new Array(3); // [<3 empty items>]
console.log(arr.length);  // 3

console.log(arr.map(x => 1)); // [<3 empty items>] (map ignora posições vazias!)
console.log(0 in arr);        // false! (a chave 0 não existe!)

// Correção (criar array preenchido):
const filled = Array.from({ length: 3 }, () => 0); // [0, 0, 0]
```

---

## Como Evitar Quirks no Código Real

1. **Use sempre igualdade estrita (`===`)**.
2. **Ative o Strict Mode (`"use strict";`) ou use TypeScript**.
3. **Use linters como ESLint** para proibir coerções implícitas perigosas.
4. **Use `Number.isNaN()`** em vez do `isNaN()` global.

---

## Resumo & Revisão

- Comportamentos bizarros do JS têm raízes em **compatibilidade histórica** ou na especificação **IEEE 754**.
- `NaN` não é igual a nada, nem a si próprio.
- `typeof null === "object"` é um bug de 1995 que nunca será corrigido para não quebrar a Web.

---

## Referências & Links Úteis

- **MDN**: [JavaScript Quirks and Gotchas](https://developer.mozilla.org/)
- **JS Wat**: [Palestra Clássica de Gary Bernhardt](https://www.destroyallsoftware.com/talks/wat)
