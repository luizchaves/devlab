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
description: "Manipulação de textos, codificação UTF-16, template literals, tagged templates e principais métodos do protótipo String."
---

<!-- _class: lead -->

# JavaScript: Strings e Template Literals

Manipulação de textos, imutabilidade, codificação UTF-16, Template Literals, Tagged Templates e protótipo String.

---

## Objetivos da Aula

- **Imutabilidade**: Entender que Strings são primitivos imutáveis em JavaScript.
- **Template Literals**: Aplicar interpolação, multilinhas e Tagged Templates.
- **Métodos de Busca**: Dominar `includes()`, `startsWith()`, `endsWith()` e `indexOf()`.
- **Manipulação**: Utilizar `slice()`, `split()`, `replace()`, `replaceAll()`, `padStart()` e `padEnd()`.

---

## Imutabilidade de Strings

Em JavaScript, Strings são **primitivos imutáveis**. Qualquer método de String **não altera a string original**, mas sim **retorna uma nova String**:

```javascript
let text = "javascript";

// Tentar alterar um caractere por índice não surte efeito:
text[0] = "J";
console.log(text); // "javascript" (inalterado!)

// Métodos sempre retornam um novo valor:
const upperText = text.toUpperCase();
console.log(upperText); // "JAVASCRIPT"
console.log(text);      // "javascript"
```

---

## Template Literals (ES6)

Declaradas com crases (`` ` ``), resolvem os problemas de concatenação e quebra de linha:

### 1. Interpolação de Expressões
```javascript
const product = "Teclado";
const price = 150;
console.log(`O ${product} custa R$ ${price * 1.1}`);
```

### 2. Strings Multilinhas
```javascript
const html = `
  <div class="card">
    <h2>${product}</h2>
  </div>
`;
```

---

## Tagged Template Literals

Permite pré-processar Template Literals através de uma função customizada:

```javascript
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const val = values[i - 1];
    return result + `<mark>${val}</mark>` + str;
  });
}

const user = "Maria";
const role = "Admin";
const output = highlight`Usuário ${user} tem papel ${role}.`;

console.log(output);
// "Usuário <mark>Maria</mark> tem papel <mark>Admin</mark>."
```

---

## Principais Métodos de Busca

```javascript
const text = "DevLab - Portal de Cursos de Programação";

// 1. Verificações booleanas:
console.log(text.includes("Portal"));  // true
console.log(text.startsWith("DevLab"));// true
console.log(text.endsWith("ação"));   // true

// 2. Localização de posição:
console.log(text.indexOf("Cursos"));   // 19 (posição inicial)
console.log(text.indexOf("Python"));   // -1 (não encontrado)
```

---

## Métodos de Extração e Transformação

```javascript
const item = "  PROD-10293-AZUL  ";

// 1. Remoção de espaços extras:
const clean = item.trim(); // "PROD-10293-AZUL"

// 2. Divisão em Array (split):
const parts = clean.split("-"); // ["PROD", "10293", "AZUL"]

// 3. Fatiamento (slice):
const code = clean.slice(5, 10); // "10293"

// 4. Substituição (replace / replaceAll):
const fixed = clean.replaceAll("-", " | "); // "PROD | 10293 | AZUL"
```

---

## Preenchimento (Padding) e Unicode

### 1. Preenchimento de Strings (`padStart` / `padEnd`)
Útil para formatar números de conta, códigos ou datas com zeros à esquerda:
```javascript
const id = "42";
console.log(id.padStart(5, "0")); // "00042"
console.log(id.padEnd(6, "."));   // "42...."
```

### 2. Unicode e Emojis
```javascript
const emoji = "🚀";
console.log(emoji.length); // 2 (Emojis utilizam pares substitutos no UTF-16!)
console.log([...emoji].length); // 1 (Spread converte em pontos de código Unicode!)
```

---

## Resumo & Revisão

- Strings em JS são **imutáveis**; métodos sempre retornam novas instâncias.
- **Template Literals** (crases) suportam interpolação `${}` e multilinhas.
- Prefira `includes()`, `startsWith()` e `endsWith()` ao antigo `indexOf() !== -1`.
- Use `slice()` para fatiar strings e `split()` para converter em Arrays.

---

## Referências & Links Úteis

- **MDN**: [String - Referência do Protótipo](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/String)
- **MDN**: [Template Literals](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Template_literals)
