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
title: "JavaScript vs Python: Comparativo Prático"
description: "Comparativo entre JavaScript e Python: diferenças de execução, escopo, sintaxe, estruturas de dados e assincronismo."
---

<!-- _class: lead -->

# JavaScript vs Python: Comparativo Prático

Mapeamento de conceitos, diferenças de sintaxe, tipos, coleções, escopo, orientação a objetos e modelo assíncrono.

---

## Objetivos da Aula

- **Ambiente**: Comparar o runtime do V8 (Node/Browser) com o interpretador CPython.
- **Sintaxe**: Contrastar a sintaxe baseada em chaves `{}` do JS com a indentação do Python.
- **Coleções**: Mapear equivalências entre Arrays/Listas, Objetos/Dicionários e Maps/Sets.
- **Assincronismo**: Comparar Event Loop (Promises/Async-Await) com o modelo `asyncio` do Python.

---

## Comparativo Geral de Características

| Recurso | JavaScript (Node.js / V8) | Python (CPython) |
| :--- | :--- | :--- |
| **Blocos de Código** | Chaves `{}` e ponto e vírgula opcional | Indentação obrigatória (espaços) |
| **Variáveis** | `const`, `let`, `var` (Léxico / Bloco) | Atribuição direta (Escopo de função/global) |
| **Execução** | JIT Compiler (V8 / TurboFan) | Interpretado via Bytecode |
| **Threads** | Single-thread assíncrono com Event Loop | Single-thread com GIL (Global Interpreter Lock) |
| **Tipagem** | Dinâmica e Fraca (Coerção implícita) | Dinâmica e Forte (Sem coerção implícita) |

---

## Mapeamento de Tipos e Coleções

```javascript
// JavaScript
const name = "DevLab";           // String
const list = [1, 2, 3];          // Array
const dict = { a: 1, b: 2 };     // Object literal
const set  = new Set([1, 2]);    // Set
```

```python
# Python equivalente
name = "DevLab"                  # str
list_data = [1, 2, 3]            # list
dict_data = {"a": 1, "b": 2}     # dict
set_data  = {1, 2}               # set
```

- **Notação**: Em JS usa-se camelCase (`fetchUserData`), em Python snake_case (`fetch_user_data`).

---

## Funções e Closures

### JavaScript (Arrow Functions e First-Class Functions)
```javascript
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(n => n * 2);
```

### Python Equivalente (List Comprehensions & Lambdas)
```python
numbers = [1, 2, 3, 4]
doubled = [n * 2 for n in numbers] # List Comprehension idiomática
# ou: doubled = list(map(lambda n: n * 2, numbers))
```

---

## Assincronismo: JS Event Loop vs Python `asyncio`

```javascript
// JavaScript (Nativo com Promises)
async function fetchData() {
  const res = await fetch("https://api.devlab.org");
  const data = await res.json();
  return data;
}
```

```python
# Python (Requer módulo asyncio e httpx/aiohttp)
import asyncio
import httpx

async def fetch_data():
    async with httpx.AsyncClient() as client:
        res = await client.get("https://api.devlab.org")
        return res.json()
```

---

## Resumo & Revisão

- JS exige atenção a coerções implícitas; Python lança `TypeError` em operações incompatíveis.
- Arrays do JS equivalem às `lists` do Python; Objetos do JS lembram os `dicts` do Python.
- Ambas são linguagens multiparadigma e dominam a programação moderna (Web vs Dados).

---

## Referências & Links Úteis

- **MDN**: [JavaScript vs Python](https://developer.mozilla.org/)
- **Python Docs**: [Documentação Oficial do Python](https://docs.python.org/3/)
