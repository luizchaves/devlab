---
title: 'JavaScript: Strings'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Strings

## Ideia Central

- Sequência de caracteres para representar texto
- Primitivo imutável (métodos retornam novas strings)
- Delimitadores: `'aspas simples'`, `"aspas duplas"`, `` `template literals` ``
- Tipo interno: `typeof "texto" === "string"`

## Delimitadores e Template Literals

- **Aspas simples/duplas**: equivalentes em comportamento
- **Template Literals (Crase)**:
  - Interpolação de expressões: `${variável}`
  - Strings multilinhas sem `\n` ou `+`
- **Caracteres de escape (`\`)**:
  - `\'` (aspas simples), `\"` (aspas duplas)
  - `\n` (quebra de linha), `\t` (tabulação), `\\` (barra literal)

## Acesso a Caracteres

- **Notação de Colchetes `str[i]`**: retorna caractere ou `undefined`
- **Método `.charAt(i)`**: retorna caractere ou string vazia `""`
- **Método `.at(i)`**: aceita índices negativos (`.at(-1)` pega o último)
- **Propriedade `.length`**: contagem de unidades UTF-16

## Métodos de Busca e Inspeção

- **`.includes(sub)`**: verifica existência de subcadeia (boolean)
- **`.startsWith(sub)` / `.endsWith(sub)`**: checagem de início/fim (boolean)
- **`.indexOf(sub)` / `.lastIndexOf(sub)`**: retorna índice da primeira/última ocorrência (-1 se não encontrar)

## Métodos de Fatiamento e Extração

- **`.slice(start, end)`**: fatiamento flexível (aceita índices negativos)
- **`.substring(start, end)`**: fatiamento básico (trata negativos como `0`)

## Métodos de Transformação

- **Limpeza de Espaços**: `trim()`, `trimStart()`, `trimEnd()`
- **Caixa de Texto**: `toLowerCase()`, `toUpperCase()`
- **Preenchimento**: `padStart(size, char)`, `padEnd(size, char)`
- **Repetição**: `repeat(count)`
- **Substituição**: `replace(old, new)` (primeira ocorrência) e `replaceAll(old, new)` (todas)

## Conversão e Iteração com Arrays

- **`.split(separador)`**: converte string para Array
- **`.join(separador)`**: junta elementos de Array em String
- **Inversão de String**: `[...str].reverse().join("")`

## Emojis e Unicode (UTF-16)

- Emojis usam pares substitutos (*surrogate pairs*) ocupando `length: 2`
- Contagem real de caracteres visíveis: `Array.from(str).length` ou `[...str].length`
- Leitura de código Unicode: `codePointAt(i)`

## Boas Práticas

- Prefira Template Literals para concatenação e texto dinâmico
- Use `.slice()` em vez de `.substring()` pela consistência com índices negativos
- Lembre-se de que strings são imutáveis e sempre reatribua a variável ao modificar
- Utilize `[...str].length` para validar tamanho de campos com Emojis
