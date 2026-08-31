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
title: "'JavaScript: Casos \"Bizarros\"'"
description: "Casos estranhos e famosos do JavaScript: NaN, typeof null, precisão decimal, coerção, igualdade, arrays esparsos, parseInt, truthy/falsy e objetos."
---

<!-- _class: lead -->

# 'JavaScript: Casos "Bizarros"'

Casos estranhos e famosos do JavaScript: NaN, typeof null, precisão decimal, coerção, igualdade, arrays esparsos, parseInt, truthy/falsy e objetos.

---

## Objetivo

- Entender os principais casos estranhos do JavaScript, identificar a regra que explica cada um.

---

## Mapa da Aula

- Três Fontes de Estranheza
- `NaN !== NaN`
- `typeof null === "object"`
- `0.1 + 0.2 !== 0.3`
- Igualdade: `==` vs `===`
- Soma, Concatenação e Conversão

---

## Três Fontes de Estranheza

- Muitos exemplos virais de JavaScript misturam sintomas diferentes.
- Antes de decorar casos, é melhor classificar a origem do comportamento.
- O mapa abaixo organiza as causas mais frequentes
- B --> B1["0.1 + 0.2"] B --> B2["NaN"] C --> C1["typeof null"] D --> D1["=="] D --> D2["+ como soma ou concatenação"] E --> E1["[] !
- Ao encontrar um resultado estranho, pergunte: é número decimal, herança histórica, coerção automática ou comparação de referências?

---

## Três Fontes de Estranheza (Comparação)

| Caso | Resultado | Causa principal | Forma segura |
| :--- | :--- | :--- | :--- |
| `NaN === NaN` | `false` | Regra IEEE 754 para "não é um número" | `Number.isNaN(value)` |
| `typeof null` | `"object"` | Compatibilidade histórica | `value === null` |
| `0.1 + 0.2 === 0.3` | `false` | Ponto flutuante binário | Comparar com tolerância |
| `[] === []` | `false` | Objetos são comparados por referência | Comparar conteúdo |
| `"5" + 2` | `"52"` | `+` também concatena strings | Converter antes |

---

## `NaN !== NaN`

- `NaN` significa Not-a-Number, mas o próprio nome engana: o tipo de `NaN` é `number`.
- Ele representa um resultado numérico inválido, como converter texto não numérico ou calcular uma operação sem resultado representável.
- O detalhe importante é que `NaN` não é igual a nenhum valor, nem a ele mesmo
- Use `Number.isNaN(value)` para verificar `NaN` sem coerção.
- A função global `isNaN()` converte o valor antes do teste e pode aceitar entradas que você não queria aceitar.

---

## `NaN !== NaN` (Exemplo)

```js
const value = Number("abc");

console.log(value); // NaN
console.log(typeof value); // "number"
console.log(value === NaN); // false
console.log(value !== value); // true
console.log(Number.isNaN(value)); // true
```

---

## `typeof null === "object"`

- `null` representa ausência intencional de valor, mas `typeof null` retorna `"object"`.
- Esse é um comportamento antigo da linguagem, preservado porque mudar isso quebraria código real publicado na web.
- O teste correto para `null` é comparação direta
- Para diferenciar objetos reais de `null`, combine os testes
- `typeof []` também é `"object"`.

---

## `typeof null === "object"` (Exemplo)

```js
const selectedUser = null;

console.log(typeof selectedUser); // "object"
console.log(selectedUser === null); // true
console.log(selectedUser == undefined); // true, mas depende de coerção
console.log(selectedUser === undefined); // false
```

---

## `0.1 + 0.2 !== 0.3`

- JavaScript usa o tipo `number` baseado em ponto flutuante binário de 64 bits.
- Alguns decimais simples para humanos não têm representação exata em binário, então pequenas diferenças de arredondamento aparecem.
- O exemplo clássico mostra a diferença
- Em dinheiro, uma alternativa comum é trabalhar em centavos
- `toFixed(2)` é útil para exibir valores, mas devolve string e não transforma ponto flutuante em decimal exato.

---

## `0.1 + 0.2 !== 0.3` (Exemplo)

```js
const result = 0.1 + 0.2;

console.log(result); // 0.30000000000000004
console.log(result === 0.3); // false
console.log(Math.abs(result - 0.3) < Number.EPSILON); // true
```

---

## Igualdade: `==` vs `===`

- O operador `==` compara depois de aplicar coerções.
- O operador `===` compara sem converter tipos.
- Em código de aplicação, `===` é a escolha padrão porque a leitura fica previsível.
- Os exemplos abaixo mostram por que `==` surpreende
- O fluxo mental para comparar valores em JavaScript deve favorecer a igualdade estrita

---

## Igualdade: `==` vs `===` (Exemplo)

```js
console.log(0 == false); // true
console.log("" == false); // true
console.log("5" == 5); // true
console.log(null == undefined); // true

console.log(0 === false); // false
console.log("" === false); // false
console.log("5" === 5); // false
console.log(null === undefined); // false
```

---

## Soma, Concatenação e Conversão

- O operador `+` é ambíguo: ele soma números, mas concatena se algum lado virar string.
- Outros operadores aritméticos, como `-`, `*` e `/`, forçam conversão numérica.
- O contraste fica claro nestes exemplos
- Quando o valor vem de formulário, faça a conversão de forma explícita
- Mesmo um `` entrega texto em `input.value`.

---

## Soma, Concatenação e Conversão (Exemplo)

```js
console.log(5 + 2); // 7
console.log("5" + 2); // "52"
console.log(5 + "2"); // "52"
console.log("5" - 2); // 3
console.log("5" * "2"); // 10
```

---

## Objetos, Arrays e Referências

- Primitivos são comparados por valor.
- O exemplo abaixo parece estranho só até lembrar que cada literal cria uma nova referência
- Para comparar conteúdo, escolha uma regra explícita
- Serializar pode funcionar em exemplos pequenos, mas falha com ordem de propriedades, funções, `undefined`, símbolos, datas, `Map`.

---

## Objetos, Arrays e Referências (Exemplo)

```js
console.log([] === []); // false
console.log({} === {}); // false

const first = [];
const second = first;

console.log(first === second); // true
```

---

## Arrays Esparsos

- Um array pode ter "buracos": posições sem valor definido.
- Isso é diferente de uma posição que existe contendo `undefined`.
- O comportamento aparece quando alguns métodos pulam posições vazias
- Prefira criar arrays preenchidos quando quiser percorrer todas as posições
- Em um array esparso, a posição nem existe.

---

## Arrays Esparsos (Exemplo)

```js
const sparse = [1, , 3];
const explicit = [1, undefined, 3];

console.log(sparse.length); // 3
console.log(1 in sparse); // false
console.log(1 in explicit); // true

sparse.forEach((value) => console.log(value));
// 1
// 3
```

---

## Números e valores especiais

- Por que `NaN === NaN` retorna `false`?
- Porque `NaN` representa um resultado numérico inválido e, pela semântica de ponto flutuante, não é igual a nenhum valor.
- Qual é a forma recomendada de testar `NaN`?
- Use `Number.isNaN(value)`, que testa `NaN` sem converter valores antes da comparação.
- Por que `0.1 + 0.2` não resulta exatamente em `0.3`?

---

## Tipos, coerção e referência

- Por que `typeof null` retorna `"object"`?
- Por um comportamento histórico preservado por compatibilidade.
- Para testar `null`, use `value === null`.
- Por que `"5" + 2` resulta em `"52"`?
- Porque, quando há string na operação, `+` pode agir como concatenação.

---

## Executando

- Crie um arquivo `weird-cases.js`
- Execute com Node.js
- Repita no console do navegador com F12. Os resultados são os mesmos porque
- Teste os casos em um arquivo isolado para observar a saída sem misturar com o restante do projeto.
- esses comportamentos pertencem à linguagem ECMAScript, não apenas ao Node.js.

---

## Exercício

- `Number.isNaN(Number("abc"))`
- `Array.isArray([])`
- `Boolean("false")`
- `[1, , 3].map((n) => n * 2)`
- `Object.is(NaN, NaN)`

---

## Desafio

- Escreva uma função `safeSum(a, b)` que aceite números ou strings numéricas.

---

## Resumo da Aula

- **NaN**: `NaN !== NaN` decorre da norma IEEE 754; use sempre `Number.isNaN(val)` para checagem confiável.
- **typeof null**: O retorno `"object"` é um bug de 1995 da representação de tags de tipo em C mantido por compatibilidade web.
- **Ponto Flutuante**: `0.1 + 0.2 !== 0.3` ocorre pela representação binária de frações; compare usando `Number.EPSILON`.
- **Coerção Implícita**: Evite operações aritméticas com tipos heterogêneos (`[] + {}`, `true + true`, `"5" - - "3"`).
- **Imunização do Código**: Adote TypeScript, linters (ESLint), Strict Mode e igualdade estrita (`===`) para neutralizar esses comportamentos.
