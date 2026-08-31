---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Numbers, BigInt e Math"
description: "Slides completos da aula JavaScript: Numbers, BigInt e Math."
---

<!-- _class: lead -->

# JavaScript: Numbers, BigInt e Math

Representação numérica, limites de precisão, métodos estáticos do Number, objeto Math e formatação de moedas e localidades com Intl.NumberFormat em JavaScript.

---

## Objetivo

- Compreender o tipo de dado Number em JavaScript, reconhecer limites de precisão e números especiais (`NaN`, `Infinity`),...

---

## Mapa da Aula

- Criação e Representação Numérica
- Representação Numérica, `NaN` e `Infinity`
- O Objeto Estático Math
- Formatação de Números e Moedas (`Intl.NumberFormat`)
- Executando
- Próxima aula

---

## Introdução

- Esta aula apresenta os recursos para manipulação numérica em JavaScript
- como criar e converter números, entender a precisão IEEE 754, utilizar o objeto Number, aplicar constantes e funções do...

---

## Criação e Representação Numérica

- Em JavaScript, o tipo primitivo `number` representa tanto números inteiros quanto números de ponto flutuante (decimais)
- Internamente, o JavaScript utiliza o padrão internacional IEEE 754 de 64 bits (dupla precisão) para armazenar todos os...
- As numerações podem ser declaradas usando notação decimal comum, notação exponencial ou notações de bases alternativas...
- Assim como no caso das strings, evite utilizar `new Number(42)`
- O operador `new` instancia um objeto *wrapper* na memória em vez de um primitivo, fazendo com que `typeof new Number(42)`...

---

## Criação e Representação Numérica: Comparação

| Notação | Prefixo / Sintaxe | Exemplo | Valor em Base 10 |
| :--- | :--- | :--- | :--- |
| **Decimal** | Nenhuma | `42` / `3.14159` | `42` / `3.14159` |
| **Exponencial (Científica)** | `e` / `E` | `1.5e3` (1.5 × 10³) | `1500` |
| **Hexadecimal** | `0x` / `0X` | `0xFF` / `0x2A` | `255` / `42` |
| **Octal** | `0o` / `0O` | `0o52` | `42` |
| **Binária** | `0b` / `0B` | `0b101010` | `42` |
| **Separador Numérico** | `_` (ES2021) | `1_000_000` | `1000000` |

---

## Formas de declaração de Numbers

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

// 4. Separadores Numéricos (ES2021) para melhor legibilidade
const billion = 1_000_000_000; // 1000000000

console.log(binary === hex); // true (ambos valem 42)
console.log(billion);        // 1000000000
```

---

## Primitivo vs Objeto Number

```js
const numPrim = 42;
const numObj = new Number(42);

console.log(typeof numPrim); // "number"
console.log(typeof numObj);  // "object"
console.log(numPrim === numObj); // false
```

---

## Panorama de literais, limites e precisão

- O tipo `number` representa inteiros, decimais e valores especiais como `NaN`, `Infinity` e `-Infinity`
- Além dos valores escritos diretamente no código, o objeto global `Number` expõe constantes úteis para entender limites e...
- O limite seguro é importante quando o programa trabalha com identificadores, contadores ou valores inteiros muito grandes
- Depois do limite seguro, operações com inteiros podem perder precisão
- Quando isso for relevante, avalie `bigint` ou outra representação adequada ao domínio

---

## Panorama de literais, limites e precisão: Comparação

| Constante | Ideia principal |
| --------- | --------------- |
| [`Number.MAX_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER) | Maior inteiro que pode ser representado com segurança |
| [`Number.MIN_SAFE_INTEGER`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER) | Menor inteiro que pode ser representado com segurança |
| [`Number.MAX_VALUE`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_VALUE) | Maior valor numérico positivo representável |
| [`Number.MIN_VALUE`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_VALUE) | Menor valor positivo representável acima de zero |
| [`Number.EPSILON`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON) | Diferença mínima útil para comparar números próximos de `1` |

---

## Formatos numéricos

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

## Limites de Number

