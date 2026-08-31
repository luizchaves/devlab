---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Comparativo com Python"
description: "Slides completos da aula JavaScript: Comparativo com Python."
---

<!-- _class: lead -->

# JavaScript: Comparativo com Python

Comparativo prático entre JavaScript e Python: execução, sintaxe, tipos, coleções, funções, módulos, ecossistema e APIs equivalentes de strings, arrays/listas, mapas/dicionários e conjuntos.

---

## Objetivo

- Comparar JavaScript e Python em modelo de execução, sintaxe, tipos, coleções, funções, módulos, ecossistema e APIs nativas
- Ao final, você deve conseguir traduzir estruturas comuns entre as duas linguagens, evitar falsas equivalências,...

---

## Mapa da Aula

- Panorama Geral
- Execução e Ambiente
- Sintaxe e Blocos
- Tipos e Coerção
- Coleções e Objetos
- Comparativo de APIs Nativas
- Funções e Escopo
- Executando

---

## Introdução

- Esta aula compara Python e JavaScript para ajudar quem já estudou uma das linguagens a transferir conceitos para a outra
- As duas são dinâmicas, populares e multiparadigma, mas nasceram em contextos diferentes e tomam decisões de sintaxe,...
- JavaScript começou como linguagem do navegador e depois foi para o servidor com Node.js
- Python começou como linguagem de propósito geral no sistema operacional e ganhou força em automação, dados, ciência, APIs...

---

## Panorama Geral

- Python e JavaScript são linguagens de alto nível, com tipagem dinâmica e suporte a múltiplos estilos de programação
- A diferença principal está no ambiente padrão
- JavaScript é nativo do navegador
- Python é nativo do terminal, do sistema operacional e de ambientes de dados
- A tabela resume as diferenças iniciais

---

## Panorama Geral: Comparação

| Aspecto | Python | JavaScript |
| :--- | :--- | :--- |
| Origem | Linguagem de propósito geral | Linguagem de script para navegadores |
| Ambiente clássico | Terminal, scripts, servidores e dados | Navegador e, com Node.js, servidores |
| Delimitação de blocos | Indentação obrigatória | Chaves `{}` |
| Final de instrução | Quebra de linha | Ponto e vírgula opcional |
| Tipagem | Dinâmica e forte | Dinâmica, com coerções implícitas frequentes |
| ... | ... | ... |

---

## Execução e Ambiente

- Python costuma executar arquivos `.py` com o interpretador CPython
- JavaScript executa no navegador, no Node.js ou em runtimes compatíveis
- Em ambos os casos, existe uma etapa interna de preparação antes da execução real, mas o fluxo de trabalho para o...
- O diagrama mostra os caminhos mais comuns
- Diagrama da página

---

## hello.py

```py
name = "Ana"
print(f"Olá, {name}")
```

---

## hello.js

```js
const name = "Ana";
console.log(`Olá, ${name}`);
```

---

## Sintaxe e Blocos

- Python usa indentação como parte da sintaxe
- JavaScript usa chaves para delimitar blocos e costuma usar indentação como convenção de leitura
- O exemplo a seguir compara uma estrutura de decisão simples
- Em JavaScript, as chaves deixam o bloco explícito
- `None` parece `null`, mas JavaScript também tem `undefined`

---

## Sintaxe e Blocos: Comparação

| Ideia | Python | JavaScript |
| :--- | :--- | :--- |
| Comentário de linha | `# texto` | `// texto` |
| String interpolada | `f"Olá, {name}"` | `` `Olá, ${name}` `` |
| Bloco condicional | `if score >= 7:` | `if (score >= 7) { ... }` |
| Valor nulo | `None` | `null` e `undefined` |
| Booleanos | `True`, `False` | `true`, `false` |
| ... | ... | ... |

---

## Python: bloco por indentação

```py
score = 8

if score >= 7:
 print("Aprovado")
else:
 print("Revisar conteúdo")
```

---

