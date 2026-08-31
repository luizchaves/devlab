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
title: "JavaScript: Expressões Regulares (RegExp)"
description: "Sintaxe de Regex, flags, grupos de captura, quantificadores, métodos de busca e validação de padrões."
---

<!-- _class: lead -->

# JavaScript: Expressões Regulares (RegExp)

Sintaxe de Regex, metacaracteres, flags (`g`, `i`, `m`, `u`), grupos de captura nomeados e métodos de busca/substituição.

---

## Objetivos da Aula

- **Sintaxe**: Construir expressões regulares literais e com o construtor `RegExp`.
- **Metacaracteres**: Dominar classes de caracteres, ancoragens e quantificadores.
- **Grupos**: Aplicar grupos de captura nomeados (`(?<name>...)`) e não-capturantes.
- **Métodos**: Utilizar `test()`, `exec()`, `match()`, `matchAll()` e `replace()`.

---

## Criação e Flags de RegExp

### 1. Literal de RegExp (Estático) vs Construtor `RegExp` (Dinâmico)
```javascript
const staticRegex = /devlab/gi; // Literal entre barras
const dynamicRegex = new RegExp("devlab", "gi"); // Construtor
```

### 2. Flags Principais
- `g` (**Global**): Busca todas as ocorrências, não apenas a primeira.
- `i` (**Case-insensitive**): Ignora diferenças entre maiúsculas e minúsculas.
- `m` (**Multiline**): Ancoragens `^` e `$` funcionam no início/fim de cada linha.
- `u` / `v` (**Unicode**): Suporte correto a caracteres UTF-16/Emojis.

---

## Classes e Metacaracteres

| Metacaractere | Significado | Exemplo de Correspondência |
| :--- | :--- | :--- |
| `\d` | Qualquer dígito numérico `[0-9]` | `"1"`, `"9"` |
| `\w` | Caractere alfanumérico `[a-zA-Z0-9_]` | `"a"`, `"Z"`, `"5"`, `"_"` |
| `\s` | Espaço em branco, tab ou quebra de linha | `" "`, `"\t"`, `"\n"` |
| `.` | Qualquer caractere (exceto quebra de linha) | `"x"`, `"9"`, `"%"` |
| `^` e `$` | Início e Fim da string | `^http` / `png$` |

---

## Quantificadores

Determinam a quantidade de vezes que o caractere ou grupo anterior deve aparecer:

- `*`: 0 ou mais vezes (ex: `/a*/`)
- `+`: 1 ou mais vezes (ex: `/\d+/` — um ou mais números)
- `?`: 0 ou 1 vez (opcional) (ex: `/https?/` — aceita `http` e `https`)
- `{n}`: Exatamente $n$ vezes (ex: `/\d{4}/` — 4 dígitos)
- `{n,m}`: Entre $n$ e $m$ vezes (ex: `/\d{2,4}/`)

```javascript
// Validação de formato de data DD/MM/AAAA:
const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
console.log(dateRegex.test("25/12/2026")); // true
```

---

## Grupos de Captura Nomeados (Named Groups)

Permite extrair partes da correspondência associando nomes aos grupos com `(?<name>...)`:

```javascript
const logPattern = /^(?<date>\d{4}-\d{2}-\d{2}) \[(?<level>ERROR|INFO)\] (?<msg>.+)$/;
const logLine = "2026-08-30 [ERROR] Conexão recusada";

const match = logPattern.exec(logLine);
console.log(match.groups.date);  // "2026-08-30"
console.log(match.groups.level); // "ERROR"
console.log(match.groups.msg);   // "Conexão recusada"
```

---

## Métodos de Busca e Substituição

### 1. `test()` e `exec()` no Protótipo RegExp
```javascript
const regex = /code/i;
console.log(regex.test("Clean Code")); // true
```

### 2. `replace()` com Grupos na String
```javascript
const phone = "55-83-999998888";
// Reorganiza o formato do telefone:
const formatted = phone.replace(/^(\d{2})-(\d{2})-(\d+)$/, "+$1 ($2) $3");
console.log(formatted); // "+55 (83) 999998888"
```

---

## Resumo & Revisão

- Use **`test()`** quando precisar apenas de um resultado booleano (`true`/`false`).
- Use **`exec()`** ou **`matchAll()`** quando precisar extrair dados e grupos de captura.
- **Grupos Nomeados** (`(?<nome>...)`) deixam a extração de dados muito mais legível.
- Teste e valide suas regex em ferramentas visuais como **RegExr** ou **Regex101**.

---

## Referências & Links Úteis

- **MDN**: [Expressões Regulares](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Regular_Expressions)
- **MDN**: [RegExp - Protótipo](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- **Ferramenta**: [RegExr - Learn, Build & Test](https://regexr.com/)