```js
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991, ou 2^53 - 1
console.log(Number.MIN_SAFE_INTEGER); // -9007199254740991, ou -(2^53 - 1)
console.log(Number.MAX_VALUE); // 1.7976931348623157e+308
console.log(Number.MIN_VALUE); // 5e-324
console.log(Number.EPSILON); // 2.220446049250313e-16
```

---

## Inteiro fora do limite seguro

```js
console.log(Number.MAX_SAFE_INTEGER + 1); // 9007199254740992
console.log(Number.MAX_SAFE_INTEGER + 2); // 9007199254740992
console.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER)); // true
console.log(Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1)); // false
```

---

## Limites de Inteiros Seguros e Imprecisão Flutuante

- Devido ao formato IEEE 754 de 64 bits, apenas inteiros no intervalo entre `-(2⁵³ - 1)` e `2⁵³ - 1` são representados com...
- Esses limites são representados pelas constantes estáticas `Number.MINSAFEINTEGER` e `Number.MAXSAFEINTEGER`

---

## Limites de segurança e ponto flutuante

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

- Literais e Bases Numéricas: Suporta notação decimal, exponencial (`314e-2`), binária (`0b1111`), octal (`0o17`),...
- `Infinity` e `-Infinity`: Representam números além do limite de precisão do ponto flutuante (ex: `1 / 0 // Infinity`).
- `NaN` (*Not-a-Number*): Apesar do nome ("Não é um Número"), o operador `typeof NaN` retorna `"number"`. Ele representa um...

---

## Representação Numérica, `NaN` e `Infinity`: Comparação

| Cenário | Operação | Resultado |
| :--- | :--- | :--- |
| **Divisão Indefinida / Operações Indeterminadas com `Infinity`** | `0 / 0`, `Infinity - Infinity`, `0 * Infinity`, `Infinity / Infinity` | `NaN` |
| **Matemática Não-Real (Raízes de Negativos)** | `Math.sqrt(-1)`, `Math.log(-1)`, `Math.asin(2)` | `NaN` |
| **Conversões Numéricas Inválidas** | `Number("abc")`, `parseInt("texto")` | `NaN` |
| **Aritmética com `undefined`** | `undefined + 1`, `undefined * 5` | `NaN` |

---

## Exemplos práticos de geração de NaN e Infinity

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
// 4. Conversões numéricas inválidas e aritmética com undefined
console.log(Number("devlab"));   // NaN
console.log(parseInt("texto"));   // NaN
console.log(undefined + 10);      // NaN
console.log(undefined * 5);       // NaN
```

---

## Representação Numérica, `NaN` e `Infinity`

```js
console.log(NaN === NaN); // false!
```

---

## Representação Numérica, `NaN` e `Infinity`

```js
console.log(Number.isNaN(Math.sqrt(-1))); // true (Seguro!)
console.log(Object.is(NaN, NaN));         // true (Seguro!)
```

---

## Métodos Estáticos de Verificação do Number

- O objeto `Number` oferece métodos estáticos para testar a validade e o tipo de valores numéricos sem realizar coerções...

---

## Métodos Estáticos de Verificação do Number: Comparação

| Método | Descrição | Exemplo |
| :--- | :--- | :--- |
| **`Number.isNaN(val)`** | Testa estritamente se o valor é `NaN` (sem coerção de tipo). | `Number.isNaN("abc")` // `false` |
| **`Number.isFinite(val)`** | Testa se o valor é um número finito válido (não `NaN` nem `Infinity`). | `Number.isFinite(100)` // `true` |
| **`Number.isInteger(val)`** | Testa se o valor é um número inteiro sem casas decimais. | `Number.isInteger(4.2)` // `false` |
| **`Number.isSafeInteger(val)`**| Testa se é um inteiro dentro do limite de precisão segura. | `Number.isSafeInteger(10)` // `true` |

---

## Conversão Explícita: `Number()`, `parseInt()` e `parseFloat()`

- O JavaScript oferece três funções principais para converter textos ou outros tipos em números
- A tabela a seguir resume suas principais diferenças
- Abaixo estão exemplos práticos de uso e conversão com diferentes formatos e bases numéricas:

---

## Conversão Explícita: `Number()`, `parseInt()` e `parseFloat()`: Comparação

| Função | Comportamento | Exemplo `"42.5px"` | Exemplo `"abc"` |
| :--- | :--- | :--- | :--- |
| **`Number(val)`** | Converte a string inteira. Se houver caracteres inválidos, retorna `NaN`. | `NaN` | `NaN` |
| **`parseInt(str, radix?)`** | Converte o início da string até encontrar um caractere não numérico, ignorando o resto. Retorna inteiro. | `42` | `NaN` |
| **`parseFloat(str)`** | Converte o início da string permitindo ponto decimal. | `42.5` | `NaN` |

---

## Comparação de conversões numéricas

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

- Os métodos do protótipo `Number.prototype` permitem formatar números em strings com casas decimais fixas, precisão...
- O exemplo abaixo demonstra a utilização prática de cada um desses métodos de formatação:

---

## Métodos de Instância e Formatação do Protótipo Number: Comparação

| Método | Assinatura | Retorno | Descrição |
| :--- | :--- | :--- | :--- |
| **`toFixed()`** | `num.toFixed(digits?)` | `string` | Formata o número com um número fixo de casas decimais (arredonda se necessário). |
| **`toPrecision()`** | `num.toPrecision(precision?)` | `string` | Formata o número com a quantidade especificada de dígitos significativos totais. |
| **`toExponential()`** | `num.toExponential(digits?)` | `string` | Retorna o número formatado em notação científica exponencial. |
| **`toString()`** | `num.toString(radix?)` | `string` | Converte o número em string na base numérica fornecida (`2` a `36`). |

---

## Exemplo de métodos do protótipo Number

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

// 4. toString(radix) - Conversão de base
const n = 255;
console.log(n.toString(16)); // "ff" (hexadecimal)
console.log(n.toString(2));  // "11111111" (binário)
```

