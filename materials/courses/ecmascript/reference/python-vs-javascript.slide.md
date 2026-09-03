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
    position: absolute;
    bottom: 24px;
    right: 32px;
    padding: 0;
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "JavaScript: Comparativo com Python"
description: "Comparativo prático entre JavaScript e Python: execução, sintaxe, tipos, coleções, tuplas, funções, módulos, classes, assincronismo e APIs equivalentes."
---

<!-- _class: lead -->

# JavaScript: Comparativo com Python

Tradução conceitual, estruturas equivalentes, armadilhas e boas práticas.

---

## Objetivo

Comparar JavaScript e Python em modelo de execução, sintaxe, tipagem, coleções, orientação a objetos e assincronismo.

- Identificar os contextos de criação e execução de cada linguagem.
- Reconhecer diferenças de blocos (indentação vs chaves `{}`).
- Evitar armadilhas de tipagem, coerção e valores falsy (`[]`, `{}`).
- Traduzir APIs de strings, listas/arrays, tuplas, dicionários/mapas e conjuntos.
- Compreender diferenças fundamentais em funções, classes (`self` vs `this`) e módulos.
- Entender o modelo assíncrono básico de cada ambiente.

---

## Mapa do Tópico

- Panorama Geral e Ambientes de Execução
- Sintaxe, Blocos e Operadores
- A Armadilha dos Valores Falsy e Truthy
- Tipos, Coerções e Comparadores de Igualdade
- Coleções: Strings, Listas vs Arrays, Tuplas
- Coleções: Dicionários vs Objetos e Maps, Conjuntos
- Funções, Parâmetros e Escopo
- Classes e Orientação a Objetos (`self` vs `this`)
- Módulos, Ecossistema e Assincronismo
- Exercício, Desafio e Revisão

---

## Panorama Geral: Comparativo Estrutural

| Aspecto | Python | JavaScript |
| :--- | :--- | :--- |
| **Origem** | Propósito geral no SO (1991) | Scripting no navegador web (1995) |
| **Ambientes** | Terminal, servidores, dados e IA | Navegador (web) e Node.js/Bun |
| **Blocos** | Indentação obrigatória | Chaves `{ ... }` |
| **Instrução** | Quebra de linha | Ponto e vírgula `;` (opcional) |
| **Tipagem** | Dinâmica e forte | Dinâmica e flexível (com coerções) |
| **Pacotes** | PyPI (`pip`, `uv`) | npm registry (`pnpm`, `npm`) |
| **Manifesto** | `pyproject.toml` | `package.json` |

---

## Execução: CPython vs Motores JS

```txt
[Python]     script.py ──> CPython ──> Bytecode (.pyc) ──> Terminal / Servidor

[JavaScript] script.js ──> Motor V8 ──> Compilação JIT ──> Navegador / Node.js
```

- **Python**: Execução tradicional via interpretador no terminal e servidores.
- **JavaScript**: Compilação JIT de alta performance com APIs de DOM (navegador) ou I/O (Node.js).

---

## Hello World Lado a Lado

Em Python, a execução clássica foca em scripts e terminal:

```py
# hello.py
name = "Ana"
print(f"Olá, {name}!")
```

Em JavaScript, o código roda nativamente no Node.js ou no navegador:

```js
// hello.js
const name = "Ana";
console.log(`Olá, ${name}!`);
```

*Nota: `console.log()` exibe dados no console; `print()` imprime no stdout do terminal.*

---

## Sintaxe e Blocos de Controle

Python usa indentação obrigatória; JavaScript usa chaves explícitas:

```py
# Python: indentação delimita o bloco
score = 8.5
if score >= 9.0:
    print("Excelente")
elif score >= 7.0:
    print("Aprovado")
else:
    print("Recuperação")
```

```js
// JavaScript: chaves delimitam o bloco
const score = 8.5;
if (score >= 9.0) {
  console.log("Excelente");
} else if (score >= 7.0) {
  console.log("Aprovado");
} else {
  console.log("Recuperação");
}
```

---

## Operadores e Equivalências