## JavaScript: bloco por chaves

```js
const score = 8;

if (score >= 7) {
console.log("Aprovado");
} else {
console.log("Revisar conteúdo");
}
```

---

## Tipos e Coerção

- Python é dinâmico e forte
- o tipo é decidido em runtime, mas operações incompatíveis tendem a falhar em vez de converter silenciosamente
- JavaScript também é dinâmico, mas possui várias coerções automáticas
- O exemplo abaixo evidencia a diferença
- Em JavaScript, o operador `+` também concatena strings e pode converter números

---

## Python: conversão precisa ser explícita

```py
age = 20

# print("Idade: " + age)
# TypeError: só concatena string com string

print("Idade: " + str(age)) # Idade: 20
```

---

## JavaScript: coerção implícita

```js
const age = 20;

console.log("Idade: " + age); // Idade: 20
console.log("5" - 2); // 3
console.log("5" + 2); // 52
```

---

## Coleções e Objetos

- As estruturas mais usadas têm equivalentes conceituais, mas não são idênticas
- A maior diferença para iniciantes é que o objeto literal de JavaScript parece um dicionário de Python, mas também carrega...
- Esta tabela serve como mapa de tradução inicial
- O exemplo compara filtragem e transformação de listas
- Em JavaScript, a mesma intenção costuma combinar `filter()` e `map()`

---

## Coleções e Objetos: Comparação

| Conceito | Python | JavaScript |
| :--- | :--- | :--- |
| Lista ordenada mutável | `list` | `Array` |
| Registro chave-valor | `dict` | `Object` ou `Map` |
| Conjunto sem repetição | `set` | `Set` |
| Sequência imutável | `tuple` | Não há equivalente direto nativo |
| Ausência de valor | `None` | `null` / `undefined` |
| Iteração simples | `for item in items:` | `for (const item of items)` |

---

## Python: list comprehension

```py
numbers = [1, 2, 3, 4, 5]
double_even = [number * 2 for number in numbers if number % 2 == 0]

print(double_even) # [4, 8]
```

---

## JavaScript: filter + map

```js
const numbers = [1, 2, 3, 4, 5];
const doubleEven = numbers
.filter((number) => number % 2 === 0)
.map((number) => number * 2);

console.log(doubleEven); // [4, 8]
```

---

## Comparativo de APIs Nativas

- Aprender a sintaxe geral é só metade da tradução entre linguagens
- No dia a dia, a maior parte do código chama métodos de strings, listas/arrays, dicionários/mapas e conjuntos
- As tabelas abaixo não tentam cobrir toda a biblioteca padrão
- Elas funcionam como um mapa prático
- "se em Python eu usaria isto, o que costumo usar em JavaScript?"

---

## Strings: `str` vs `String`

- Strings são imutáveis nas duas linguagens
- Métodos de transformação devolvem uma nova string
- eles não alteram o texto original
- O exemplo abaixo mostra operações comuns lado a lado
- Em JavaScript, a mesma cadeia usa métodos de `String` e `Array`

---

## Strings: `str` vs `String`: Comparação

| Tarefa | Python `str` | JavaScript `String` |
| :--- | :--- | :--- |
| Tamanho | `len(text)` | `text.length` |
| Minúsculas | `text.lower()` | `text.toLowerCase()` |
| Maiúsculas | `text.upper()` | `text.toUpperCase()` |
| Remover espaços nas pontas | `text.strip()` | `text.trim()` |
| Começa com | `text.startswith("Dev")` | `text.startsWith("Dev")` |
| ... | ... | ... |

---

## Python: API de str

```py
text = "  JavaScript,Python,TypeScript  "
items = [item.strip().lower() for item in text.split(",")]

print(items) # ['javascript', 'python', 'typescript']
print(" / ".join(items)) # javascript / python / typescript
```

---

## JavaScript: API de String

