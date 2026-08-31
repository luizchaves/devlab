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
title: "JavaScript: Numbers, BigInt e Math"
description: "Representação numérica, limites de precisão, métodos estáticos do Number, objeto Math e formatação de moedas e localidades com Intl.NumberFormat em JavaScript."
---

<!-- _class: lead -->

# JavaScript: Numbers, BigInt e Math

Representação numérica, limites de precisão, métodos estáticos do Number, objeto Math e formatação de moedas e localidades com Intl.NumberFormat em JavaScript.

---

## Objetivo

- Compreender o tipo de dado Number em JavaScript, reconhecer limites de precisão e números especiais (`NaN`, `Infinity`).

---

## Mapa da Aula

- Criação e Representação Numérica
- Limites de Precisão e Valores Especiais
- Representação Numérica, `NaN` e `Infinity`
- Conversão Numérica e Métodos do Protótipo
- O Objeto Estático Math
- Formatação de Números e Moedas (`Intl.NumberFormat`)

---

## Criação e Representação Numérica

- Em JavaScript, o tipo primitivo `number` representa tanto números inteiros quanto números de ponto flutuante (decimais).
- As numerações podem ser declaradas usando notação decimal comum, notação exponencial ou notações de bases alternativas (binária.
- Assim como no caso das strings, evite utilizar `new Number(42)`.
- O operador `new` instancia um objeto wrapper na memória em vez de um primitivo.
- O exemplo a seguir ilustra o impacto do uso de primitivos em comparação com objetos instanciados via `new Number()`

---

## Criação e Representação Numérica (Comparação)

| Notação | Prefixo / Sintaxe | Exemplo | Valor em Base 10 |
| :--- | :--- | :--- | :--- |
| **Decimal** | Nenhuma | `42` / `3.14159` | `42` / `3.14159` |
| **Exponencial (Científica)** | `e` / `E` | `1.5e3` (1.5 × 10³) | `1500` |
| **Hexadecimal** | `0x` / `0X` | `0xFF` / `0x2A` | `255` / `42` |
| **Octal** | `0o` / `0O` | `0o52` | `42` |
| **Binária** | `0b` / `0B` | `0b101010` | `42` |

---

## Criação e Representação Numérica (Exemplo)

```js
// 1. Decimais e Ponto Flutuante
const age = 28;
const price = 49.90;

// 2. Notação Exponencial
const bigVal = 2.5e6; // 2.500.000
const smallVal = 1e-3; // 0.001

// 3. Bases Alternativas (Binária, Octal e Hexadecimal)
const binary = 0b101010; // 42
const octal = 0o52;       // 42
const hex = 0x2A;         // 42
// ...
```

---

## Panorama de literais, limites e precisão

- O tipo `number` representa inteiros, decimais e valores especiais como `NaN`, `Infinity` e `-Infinity`.
- Além dos valores escritos diretamente no código, o objeto global `Number` expõe constantes úteis para entender limites e precisão.
- O limite seguro é importante quando o programa trabalha com identificadores, contadores ou valores inteiros muito grandes.
- Depois do limite seguro, operações com inteiros podem perder precisão.
- Quando isso for relevante, avalie `bigint` ou outra representação adequada ao domínio.

---

## Panorama de literais, limites e precisão (Comparação)

| Constante | Ideia principal |
| --------- | --------------- |
| [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER) | Maior inteiro que pode ser representado com segurança |
| [`Number.MIN_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER) | Menor inteiro que pode ser representado com segurança |
| [`Number.MAX_VALUE`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_VALUE) | Maior valor numérico positivo representável |
| [`Number.MIN_VALUE`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_VALUE) | Menor valor positivo representável acima de zero |
| [`Number.EPSILON`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON) | Diferença mínima útil para comparar números próximos de `1` |

---

## Panorama de literais, limites e precisão (Exemplo)

```js
console.log(-15); // -15
console.log(15); // 15
console.log(0b1111); // 15
console.log(0o17); // 15
console.log(0xf); // 15
console.log(15_000); // 15000
console.log(3.14); // 3.14
console.log(314e-2); // 3.14
console.log(Math.PI); // 3.141592653589793
```

---

## Limites de Inteiros Seguros e Imprecisão Flutuante

- Devido ao formato IEEE 754 de 64 bits, apenas inteiros no intervalo entre `-(2⁵³ - 1)` e `2⁵³.
- Esses limites são representados pelas constantes estáticas `Number.MIN_SAFE_INTEGER` e `Number.MAX_SAFE_INTEGER`.

---

## Limites de Inteiros Seguros e Imprecisão Flutuante (Exemplo)

```js
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991 (2^53 - 1)
console.log(Number.MIN_SAFE_INTEGER); // -9007199254740991

// Operações com números maiores que MAX_SAFE_INTEGER perdem precisão:
console.log(9007199254740991 + 1); // 9007199254740992
console.log(9007199254740991 + 2); // 9007199254740992 (erro de arredondamento!)

// Imprecisão clássica de ponto flutuante:
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false

// Comparação correta usando Number.EPSILON:
const diff = Math.abs((0.1 + 0.2) - 0.3);
console.log(diff < Number.EPSILON); // true (praticamente iguais!)
```

---

## Representação Numérica, `NaN` e `Infinity`

- Literais e Bases Numéricas: Suporta notação decimal, exponencial (`314e-2`), binária (`0b1111`), octal (`0o17`).
- `Infinity` e `-Infinity`: Representam números além do limite de precisão do ponto flutuante (ex: `1 / 0 // Infinity`).
- `NaN` (Not-a-Number): Apesar do nome ("Não é um Número"), o operador `typeof NaN` retorna `"number"`.
- No tipo `number`, o ECMAScript define representações literais versáteis e valores numéricos especiais conforme o padrão IEEE 754
- A tabela e os exemplos a seguir detalham as operações que resultam em `NaN`

---

## Representação Numérica, `NaN` e `Infinity` (Comparação)

| Cenário | Operação | Resultado |
| :--- | :--- | :--- |
| **Divisão Indefinida / Operações Indeterminadas com `Infinity`** | `0 / 0`, `Infinity - Infinity`, `0 * Infinity`, `Infinity / Infinity` | `NaN` |
| **Matemática Não-Real (Raízes de Negativos)** | `Math.sqrt(-1)`, `Math.log(-1)`, `Math.asin(2)` | `NaN` |
| **Conversões Numéricas Inválidas** | `Number("abc")`, `parseInt("texto")` | `NaN` |
| **Aritmética com `undefined`** | `undefined + 1`, `undefined * 5` | `NaN` |

---

## Representação Numérica, `NaN` e `Infinity` (Exemplo)

```js
// 1. Divisão por zero e infinitos
console.log(10 / 0);              // Infinity
console.log(-10 / 0);             // -Infinity

// 2. Divisão indefinida de zero por zero e operações indeterminadas com Infinity
console.log(0 / 0);               // NaN (O clássico 0 / 0!)
console.log(Infinity - Infinity); // NaN
console.log(0 * Infinity);        // NaN
console.log(Infinity / Infinity); // NaN

// 3. Operações matemáticas sem resultado real (raízes e logaritmos negativos)
console.log(Math.sqrt(-1));       // NaN
// ...
```

---

## Métodos Estáticos de Verificação do Number

| Método | Descrição | Exemplo |
| :--- | :--- | :--- |
| **`Number.isNaN(val)`** | Testa estritamente se o valor é `NaN` (sem coerção de tipo). | `Number.isNaN("abc")` // `false` |
| **`Number.isFinite(val)`** | Testa se o valor é um número finito válido (não `NaN` nem `Infinity`). | `Number.isFinite(100)` // `true` |
| **`Number.isInteger(val)`** | Testa se o valor é um número inteiro sem casas decimais. | `Number.isInteger(4.2)` // `false` |
| **`Number.isSafeInteger(val)`**| Testa se é um inteiro dentro do limite de precisão segura. | `Number.isSafeInteger(10)` // `true` |

---

## Conversão Explícita: `Number()`, `parseInt()` e `parseFloat()`

- O JavaScript oferece três funções principais para converter textos ou outros tipos em números.
- A tabela a seguir resume suas principais diferenças
- Abaixo estão exemplos práticos de uso e conversão com diferentes formatos e bases numéricas

---

## Conversão Explícita: `Number()`, `parseInt()` e `parseFloat()` (Comparação)

| Função | Comportamento | Exemplo `"42.5px"` | Exemplo `"abc"` |
| :--- | :--- | :--- | :--- |
| **`Number(val)`** | Converte a string inteira. Se houver caracteres inválidos, retorna `NaN`. | `NaN` | `NaN` |
| **`parseInt(str, radix?)`** | Converte o início da string até encontrar um caractere não numérico, ignorando o resto. Retorna inteiro. | `42` | `NaN` |
| **`parseFloat(str)`** | Converte o início da string permitindo ponto decimal. | `42.5` | `NaN` |

---

## Conversão Explícita: `Number()`, `parseInt()` e `parseFloat()` (Exemplo)

```js
// 1. Função Number() (conversão estrita da string inteira)
console.log(Number("42"));     // 42
console.log(Number("42.5"));   // 42.5
console.log(Number("42.5px")); // NaN (falha por causa do "px")
console.log(Number(true));     // 1
console.log(Number(null));     // 0

// 2. parseInt() e parseFloat() (extraem o número do início da string)
console.log(parseInt("42.5px"));   // 42 (descarta a fração e "px")
console.log(parseFloat("42.5px")); // 42.5 (preserva decimal, descarta "px")

// Sempre informe a base (radix) no parseInt() para evitar ambiguidades!
console.log(parseInt("1010", 2));  // 10 (interpreta "1010" em binário)
console.log(parseInt("FF", 16));   // 255 (interpreta "FF" em hexadecimal)
```

---

## Métodos de Instância e Formatação do Protótipo Number

- Os métodos do protótipo `Number.prototype` permitem formatar números em strings com casas decimais fixas.
- O exemplo abaixo demonstra a utilização prática de cada um desses métodos de formatação

---

## Métodos de Instância e Formatação do Protótipo Number (Comparação)

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| **`toFixed()`** | `num.toFixed(digits?)` | `string` | Formata o número com um número fixo de casas decimais (arredonda se necessário). |
| **`toPrecision()`** | `num.toPrecision(precision?)` | `string` | Formata o número com a quantidade especificada de dígitos significativos totais. |
| **`toExponential()`** | `num.toExponential(digits?)` | `string` | Retorna o número formatado em notação científica exponencial. |
| **`toString()`** | `num.toString(radix?)` | `string` | Converte o número em string na base numérica fornecida (`2` a `36`). |

---

## Métodos de Instância e Formatação do Protótipo Number (Exemplo)

```js
const val = 1234.5678;

// 1. toFixed() - Define casas decimais
console.log(val.toFixed(2)); // "1234.57" (arredonda para cima)
console.log(val.toFixed(0)); // "1235"

// 2. toPrecision() - Define total de dígitos significativos
console.log(val.toPrecision(4)); // "1235"
console.log((0.001234).toPrecision(2)); // "0.0012"

// 3. toExponential() - Notação científica
console.log((12345).toExponential(2)); // "1.23e+4"
// ...
```

---

## O Objeto Estático Math

- O objeto `Math` é um objeto estático nativo do JavaScript que fornece constantes matemáticas e funções utilitárias para trigonometria.
- Como é um objeto estático, ele não possui construtor e não pode ser instanciado com `new Math()`.

---

## Constantes Matemáticas

- O objeto `Math` disponibiliza constantes matemáticas fundamentais prontas para uso

---

## Constantes Matemáticas (Exemplo)

```js
console.log(Math.PI);     // 3.141592653589793 (Pi)
console.log(Math.E);      // 2.718281828459045 (Número de Euler)
console.log(Math.SQRT2);  // 1.4142135623730951 (Raiz quadrada de 2)
```

---

## Funções de Arredondamento

- O `Math` oferece quatro formas distintas de arredondar valores numéricos, cujas diferenças são destacadas na tabela a seguir
- O exemplo a seguir ilustra a aplicação prática destas quatro funções de arredondamento

---

## Funções de Arredondamento (Comparação)

| Função | Comportamento | `3.7` | `3.2` | `-3.7` |
| :--- | :--- | :--- | :--- | :--- |
| **`Math.floor(x)`** | Arredonda sempre **para baixo** (menor inteiro). | `3` | `3` | `-4` |
| **`Math.ceil(x)`** | Arredonda sempre **para cima** (maior inteiro). | `4` | `4` | `-3` |
| **`Math.round(x)`** | Arredonda para o **inteiro mais próximo**. | `4` | `3` | `-4` |
| **`Math.trunc(x)`** | Trunca o número, descartando a parte decimal. | `3` | `3` | `-3` |

---

## Funções de Arredondamento (Exemplo)

```js
console.log(Math.floor(4.9)); // 4
console.log(Math.ceil(4.1));  // 5
console.log(Math.round(4.5)); // 5
console.log(Math.trunc(4.9)); // 4
```

---

## Funções Matemáticas Utilitárias

- Para realizar operações matemáticas comuns como potências, raízes, valores absolutos e identificação de extremos.

---

## Funções Matemáticas Utilitárias (Exemplo)

```js
// Potência e Raiz
console.log(Math.pow(2, 3));  // 8 (equivalente a 2 ** 3)
console.log(Math.sqrt(16));   // 4 (raiz quadrada)
console.log(Math.cbrt(27));   // 3 (raiz cúbica)
console.log(Math.hypot(3, 4));// 5 (hipotenusa: sqrt(3² + 4²))

// Absoluto e Sinal
console.log(Math.abs(-15));   // 15 (valor positivo)
console.log(Math.sign(-42));  // -1 (retorna -1, 0 ou 1 dependendo do sinal)

// Mínimo e Máximo
console.log(Math.min(10, 5, 20, 3)); // 3
// ...
```

---

## Geração de Números Aleatórios (`Math.random()`)

- `Math.random()` retorna um número pseudo-aleatório no intervalo `[0, 1)` (inclui 0, mas exclui 1).
- A seguir está o padrão recomendado para gerar inteiros aleatórios dentro de um limite pré-definido

---

## Geração de Números Aleatórios (`Math.random()`) (Exemplo)

```js
// Função utilitária para gerar inteiro aleatório entre min (inclusivo) e max (inclusivo)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log(getRandomInt(1, 10)); // Retorna um inteiro entre 1 e 10
console.log(getRandomInt(1, 6));  // Simulação de um dado de 6 lados
```

---

## Formatação de Números e Moedas (`Intl.NumberFormat`)

- Para formatar moedas, porcentagens e valores numéricos respeitando as convenções internacionais.

---

## Sintaxe Básica (Exemplo)

```js
const formatter = new Intl.NumberFormat(locales?, options?);
formatter.format(number);
```

---

## 1. Formatação de Moedas (*Currency*)

- Para formatar valores Monetários (como Real Brasileiro `BRL`, Dólar Americano `USD` ou Euro `EUR`).

---

## 1. Formatação de Moedas (*Currency*) (Exemplo)

```js
const price = 1250.5;

// Real Brasileiro (pt-BR)
const formatterBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
console.log(formatterBRL.format(price)); // "R$ 1.250,50"

// Dólar Americano (en-US)
const formatterUSD = new Intl.NumberFormat("en-US", {
  style: "currency",
// ...
```

---

## 2. Formatação de Porcentagem (*Percent*)

- Para exibir taxas, descontos e porcentagens, utilizamos `style: 'percent'`, que multiplica o valor por 100 e adiciona o símbolo `%`

---

## 2. Formatação de Porcentagem (*Percent*) (Exemplo)

```js
const discount = 0.155; // 15.5%

const percentFormatter = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 1,
});

console.log(percentFormatter.format(discount)); // "15,5%"
```

---

## 3. Formatação Numérica com Casas Decimais e Notação Compacta

- O `Intl.NumberFormat` trata automaticamente separadores de milhar (ponto no Brasil, vírgula nos EUA), símbolos de moedas.

---

## 3. Formatação Numérica com Casas Decimais e Notação Compacta (Exemplo)

```js
const population = 214300000;

// Formatação Decimal Padrão com Separador de Milhar
const numberFormatter = new Intl.NumberFormat("pt-BR");
console.log(numberFormatter.format(population)); // "214.300.000"

// Notação Compacta (ex: 214 mi)
const compactFormatter = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  compactDisplay: "short",
});
console.log(compactFormatter.format(population)); // "214 mi"
```

---

## Precisão e Verificação Numérica

- Por que `0.1 + 0.2 === 0.3` resulta em `false` em JavaScript?
- Porque o JavaScript utiliza o padrão IEEE 754 de ponto flutuante de 64 bits em base binária.
- Certas frações decimais (como `0.1` e `0.2`) não possuem representação binária exata finita.
- Qual é a diferença entre `Number.isNaN(val)` e a função global `isNaN(val)`?
- A função global `isNaN(val)` realiza a coerção de tipo do valor para número antes de testar (fazendo `isNaN("abc")` retornar `true`).

---

## Objeto Math e Formatação Intl

- Qual é a diferença entre `Math.floor()`, `Math.ceil()` e `Math.trunc()` para números negativos?
- Para o número `-3.7`: `Math.floor(-3.7)` arredonda para baixo (menor inteiro), resultando em `-4`.
- `Math.ceil(-3.7)` arredonda para cima (maior inteiro), resultando em `-3`.
- `Math.trunc(-3.7)` simplesmente remove a parte decimal, resultando em `-3`.
- Quais opções são obrigatórias em `Intl.NumberFormat` para formatar um valor como moeda em Reais (`R$`)?

---

## Executando

- Crie um arquivo chamado `number-demo.js`
- Execute o arquivo com Node.js
- Os conceitos de `Number`, `Math` e `Intl.NumberFormat` podem ser testados diretamente no terminal com Node.

---

## Resumo da Aula

- **IEEE 754 Double Precision**: Todos os números padrão são de 64 bits; frações decimais causam imprecisões como `0.1 + 0.2 !== 0.3`.
- **Comparação Segura**: Usar `Math.abs(a - b) < Number.EPSILON` para comparar números com casas decimais.
- **Validação de NaN**: `NaN !== NaN`; usar sempre `Number.isNaN()` em vez da função global `isNaN()`.
- **Objeto Math**: Arredondamentos com `Math.floor()`, `ceil()`, `round()`, `trunc()` e números aleatórios com `Math.random()`.
- **BigInt**: Inteiros com sufixo `n` para valores além de `Number.MAX_SAFE_INTEGER` ($2^{53} - 1$), sem misturar diretamente com Number.