| Recurso | Python | JavaScript |
| :--- | :--- | :--- |
| **Comentário** | `# texto` | `// texto` |
| **Interpolação** | `f"Olá, {nome}"` | `` `Olá, ${nome}` `` |
| **Condicional** | `if / elif / else` | `if / else if / else` |
| **E / OU / NÃO** | `and` / `or` / `not` | `&&` / `\|\|` / `!` |
| **Coalescência nula** | `val if val is not None else fallback` | `val ?? fallback` |
| **Ternário** | `res if cond else fallback` | `cond ? res : fallback` |
| **Ausência de valor** | `None` | `null` e `undefined` |

---

## A Armadilha dos Valores Falsy vs Truthy

A interpretação booleana de coleções vazias é uma diferença crucial:

| Valor Testado | Booleano em Python | Booleano em JavaScript |
| :--- | :--- | :--- |
| **Zero numérico** (`0`, `0.0`) | `False` | `false` |
| **String vazia** (`""`) | `False` | `false` |
| **Ausência de valor** | `None` $\rightarrow$ `False` | `null` / `undefined` $\rightarrow$ `false` |
| **Não-número** (`NaN`) | `float('nan')` $\rightarrow$ `True` | `NaN` $\rightarrow$ `false` |
| **Array vazio** (`[]`) | **`False`** | **`true`** (Truthy!) |
| **Objeto vazio** (`{}`) | **`False`** | **`true`** (Truthy!) |

*Atenção: Em JS, sempre verifique arrays vazios com `if (arr.length === 0)`.*

---

## Tipagem: Forte vs Coerções Automáticas

Python recusa tipos incompatíveis; JavaScript realiza coerções automáticas:

```py
# Python: tipagem forte (lança TypeError)
price = 50
# print("Total: " + price) # TypeError: can only concatenate str
print("Total: " + str(price)) # "Total: 50"
```

```js
// JavaScript: coerção implícita de tipos
const price = 50;
console.log("Total: " + price); // "Total: 50" (converte número em string)
console.log("100" - 20);         // 80 (converte string em número)
console.log("100" + 20);         // "10020" (concatena string!)
```

---

## Operadores de Igualdade

- **Python**: `==` compara valores; `is` compara identidade de objeto na memória.
- **JavaScript**: adote sempre `===` (valor e tipo sem coerção).

```py
# Python
list_a = [1, 2]
list_b = [1, 2]
print(list_a == list_b) # True (valores idênticos)
print(list_a is list_b) # False (objetos distintos na memória)
```

```js
// JavaScript
console.log(42 == "42");  // true (coerção implícita - EVITE!)
console.log(42 === "42"); // false (tipos distintos: number vs string)

const arrA = [1, 2];
const arrB = [1, 2];
console.log(arrA === arrB); // false (compara referências de memória)
```

---

## Strings: Métodos Equivalentes

Strings são sequências primitivas imutáveis em ambas as linguagens:

| Tarefa | Python `str` | JavaScript `String` |
| :--- | :--- | :--- |
| **Comprimento** | `len(text)` | `text.length` (unidades UTF-16) |
| **Acesso por índice** | `text[0]`, `text[-1]` | `text[0]`, `text.at(-1)` |
| **Fatiamento** | `text[0:4]` | `text.slice(0, 4)` |
| **Minúsculas / Maiúsculas** | `text.lower()`, `text.upper()` | `text.toLowerCase()`, `text.toUpperCase()` |
| **Remover espaços pontas** | `text.strip()` | `text.trim()` |
| **Contém substring** | `"dev" in text` | `text.includes("dev")` |
| **Substituição** | `text.replace("a", "b")` | `text.replace("a", "b")` |
| **Dividir / Juntar** | `text.split(",")`, `", ".join(arr)` | `text.split(",")`, `arr.join(", ")` |

*Nota: Em JS, emojis como `"😀".length` valem `2` devido a surrogate pairs UTF-16.*

---

## Prática com Strings

```py
# Python: manipulação encadeada de strings
raw = "  JavaScript,Python,TypeScript  "
items = [item.strip().lower() for item in raw.split(",")]
print(" / ".join(items))
# Saída: javascript / python / typescript
```

