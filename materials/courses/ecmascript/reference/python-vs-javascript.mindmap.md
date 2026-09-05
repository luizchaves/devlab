---
title: "JavaScript: Comparativo com Python"
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript vs Python

## Panorama e Execução

- **Origem e Ambientes**:
  - Python: script de SO, terminal, ciência de dados, backend (`CPython`).
  - JavaScript: navegador web, front-end interativo, servidores (`Node.js`/`V8`).
- **Arquitetura de Execução**:
  - Python: Parser + AST -> Bytecode (.pyc) -> PVM (máquina virtual em C).
  - JavaScript: Parser + AST -> Bytecode em memória (Ignition) -> JIT nativo (TurboFan).
- **Sintaxe e Blocos**:
  - Python: indentação obrigatória e quebra de linha.
  - JavaScript: chaves `{ ... }` e ponto e vírgula opcional.

## Sistema de Tipos e Coerção

- **Tipagem Dinâmica**: ambas resolvem tipos em runtime.
- **Tipagem Forte (Python)**: sem coerções perigosas (`str + int` lança `TypeError`).
- **Tipagem Flexível (JS)**: coerções implícitas (`"5" + 2 = "52"`).
- **Armadilha Truthy / Falsy**:
  - Python: coleções vazias `[]`, `{}` são **falsy** (`False`).
  - JavaScript: coleções vazias `[]`, `{}` são **truthy** (`true`).
- **Comparadores**:
  - Python: `==` (valor), `is` (identidade na memória).
  - JavaScript: `===` (estrito sem coerção), `==` (frouxo - evitar).

## Coleções e Estruturas

- **Strings (Imutáveis)**:
  - Python: `len(s)`, `s.strip()`, `s.lower()`, `", ".join(arr)`.
  - JavaScript: `s.length`, `s.trim()`, `s.toLowerCase()`, `arr.join(", ")`.
- **Listas e Sequências**:
  - Python `list`: `append()`, `pop()`, índices negativos (`items[-1]`), *list comprehensions*.
  - JavaScript `Array`: `push()`, `pop()`, `.at(-1)` (ES2022), `filter()`, `map()`, `reduce()`, `toSorted()`.
- **Dicionários e Mapas**:
  - Python `dict`: `{"k": v}`, `d.keys()`, `d.get()`.
  - JavaScript `Object`: registros com campos conhecidos `{ k: v }`.
  - JavaScript `Map`: chaves de qualquer tipo, dinâmico (`map.set()`, `map.get()`).
- **Conjuntos**:
  - Python `set`: `add()`, operadores de conjunto (`|`, `&`).
  - JavaScript `Set`: `add()`, `has()`, `delete()`.

## Funções, Classes e Módulos

- **Funções**:
  - Python: `def`, `*args`, `**kwargs`, `lambda`.
  - JavaScript: `function`, `...rest`, *Arrow Functions* `() => {}`.
- **Orientação a Objetos**:
  - Python: `class`, `__init__(self)`, `self` explícito nos métodos.
  - JavaScript: `class`, `constructor()`, `this` implícito no contexto.
- **Módulos e Pacotes**:
  - Python: `import`, `from ... import`, `pip`/`uv`, `pyproject.toml`.
  - JavaScript: `import`, `export`, `pnpm`/`npm`, `package.json`.

## Assincronismo

- **Python**: síncrono clássico; assíncrono com `async def`, `await` e `asyncio.run()`.
- **JavaScript**: assíncrono por natureza via *Event Loop*, Promises e `async/await`.