---

## O Objeto Estático Math

- O objeto `Math` é um objeto estático nativo do JavaScript que fornece constantes matemáticas e funções utilitárias para...
- Como é um objeto estático, ele não possui construtor e não pode ser instanciado com `new Math()`

---

## Constantes Matemáticas

- O objeto `Math` disponibiliza constantes matemáticas fundamentais prontas para uso:

---

## Constantes do objeto Math

```js
console.log(Math.PI);     // 3.141592653589793 (Pi)
console.log(Math.E);      // 2.718281828459045 (Número de Euler)
console.log(Math.SQRT2);  // 1.4142135623730951 (Raiz quadrada de 2)
```

---

## Funções de Arredondamento

- O `Math` oferece quatro formas distintas de arredondar valores numéricos, cujas diferenças são destacadas na tabela a seguir
- O exemplo a seguir ilustra a aplicação prática destas quatro funções de arredondamento:

---

## Funções de Arredondamento: Comparação

| Função | Comportamento | `3.7` | `3.2` | `-3.7` |
| :--- | :--- | :--- | :--- | :--- |
| **`Math.floor(x)`** | Arredonda sempre **para baixo** (menor inteiro). | `3` | `3` | `-4` |
| **`Math.ceil(x)`** | Arredonda sempre **para cima** (maior inteiro). | `4` | `4` | `-3` |
| **`Math.round(x)`** | Arredonda para o **inteiro mais próximo**. | `4` | `3` | `-4` |
| **`Math.trunc(x)`** | Trunca o número, descartando a parte decimal. | `3` | `3` | `-3` |

---

## Exemplo de arredondamentos

```js
console.log(Math.floor(4.9)); // 4
console.log(Math.ceil(4.1));  // 5
console.log(Math.round(4.5)); // 5
console.log(Math.trunc(4.9)); // 4
```

---

## Funções Matemáticas Utilitárias

- Para realizar operações matemáticas comuns como potências, raízes, valores absolutos e identificação de extremos, o...

---

## Operações com Math

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
console.log(Math.max(10, 5, 20, 3)); // 20