```js
// JavaScript: cadeia de métodos equivalentes
const raw = "  JavaScript,Python,TypeScript  ";
const items = raw
  .split(",")
  .map((item) => item.trim().toLowerCase());
console.log(items.join(" / "));
// Saída: javascript / python / typescript
```

---

## Listas vs Arrays

| Tarefa | Python `list` | JavaScript `Array` |
| :--- | :--- | :--- |
| **Tamanho** | `len(items)` | `items.length` |
| **Adicionar no fim** | `items.append(val)` | `items.push(val)` |
| **Remover do fim** | `items.pop()` | `items.pop()` |
| **Adicionar no início** | `items.insert(0, val)` | `items.unshift(val)` |
| **Remover do início** | `items.pop(0)` | `items.shift()` |
| **Filtrar** | `[x for x in items if cond(x)]` | `items.filter(cond)` |
| **Transformar** | `[fn(x) for x in items]` | `items.map(fn)` |
| **Reduzir / Acumular** | `functools.reduce(...)` | `items.reduce(...)` |
| **Ordenar cópia** | `sorted(items)` | `items.toSorted((a, b) => a - b)` |

---

## Pipelines: Comprehensions vs Métodos Funcionais

```py
# Python: List Comprehension para filtrar e transformar
numbers = [1, 2, 3, 4, 5, 6]
evens_doubled = [n * 2 for n in numbers if n % 2 == 0]
print(evens_doubled) # [4, 8, 12]
```

```js
// JavaScript: Métodos funcionais de Array (.filter + .map)
const numbers = [1, 2, 3, 4, 5, 6];
const evensDoubled = numbers
  .filter((n) => n % 2 === 0)
  .map((n) => n * 2);
console.log(evensDoubled); // [ 4, 8, 12 ]
```

*Nota: Em JS, `toSorted((a, b) => a - b)` ordena números sem mutar o array original.*

---

## Sequências Imutáveis: `tuple` vs Array

Python tem tuplas nativas imutáveis com hash; JavaScript adota arrays com convenções:

```py
# Python: tuplas nativas (imutáveis, usadas como chaves ou retornos)
point = (10, 20)
# point[0] = 15 # TypeError: 'tuple' object does not support item assignment
x, y = point
```

```js
// JavaScript: Arrays desestruturados ou congelados
const point = Object.freeze([10, 20]);
// point[0] = 15; // TypeError em strict mode

// Desestruturação de retornos múltiplos:
const [x, y] = point;
```

---

## Chave-Valor: `dict` vs `Object` e `Map`

| Tarefa | Python `dict` | JavaScript `Object` | JavaScript `Map` |
| :--- | :--- | :--- | :--- |
| **Criação** | `{"a": 1}` | `{ a: 1 }` | `new Map()` |
| **Leitura** | `d["a"]`, `d.get("a", 0)` | `obj.a`, `obj.a ?? 0` | `map.get("a") ?? 0` |
| **Escrita** | `d["b"] = 2` | `obj.b = 2` | `map.set("b", 2)` |
| **Remoção** | `del d["a"]` | `delete obj.a` | `map.delete("a")` |
| **Existe chave** | `"a" in d` | `Object.hasOwn(obj, "a")` | `map.has("a")` |
| **Pares (entradas)**| `d.items()` | `Object.entries(obj)` | `map.entries()` |

- Use **`Object`** para registros estruturados com propriedades fixas.
- Use **`Map`** para dicionários dinâmicos com chaves de tipos arbitrários.

---

## Conjuntos: `set` vs `Set`

Ambas mantêm valores únicos sem duplicação:

```py
# Python: operadores nativos de conjunto
front = {"html", "css", "js"}
back = {"js", "python", "sql"}
print(front | back) # União: {'html', 'css', 'js', 'python', 'sql'}
print(front & back) # Interseção: {'js'}
print(front - back) # Diferença: {'html', 'css'}
```

