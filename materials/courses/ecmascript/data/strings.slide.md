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
title: "JavaScript: Strings e Template Literals"
description: "Criação, imutabilidade, caracteres de escape, concatenação, template literals e principais métodos do objeto String em JavaScript."
---

<!-- _class: lead -->

# JavaScript: Strings e Template Literals

Criação, imutabilidade, caracteres de escape, concatenação, template literals e principais métodos do objeto String em JavaScript.

---

## Objetivo

- Compreender o tipo de dado String em JavaScript, reconhecer a imutabilidade das strings, dominar delimitadores e sequências de escape.

---

## Mapa da Aula

- Criação e Literais de String
- Conversão para String
- Caracteres de Escape e Unicode
- Imutabilidade e Acesso por Índice
- Concatenação e Template Literals
- Métodos do Objeto String

---

## Criação e Literais de String

- Em JavaScript, uma String é uma sequência de caracteres imutável usada para representar texto.
- As strings podem ser criadas utilizando três tipos de delimitadores: aspas simples (`'`), aspas duplas (`"`) ou crases (`` ` ``).
- Evite utilizar `new String()`.
- O operador `new` cria um objeto wrapper na memória em vez de uma string primitiva.

---

## Criação e Literais de String (Comparação)

| Delimitador | Nome | Uso Principal | Exemplo |
| ----------- | ---- | ------------- | ------- |
| `'...'` | Aspas Simples | Literal de texto simples | `'Desenvolvimento Web'` |
| `"..."` | Aspas Duplas | Literal de texto simples | `"JavaScript"` |
| `` `...` `` | Template Literal | Interpolação e textos multilinhas | `` `Olá, ${nome}` `` |

---

## Criação e Literais de String (Exemplo)

```js
// 1. Aspas simples e duplas (equivalentes no comportamento)
const single = 'Desenvolvimento Web';
const double = "Curso de Redes de Computadores";

// 2. Template Literals (crases)
const template = `Tecnologia em Redes`;

// 3. Função conversora String()
const converted = String(42); // "42"

// 4. Construtor new String() (EVITAR)
const objectString = new String("Texto"); // Cria um objeto Wrapper
```

---

## Conversão para String

- Função `String(valor)`: É a forma mais direta e segura de conversão explícita, pois funciona com qualquer tipo de dado.
- Método `.toString()`: Método presente no protótipo da maioria dos tipos de dados (números, booleanos, arrays, objetos).
- Sintaxe com literais numéricos: Chamar `.toString()` diretamente em um número literal como `42.
- Bases numéricas com `.toString(radix)`: Em valores numéricos, o método `.
- Qualquer tipo de dado em JavaScript pode ser convertido para String de forma explícita ou implícita.

---

## Conversão para String (Exemplo)

```js
// 1. Função conversora String() (funciona com todos os tipos)
console.log(String(42));        // "42"
console.log(String(true));      // "true"
console.log(String(null));      // "null"
console.log(String(undefined)); // "undefined"

// 2. Método .toString()
const active = true;
console.log(active.toString()); // "true"

// Sintaxe com literais numéricos:
// 42.toString(); // SyntaxError: Invalid or unexpected token
// ...
```

---

## Caracteres de Escape e Unicode

| Sequência | Descrição | Exemplo |
| --------- | --------- | ------- |
| `\'` | Aspa simples literal | `'D\'água'` |
| `\"` | Aspa dupla literal | `"Disse: \"Olá!\""` |
| `\\` | Barra invertida literal | `"C:\\Arquivos"` |
| `\n` | Nova linha (*Line Feed*) | `"Linha 1\nLinha 2"` |
| `\t` | Tabulação (*Tab*) | `"Item:\tValor"` |

---

## Caracteres de Escape e Unicode (Exemplo)

```js
const quote = "O professor disse: \"Pratiquem JavaScript!\"";
const path = "C:\\projetos\\devlab\\script.js";
const multiline = "Primeira linha\nSegunda linha";
const heart = "Eu \u2661 JavaScript!";

console.log(quote);     // "O professor disse: "Pratiquem JavaScript!""
console.log(path);      // "C:\projetos\devlab\script.js"
console.log(multiline); // "Primeira linha" e na linha seguinte "Segunda linha"
console.log(heart);     // "Eu ♡ JavaScript!"
```

---

## Imutabilidade e Acesso por Índice

- Strings em JavaScript são primitivos imutáveis.
- Isso significa que, uma vez criada, uma string não pode ter seus caracteres alterados individualmente.

---

## Notação de Colchetes e .at()

- Os caracteres de uma string podem ser lidos por índices inteiros a partir do zero (`0`), similar a um array.

---

## Notação de Colchetes e .at() (Exemplo)

```js
const text = "JavaScript";

// Propriedade length (quantidade de caracteres)
console.log(text.length); // 10

// Leitura por índice (colchetes)
console.log(text[0]); // "J"
console.log(text[4]); // "S"
console.log(text[9]); // "t"
console.log(text[10]); // undefined (índice inexistente)

// Método .at() (aceita índices negativos a partir do final)
// ...
```

---

## Inspeção de Códigos Unicode com `codePointAt()`

- Cada caractere possui um número inteiro correspondente na tabela Unicode (por exemplo, o caractere `"1"` tem o código `49`.
- Dê preferência ao método `.codePointAt()` em relação ao antigo `.charCodeAt()`.
- Para realizar o caminho inverso (converter um número de código Unicode em caractere).

---

## Inspeção de Códigos Unicode com `codePointAt()` (Exemplo)

```js
const str = "123 JavaScript 😀";

// Obtendo o código Unicode do caractere "1" na posição 0
console.log(str.codePointAt(0)); // 49 (código ASCII/Unicode de "1")
console.log(str.codePointAt(4)); // 74 (código de "J")

// Emojis possuem pontos de código Unicode de 32-bit
const emojiPos = str.indexOf("😀");
console.log(str.codePointAt(emojiPos)); // 128512

// Conversão inversa: de código Unicode numérico para caractere String
console.log(String.fromCodePoint(49));     // "1"
console.log(String.fromCodePoint(65));     // "A"
console.log(String.fromCodePoint(128512)); // "😀"
```

---

## Tentativa de Mutação de Strings

- Nenhum método do objeto `String` altera a string original.
- Métodos como `.toUpperCase()`, `.trim()` ou `.replace()` sempre retornam uma nova string resultante do processamento.

---

## Tentativa de Mutação de Strings (Exemplo)

```js
let language = "JavaScript";

// Tentativa de alterar o primeiro caractere
language[0] = "Y";

console.log(language); // "JavaScript" (não mudou!)

// Para alterar, é necessário atribuir uma NOVA string à variável
language = "Y" + language.slice(1);
console.log(language); // "YavaScript"
```

---

## Concatenação e Template Literals

- A junção de textos pode ser realizada através da concatenação tradicional com o operador `+` ou via Template Literals (crases).

---

## Concatenação com o Operador `+`

- O operador `+` realiza a junção de strings.
- Se um dos operandos for uma string, o outro será convertido para string automaticamente (coerção).

---

## Concatenação com o Operador `+` (Exemplo)

```js
const firstName = "Luiz";
const lastName = "Chaves";
const fullName = firstName + " " + lastName;

console.log(fullName); // "Luiz Chaves"

// Coerção automática de números para string
console.log("Aula " + 5); // "Aula 5"
```

---

## Template Literals (Interpolação de Expressões)

- Elas também suportam textos multilinhas sem a necessidade de `\n`.
- Referência: Template literals | MDN.

---

## Template Literals (Interpolação de Expressões) (Exemplo)

```js
const user = "Alice";
const role = "Desenvolvedora";
const age = 28;

// Interpolação de variáveis e expressões JavaScript
const greeting = `Usuário ${user} (${role}) tem ${age} anos. Próximo ano terá ${age + 1}.`;
console.log(greeting);
// "Usuário Alice (Desenvolvedora) tem 28 anos. Próximo ano terá 29."

// Criação de HTML multilinha de forma limpa
const cardHtml = `
<div class="user-card">
// ...
```

---

## Métodos do Objeto String

- O objeto `String` oferece um rico conjunto de métodos para buscar, fatiar, transformar e formatar textos.

---

## 1. Busca e Inspeção

- Métodos usados para verificar a existência de padrões ou localizar posições de caracteres em uma string.

---

## 1. Busca e Inspeção (Comparação)

| Método | Descrição | Retorno |
| ------ | --------- | ------- |
| `includes(search)` | Verifica se a string contém o trecho informado | `boolean` |
| `startsWith(search)` | Verifica se a string começa com o trecho informado | `boolean` |
| `endsWith(search)` | Verifica se a string termina com o trecho informado | `boolean` |
| `indexOf(search)` | Retorna o primeiro índice onde o trecho foi encontrado | Índice ou `-1` |
| `lastIndexOf(search)` | Retorna o último índice onde o trecho foi encontrado | Índice ou `-1` |

---

## 1. Busca e Inspeção (Exemplo)

```js
const filename = "relatorio-financeiro-2026.pdf";

console.log(filename.includes("financeiro")); // true
console.log(filename.startsWith("relatorio"));// true
console.log(filename.endsWith(".pdf"));       // true

const phrase = "A linguagem JavaScript é a linguagem da Web";
console.log(phrase.indexOf("linguagem"));     // 2 (primeira ocorrência)
console.log(phrase.lastIndexOf("linguagem")); // 27 (última ocorrência)
console.log(phrase.indexOf("Python"));        // -1 (não encontrado)
```

---

## 2. Extração e Fatiamento

- Métodos usados para extrair partes de uma string ou dividi-la em um array de pedaços.
- O método `.substr(start, length)` foi marcado como obsoleto na especificação do JavaScript.
- Dê preferência ao método padrão `.slice(start, end)`.

---

## 2. Extração e Fatiamento (Comparação)

| Método | Descrição | Retorno |
| ------ | --------- | ------- |
| `slice(start, end)` | Extrai um trecho do índice `start` até `end` (exclusivo). Suporta índices negativos. | Nova `string` |
| `substring(start, end)` | Extrai um trecho de `start` até `end`. Trata negativos como `0`. | Nova `string` |
| `split(separator)` | Divide a string em um array utilizando o separador informado | Novo `Array` |

---

## 2. Extração e Fatiamento (Exemplo)

```js
const email = "usuario@redes.ifpb.edu.br";

// Encontrando a posição do caractere '@'
const atIndex = email.indexOf("@");

// Extraindo nome de usuário e domínio com slice()
const username = email.slice(0, atIndex);
const domain = email.slice(atIndex + 1);

console.log(username); // "usuario"
console.log(domain);   // "redes.ifpb.edu.br"

// ...
```

---

## 3. Transformação e Ajustes de Formato

- Métodos usados para alterar a caixa de texto (maiúsculas/minúsculas), remover espaços em branco ou preencher caracteres de borda.

---

## 3. Transformação e Ajustes de Formato (Comparação)

| Método | Descrição | Retorno |
| ------ | --------- | ------- |
| `toUpperCase()` | Converte todos os caracteres para maiúsculas | Nova `string` |
| `toLowerCase()` | Converte todos os caracteres para minúsculas | Nova `string` |
| `trim()` | Remove espaços em branco do início e do final | Nova `string` |
| `trimStart()` / `trimEnd()` | Remove espaços apenas do início ou apenas do final | Nova `string` |
| `padStart(targetLength, pad)` | Preenche o **início** até atingir o tamanho alvo | Nova `string` |

---

## 3. Transformação e Ajustes de Formato (Exemplo)

```js
// 1. Ajuste de caixa de texto e remoção de espaços
const rawInput = "  contato@EMPRESA.com  \n";
const cleanEmail = rawInput.trim().toLowerCase();
console.log(cleanEmail); // "contato@empresa.com"

// 2. Preenchimento de texto com padStart()
const code = "42";
const formattedCode = code.padStart(6, "0");
console.log(formattedCode); // "000042"

// 3. Substituição de texto com replace() e replaceAll()
const text = "O gato subiu no telhado. O gato é esperto.";
// ...
```

---

## 4. Comparação de Strings e `localeCompare()`

- Comparação por Unicode (Operadores ``)
- Comparações textuais de números comparam caractere a caractere (`"2" > "10"` é `true` porque o caractere `"2"` vem depois de `"1"`).
- Vogais acentuadas possuem códigos Unicode elevados (`"á" > "b"` é `true`, contrariando a ordem alfabética).
- Comparação por Regras de Idioma (`localeCompare()`)
- Retorna um número negativo se `strA` vier antes de `strB`, positivo se vier depois, e `0` se forem consideradas equivalentes.

---

## 4. Comparação de Strings e `localeCompare()` (Comparação)

| Tipo de Comparação | Sintaxe / Exemplo | Resultado | Explicação |
| ------------------ | ----------------- | --------- | ---------- |
| Operador `>` | `"á" > "b"` | `true` | Comparação simples por código Unicode |
| `localeCompare()` | `"á".localeCompare("b", "pt-BR")` | `-1` (negativo) | No português ("pt-BR"), "á" vem antes de "b" |
| Ignorando case e acentos | `"á".localeCompare("A", "pt-BR", { sensitivity: 'base' })` | `0` | Trata acentos e maiúsculas como equivalentes |

---

## 4. Comparação de Strings e `localeCompare()` (Exemplo)

```js
// Comparação lexicográfica tradicional (Unicode)
console.log("banana" > "abacaxi"); // true
console.log("Mesa" < "cadeira");   // true ('M' = 77, 'c' = 99 em Unicode)
console.log("2" > "10");           // true ("2" vem depois de "1")
console.log("á" > "b");            // true (código Unicode de 'á' é 225, de 'b' é 98)

// Comparação correta por idioma com localeCompare()
console.log("á".localeCompare("b", "pt-BR")); // -1 ("á" vem antes de "b")
console.log("b".localeCompare("á", "pt-BR")); // 1 ("b" vem depois de "á")

// Ignorando diferenças de maiúsculas/minúsculas e acentos:
console.log("á".localeCompare("A", "pt-BR", { sensitivity: "base" })); // 0
// ...
```

---

## 5. Métodos que Aceitam Expressões Regulares (Regex)

- Vários métodos do protótipo `String` aceitam Expressões Regulares (Regex) como parâmetro, permitindo realizar buscas complexas.

---

## 5. Métodos que Aceitam Expressões Regulares (Regex) (Comparação)

| Método | Aceita Regex? | Descrição | Retorno |
| ------ | ------------- | --------- | ------- |
| `match(regex)` | Sim | Busca correspondências do padrão regex na string | `Array` ou `null` |
| `matchAll(regex)` | Sim (requer flag `/g`) | Retorna um iterador com todas as correspondências e grupos de captura | Iterador |
| `search(regex)` | Sim | Retorna a posição do primeiro caractere que casa com a regex | Índice ou `-1` |
| `replace(regex, sub)` | Sim | Substitui o padrão encontrado pela string de substituição | Nova `string` |
| `replaceAll(regex, sub)` | Sim (requer flag `/g`) | Substitui todas as ocorrências do padrão regex | Nova `string` |

---

## 5. Métodos que Aceitam Expressões Regulares (Regex) (Exemplo)

```js
const input = "Contatos: ana@email.com, bob123@site.org e carla_2026@dev.io";

// 1. search(regex) - Retorna o índice do primeiro dígito numérico
console.log(input.search(/\d+/)); // 31 (posição do dígito '1' em bob123)

// 2. match(regex) - Extrai a primeira ocorrência que combina com o padrão de e-mail
const firstEmail = input.match(/[\w.-]+@[\w.-]+\.\w+/);
console.log(firstEmail[0]); // "ana@email.com"

// 3. matchAll(regex) - Iterador para extrair todos os e-mails com grupos de captura
const allEmails = input.matchAll(/([\w.-]+)@([\w.-]+\.\w+)/g);
for (const match of allEmails) {
// ...
```

---

## 6. Normalização de Unicode com `normalize()`

- Forma Composta (NFC): Um único ponto de código Unicode (ex: `"é"` como `"\u00E9"`).
- Forma Decomposta (NFD): O caractere base acompanhado do caractere combinador de acento (ex: `"e"` + `"\u0301"`).
- Em Unicode, um mesmo caractere acentuado pode ser representado de duas formas diferentes na memória
- O método `str.normalize(form)` padroniza a string em uma das formas normais Unicode (`"NFC"` ou `"NFD"`).

---

## 6. Normalização de Unicode com `normalize()` (Exemplo)

```js
// Duas representações visivelmente idênticas, mas com códigos Unicode diferentes:
const strNFC = "é";          // "\u00E9" (NFC)
const strNFD = "e\u0301";    // "e" + "\u0301" (NFD)

console.log(strNFC === strNFD); // false (código na memória é diferente!)
console.log(strNFC.normalize("NFC") === strNFD.normalize("NFC")); // true

// Aplicação clássica: Remoção elegante de acentos combinando NFD e Regex
function removeAccents(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

console.log(removeAccents("Atenção! Olá, programação!"));
// "Atencao! Ola, programacao!"
```

---

## O Tipo Primitivo Symbol

- Diferente de strings ou números, cada valor criado por `Symbol()` é único na memória.
- `Symbol` é uma função primitivadora, não um construtor de classe.
- Invocá-la com `new Symbol()` lança um erro `TypeError: Symbol is not a constructor`.

---

## O Tipo Primitivo Symbol (Exemplo)

```js
const id1 = Symbol("id");
const id2 = Symbol("id");

console.log(typeof id1); // "symbol"
console.log(id1 === id2); // false (símbolos são sempre únicos!)
```

---

## 1. Propriedades de Objetos e Não-Enumerabilidade

- Não Enumerabilidade: Propriedades com chave `Symbol` não aparecem em loops `for...in`.
- Acesso Direto e Reflexão: Para listar as chaves de símbolos de um objeto.

---

## 1. Propriedades de Objetos e Não-Enumerabilidade (Exemplo)

```js
const SECRET_KEY = Symbol("secret");
const user = {
  name: "Alice",
  [SECRET_KEY]: "token_super_secreto_123"
};

// 1. Não aparece em Object.keys() ou for...in
console.log(Object.keys(user)); // [ "name" ]

// 2. Não aparece em JSON.stringify()
console.log(JSON.stringify(user)); // '{"name":"Alice"}'

// ...
```

---

## 2. Registro Global de Símbolos (`Symbol.for` e `Symbol.keyFor`)

- `Symbol.for(chave)`: Procura um símbolo no registro global com o nome fornecido. Se existir, ele é retornado; caso contrário.
- `Symbol.keyFor(simbolo)`: Recebe um símbolo registrado e retorna a string de sua chave global (ou `undefined` se for um símbolo local).
- Quando é necessário reutilizar o mesmo símbolo em diferentes arquivos, módulos ou escopos da aplicação.

---

## 2. Registro Global de Símbolos (`Symbol.for` e `Symbol.keyFor`) (Exemplo)

```js
// Cria (ou recupera) o símbolo no registro global
const globalSym1 = Symbol.for("app.userId");
const globalSym2 = Symbol.for("app.userId");

console.log(globalSym1 === globalSym2); // true (mesma referência global!)

// Obtendo a chave de string a partir do símbolo registrado
console.log(Symbol.keyFor(globalSym1)); // "app.userId"

// Símbolos locais (criados via Symbol()) não possuem chave global
const localSym = Symbol("app.userId");
console.log(Symbol.keyFor(localSym)); // undefined
```

---

## 3. Símbolos Conhecidos (*Well-Known Symbols*)

- O ECMAScript possui um conjunto de símbolos nativos pré-definidos expostos como propriedades da função `Symbol`.
- Referência: String.prototype | MDN.

---

## 3. Símbolos Conhecidos (*Well-Known Symbols*) (Comparação)

| Símbolo Nativo | Propósito / Aplicação |
| :--- | :--- |
| **`Symbol.iterator`** | Define o método de iteração padrão para loops `for...of` e espalhamento `...`. |
| **`Symbol.toPrimitive`** | Customiza a coerção de tipo quando o objeto é convertido para `string` ou `number`. |
| **`Symbol.toStringTag`** | Personaliza o rótulo retornado por `Object.prototype.toString.call(obj)`. |
| **`Symbol.hasInstance`** | Personaliza o resultado do operador `instanceof`. |

---

## 3. Símbolos Conhecidos (*Well-Known Symbols*) (Exemplo)

```js
// 1. Symbol.toPrimitive: Personaliza conversão para primitivo
const collection = {
  items: [10, 20, 30],
  [Symbol.toPrimitive](hint) {
    if (hint === "number") return this.items.length;
    if (hint === "string") return `Coleção com ${this.items.length} itens`;
    return this.items.join(",");
  }
};

console.log(Number(collection)); // 3 (hint === "number")
console.log(String(collection)); // "Coleção com 3 itens" (hint === "string")
// ...
```

---

## Resumo e Boas Práticas

- Lembre-se de que strings são imutáveis; métodos sempre retornam novas strings.
- Utilize `slice()` em vez do obsoleto `substr()`.
- Lembre-se de que `.length` mede unidades de código de 16 bits.
- Dê preferência a Template Literals (crases) para concatenar variáveis ou criar HTML multilinha.
- Sanitize dados de entrada de formulários usando `.trim()` e `.toLowerCase()`.

---

## Criação, Imutabilidade e Concatenação

- O que significa dizer que as Strings em JavaScript são imutáveis?
- Significa que os caracteres de uma string não podem ser alterados individualmente após sua criação.
- Qualquer método de string retorna uma nova string com o resultado, deixando a string original intocada.
- Qual é a vantagem de utilizar Template Literals (crases) em relação às aspas tradicionais?
- Por que a instrução `42.toString()` lança um erro de sintaxe (`SyntaxError`) e como podemos corrigi-la?

---

## Métodos de Busca e Extração

- Qual é a diferença entre os métodos `.slice(start, end)` e `.substring(start, end)`?
- `.slice()` aceita índices negativos (que contam a partir do final da string).
- `.substring()` trata valores negativos como `0` e inverte a ordem dos parâmetros se `start > end`.
- Por que o método `.substr()` deve ser evitado em código JavaScript moderno?
- Porque `.substr()` foi marcado como obsoleto (deprecated) pela especificação da linguagem.

---

## Transformação e Boas Práticas

- Para que serve o método `.padStart(targetLength, padString)` e em que cenário ele é útil?
- Ele preenche o início da string com o caractere desejado até que a string atinja o tamanho limite especificado.
- É útil para formatar números de protocolo, matrículas ou valores numéricos com zeros à esquerda (ex: `"42".padStart(4.
- Qual é a diferença entre os métodos `.replace()` e `.replaceAll()`?
- `.replaceAll()` substitui todas as ocorrências do termo na string.

---

## Executando

- Crie um arquivo chamado `string-demo.js`
- Execute o arquivo com Node.js no terminal
- Modifique os valores e teste outros métodos de substituição e fatiamento no código.
- Os conceitos de manipulação de Strings podem ser testados diretamente no terminal com o Node.js.

---

## Exercício

- Crie uma variável `userEmail` contendo o valor `" ALICE.SILVA@Gmail.com "`;
- Remova os espaços em branco das bordas e converta a string para letras minúsculas;
- Extraia o nome do usuário (trecho antes do `@`) e o domínio (trecho após o `@`);
- Verifique se o domínio do e-mail é do provedor `"gmail.com"`;
- Imprima no console o e-mail sanitizado, o nome do usuário, o domínio e o resultado da verificação.

---

## Desafio

- Crie uma função `generateSlug(title)` que receba uma string;
- Remova espaços das bordas e converta todo o texto para letras minúsculas;
- Remova acentos utilizando `.normalize("NFD")` e Regex;
- Remova pontuações especiais (como `!`, `?`, `,`, `:`);
- Substitua todos os espaços internos por hífen (`-`);

---

## Resumo da Aula

- **Imutabilidade**: Strings são primitivos imutáveis; métodos de transformação sempre retornam uma nova instância.
- **Template Literals**: Sintaxe com crases para interpolação `${expr}`, strings multilinhas nativas e Tagged Templates.
- **Busca & Verificação**: `includes()`, `startsWith()`, `endsWith()` para testes booleanos e `indexOf()` para localização de índice.
- **Fatiamento & Alteração**: `slice(start, end)` para extração; `replace()` e `replaceAll()` para substituição com strings ou regex.
- **Formatação**: `trim()`, `trimStart()`, `trimEnd()` para limpeza de espaços e `padStart()` / `padEnd()` para preenchimento de dígitos.
