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
title: "JavaScript: Comparativo com Python"
description: "Comparativo prático entre JavaScript e Python: execução, sintaxe, tipos, coleções, funções, módulos, ecossistema e APIs equivalentes de strings, arrays/listas, mapas/dicionários e conjuntos."
---

<!-- _class: lead -->

# JavaScript: Comparativo com Python

Comparativo prático entre JavaScript e Python: execução, sintaxe, tipos, coleções, funções, módulos, ecossistema e APIs equivalentes de strings, arrays/listas, mapas/dicionários e conjuntos.

---

## Objetivo

- Comparar JavaScript e Python em modelo de execução, sintaxe, tipos, coleções, funções, módulos, ecossistema e APIs nativas.
- Ao final, você deve conseguir traduzir estruturas comuns entre as duas linguagens, evitar falsas equivalências.

---

## Mapa da Aula

- Panorama Geral
- Execução e Ambiente
- Sintaxe e Blocos
- Tipos e Coerção
- Coleções e Objetos
- Comparativo de APIs Nativas

---

## Panorama Geral

- Python e JavaScript são linguagens de alto nível, com tipagem dinâmica e suporte a múltiplos estilos de programação.
- A diferença principal está no ambiente padrão: JavaScript é nativo do navegador; Python é nativo do terminal.
- A tabela resume as diferenças iniciais
- As duas linguagens decidem tipos em runtime, mas JavaScript faz mais coerções implícitas.
- Python tende a recusar combinações incompatíveis com erro explícito.

---

## Panorama Geral (Comparação)

| Aspecto | Python | JavaScript |
| :--- | :--- | :--- |
| Origem | Linguagem de propósito geral | Linguagem de script para navegadores |
| Ambiente clássico | Terminal, scripts, servidores e dados | Navegador e, com Node.js, servidores |
| Delimitação de blocos | Indentação obrigatória | Chaves `{}` |
| Final de instrução | Quebra de linha | Ponto e vírgula opcional |
| Tipagem | Dinâmica e forte | Dinâmica, com coerções implícitas frequentes |

---

## Execução e Ambiente

- Python costuma executar arquivos `.py` com o interpretador CPython.
- JavaScript executa no navegador, no Node.js ou em runtimes compatíveis.
- Em ambos os casos, existe uma etapa interna de preparação antes da execução real, mas o fluxo de trabalho para o estudante é diferente.

```txt
script.py ──► CPython ──► saída no terminal
app.js    ──► V8/Node ──► saída no terminal
script.js ──► navegador ──► DOM, eventos e Web APIs
```

---

## Execução e Ambiente (Exemplo)

```py
name = "Ana"
print(f"Olá, {name}")
```

---

## Sintaxe e Blocos

- Python usa indentação como parte da sintaxe.
- JavaScript usa chaves para delimitar blocos e costuma usar indentação como convenção de leitura.
- O exemplo a seguir compara uma estrutura de decisão simples
- Em JavaScript, as chaves deixam o bloco explícito
- `None` parece `null`, mas JavaScript também tem `undefined`.

---

## Sintaxe e Blocos (Comparação)

| Ideia | Python | JavaScript |
| :--- | :--- | :--- |
| Comentário de linha | `# texto` | `// texto` |
| String interpolada | `f"Olá, {name}"` | `` `Olá, ${name}` `` |
| Bloco condicional | `if score >= 7:` | `if (score >= 7) { ... }` |
| Valor nulo | `None` | `null` e `undefined` |
| Booleanos | `True`, `False` | `true`, `false` |

---

## Sintaxe e Blocos (Exemplo)

```py
score = 8

if score >= 7:
    print("Aprovado")
else:
    print("Revisar conteúdo")
```

---

## Tipos e Coerção

- JavaScript também é dinâmico, mas possui várias coerções automáticas.
- O exemplo abaixo evidencia a diferença
- Em JavaScript, o operador `+` também concatena strings e pode converter números

---

## Tipos e Coerção (Exemplo)

```py
age = 20

# print("Idade: " + age)
# TypeError: só concatena string com string

print("Idade: " + str(age)) # Idade: 20
```

---

## Coleções e Objetos

- As estruturas mais usadas têm equivalentes conceituais, mas não são idênticas.
- A maior diferença para iniciantes é que o objeto literal de JavaScript parece um dicionário de Python.
- Esta tabela serve como mapa de tradução inicial
- O exemplo compara filtragem e transformação de listas
- Em JavaScript, a mesma intenção costuma combinar `filter()` e `map()`

---

## Coleções e Objetos (Comparação)