```js
// JavaScript: Set com sintaxe de espalhamento (spread)
const front = new Set(["html", "css", "js"]);
const back = new Set(["js", "python", "sql"]);

const union = new Set([...front, ...back]);
const intersection = new Set([...front].filter((x) => back.has(x)));
const difference = new Set([...front].filter((x) => !back.has(x)));
console.log([...difference]); // [ 'html', 'css' ]
```

---

## Funções e Sintaxe

```py
# Python: def e lambda
def calculate_total(price, tax=0.1):
    return price * (1 + tax)

double = lambda x: x * 2

print(calculate_total(100)) # 110.0
print(double(5))            # 10
```

```js
// JavaScript: function e arrow function
function calculateTotal(price, tax = 0.1) {
  return price * (1 + tax);
}

const double = (x) => x * 2;

console.log(calculateTotal(100)); // 110
console.log(double(5));            // 10
```

---

## Parâmetros Variáveis e Escopo

| Recurso | Python | JavaScript |
| :--- | :--- | :--- |
| **Parâmetros posicionais extras** | `*args` (tupla) | `...rest` (Array legítimo) |
| **Parâmetros nomeados extras** | `**kwargs` (dicionário) | Desestruturação: `{ a, b } = {}` |
| **Escopo de bloco** | Não (`if` e `for` não criam escopo) | Sim (`let` e `const` respeitam blocos `{}`) |
| **Funções de 1ª classe** | Sim (passadas como valores) | Sim (passadas como valores) |

```py
# Python: variável de loop vaza para o escopo externo
for i in range(3): pass
print(i) # 2 (existe fora do loop!)
```

```js
// JavaScript: let fica restrito ao bloco do loop
for (let i = 0; i < 3; i++) {}
// console.log(i); // ReferenceError: i is not defined
```

---

## Classes: `self` Explícito vs `this` Implícito

Em Python, métodos recebem `self` explicitamente na assinatura:

```py
class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        return self.balance

acc = Account("Ana", 100)
acc.deposit(50)
print(f"{acc.owner}: R$ {acc.balance}") # Ana: R$ 150
```

---

## Classes em JavaScript Moderno

Em JavaScript, `constructor()` inicializa a classe e `this` é implícito nos métodos:

```js
class Account {
  constructor(owner, balance = 0) {
    this.owner = owner;
    this.balance = balance;
  }

  deposit(amount) {
    this.balance += amount;
    return this.balance;
  }
}

const acc = new Account("Ana", 100);
acc.deposit(50);
console.log(`${acc.owner}: R$ ${acc.balance}`); // Ana: R$ 150
```

---

## Módulos e Gerenciadores de Pacotes

| Aspecto | Python | JavaScript |
| :--- | :--- | :--- |
| **Importação** | `import math` / `from os import path` | `import math from "math"` / `import { fn }` |
| **Exportação** | Implícita (símbolos do arquivo) | Explícita (`export const ...`, `export default`) |
| **Repositório** | PyPI (*Python Package Index*) | npm (*Node Package Manager*) |
| **Ferramentas** | `uv`, `pip`, `poetry` | `pnpm`, `npm`, `yarn` |
| **Manifesto** | `pyproject.toml` / `requirements.txt` | `package.json` |

```py
# Python: importação de biblioteca padrão
from datetime import datetime
print(datetime.now().year)
```

```js
// JavaScript (ESM): importação de módulos
import { readFile } from "node:fs/promises";
export const APP_VERSION = "2.0";
```

---

## Assincronismo e Concorrência

```py
# Python: assincronismo explícito com asyncio
import asyncio

async def fetch_user():
    await asyncio.sleep(0.1) # Simula I/O assíncrono
    return {"name": "Ana"}

async def main():
    user = await fetch_user()
    print(user)

asyncio.run(main())
```

- **Python**: Síncrono por padrão; `asyncio.run()` inicia o loop de eventos.
- **JavaScript**: Assíncrono por natureza com *Event Loop* integrado e Promises nativas.

---

## Assincronismo em JavaScript

```js
// JavaScript: Event Loop não-bloqueante e Promises
const fetchUser = async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return { name: "Ana" };
};

const main = async () => {
  const user = await fetchUser();
  console.log(user);
};

main();
```

