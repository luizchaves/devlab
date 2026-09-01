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
    padding-bottom: 0;
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

Delimitadores, imutabilidade, template literals, métodos do objeto `String` e `Symbol`.

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

## Mapa da Aula

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

Sequências de caracteres imutáveis para representação textual:

| Delimitador | Nome | Uso Principal | Exemplo |
| :--- | :--- | :--- | :--- |
| `'...'` | Aspas Simples | Literal simples | `'DevLab'` |
| `"..."` | Aspas Duplas | Literal simples | `"JavaScript"` |
| `` `...` `` | Template Literal | Interpolação e multilinhas | `` `Olá, ${nome}` `` |

- Evite `new String()`: instancia um objeto *wrapper* na Heap, fazendo `typeof new String()` retornar `"object"`.

---

## Conversão para String e Bases Numéricas

```js
// 1. Função conversora universal String()
console.log(String(42));        // "42"
console.log(String(null));      // "null"
console.log(String(undefined)); // "undefined"

// 2. Método .toString() em literais numéricos (use parênteses ou dois pontos)
console.log((42).toString());   // "42"
console.log(42..toString());   // "42"

// 3. Conversão de bases numéricas com radix (base 2 a 36):
console.log((42).toString(2));   // "101010" (Binário - base 2)
console.log((42).toString(8));   // "52"     (Octal - base 8)
console.log((255).toString(16)); // "ff"     (Hexadecimal - base 16)
```

---

## Caracteres de Escape e Unicode