| Conceito | Python | JavaScript |
| :--- | :--- | :--- |
| Lista ordenada mutável | `list` | `Array` |
| Registro chave-valor | `dict` | `Object` ou `Map` |
| Conjunto sem repetição | `set` | `Set` |
| Sequência imutável | `tuple` | Não há equivalente direto nativo |
| Ausência de valor | `None` | `null` / `undefined` |

---

## Coleções e Objetos (Exemplo)

```py
numbers = [1, 2, 3, 4, 5]
double_even = [number * 2 for number in numbers if number % 2 == 0]

print(double_even) # [4, 8]
```

---

## Comparativo de APIs Nativas

- Aprender a sintaxe geral é só metade da tradução entre linguagens.
- No dia a dia, a maior parte do código chama métodos de strings, listas/arrays, dicionários/mapas e conjuntos.
- As tabelas abaixo não tentam cobrir toda a biblioteca padrão.
- Elas funcionam como um mapa prático: "se em Python eu usaria isto, o que costumo usar em JavaScript?".

---

## Strings: `str` vs `String`

- Strings são imutáveis nas duas linguagens.
- Métodos de transformação devolvem uma nova string; eles não alteram o texto original.
- O exemplo abaixo mostra operações comuns lado a lado
- Em JavaScript, a mesma cadeia usa métodos de `String` e `Array`
- Em JavaScript, `string.length` conta unidades UTF-16, não necessariamente caracteres percebidos pelo usuário.

---

## Strings: `str` vs `String` (Comparação)

| Tarefa | Python `str` | JavaScript `String` |
| :--- | :--- | :--- |
| Tamanho | `len(text)` | `text.length` |
| Minúsculas | `text.lower()` | `text.toLowerCase()` |
| Maiúsculas | `text.upper()` | `text.toUpperCase()` |
| Remover espaços nas pontas | `text.strip()` | `text.trim()` |
| Começa com | `text.startswith("Dev")` | `text.startsWith("Dev")` |

---

## Strings: `str` vs `String` (Exemplo)

```py
text = "  JavaScript,Python,TypeScript  "
items = [item.strip().lower() for item in text.split(",")]

print(items) # ['javascript', 'python', 'typescript']
print(" / ".join(items)) # javascript / python / typescript
```

---

## Sequências Mutáveis: `list` vs `Array`

- `list` em Python e `Array` em JavaScript representam sequências ordenadas e mutáveis.
- A semelhança é forte, mas a API idiomática muda: Python usa muitas funções globais e métodos mutadores.
- O exemplo a seguir compara um pipeline de dados com filtro, transformação e ordenação
- Em JavaScript moderno, `toSorted()` preserva o array original
- `array.sort()` converte valores para string se você não passar `compareFn`.

---

## Sequências Mutáveis: `list` vs `Array` (Comparação)

| Tarefa | Python `list` | JavaScript `Array` |
| :--- | :--- | :--- |
| Tamanho | `len(items)` | `items.length` |
| Adicionar no fim | `items.append(value)` | `items.push(value)` |
| Remover do fim | `items.pop()` | `items.pop()` |
| Adicionar vários | `items.extend(other)` | `items.push(...other)` ou `items.concat(other)` |
| Inserir em posição | `items.insert(index, value)` | `items.splice(index, 0, value)` |

---

## Sequências Mutáveis: `list` vs `Array` (Exemplo)

```py
scores = [7, 10, 4, 8]
approved = sorted([score + 1 for score in scores if score >= 7])

print(approved) # [8, 9, 11]
print(scores) # [7, 10, 4, 8]
```

---

## Chave-Valor: `dict` vs `Object` e `Map`

- O `dict` de Python é a estrutura padrão para chave-valor.
- O exemplo com objeto literal fica natural quando as propriedades fazem parte do modelo
- Quando as chaves são dinâmicas, `Map` deixa a intenção mais explícita
- Se você está representando `user.name`, `user.email` e `user.role`, use objeto.
- Se está contando ocorrências por qualquer chave recebida em runtime, considere `Map`.

---

## Chave-Valor: `dict` vs `Object` e `Map` (Comparação)

| Tarefa | Python `dict` | JavaScript `Object` | JavaScript `Map` |
| :--- | :--- | :--- | :--- |
| Criar vazio | `{}` | `{}` | `new Map()` |
| Ler valor | `user["name"]` | `user.name` ou `user["name"]` | `map.get("name")` |
| Definir valor | `user["name"] = "Ana"` | `user.name = "Ana"` | `map.set("name", "Ana")` |
| Valor padrão | `user.get("age", 0)` | `user.age ?? 0` | `map.get("age") ?? 0` |
| Chaves | `user.keys()` | `Object.keys(user)` | `map.keys()` |

