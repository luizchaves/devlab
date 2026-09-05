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
title: "JavaScript: Strings e Template Literals"
description: "Criação, imutabilidade, caracteres de escape, concatenação, template literals e principais métodos do objeto String em JavaScript."
---

<!-- _class: lead -->

# JavaScript: Strings e Template Literals

Delimitadores, imutabilidade, template literals, métodos do protótipo `String` e `Symbol`.

---

## Objetivo

Compreender o tipo de dado String, imutabilidade e manipulação avançada de texto em JavaScript.

- Declarar strings com **aspas simples**, **duplas** e **Template Literals (crases)**.
- Converter dados e bases numéricas com **`String()`** e **`.toString(radix)`**.
- Aplicar **caracteres de escape**, inspeção de **Unicode (`codePointAt`)** e **`normalize()`**.
- Dominar a **imutabilidade** e acesso com **`[i]`** e **`.at()`**.
- Utilizar métodos de busca (**`includes`**, **`indexOf`**), fatiamento (**`slice`**, **`split`**) e formatação (**`trim`**, **`padStart`**, **`replace`**).
- Comparar textos com regras de idioma usando **`localeCompare("pt-BR")`**.
- Aplicar o tipo primitivo **`Symbol`** como identificador exclusivo de propriedades.

---

## Mapa do Tópico

- Delimitadores e Primitivo vs Wrapper (`new String`)
- Conversão e Bases Numéricas (`radix`)
- Escape, Imutabilidade e Acesso por Índice
- Concatenação e Template Literals
- Métodos de Busca, Fatiamento e Transformação
- Comparação de Strings e `localeCompare`
- Métodos com Regex e Normalização Unicode
- O Tipo Primitivo `Symbol`
- Exercício, Desafio e Revisão

---

## Literais de String e Delimitadores

Sequências de caracteres imutáveis para representação textual em JavaScript:

| Delimitador | Nome | Uso Principal | Exemplo |
| :--- | :--- | :--- | :--- |
| `'...'` | Aspas Simples | Literal simples | `'DevLab'` |
| `"..."` | Aspas Duplas | Literal simples | `"JavaScript"` |
| `` `...` `` | Template Literal | Interpolação e multilinhas | `` `Olá, ${nome}` `` |

- **Padronização**: Adote aspas simples ou duplas de forma consistente no projeto.
- **Função Conversora**: `String(42)` converte qualquer tipo de dado para string primitiva.
- **Evite `new String()`**: Instancia um objeto *wrapper* na memória Heap (`typeof` retorna `"object"`).

---

## Primitivo vs Objeto String (Wrapper)

Instanciar com `new String()` quebra a comparação estrita (`===`):

```js
const prim = "DevLab";
const obj = new String("DevLab");

console.log(typeof prim); // "string"
console.log(typeof obj);  // "object"

// Comparação por igualdade estrita:
console.log(prim === obj); // false (tipos primitivo vs objeto)
console.log(prim == obj);  // true (coerção de tipo)

// Sempre prefira primitivos literais:
const safeText = "DevLab";
```

---

## Conversão para String

Conversão explícita com `String()` e método `.toString()`:

```js
// 1. Função conversora universal String() (segura para null e undefined)
console.log(String(42));        // "42"
console.log(String(true));      // "true"
console.log(String(null));      // "null"
console.log(String(undefined)); // "undefined"

// 2. Método .toString() em literais numéricos
// 42.toString(); // SyntaxError: Invalid or unexpected token
console.log((42).toString());   // "42" (envolvido em parênteses)
console.log(42..toString());    // "42" (dois pontos: decimal + método)

const count = 42;
console.log(count.toString());  // "42" (em variáveis funciona direto)
```

---

## Conversão de Bases Numéricas com Radix

O método `.toString(radix)` converte inteiros para bases numéricas entre 2 e 36:

```js
const number = 42;

// Base 2: Binário
console.log(number.toString(2));  // "101010"

// Base 8: Octal
console.log(number.toString(8));  // "52"

// Base 16: Hexadecimal
console.log((255).toString(16)); // "ff"
console.log((16).toString(16));  // "10"

// Base 36: Alfanumérico máximo (0-9 e a-z)
console.log((123456).toString(36)); // "2n9c"
```