```js
const text = "  JavaScript,Python,TypeScript  ";
const items = text
.split(",")
.map((item) => item.trim().toLowerCase());

console.log(items); // [ 'javascript', 'python', 'typescript' ]
console.log(items.join(" / ")); // javascript / python / typescript
```

---

## Sequências Mutáveis: `list` vs `Array`

- `list` em Python e `Array` em JavaScript representam sequências ordenadas e mutáveis
- A semelhança é forte, mas a API idiomática muda
- Python usa muitas funções globais e métodos mutadores
- JavaScript usa muitos métodos de alta ordem no próprio array
- O exemplo a seguir compara um pipeline de dados com filtro, transformação e ordenação

---

## Sequências Mutáveis: `list` vs `Array`: Comparação

| Tarefa | Python `list` | JavaScript `Array` |
| :--- | :--- | :--- |
| Tamanho | `len(items)` | `items.length` |
| Adicionar no fim | `items.append(value)` | `items.push(value)` |
| Remover do fim | `items.pop()` | `items.pop()` |
| Adicionar vários | `items.extend(other)` | `items.push(...other)` ou `items.concat(other)` |
| Inserir em posição | `items.insert(index, value)` | `items.splice(index, 0, value)` |
| ... | ... | ... |

---

## Python: list, sorted e comprehension

```py
scores = [7, 10, 4, 8]
approved = sorted([score + 1 for score in scores if score >= 7])

print(approved) # [8, 9, 11]
print(scores) # [7, 10, 4, 8]
```

---

## JavaScript: Array, filter, map e toSorted

```js
const scores = [7, 10, 4, 8];
const approved = scores
.filter((score) => score >= 7)
.map((score) => score + 1)
.toSorted((a, b) => a - b);

console.log(approved); // [8, 9, 11]
console.log(scores); // [7, 10, 4, 8]
```

---

## Chave-Valor: `dict` vs `Object` e `Map`

- O `dict` de Python é a estrutura padrão para chave-valor
- Em JavaScript existem duas escolhas comuns
- objeto literal para registros com campos conhecidos e `Map` para mapa de chaves arbitrárias
- O exemplo com objeto literal fica natural quando as propriedades fazem parte do modelo
- Quando as chaves são dinâmicas, `Map` deixa a intenção mais explícita

---

## Chave-Valor: `dict` vs `Object` e `Map`: Comparação

| Tarefa | Python `dict` | JavaScript `Object` | JavaScript `Map` |
| :--- | :--- | :--- | :--- |
| Criar vazio | `{}` | `{}` | `new Map()` |
| Ler valor | `user["name"]` | `user.name` ou `user["name"]` | `map.get("name")` |
| Definir valor | `user["name"] = "Ana"` | `user.name = "Ana"` | `map.set("name", "Ana")` |
| Valor padrão | `user.get("age", 0)` | `user.age ?? 0` | `map.get("age") ?? 0` |
| Chaves | `user.keys()` | `Object.keys(user)` | `map.keys()` |
| ... | ... | ... | ... |

---

## JavaScript: Object como registro

```js
const user = {
name: "Ana",
role: "student",
};

console.log(Object.keys(user)); // [ 'name', 'role' ]
console.log(user.name); // Ana
```

---

## JavaScript: Map como dicionário dinâmico

```js
const counters = new Map();

counters.set("javascript", 2);
counters.set("python", (counters.get("python") ?? 0) + 1);

console.log(counters.has("python")); // true
console.log([...counters.entries()]); // [ [ 'javascript', 2 ], [ 'python', 1 ] ]
```

---

## Conjuntos: `set` vs `Set`

- As duas linguagens têm conjuntos para guardar valores sem repetição
- A ideia é parecida
- adicionar, testar presença, remover e combinar coleções
- O exemplo abaixo mostra operações equivalentes com `Set`
- Python expõe operações de conjunto com operadores próprios (`|`, `&`, `-`)

---

## Conjuntos: `set` vs `Set`: Comparação