---

## Chave-Valor: `dict` vs `Object` e `Map` (Exemplo)

```js
const user = {
  name: "Ana",
  role: "student",
};

console.log(Object.keys(user)); // [ 'name', 'role' ]
console.log(user.name); // Ana
```

---

## Conjuntos: `set` vs `Set`

- As duas linguagens têm conjuntos para guardar valores sem repetição.
- A ideia é parecida: adicionar, testar presença, remover e combinar coleções.
- O exemplo abaixo mostra operações equivalentes com `Set`
- Python expõe operações de conjunto com operadores próprios (`|`, `&`, `-`).
- JavaScript tradicionalmente monta essas operações combinando `Set`, spread e métodos de `Array`.

---

## Conjuntos: `set` vs `Set` (Comparação)

| Tarefa | Python `set` | JavaScript `Set` |
| :--- | :--- | :--- |
| Criar | `set(items)` | `new Set(items)` |
| Tamanho | `len(tags)` | `tags.size` |
| Adicionar | `tags.add("js")` | `tags.add("js")` |
| Testar presença | `"js" in tags` | `tags.has("js")` |
| Remover | `tags.remove("js")` ou `tags.discard("js")` | `tags.delete("js")` |

---

## Conjuntos: `set` vs `Set` (Exemplo)

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

- Python e JavaScript tratam funções como valores: você pode guardar uma função em variável.
- A sintaxe, porém, muda bastante.
- O exemplo abaixo define uma função nomeada em Python
- Em JavaScript, funções podem ser declarações, expressões ou arrow functions
- Em JavaScript moderno, prefira `const` e `let`, que respeitam bloco.

---

## Funções e Escopo (Comparação)

| Recurso | Python | JavaScript |
| :--- | :--- | :--- |
| Parâmetro padrão | `def fn(x=1):` | `function fn(x = 1)` |
| Vários argumentos posicionais | `*args` | `...args` |
| Argumentos nomeados extras | `**kwargs` | Objeto de opções |
| Função anônima curta | `lambda x: x * 2` | `(x) => x * 2` |
| Escopo de bloco | Não para `if`/`for` | Sim com `let` e `const` |

---

## Funções e Escopo (Exemplo)

```py
def apply_discount(price, percent=10):
    return price * (1 - percent / 100)

print(apply_discount(100)) # 90.0
```

---

## Modelo mental

- Qual é a diferença mais importante entre o ambiente clássico de Python e o de JavaScript?
- JavaScript é nativo do navegador e também roda no servidor com Node.js.
- Python é mais comum no terminal, em scripts, servidores, automação, dados e ferramentas de sistema.
- As duas linguagens têm tipagem dinâmica?
- O tipo dos valores é conhecido em runtime.

---

## Tradução de conceitos

- Qual estrutura de JavaScript se aproxima de uma lista Python?
- `Array`, porque representa uma sequência ordenada e mutável de valores.
- Um objeto JavaScript é exatamente igual a um dicionário Python?
- Objetos podem servir como registros chave-valor, mas têm protótipo e acesso por ponto.
- Para mapa de chaves arbitrárias, `Map` costuma ser uma comparação melhor.

---

## Executando

- Crie um arquivo `average.py`
- Execute com Python
- Crie um arquivo `average.js`
- Execute com Node.js
- No navegador, cole apenas a versão JavaScript no console das DevTools. Python não roda

---

## Exercício

- Comece com uma lista de cursos.
- Cada curso deve ter `title` e `workload`.
- Filtre apenas cursos com carga horária maior ou igual a 60.
- Transforme o resultado em uma lista de títulos.
- Escreva uma versão em Python.

---

## Desafio

- Implemente a mesma lógica em Python e JavaScript: receber uma lista de vendas.

---

## Resumo da Aula

- **Execução & Tipagem**: JS executa em motor JIT (V8) com tipagem dinâmica/fraca; Python em CPython (Bytecode) com tipagem dinâmica/forte.
- **Sintaxe & Escopo**: JS usa chaves `{}` e escopo de bloco (`let`/`const`); Python usa indentação obrigatória e escopo de função/global.
- **Equivalência de Estruturas**: Arrays em JS equivalem a `lists`; Objetos literais a `dicts`; `Set` e `Map` mapeiam diretamente para `set` e `dict`.
- **Concorrência**: JS utiliza Event Loop nativo mono-thread; Python utiliza modelo síncrono com GIL e biblioteca `asyncio` explícita.
- **Idiomas**: camelCase e arrow functions no ecossistema JS; snake_case e list comprehensions no ecossistema Python.