---

## Caracteres de Escape

Barra invertida (`\`) para incluir caracteres especiais ou reservados:

| Sequência | Descrição | Exemplo | Saída |
| :--- | :--- | :--- | :--- |
| `\'` | Aspa simples literal | `'D\'água'` | `D'água` |
| `\"` | Aspa dupla literal | `"Disse: \"Olá!\""` | `Disse: "Olá!"` |
| `\\` | Barra invertida literal | `"C:\\Arquivos"` | `C:\Arquivos` |
| `\n` | Nova linha (*Line Feed*) | `"Linha 1\nLinha 2"` | Texto em 2 linhas |
| `\t` | Tabulação (*Tab*) | `"Item:\tValor"` | Espaçamento tab |
| `\uXXXX` | Unicode Hex (16-bit) | `"\u2661"` | `♡` |

---

## Uso Prático de Escape e Unicode

```js
const quote = "O professor disse: \"Pratiquem JavaScript!\"";
const path = "C:\\projetos\\devlab\\script.js";
const multiline = "Primeira linha\nSegunda linha";
const heart = "Eu \u2661 JavaScript!";

console.log(quote);
// "O professor disse: "Pratiquem JavaScript!""

console.log(path);
// "C:\projetos\devlab\script.js"

console.log(multiline);
// "Primeira linha"
// "Segunda linha"

console.log(heart);
// "Eu ♡ JavaScript!"
```

---

## Imutabilidade e Leitura por Índice

Strings são primitivos imutáveis: caracteres não podem ser alterados diretamente.

```js
const text = "JavaScript";

// Leitura por colchetes e propriedade length
console.log(text.length); // 10
console.log(text[0]);     // "J"
console.log(text[9]);     // "t"
console.log(text[10]);    // undefined (índice inexistente)

// Tentativa de mutação direta:
let lang = "JavaScript";
lang[0] = "Y";            // Silenciosamente ignorado (ou erro no strict mode)
console.log(lang);        // "JavaScript" (inalterado!)

// Produzindo uma nova string derivada:
lang = "Y" + lang.slice(1);
console.log(lang);        // "YavaScript"
```

---

## Estrutura de Indexação e Método `.at()`

```txt
Índice positivo [i] / .at(i):  0   1   2   3   4   5   6   7   8   9
Caractere:                    'J' 'a' 'v' 'a' 'S' 'c' 'r' 'i' 'p' 't'
Índice negativo .at(i):       -10  -9  -8  -7  -6  -5  -4  -3  -2  -1
```

```js
const text = "JavaScript";

console.log(text[0]);     // "J" (primeiro caractere)
console.log(text.at(0));  // "J"

// Índices negativos a partir do final com .at():
console.log(text.at(-1)); // "t" (último caractere)
console.log(text.at(-2)); // "p" (penúltimo caractere)
console.log(text.slice(-4)); // "ript" (últimos 4 caracteres)
```

---

## Códigos Unicode: `codePointAt` e `fromCodePoint`

Prefira `codePointAt()` sobre `charCodeAt()`, pois ele suporta caracteres Unicode de 32-bit (como emojis) sem truncamento:

```js
const str = "123 JavaScript 😀";

// Obtendo o código numérico Unicode de '1' na posição 0:
console.log(str.codePointAt(0)); // 49 (ASCII/Unicode de '1')
console.log(str.codePointAt(4)); // 74 (Código de 'J')

// Emojis de 32 bits (consomem 2 unidades de código UTF-16):
const emojiPos = str.indexOf("😀");
console.log(str.codePointAt(emojiPos)); // 128512 (code point completo)

// Conversão inversa: de número Unicode para caractere String
console.log(String.fromCodePoint(49));     // "1"
console.log(String.fromCodePoint(65));     // "A"
console.log(String.fromCodePoint(128512)); // "😀"
```

---

## Concatenação Tradicional com `+`

O operador `+` realiza a junção de strings e coerção implícita:

```js
const firstName = "Luiz";
const lastName = "Chaves";

// Concatenação simples de strings:
const fullName = firstName + " " + lastName;
console.log(fullName); // "Luiz Chaves"

// Coerção automática de números quando há string na expressão:
console.log("Aula " + 5);      // "Aula 5"
console.log("Total: " + 10 + 20); // "Total: 1020" (avalia da esquerda para a direita)
console.log("Total: " + (10 + 20)); // "Total: 30" (parênteses priorizam a soma)
```

---

## Template Literals (Crases)

Permitem interpolação direta com `${expressão}` e blocos em múltiplas linhas:

```js
const user = "Alice";
const role = "Desenvolvedora";
const age = 28;

// 1. Interpolação de variáveis e expressões JavaScript
const greeting = `Usuário ${user} (${role}) terá ${age + 1} anos.`;
console.log(greeting);
// "Usuário Alice (Desenvolvedora) terá 29 anos."

// 2. HTML multilinha limpo sem necessidade de \n
const cardHtml = `
<div class="user-card">
  <h2>${user}</h2>
  <p>Cargo: ${role}</p>
</div>
`;
console.log(cardHtml);
// <div class="user-card">
//   <h2>Alice</h2>
//   <p>Cargo: Desenvolvedora</p>
// </div>
```

---

## Métodos do Objeto String

O protótipo `String` oferece métodos puros (não-mutadores) para:

- **Busca e Inspeção**: `.includes()`, `.startsWith()`, `.endsWith()`, `.indexOf()`, `.lastIndexOf()`.
- **Extração e Fatiamento**: `.slice()`, `.substring()`, `.split()`.
- **Transformação de Formato**: `.toUpperCase()`, `.toLowerCase()`, `.trim()`, `.padStart()`, `.padEnd()`, `.repeat()`.
- **Substituição**: `.replace()`, `.replaceAll()`.
- **Comparação Internacional**: `.localeCompare()`.
- **Expressões Regulares**: `.match()`, `.matchAll()`, `.search()`.
- **Normalização**: `.normalize()`.

---

## Métodos de Busca e Inspeção

| Método | Descrição | Retorno |
| :--- | :--- | :--- |
| `includes(search)` | Verifica se a string contém o trecho informado | `boolean` |
| `startsWith(search)` | Verifica se a string começa com o trecho | `boolean` |
| `endsWith(search)` | Verifica se a string termina com o trecho | `boolean` |
| `indexOf(search)` | Retorna a 1ª posição onde o trecho foi encontrado | Índice ou `-1` |
| `lastIndexOf(search)` | Retorna a última posição onde o trecho foi encontrado | Índice ou `-1` |

```js
const file = "relatorio-financeiro-2026.pdf";

console.log(file.includes("financeiro")); // true
console.log(file.startsWith("relatorio"));// true
console.log(file.endsWith(".pdf"));       // true
```

---

## Prática: Busca e Índices de Ocorrência

```js
const phrase = "A linguagem JavaScript é a linguagem da Web";

// Primeira ocorrência de "linguagem":
console.log(phrase.indexOf("linguagem"));     // 2

// Última ocorrência de "linguagem":
console.log(phrase.lastIndexOf("linguagem")); // 27

// Termo inexistente retorna sempre -1:
console.log(phrase.indexOf("Python"));        // -1

// Validação com indexOf vs includes:
if (phrase.includes("JavaScript")) {
  console.log("Contém JavaScript!"); // Executado
}
```

---

## Métodos de Extração e Fatiamento

| Método | Descrição | Retorno |
| :--- | :--- | :--- |
| `slice(start, end)` | Extrai do índice `start` até `end` (exclusivo). Aceita negativos. | Nova `string` |
| `substring(start, end)` | Extrai de `start` até `end`. Trata negativos como `0`. | Nova `string` |
| `split(separator)` | Divide o texto em um Array usando o delimitador informado | Novo `Array` |

- Prefira `.slice()` para suportar fatiamento com índices negativos a partir do final.
- Evite `.substr()`: o método foi marcado como obsoleto (*deprecated*) pela especificação.

---

## Prática: Extração com `slice` e `split`

```js
const email = "usuario@redes.ifpb.edu.br";
const atIndex = email.indexOf("@");

// Extraindo nome de usuário e domínio com slice:
const username = email.slice(0, atIndex);
const domain = email.slice(atIndex + 1);

console.log(username); // "usuario"
console.log(domain);   // "redes.ifpb.edu.br"

// Dividindo a string em um Array com split():
const parts = email.split("@");
console.log(parts); // [ "usuario", "redes.ifpb.edu.br" ]

const tags = "HTML,CSS,JavaScript,Node.js".split(",");
console.log(tags);  // [ "HTML", "CSS", "JavaScript", "Node.js" ]
```

---

## Métodos de Transformação e Ajustes

| Método | Descrição | Retorno |
| :--- | :--- | :--- |
| `toUpperCase()` / `toLowerCase()` | Converte para maiúsculas ou minúsculas | Nova `string` |
| `trim()` | Remove espaços do início e final | Nova `string` |
| `trimStart()` / `trimEnd()` | Remove espaços apenas de um lado | Nova `string` |
| `padStart(len, pad)` | Preenche o **início** até atingir o tamanho alvo | Nova `string` |
| `padEnd(len, pad)` | Preenche o **final** até atingir o tamanho alvo | Nova `string` |
| `repeat(count)` | Repete a string `count` vezes | Nova `string` |
| `replace(search, sub)` | Substitui a **primeira** ocorrência | Nova `string` |
| `replaceAll(search, sub)` | Substitui **todas** as ocorrências | Nova `string` |

---

## Prática: Transformação e Formatação

```js
// 1. Sanitização de entradas com trim e toLowerCase:
const rawInput = "  contato@EMPRESA.com  \n";
const cleanEmail = rawInput.trim().toLowerCase();
console.log(cleanEmail); // "contato@empresa.com"

// 2. Preenchimento de zeros à esquerda com padStart:
const code = "42";
console.log(code.padStart(6, "0")); // "000042"

// 3. Substituição de strings:
const text = "O gato subiu no telhado. O gato é esperto.";
console.log(text.replace("gato", "cão"));    // "O cão subiu... O gato..."
console.log(text.replaceAll("gato", "cão")); // "O cão subiu... O cão..."

// 4. Repetição de strings:
console.log("Dev! ".repeat(3)); // "Dev! Dev! Dev! "
```

---

## Comparação de Strings: Unicode vs Regras de Idioma

- **Operadores `<` e `>`**: Comparam estritamente pelos pontos de código Unicode.
  - Maiúsculas vêm antes de minúsculas: `"Mesa" < "cadeira"` (`true`, `'M'`=77 vs `'c'`=99).
  - Acentos ficam fora da ordem: `"á" > "b"` (`true`, `'á'`=225 vs `'b'`=98).
- **`localeCompare(target, locale, options)`**: Compara segundo as regras gramaticais do idioma.
  - Retorna **negativo** se a string vier antes, **positivo** se vier depois, e `0` se equivalentes.
  - Aceita `{ sensitivity: "base" }` para tratar acentos e maiúsculas como equivalentes.

```js
console.log("á" > "b");                       // true (incorreto gramaticalmente)
console.log("á".localeCompare("b", "pt-BR")); // -1 ("á" vem antes de "b" no Português)
```

---

## Prática: Ordenação com `localeCompare`

```js
const frutas = ["Maçã", "abacaxi", "Água", "banana"];

// 1. Ordenação padrão do sort() (usa Unicode - incorreta para acentos e maiúsculas):
console.log([...frutas].sort());
// ["Maçã", "abacaxi", "banana", "Água"]

// 2. Ordenação correta em Português usando localeCompare():
const frutasOrdenadas = [...frutas].sort((a, b) => a.localeCompare(b, "pt-BR"));
console.log(frutasOrdenadas);
// ["abacaxi", "Água", "banana", "Maçã"]

// 3. Ignorando distinção entre maiúsculas/minúsculas e acentos:
console.log("á".localeCompare("A", "pt-BR", { sensitivity: "base" })); // 0
```

---

## Métodos com Expressões Regulares (Regex)

| Método | Suporta Regex? | Descrição |
| :--- | :--- | :--- |
| `search(regex)` | Sim | Retorna o índice da 1ª correspondência ou `-1` |
| `match(regex)` | Sim | Extrai correspondências em Array |
| `matchAll(regex)` | Sim (`/g`) | Iterador com todas as correspondências e grupos de captura |
| `replace(regex, sub)` | Sim | Substitui o padrão pela string de substituição |
| `split(regex)` | Sim | Divide a string utilizando a regex como delimitador |

```js
const input = "Tags: js; web, react   node";
const tags = input.replace("Tags: ", "").split(/[\s,;]+/);
console.log(tags); // [ "js", "web", "react", "node" ]
```

---

## Prática: Métodos de String com Regex

```js
const input = "Contatos: ana@email.com, bob123@site.org e carla_2026@dev.io";

// 1. search(regex) - Localiza posição do primeiro dígito numérico
console.log(input.search(/\d+/)); // 28 (posição do '1' em bob123)

// 2. match(regex) - Extrai o primeiro e-mail encontrado
const first = input.match(/[\w.-]+@[\w.-]+\.\w+/);
console.log(first[0]); // "ana@email.com"

// 3. matchAll(regex) - Itera sobre todos os e-mails e grupos
const all = input.matchAll(/([\w.-]+)@([\w.-]+\.\w+)/g);
for (const m of all) {
  console.log(`${m[1]} -> ${m[2]}`);
}
// ana -> email.com
// bob123 -> site.org
// carla_2026 -> dev.io

// 4. replace(regex) - Oculta dígitos numéricos
console.log(input.replace(/\d+/g, "[OCULTO]"));
// "Contatos: ana@email.com, bob[OCULTO]@site.org e carla_[OCULTO]@dev.io"
```

---

## Normalização Unicode: `normalize()`

Um mesmo caractere acentuado pode ter 2 formas na memória:
1. **NFC (Composta)**: Ponto de código único (ex: `"é"` como `\u00E9`).
2. **NFD (Decomposta)**: Caractere base + modificador combinador (`"e"` + `\u0301`).

```js
const strNFC = "é";
const strNFD = "e\u0301";

console.log(strNFC === strNFD); // false (códigos binários diferentes)
console.log(strNFC.normalize("NFC") === strNFD.normalize("NFC")); // true

// Aplicação: Remoção infalível de acentos com NFD + Regex
function removeAcentos(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
console.log(removeAcentos("Atenção! Olá, programação!"));
// "Atencao! Ola, programacao!"
```

---

## O Tipo Primitivo `Symbol`

Introduzido no ES6, **`Symbol`** é um primitivo imutável que garante unicidade absoluta na memória:

```js
// Cada Symbol() é único, mesmo com descrições idênticas
const id1 = Symbol("id");
const id2 = Symbol("id");

console.log(typeof id1);  // "symbol"
console.log(id1 === id2); // false (sempre único!)

// Nunca use new com Symbol:
// new Symbol("id"); // TypeError: Symbol is not a constructor
```

*Propósito: Servir como chave de propriedade garantidamente única que nunca colide com chaves de strings.*

---

## Propriedades com Chave `Symbol`

Propriedades com chaves `Symbol` são não-enumeráveis em loops convencionais:

```js
const SECRET = Symbol("secretKey");

const user = {
  name: "Alice",
  [SECRET]: "token_super_secreto_123"
};

// 1. Não aparecem em Object.keys() nem em for...in:
console.log(Object.keys(user)); // [ "name" ]

// 2. Não saem no JSON.stringify():
console.log(JSON.stringify(user)); // '{"name":"Alice"}'

// 3. Acesso direto requer a referência do símbolo:
console.log(user[SECRET]); // "token_super_secreto_123"

// 4. Reflexão para listar chaves Symbol:
console.log(Object.getOwnPropertySymbols(user)); // [ Symbol(secretKey) ]
```

---

## Registro Global de Símbolos

Permite compartilhar o mesmo símbolo entre diferentes arquivos e módulos da aplicação:

```js
// 1. Symbol.for(key): Cria ou recupera o símbolo no registro global
const global1 = Symbol.for("app.userId");
const global2 = Symbol.for("app.userId");

console.log(global1 === global2); // true (mesma referência compartilhada)

// 2. Symbol.keyFor(sym): Retorna a chave do símbolo registrado
console.log(Symbol.keyFor(global1)); // "app.userId"

// Símbolos locais criados com Symbol() não possuem chave global:
const local = Symbol("app.userId");
console.log(Symbol.keyFor(local));   // undefined
```

---

## Símbolos Conhecidos (*Well-Known Symbols*)

Ganchos de protocolo nativos para customizar comportamentos do motor JS:

```js
const colecao = {
  itens: [10, 20, 30],

  // Customiza coerção de tipo com Symbol.toPrimitive:
  [Symbol.toPrimitive](hint) {
    if (hint === "number") return this.itens.length;
    if (hint === "string") return `Coleção com ${this.itens.length} itens`;
    return this.itens.join(",");
  }
};

console.log(Number(colecao)); // 3 (hint === "number")
console.log(String(colecao)); // "Coleção com 3 itens" (hint === "string")
console.log(`${colecao}`);    // "Coleção com 3 itens"
```

---

## Exercício: Sanitização e Análise de E-mail

Crie um script que receba `"   ALICE.SILVA@Gmail.com   "` e:

1. Remova espaços das bordas e converta todo o texto para letras minúsculas.
2. Extraia o nome de usuário (trecho antes do `@`) e o domínio (trecho após o `@`).
3. Verifique se o domínio do e-mail é `"gmail.com"`.
4. Imprima o e-mail limpo, usuário, domínio e o resultado booleano.

---

## Resolução do Exercício

```js
const userEmail = "   ALICE.SILVA@Gmail.com   ";

// 1. Sanitização de bordas e caixa de texto:
const cleanEmail = userEmail.trim().toLowerCase();

// 2. Extração de partes com slice e indexOf:
const atIndex = cleanEmail.indexOf("@");
const username = cleanEmail.slice(0, atIndex);
const domain = cleanEmail.slice(atIndex + 1);

// 3. Verificação com endsWith:
const isGmail = cleanEmail.endsWith("gmail.com");

console.log("E-mail limpo:", cleanEmail); // "alice.silva@gmail.com"
console.log("Usuário:", username);        // "alice.silva"
console.log("Domínio:", domain);          // "gmail.com"
console.log("É Gmail?", isGmail);         // true
```

---

## Desafio: Gerador de Slugs para URLs

Crie uma função `generateSlug(title)` que converta títulos em slugs de URL:

1. Remova espaços das bordas e converta para minúsculas.
2. Remova acentos combinando `.normalize("NFD")` e Regex.
3. Remova pontuações especiais (`!`, `?`, `,`, `:`, `&`).
4. Substitua espaços internos por hífen (`-`).
5. Teste com `"JavaScript: Estruturas de Dados & Arrays!"`.

---

## Resolução do Desafio

```js
function generateSlug(title) {
  return title
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replaceAll(":", "")
    .replaceAll("!", "")
    .replaceAll("?", "")
    .replaceAll("&", "e")
    .split(/\s+/)                    // Divide por espaços múltiplos
    .filter((w) => w.length > 0)
    .join("-");
}

console.log(generateSlug("JavaScript: Estruturas de Dados & Arrays!"));
// "javascript-estruturas-de-dados-e-arrays"

console.log(generateSlug("  A Importância da Web no Século 21?  "));
// "a-importancia-da-web-no-seculo-21"
```

---

## Perguntas de Revisão

- Por que dizemos que strings são imutáveis em JavaScript?
- Qual a vantagem de *Template Literals* sobre a concatenação com `+`?
- Por que `(42).toString()` requer parênteses ou dois pontos?
- Qual a diferença prática entre `.slice()` e `.substring()`?
- Para que serve o método `.padStart()`?
- Qual a diferença entre `replace()` e `replaceAll()`?
- Por que devemos usar `localeCompare()` em vez de `<` ou `>` para ordenar português?
- O que é o tipo primitivo `Symbol` e por que suas propriedades não saem no JSON?

---

## Resumo do Tópico

- **Delimitadores**: aspas para literais simples; crases (`` ` ``) para interpolação e multilinhas.
- **Imutabilidade**: métodos nunca alteram o texto original, sempre geram novas strings.
- **Conversão e Bases**: `String()`, `(num).toString()` e conversões binárias/hex com `radix`.
- **Busca e Fatiamento**: `includes`, `indexOf`, `slice` e `split`.
- **Formatação**: `trim`, `padStart`, `padEnd` e `replaceAll`.
- **Internacionalização**: `localeCompare("pt-BR")` para ordenação e `normalize()` para acentos.
- **Identificadores Únicos**: `Symbol` para propriedades privadas não colidentes.
