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
title: "JavaScript: Numbers, Math e BigInt"
description: "Padrão IEEE 754, imprecisão de ponto flutuante, objeto Math, validação de NaN e inteiros com BigInt."
---

<!-- _class: lead -->

# JavaScript: Numbers, Math e BigInt

O padrão IEEE 754 de 64 bits, limitações de precisão em números de ponto flutuante, validações numéricas, o objeto `Math` e o tipo `BigInt`.

---

## Objetivos da Aula

- **Padrão IEEE 754**: Compreender por que `0.1 + 0.2 !== 0.3` em JavaScript.
- **Validação**: Diferenciar `isNaN()` global de `Number.isNaN()`.
- **Objeto Math**: Aplicar métodos de arredondamento (`floor`, `ceil`, `round`, `trunc`) e utilitários.
- **BigInt**: Operar com inteiros de precisão arbitrária para valores maiores que $2^{53} - 1$.

---

## O Padrão IEEE 754 (Double Precision)

Em JavaScript, todos os números padrão pertencem ao tipo `number` e são armazenados em **ponto flutuante de 64 bits (IEEE 754)**.

### O Problema da Imprecisão em Ponto Flutuante:
```javascript
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false!
```

- **Causa**: Frações decimais não possuem representação exata em binário.
- **Solução (Comparação Segura com `Number.EPSILON`)**:
```javascript
const result = 0.1 + 0.2;
const isEqual = Math.abs(result - 0.3) < Number.EPSILON;
console.log(isEqual); // true
```

---

## Valores Especiais: `NaN` e `Infinity`

### 1. `NaN` (Not-a-Number)
Representa um resultado matemático inválido ou erro de coerção:
```javascript
console.log("texto" * 2); // NaN
console.log(typeof NaN);  // "number"
console.log(NaN === NaN); // false (NaN é o único valor em JS que não é igual a si mesmo!)
```

### 2. Validação Correta de `NaN`
```javascript
isNaN("texto");        // true (FALSO POSITIVO: faz coerção de "texto" para NaN!)
Number.isNaN("texto"); // false (CORRETO: verifica se o valor É de fato NaN sem converter!)
Number.isNaN(NaN);     // true
```

---

## Métodos de Arredondamento com `Math`

```javascript
const value = 4.7;

console.log(Math.floor(value)); // 4  (Arredonda SEMPRE para baixo)
console.log(Math.ceil(value));  // 5  (Arredonda SEMPRE para cima)
console.log(Math.round(value)); // 5  (Arredonda para o inteiro mais próximo)
console.log(Math.trunc(value)); // 4  (Remove a parte decimal)

// Arredondamento com casas decimais (retorna String!):
const price = 19.987;
console.log(price.toFixed(2));  // "19.99"
console.log(+price.toFixed(2)); // 19.99 (número)
```

---

## O Objeto `Math` e Operações Comuns

```javascript
// 1. Maior e menor valor:
Math.max(10, 50, 2, 90); // 90
Math.min(10, 50, 2, 90); // 2

// 2. Geração de números aleatórios [0, 1):
Math.random(); // Ex: 0.742819...

// 3. Função utilitária para inteiro aleatório entre min e max (inclusive):
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log(getRandomInt(1, 6)); // Simula um dado de 6 lados
```

---

## BigInt: Inteiros de Precisão Arbitrária (ES2020)

O tipo `number` tem um limite seguro de inteiro: `Number.MAX_SAFE_INTEGER` ($2^{53} - 1 = 9.007.199.254.740.991$).

Para valores maiores (ex: IDs de 64 bits do Twitter/Database, criptografia), use **`BigInt`** (sufixo `n`):

```javascript
const maxSafe = 9007199254740991n;
const bigger = maxSafe + 2n;
console.log(bigger); // 9007199254740993n

// CUIDADO: Não misture BigInt com Number diretamente!
// const invalid = 100n + 10; // TypeError: Cannot mix BigInt and other types
const valid = 100n + BigInt(10); // 110n
```

---

## Resumo & Revisão

- Todos os `numbers` em JS são números de ponto flutuante de 64 bits (IEEE 754).
- Use `Number.EPSILON` para comparar números de ponto flutuante.
- Sempre use **`Number.isNaN()`** em vez do global `isNaN()`.
- Use **`BigInt`** para números inteiros gigantes maiores que $2^{53} - 1$.

---

## Referências & Links Úteis

- **MDN**: [Number](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Number)
- **MDN**: [Math](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Math)
- **MDN**: [BigInt](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