| Tarefa | Python `set` | JavaScript `Set` |
| :--- | :--- | :--- |
| Criar | `set(items)` | `new Set(items)` |
| Tamanho | `len(tags)` | `tags.size` |
| Adicionar | `tags.add("js")` | `tags.add("js")` |
| Testar presença | `"js" in tags` | `tags.has("js")` |
| Remover | `tags.remove("js")` ou `tags.discard("js")` | `tags.delete("js")` |
| ... | ... | ... |

---

## JavaScript: operações com Set

```js
const frontend = new Set(["html", "css", "javascript"]);
const backend = new Set(["javascript", "sql", "python"]);

const union = new Set([...frontend, ...backend]);
const intersection = new Set([...frontend].filter((item) => backend.has(item)));
const difference = new Set([...frontend].filter((item) => !backend.has(item)));

console.log([...union]); // [ 'html', 'css', 'javascript', 'sql', 'python' ]
console.log([...intersection]); // [ 'javascript' ]
console.log([...difference]); // [ 'html', 'css' ]
```

---

## Funções e Escopo

- Python e JavaScript tratam funções como valores
- você pode guardar uma função em variável, passar como argumento e retornar de outra função
- A sintaxe, porém, muda bastante
- O exemplo abaixo define uma função nomeada em Python
- Em JavaScript, funções podem ser declarações, expressões ou arrow functions

---

## Funções e Escopo: Comparação

| Recurso | Python | JavaScript |
| :--- | :--- | :--- |
| Parâmetro padrão | `def fn(x=1):` | `function fn(x = 1)` |
| Vários argumentos posicionais | `*args` | `...args` |
| Argumentos nomeados extras | `**kwargs` | Objeto de opções |
| Função anônima curta | `lambda x: x * 2` | `(x) => x * 2` |
| Escopo de bloco | Não para `if`/`for` | Sim com `let` e `const` |

---

## Python: função nomeada

```py
def apply_discount(price, percent=10):
 return price * (1 - percent / 100)

print(apply_discount(100)) # 90.0
```

---

## JavaScript: arrow function

```js
const applyDiscount = (price, percent = 10) => {
return price * (1 - percent / 100);
};

console.log(applyDiscount(100)); // 90
```

---

## Executando

- Crie um arquivo `average.py`:
- Execute com Python:
- Crie um arquivo `average.js`:
- Execute com Node.js:
- No navegador, cole apenas a versão JavaScript no console das DevTools. Python não roda

---

## average.py

```py
grades = [8, 7.5, 9]
average = sum(grades) / len(grades)

print(f"Média: {average:.2f}")
```

---

## Terminal

```bash
python average.py
```

---

## Output

```txt
Média: 8.17
```

---

## Exercício

- Comece com uma lista de cursos.
- Cada curso deve ter `title` e `workload`.
- Filtre apenas cursos com carga horária maior ou igual a 60.
- Transforme o resultado em uma lista de títulos.
- Escreva uma versão em Python.

---

## Desafio

- Implemente a mesma lógica em Python e JavaScript
- receber uma lista de vendas, agrupar o total por categoria e imprimir o objeto/dicionário final

---

## Modelo mental

- Qual é a diferença mais importante entre o ambiente clássico de Python e o de JavaScript
- As duas linguagens têm tipagem dinâmica
- Por que indentação é mais crítica em Python

---

## Tradução de conceitos

- Qual estrutura de JavaScript se aproxima de uma lista Python
- Um objeto JavaScript é exatamente igual a um dicionário Python
- Qual é o equivalente direto de `None` em JavaScript

---

## Próxima aula

- Depois do mapa comparativo, siga para Casos "Bizarros"
- `NaN`, `typeof null`, precisão decimal, coerção implícita e outras armadilhas famosas do JavaScript

---

## Resumo da Aula

- Revise panorama Geral
- Revise execução e Ambiente
- Revise sintaxe e Blocos
- Revise tipos e Coerção
- Revise coleções e Objetos
- Revise comparativo de APIs Nativas
- Revise funções e Escopo