// Espalhando arrays em Math.max/min:
const scores = [80, 95, 70, 88];
console.log(Math.max(...scores)); // 95
```

---

## Geração de Números Aleatórios (`Math.random()`)

- `Math.random()` retorna um número pseudo-aleatório no intervalo `[0, 1)` (inclui 0, mas exclui 1)
- A seguir está o padrão recomendado para gerar inteiros aleatórios dentro de um limite pré-definido:

---

## Gerando números aleatórios em um intervalo [min, max]

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

- Embora o método `.toFixed()` permita formatar casas decimais, ele retorna uma string simples sem separadores de milhar ou...
- Para formatar moedas, porcentagens e valores numéricos respeitando as convenções internacionais, utiliza-se a API nativa...

---

## Sintaxe Básica

- Para criar um formatador internacional, instanciamos `Intl.NumberFormat` passando a localidade desejada (ex
- `'pt-BR'`) e o objeto com as opções de formatação:

---

## Sintaxe Básica

```js
const formatter = new Intl.NumberFormat(locales?, options?);
formatter.format(number);
```

---

## Formatação de Moedas (*Currency*)

- Para formatar valores Monetários (como Real Brasileiro `BRL`, Dólar Americano `USD` ou Euro `EUR`), configuramos `style
- 'currency'` e definimos o código ISO da moeda em `currency`:

---

## Formatação de moedas com Intl.NumberFormat

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
const formatterEUR = new Intl.NumberFormat("de-DE", {
style: "currency",
currency: "EUR",
});
console.log(formatterEUR.format(price)); // "1.250,50 €"
```

---

## Formatação de Porcentagem (*Percent*)

- Para exibir taxas, descontos e porcentagens, utilizamos `style
- 'percent'`, que multiplica o valor por 100 e adiciona o símbolo `%`:

---

## Formatação de porcentagens

```js
const discount = 0.155; // 15.5%

const percentFormatter = new Intl.NumberFormat("pt-BR", {
style: "percent",
minimumFractionDigits: 1,
});

console.log(percentFormatter.format(discount)); // "15,5%"
```

---

## Formatação Numérica com Casas Decimais e Notação Compacta

- Além de moedas e porcentagens, é possível formatar grandes valores numéricos com separadores de milhar adequados ou...
- O `Intl.NumberFormat` trata automaticamente separadores de milhar (ponto no Brasil, vírgula nos EUA), símbolos de moedas,...

---

## Casas decimais e notação compacta

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

## Executando

- Crie um arquivo chamado `number-demo.js`:
- Execute o arquivo com Node.js:

---

## number-demo.js

```js
// 1. Verificações e Conversões
const input = "199.90px";
const parsedPrice = parseFloat(input);
console.log(`Preço convertido: ${parsedPrice}`);

// 2. Operações com Math
const radius = 5;
const area = Math.PI * Math.pow(radius, 2);
console.log(`Área do círculo (r=${radius}): ${area.toFixed(2)}`);

// 3. Formatação com Intl
const biningPrice = 1499.99;
const currencyBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
}).format(biningPrice);

console.log(`Valor Formatado: ${currencyBRL}`);
```

---

## Terminal

```bash
node number-demo.js
```

---

## Output

```txt
Preço convertido: 199.9
Área do círculo (r=5): 78.54
Valor Formatado: R$ 1.499,99
```

---

## Precisão e Verificação Numérica

- Por que `0.1 + 0.2 === 0.3` resulta em `false` em JavaScript
- Qual é a diferença entre `Number.isNaN(val)` e a função global `isNaN(val)`
- Qual é a diferença entre `parseInt("10px")` e `Number("10px")`

---

## Objeto Math e Formatação Intl

- Qual é a diferença entre `Math.floor()`, `Math.ceil()` e `Math.trunc()` para números negativos
- Quais opções são obrigatórias em `Intl.NumberFormat` para formatar um valor como moeda em Reais (`R$`)

---

## Próxima aula

- Arrays e Métodos Funcionais
- Criação, geração de intervalos (range), manipulação, iteração, desestruturação, operador spread e principais métodos de Array

---

## Resumo da Aula

- Revise criação e Representação Numérica
- Revise representação Numérica, `NaN` e `Infinity`
- Revise o Objeto Estático Math
- Revise formatação de Números e Moedas (`Intl.NumberFormat`)
- Revise executando
- Revise próxima aula