- Funções `async` devolvem Promises automaticamente.
- O *Event Loop* processa tarefas assíncronas sem travar a thread principal.

---

## Exercício Prático: Pipeline de Cursos

Traduza o pipeline de cursos entre as duas linguagens:

1. Lista de cursos com `title` e `workload` (horas).
2. Filtrar cursos com carga horária $\ge 60$ horas.
3. Obter lista com os títulos dos cursos aprovados em maiúsculas.
4. Versão Python com *list comprehension*.
5. Versão JavaScript com `filter()` e `map()`.

---

## Solução do Exercício

```py
# Python: courses.py
courses = [
    {"title": "HTML e CSS", "workload": 40},
    {"title": "JavaScript Moderno", "workload": 80},
    {"title": "Python Backend", "workload": 60},
]
titles = [c["title"].upper() for c in courses if c["workload"] >= 60]
print(titles) # ['JAVASCRIPT MODERNO', 'PYTHON BACKEND']
```

```js
// JavaScript: courses.js
const courses = [
  { title: "HTML e CSS", workload: 40 },
  { title: "JavaScript Moderno", workload: 80 },
  { title: "Python Backend", workload: 60 },
];
const titles = courses
  .filter((c) => c.workload >= 60)
  .map((c) => c.title.toUpperCase());
console.log(titles); // [ 'JAVASCRIPT MODERNO', 'PYTHON BACKEND' ]
```

---

## Desafio: Agrupamento Financeiro

1. Crie uma lista de transações com `category` e `value`.
2. Itere e acumule o valor total de cada categoria.
3. Trate chaves inexistentes com valores padrão de forma segura (`.get()` em Python e `??` em JS).
4. Imprima o dicionário / objeto acumulado final.

---

## Solução do Desafio

```py
# Python: transactions.py
transactions = [
    {"category": "food", "value": 45.0},
    {"category": "transport", "value": 20.0},
    {"category": "food", "value": 30.0},
]
totals = {}
for item in transactions:
    totals[item["category"]] = totals.get(item["category"], 0.0) + item["value"]
print(totals) # {'food': 75.0, 'transport': 20.0}
```

```js
// JavaScript: transactions.js
const transactions = [
  { category: "food", value: 45.0 },
  { category: "transport", value: 20.0 },
  { category: "food", value: 30.0 },
];
const totals = {};
for (const item of transactions) {
  totals[item.category] = (totals[item.category] ?? 0) + item.value;
}
console.log(totals); // { food: 75, transport: 20 }
```

---

## Perguntas de Revisão

- Por que dizemos que Python possui tipagem forte e JavaScript possui coerções implícitas?
- Por que `if ([])` se comporta de forma oposta em Python e em JavaScript?
- Qual a diferença entre `==` e `is` em Python vs `==` e `===` em JavaScript?
- Qual a diferença entre usar um objeto literal `{}` e um `Map` ao comparar com `dict`?
- Por que o método `.sort()` em JavaScript requer uma função de comparação para números?
- Como difere o uso de `self` em Python de `this` em JavaScript na definição de classes?
- Como funciona a execução assíncrona básica entre Python e JavaScript?

---

## Resumo do Tópico

- **Execução**: CPython para scripts/backend; V8 e motores web para navegador/Node.js.
- **Tipagem**: Python recusa tipos incompatíveis; JavaScript exige `===` estrito.
- **Armadilha Falsy**: Em JS, `[]` e `{}` são **truthy** — verifique `arr.length === 0`.
- **Coleções**: *Comprehensions* em Python vs `filter`/`map`/`reduce` em JavaScript.
- **Tuplas**: `tuple` nativa em Python vs arrays desestruturados/congelados em JS.
- **Classes**: `self` explícito nos métodos Python vs `this` implícito no JS.
- **Módulos & Pacotes**: `uv`/`pip` com `pyproject.toml` vs `pnpm`/`npm` com `package.json`.
- **Assincronismo**: `asyncio` opcional em Python vs *Event Loop* nativo no JS.
