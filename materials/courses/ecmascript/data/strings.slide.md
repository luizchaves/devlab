---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Strings e Template Literals"
description: "Slides completos da aula JavaScript: Strings e Template Literals."
---

<!-- _class: lead -->

# JavaScript: Strings e Template Literals

Criação, imutabilidade, caracteres de escape, concatenação, template literals e principais métodos do objeto String em JavaScript.

---

## Objetivo

- Compreender o tipo de dado String em JavaScript, reconhecer a imutabilidade das strings, dominar delimitadores e...

---

## Mapa da Aula

- Criação e Literais de String
- Conversão para String
- Caracteres de Escape e Unicode
- Imutabilidade e Acesso por Índice
- Concatenação e Template Literals
- Métodos do Objeto String
- O Tipo Primitivo Symbol
- Resumo e Boas Práticas

---

## Introdução

- Esta aula apresenta as Strings em JavaScript
- como criar sequências de caracteres, manipular textos, utilizar interpolação com *template literals*, lidar com a...

---

## Criação e Literais de String

- Em JavaScript, uma String é uma sequência de caracteres imutável usada para representar texto
- As strings podem ser criadas utilizando três tipos de delimitadores
- aspas simples (`'`), aspas duplas (`"`) ou crases (`` ` ``)
- Evite utilizar `new String()`
- O operador `new` cria um objeto *wrapper* na memória em vez de uma string primitiva, fazendo com que `typeof new...

---

## Criação e Literais de String: Comparação

| Delimitador | Nome | Uso Principal | Exemplo |
| ----------- | ---- | ------------- | ------- |
| `'...'` | Aspas Simples | Literal de texto simples | `'Desenvolvimento Web'` |
| `"..."` | Aspas Duplas | Literal de texto simples | `"JavaScript"` |
| `` `...` `` | Template Literal | Interpolação e textos multilinhas | `` `Olá, ${nome}` `` |

---

## Formas de declaração de Strings

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

## Primitivo vs Objeto String

```js
const prim = "DevLab";
const obj = new String("DevLab");

console.log(typeof prim); // "string"
console.log(typeof obj);  // "object"
console.log(prim === obj); // false (tipos diferentes)
```

---

## Conversão para String

- Função `String(valor)`: É a forma mais direta e segura de conversão explícita, pois funciona com qualquer tipo de dado,...
- Método `.toString()`: Método presente no protótipo da maioria dos tipos de dados (números, booleanos, arrays, objetos).
- Sintaxe com literais numéricos: Chamar `.toString()` diretamente em um número literal como `42.toString()` gera um erro...
- Bases numéricas com `.toString(radix)`: Em valores numéricos, o método `.toString()` aceita um parâmetro opcional `radix`...
- Coerção Implícita e Template Literals: O operador `+` converte operandos para string quando ao menos um deles for uma...

---

## Exemplos de conversão para String e bases numéricas

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
console.log((255).toString(16)); // "ff"     (Hexadecimal - base 16)

// 3. Coerção implícita
console.log("" + 100);          // "100"
console.log(`Valor: ${100}`);   // "Valor: 100"
```

---

## Caracteres de Escape e Unicode

- Quando uma string precisa conter caracteres reservados (como a própria aspa usada para delimitá-la) ou caracteres...

---

## Caracteres de Escape e Unicode: Comparação

| Sequência | Descrição | Exemplo |
| --------- | --------- | ------- |
| `\'` | Aspa simples literal | `'D\'água'` |
| `\"` | Aspa dupla literal | `"Disse: \"Olá!\""` |
| `\\` | Barra invertida literal | `"C:\\Arquivos"` |
| `\n` | Nova linha (*Line Feed*) | `"Linha 1\nLinha 2"` |
| `\t` | Tabulação (*Tab*) | `"Item:\tValor"` |
| `\uXXXX` | Caractere Unicode (Hexadecimal 16-bit) | `"\u2661"` // `"♡"` |

---

## Uso de sequências de escape

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

- Strings em JavaScript são primitivos imutáveis
- Isso significa que, uma vez criada, uma string não pode ter seus caracteres alterados individualmente

---

## Notação de Colchetes e .at()

- Os caracteres de uma string podem ser lidos por índices inteiros a partir do zero (`0`), similar a um array

---

## Leitura de caracteres e propriedade length

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
console.log(text.at(0));  // "J"
console.log(text.at(-1)); // "t" (último caractere)
console.log(text.at(-2)); // "p" (penúltimo caractere)
```

---

## Inspeção de Códigos Unicode com `codePointAt()`

- Cada caractere possui um número inteiro correspondente na tabela Unicode (por exemplo, o caractere `"1"` tem o código...
- Dê preferência ao método `.codePointAt()` em relação ao antigo `.charCodeAt()`, pois ele suporta corretamente caracteres...
- Para realizar o caminho inverso (converter um número de código Unicode em caractere), utiliza-se o método estático...

---

## Códigos Unicode com codePointAt() e String.fromCodePoint()

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

- Tentativas de alterar um caractere de uma string usando colchetes são silenciosamente ignoradas (ou lançam erro no modo...
- Nenhum método do objeto `String` altera a string original
- Métodos como `.toUpperCase()`, `.trim()` ou `.replace()` sempre retornam uma nova string resultante do processamento

---

## Imutabilidade de Strings

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

- A junção de textos pode ser realizada através da concatenação tradicional com o operador `+` ou via Template Literals...

---

## Concatenação com o Operador `+`

- O operador `+` realiza a junção de strings
- Se um dos operandos for uma string, o outro será convertido para string automaticamente (coerção)

---

## Concatenação tradicional

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

- Introduzidas no ES6, as *template literals* permitem interpolar variáveis e expressões diretamente dentro do texto usando...
- Elas também suportam textos multilinhas sem a necessidade de `\n`
- Template literals | MDN

---

## Interpolação e multilinhas com Template Literals

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
<h2>${user}</h2>
<p>Cargo: ${role}</p>
</div>
`;

console.log(cardHtml);
```

---

## Métodos do Objeto String

- O objeto `String` oferece um rico conjunto de métodos para buscar, fatiar, transformar e formatar textos

---

## Busca e Inspeção

- Métodos usados para verificar a existência de padrões ou localizar posições de caracteres em uma string

---

## Busca e Inspeção: Comparação

| Método | Descrição | Retorno |
| ------ | --------- | ------- |
| `includes(search)` | Verifica se a string contém o trecho informado | `boolean` |
| `startsWith(search)` | Verifica se a string começa com o trecho informado | `boolean` |
| `endsWith(search)` | Verifica se a string termina com o trecho informado | `boolean` |
| `indexOf(search)` | Retorna o primeiro índice onde o trecho foi encontrado | Índice ou `-1` |
| `lastIndexOf(search)` | Retorna o último índice onde o trecho foi encontrado | Índice ou `-1` |

---

## Exemplo de métodos de busca

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

## Extração e Fatiamento

- Métodos usados para extrair partes de uma string ou dividi-la em um array de pedaços
- O método `.substr(start, length)` foi marcado como obsoleto na especificação do JavaScript
- Dê preferência ao método padrão `.slice(start, end)`

---

## Extração e Fatiamento: Comparação

| Método | Descrição | Retorno |
| ------ | --------- | ------- |
| `slice(start, end)` | Extrai um trecho do índice `start` até `end` (exclusivo). Suporta índices negativos. | Nova `string` |
| `substring(start, end)` | Extrai um trecho de `start` até `end`. Trata negativos como `0`. | Nova `string` |
| `split(separator)` | Divide a string em um array utilizando o separador informado | Novo `Array` |

---

## Extração de trechos com slice() e split()

```js
const email = "usuario@redes.ifpb.edu.br";

// Encontrando a posição do caractere '@'
const atIndex = email.indexOf("@");

// Extraindo nome de usuário e domínio com slice()
const username = email.slice(0, atIndex);
const domain = email.slice(atIndex + 1);

console.log(username); // "usuario"
console.log(domain);   // "redes.ifpb.edu.br"

// Dividindo a string em um Array com split()
const parts = email.split("@");
console.log(parts); // [ "usuario", "redes.ifpb.edu.br" ]

const words = "HTML,CSS,JavaScript,Node.js".split(",");
console.log(words); // [ "HTML", "CSS", "JavaScript", "Node.js" ]
```

---

## Transformação e Ajustes de Formato

- Métodos usados para alterar a caixa de texto (maiúsculas/minúsculas), remover espaços em branco ou preencher caracteres...

---

## Transformação e Ajustes de Formato: Comparação

| Método | Descrição | Retorno |
| ------ | --------- | ------- |
| `toUpperCase()` | Converte todos os caracteres para maiúsculas | Nova `string` |
| `toLowerCase()` | Converte todos os caracteres para minúsculas | Nova `string` |
| `trim()` | Remove espaços em branco do início e do final | Nova `string` |
| `trimStart()` / `trimEnd()` | Remove espaços apenas do início ou apenas do final | Nova `string` |
| `padStart(targetLength, pad)` | Preenche o **início** até atingir o tamanho alvo | Nova `string` |
| ... | ... | ... |

---

## Exemplo de métodos de transformação

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
console.log(text.replace("gato", "cachorro"));    // "O cachorro subiu no telhado. O gato é esperto."
console.log(text.replaceAll("gato", "cachorro")); // "O cachorro subiu no telhado. O cachorro é esperto."

// 4. Repetição de strings
const echo = "Olá! ".repeat(3);
console.log(echo); // "Olá! Olá! Olá! "
```

---

## Comparação de Strings e `localeCompare()`

- Comparação por Unicode (Operadores ` `):
- Letras maiúsculas possuem códigos Unicode menores que minúsculas (`"Mesa" < "cadeira"` é `true` porque `'M'` tem valor 77...
- Comparações textuais de números comparam caractere a caractere (`"2" > "10"` é `true` porque o caractere `"2"` vem depois...
- Vogais acentuadas possuem códigos Unicode elevados (`"á" > "b"` é `true`, contrariando a ordem alfabética).
- Comparação por Regras de Idioma (`localeCompare()`):

---

## Comparação de Strings e `localeCompare()`: Comparação

| Tipo de Comparação | Sintaxe / Exemplo | Resultado | Explicação |
| ------------------ | ----------------- | --------- | ---------- |
| Operador `>` | `"á" > "b"` | `true` | Comparação simples por código Unicode |
| `localeCompare()` | `"á".localeCompare("b", "pt-BR")` | `-1` (negativo) | No português ("pt-BR"), "á" vem antes de "b" |
| Ignorando case e acentos | `"á".localeCompare("A", "pt-BR", { sensitivity: 'base' })` | `0` | Trata acentos e maiúsculas como equivalentes |

---

## Comparação de Strings e Ordenação

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

// Ordenação correta usando localeCompare():
const frutasOrdenadas = [...frutas].sort((a, b) => a.localeCompare(b, "pt-BR"));
console.log(frutasOrdenadas);
// ["abacaxi", "Água", "banana", "Maçã"]
```

---

## Métodos que Aceitam Expressões Regulares (Regex)

- Vários métodos do protótipo `String` aceitam Expressões Regulares (Regex) como parâmetro, permitindo realizar buscas...

---

## Métodos que Aceitam Expressões Regulares (Regex): Comparação

| Método | Aceita Regex? | Descrição | Retorno |
| ------ | ------------- | --------- | ------- |
| `match(regex)` | Sim | Busca correspondências do padrão regex na string | `Array` ou `null` |
| `matchAll(regex)` | Sim (requer flag `/g`) | Retorna um iterador com todas as correspondências e grupos de captura | Iterador |
| `search(regex)` | Sim | Retorna a posição do primeiro caractere que casa com a regex | Índice ou `-1` |
| `replace(regex, sub)` | Sim | Substitui o padrão encontrado pela string de substituição | Nova `string` |
| `replaceAll(regex, sub)` | Sim (requer flag `/g`) | Substitui todas as ocorrências do padrão regex | Nova `string` |
| `split(regex)` | Sim | Divide a string utilizando a regex como delimitador | Novo `Array` |

---

## Exemplo de métodos de string com Regex

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
console.log(sanitized); // "Contatos: ana@email.com, bob[OCULTO]@site.org e carla_[OCULTO]@dev.io"

// 5. split(regex) - Divide o texto por múltiplos delimitadores (vírgula, ponto e vírgula ou espaço)
const tags = "javascript; web, frontend   backend".split(/[\s,;]+/);
console.log(tags); // [ "javascript", "web", "frontend", "backend" ]
```

---

## Normalização de Unicode com `normalize()`

- Forma Composta (NFC): Um único ponto de código Unicode (ex: `"é"` como `"\u00E9"`).
- Forma Decomposta (NFD): O caractere base acompanhado do caractere combinador de acento (ex: `"e"` + `"\u0301"`).

---

## Normalização Unicode e Remoção de Acentos

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

- Introduzido no ES6, `Symbol` é um tipo primitivo de dado imutável e com propósito único em JavaScript
- servir como identificador exclusivo garantido
- Diferente de strings ou números, cada valor criado por `Symbol()` é único na memória, mesmo que receba exatamente a mesma...
- `Symbol` é uma função primitivadora, não um construtor de classe
- Invocá-la com `new Symbol()` lança um erro `TypeError

---

## Garantia de Unicidade dos Symbols

```js
const id1 = Symbol("id");
const id2 = Symbol("id");

console.log(typeof id1); // "symbol"
console.log(id1 === id2); // false (símbolos são sempre únicos!)
```

---

## Propriedades de Objetos e Não-Enumerabilidade

- Não Enumerabilidade: Propriedades com chave `Symbol` não aparecem em loops `for...in`, `Object.keys()` ou serializações...
- Acesso Direto e Reflexão: Para listar as chaves de símbolos de um objeto, utiliza-se `Object.getOwnPropertySymbols(obj)`...

---

## Símbolos como chaves privadas de objetos

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

// 4. Reflexão para obter chaves Symbol
const symbolKeys = Object.getOwnPropertySymbols(user);
console.log(symbolKeys); // [ Symbol(secret) ]
console.log(user[symbolKeys[0]]); // "token_super_secreto_123"
```

---

## Registro Global de Símbolos (`Symbol.for` e `Symbol.keyFor`)

- `Symbol.for(chave)`: Procura um símbolo no registro global com o nome fornecido. Se existir, ele é retornado; caso...
- `Symbol.keyFor(simbolo)`: Recebe um símbolo registrado e retorna a string de sua chave global (ou `undefined` se for um...

---

## Registro Global de Símbolos

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

## Símbolos Conhecidos (*Well-Known Symbols*)

- O ECMAScript possui um conjunto de símbolos nativos pré-definidos expostos como propriedades da função `Symbol`
- Esses símbolos funcionam como ganchos de protocolo (*protocol hooks*) que permitem customizar como seus objetos...
- String.prototype | MDN

---

## Símbolos Conhecidos (*Well-Known Symbols*): Comparação

| Símbolo Nativo | Propósito / Aplicação |
| :--- | :--- |
| **`Symbol.iterator`** | Define o método de iteração padrão para loops `for...of` e espalhamento `...`. |
| **`Symbol.toPrimitive`** | Customiza a coerção de tipo quando o objeto é convertido para `string` ou `number`. |
| **`Symbol.toStringTag`** | Personaliza o rótulo retornado por `Object.prototype.toString.call(obj)`. |
| **`Symbol.hasInstance`** | Personaliza o resultado do operador `instanceof`. |

---

## Customizando objetos com Well-Known Symbols

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
 return "CustomLogger";
}
}
const logger = new CustomLogger();
console.log(Object.prototype.toString.call(logger)); // "[object CustomLogger]"
```

---

## Resumo e Boas Práticas

- Lembre-se de que strings são imutáveis; métodos sempre retornam novas strings.
- Utilize `slice()` em vez do obsoleto `substr()`.
- Lembre-se de que `.length` mede unidades de código de 16 bits.
- Dê preferência a Template Literals (crases) para concatenar variáveis ou criar HTML multilinha.
- Sanitize dados de entrada de formulários usando `.trim()` e `.toLowerCase()`.

---

## Executando

- Crie um arquivo chamado `string-demo.js`:
- Execute o arquivo com Node.js no terminal:
- Modifique os valores e teste outros métodos de substituição e fatiamento no código.

---

## string-demo.js

```js
const rawName = "  luiz carlos chaves  ";
const cleanName = rawName.trim();

// Capitalizando as primeiras letras das palavras
const formattedName = cleanName
  .split(" ")
  .map((word) => word[0].toUpperCase() + word.slice(1))
  .join(" ");

console.log("Original:", `"${rawName}"`);
console.log("Sanitizado:", `"${cleanName}"`);
console.log("Formatado:", formattedName);
```

---

## Terminal

```bash
node string-demo.js
```

---

## Output

```txt
Original: "  luiz carlos chaves  "
Sanitizado: "luiz carlos chaves"
Formatado: Luiz Carlos Chaves
```

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

## Criação, Imutabilidade e Concatenação

- O que significa dizer que as Strings em JavaScript são imutáveis
- Qual é a vantagem de utilizar Template Literals (crases) em relação às aspas tradicionais
- Por que a instrução `42.toString()` lança um erro de sintaxe (`SyntaxError`) e como podemos corrigi-la
- Como converter um número inteiro para sua representação em binário ou hexadecimal em JavaScript utilizando `.toString()`
- O que acontece ao tentar modificar um caractere de uma string usando colchetes (ex

---

## Métodos de Busca e Extração

- Qual é a diferença entre os métodos `.slice(start, end)` e `.substring(start, end)`
- Por que o método `.substr()` deve ser evitado em código JavaScript moderno
- Como o método `.split()` funciona e qual o tipo de dado do seu retorno
- Qual é a vantagem do método `codePointAt()` em relação ao método legado `charCodeAt()`

---

## Transformação e Boas Práticas

- Para que serve o método `.padStart(targetLength, padString)` e em que cenário ele é útil
- Qual é a diferença entre os métodos `.replace()` e `.replaceAll()`
- Por que é uma boa prática aplicar `.trim()` em dados recebidos de formulários de usuários
- Por que `typeof new String("teste")` retorna `"object"` e por que isso deve ser evitado
- Qual é a limitação dos operadores ` ` ao comparar strings e por que o método `.localeCompare()` deve ser utilizado

---

## Próxima aula

- Numbers, BigInt e Math
- Representação numérica, IEEE 754, BigInt, métodos de Number e objeto Math

---

## Resumo da Aula

- Revise criação e Literais de String
- Revise conversão para String
- Revise caracteres de Escape e Unicode
- Revise imutabilidade e Acesso por Índice
- Revise concatenação e Template Literals
- Revise métodos do Objeto String
- Revise o Tipo Primitivo Symbol
