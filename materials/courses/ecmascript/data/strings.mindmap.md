---
title: 'JavaScript: Strings e Template Literals'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Strings e Template Literals

## Ideia Central

- **Representação Textual**: sequência imutável de caracteres e código Unicode.
- **Ecossistema Funcional**: rica biblioteca de métodos em `String.prototype`.

## Criação e Conversão

- **Literais**: aspas simples (`'`), duplas (`"`) e template literals (`` ` ``).
- **Primitivo vs Objeto**: evite `new String()` para não criar instâncias de objeto desnecessárias.
- **Função `String(valor)`**: conversão universal segura (inclusive para `null` e `undefined`).
- **Método `.toString()`**:
  - Parênteses em literais: `(42).toString()` para evitar conflito com ponto decimal.
  - Bases numéricas: `(42).toString(radix)` (ex: base 2 para binário, base 16 para hex).

## Imutabilidade e Acesso

- **Imutabilidade**: nenhuma operação altera a string original na memória.
- **Acesso por Índice**: `str[0]`, propriedade `.length`, método `.at(-1)` com suporte a negativos.
- **Unicode e Emojis**: `.codePointAt()` e `String.fromCodePoint()` suportam 32 bits.
- **Caracteres de Escape**: `\n`, `\t`, `\\`, `\"`, `\'`, `\uXXXX`.

## Concatenação e Template Literals

- **Operador `+`**: concatenação simples com coerção automática.
- **Template Literals**: interpolação com `${expressão}` e suporte nativo a multilinhas.

## Métodos de Manipulação

- **Busca**: `includes()`, `startsWith()`, `endsWith()`, `indexOf()`, `lastIndexOf()`.
- **Fatiamento**: `slice(start, end)` (suporta negativos) e `split(separator)` (retorna Array).
- **Transformação**: `toUpperCase()`, `toLowerCase()`, `trim()`, `padStart()`, `padEnd()`, `repeat()`.
- **Substituição**: `replace()` (primeira ocorrência) e `replaceAll()` (todas as ocorrências).
- **Comparação por Idioma**: `localeCompare("pt-BR")` para ordenação alfabética com acentos.
- **Expressões Regulares**: suporte a regex em `search()`, `match()`, `matchAll()` e `replace()`.
- **Normalização**: `.normalize("NFD")` para padronização e remoção de acentos.

## O Tipo Primitivo Symbol

- **Identificador Único**: cada `Symbol()` possui referência exclusiva na memória.
- **Chaves Privadas**: não aparecem em `for...in`, `Object.keys()` ou `JSON.stringify()`.
- **Registro Global**: compartilhamento entre módulos com `Symbol.for()` e `Symbol.keyFor()`.
- **Well-Known Symbols**: protocolos da linguagem como `Symbol.iterator` e `Symbol.toPrimitive`.

## Boas Práticas

- **Prefira Template Literals** para montagem de mensagens e templates de texto.
- **Use `localeCompare()`** para ordenar arrays de strings respeitando regras gramaticais.
- **Evite `.substr()`**: padronize o uso de `.slice()`.
- **Sanitize dados de entrada** com `.trim()` e `.toLowerCase()`.