Utilize a barra invertida (`\`) para escapar caracteres reservados ou de controle:

| Sequência | Descrição | Exemplo |
| :--- | :--- | :--- |
| `\'` e `\"` | Aspa simples e dupla literais | `"Disse: \"Olá!\""` |
| `\\` | Barra invertida literal | `"C:\\projetos\\app"` |
| `\n` e `\t` | Quebra de linha e Tabulação | `"Linha 1\nLinha 2"` |
| `\uXXXX` | Ponto de código Unicode 16-bit | `"\u2661"` // `"♡"` |

```js
const quote = "O autor disse: \"Pratiquem código!\"";
const heart = "Eu \u2661 JavaScript!";
console.log(quote); // "O autor disse: "Pratiquem código!""
console.log(heart); // "Eu ♡ JavaScript!"
```

---

## Imutabilidade e Acesso por Índice

Strings são primitivos imutáveis: caracteres não podem ser alterados diretamente.

```js
const text = "JavaScript";

// Leitura por colchetes e length
console.log(text.length); // 10
console.log(text[0]);     // "J"
console.log(text[9]);     // "t"

// Método .at() (suporta índices negativos a partir do fim):
console.log(text.at(-1)); // "t" (último)
console.log(text.at(-2)); // "p" (penúltimo)

// Tentativa de mutação:
let lang = "JavaScript";
lang[0] = "Y";          // Silenciosamente ignorado
console.log(lang);      // "JavaScript"
```

---

## Códigos Unicode: `codePointAt` e `fromCodePoint`

Prefira `codePointAt()` sobre `charCodeAt()`, pois ele suporta caracteres Unicode de 32-bit (como emojis) sem truncamento:

```js
const str = "A 😀";

// Posição 0: 'A' -> código 65
console.log(str.codePointAt(0)); // 65

// Posição 2: Emoji 😀 -> código 128512 (32-bit)
console.log(str.codePointAt(2)); // 128512

// Conversão inversa (número -> caractere):
console.log(String.fromCodePoint(65));     // "A"
console.log(String.fromCodePoint(128512)); // "😀"
```

---

## Template Literals (Crases)

Permitem interpolação direta com `${expressão}` e textos em múltiplas linhas:

```js
const user = "Alice";
const role = "Dev";
const age = 28;

// 1. Interpolação de variáveis e expressões
const greeting = `Usuário ${user} (${role}) terá ${age + 1} anos.`;
console.log(greeting);
// "Usuário Alice (Dev) terá 29 anos."

// 2. HTML multilinha nativo sem \n
const card = `
<div class="card">
  <h2>${user}</h2>
</div>`;
console.log(card.trim());
```

---

## Métodos de Busca e Inspeção

```js
const filename = "relatorio-financeiro-2026.pdf";

// 1. includes(): checagem de substring
console.log(filename.includes("financeiro")); // true

// 2. startsWith() e endsWith(): checagens de borda
console.log(filename.startsWith("relatorio")); // true
console.log(filename.endsWith(".pdf"));        // true

// 3. indexOf() e lastIndexOf(): posições de caracteres
const phrase = "A linguagem JS é a linguagem Web";
console.log(phrase.indexOf("linguagem"));     // 2 (primeira ocorrência)
console.log(phrase.lastIndexOf("linguagem")); // 19 (última ocorrência)
console.log(phrase.indexOf("Python"));        // -1 (não encontrado)
```

---

## Extração: `slice` vs `split`

- **`.slice(start, end)`**: extrai trecho de texto (aceita índices negativos).
- **`.split(separator)`**: divide o texto e retorna um **`Array`**.

```js
const email = "usuario@redes.ifpb.edu.br";
const atIndex = email.indexOf("@");

// Extração com slice():
const username = email.slice(0, atIndex);
const domain = email.slice(atIndex + 1);
console.log(username); // "usuario"
console.log(domain);   // "redes.ifpb.edu.br"

// Divisão em Array com split():
const parts = email.split("@");
console.log(parts); // [ 'usuario', 'redes.ifpb.edu.br' ]
```

- Nota: Evite o método obsoleto `.substr()`.

---

## Transformação e Ajustes de Formato

```js
// 1. Limpeza de espaços e caixa de texto:
const raw = "   contato@DEVLAB.org  \n";
const clean = raw.trim().toLowerCase();
console.log(clean); // "contato@devlab.org"

// 2. Preenchimento de borda com padStart / padEnd:
const code = "42";
console.log(code.padStart(5, "0")); // "00042"
console.log(code.padEnd(5, "."));   // "42..."

// 3. Repetição de strings:
console.log("DevLab! ".repeat(3)); // "DevLab! DevLab! DevLab! "
```

---

## Substituição: `replace` vs `replaceAll`

- **`.replace()`**: substitui apenas a **primeira** ocorrência encontrada.
- **`.replaceAll()`**: substitui **todas** as ocorrências do termo.

```js
const text = "O gato subiu no telhado. O gato miou.";

// Substitui apenas o primeiro:
console.log(text.replace("gato", "cachorro"));
// "O cachorro subiu no telhado. O gato miou."

// Substitui todos:
console.log(text.replaceAll("gato", "cachorro"));
// "O cachorro subiu no telhado. O cachorro miou."
```

---

## Comparação: Unicode vs `localeCompare`

Operadores `<` e `>` comparam códigos Unicode (maiúsculas antes de minúsculas e acentos desordenados). Para ordem gramatical correta, use **`localeCompare()`**:

```js
// 1. Comparação Unicode tradicional (gera distorções alfabéticas):
console.log("Mesa" < "cadeira"); // true ('M'=77 < 'c'=99)
console.log("á" > "b");          // true (á=225 > b=98)

// 2. Comparação correta com localeCompare("pt-BR"):
console.log("á".localeCompare("b", "pt-BR")); // -1 ("á" vem antes de "b")
console.log("b".localeCompare("á", "pt-BR")); // 1

// 3. Ordenação com sort():
const frutas = ["Maçã", "abacaxi", "Água", "banana"];
const ordenadas = [...frutas].sort((a, b) => a.localeCompare(b, "pt-BR"));
console.log(ordenadas); // [ 'abacaxi', 'Água', 'banana', 'Maçã' ]
```

---

## Métodos de String com Regex

```js
const input = "Contatos: ana@email.com, bob123@site.org";

// 1. search(regex): busca índice do primeiro número
console.log(input.search(/\d+/)); // 31

// 2. match(regex): extrai primeiro casamento
const first = input.match(/[\w.-]+@[\w.-]+\.\w+/);
console.log(first[0]); // "ana@email.com"

// 3. replace(regex): substitui padrões
const masked = input.replace(/\d+/g, "[NUM]");
console.log(masked); // "Contatos: ana@email.com, bob[NUM]@site.org"

// 4. split(regex): divide por múltiplos separadores
console.log("html, css; js  node".split(/[\s,;]+/));
// [ 'html', 'css', 'js', 'node' ]
```

---

## Normalização Unicode com `normalize`

Padroniza caracteres combinados (`NFC` / `NFD`) e permite remover acentos:

```js
const str1 = "é";       // "\u00E9" (composto NFC)
const str2 = "e\u0301"; // "e" + acento (decomposto NFD)

console.log(str1 === str2); // false (códigos diferentes na memória)
console.log(str1.normalize() === str2.normalize()); // true

// Função clássica para remoção limpa de acentos:
function removeAccents(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

console.log(removeAccents("Atenção! Olá, programação!"));
// "Atencao! Ola, programacao!"
```

---

## O Tipo Primitivo `Symbol`

Tipo primitivo que garante **identificador exclusivo** único na memória:

```js
const id1 = Symbol("id");
const id2 = Symbol("id");

console.log(typeof id1);  // "symbol"
console.log(id1 === id2); // false (símbolos são SEMPRE únicos!)
```

- **Propriedades Ocultas**: Chaves `Symbol` não aparecem em `for...in`, `Object.keys()` ou `JSON.stringify()`.

```js
const SECRET = Symbol("secret");
const user = { name: "Alice", [SECRET]: "12345" };

console.log(Object.keys(user)); // [ 'name' ]
console.log(user[SECRET]);      // "12345"
```

---

## Exercício Prático: Sanitização de E-mail

1. Declare `userEmail = "   ALICE.SILVA@Gmail.com   "`.
2. Remova espaços das bordas e converta para minúsculas com `.trim().toLowerCase()`.
3. Extraia o nome de usuário e o domínio com `indexOf("@")` e `slice()`.
4. Verifique se o domínio termina com `"gmail.com"`.

---

## Solução do Exercício

```js
const userEmail = "   ALICE.SILVA@Gmail.com   ";

// 2. Sanitização
const cleanEmail = userEmail.trim().toLowerCase();

// 3. Extração de partes
const atIndex = cleanEmail.indexOf("@");
const username = cleanEmail.slice(0, atIndex);
const domain = cleanEmail.slice(atIndex + 1);

// 4. Verificação
const isGmail = cleanEmail.endsWith("gmail.com");

console.log(cleanEmail); // "alice.silva@gmail.com"
console.log(username);   // "alice.silva"
console.log(domain);     // "gmail.com"
console.log(isGmail);    // true
```

---

## Desafio: Gerador de Slugs de URL

Crie a função `generateSlug(title)`:

1. Remova espaços das bordas e converta para minúsculas.
2. Remova acentos combinando `.normalize("NFD")` e Regex.
3. Remova pontuações (`:`, `!`, `?`) e substitua espaços por hífen `-`.

```js
function generateSlug(title) {
  return title
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[:!?&]/g, "")
    .split(/\s+/)
    .join("-");
}

console.log(generateSlug("JavaScript: Estruturas de Dados!"));
// "javascript-estruturas-de-dados"
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

## Resumo da Aula

- **Delimitadores**: aspas para literais simples; crases (`` ` ``) para interpolação e multilinhas.
- **Imutabilidade**: métodos nunca alteram o texto original, sempre geram novas strings.
- **Conversão e Bases**: `String()`, `(num).toString()` e conversões binárias/hex com `radix`.
- **Busca e Fatiamento**: `includes`, `indexOf`, `slice` e `split`.
- **Formatação**: `trim`, `padStart`, `padEnd` e `replaceAll`.
- **Internacionalização**: `localeCompare("pt-BR")` para ordenação e `normalize()` para acentos.
- **Identificadores Únicos**: `Symbol` para propriedades privadas não colidentes.
