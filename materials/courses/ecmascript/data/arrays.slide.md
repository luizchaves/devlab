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
title: "JavaScript: Arrays e Métodos Funcionais"
description: "Criação, geração de intervalos (range), manipulação, iteração, desestruturação, operador spread e principais métodos de Array em JavaScript."
---

<!-- _class: lead -->

# JavaScript: Arrays e Métodos Funcionais

Criação, desestruturação, `spread`, imutabilidade, ES2023 e métodos funcionais.

---

## Objetivo

Dominar a estrutura de dados de Array e aplicar paradigmas imperativos e funcionais:

- Criar coleções dinâmicas, validar tipos com **`Array.isArray()`** e gerar intervalos (*range*).
- Compreender alocação na Heap, **comparação por referência** e clonagem com **`structuredClone()`**.
- Manipular elementos com **`[i]`**, **`.at()`**, **`length`**, **`spread`** e **desestruturação**.
- Distinguir **métodos mutadores** clássicos de métodos não-mutadores do **ES2023**.
- Dominar funções de alta ordem (**`map`**, **`filter`**, **`reduce`**) e composição de pipelines.

---

## Mapa do Tópico

1. **Fundamentos**: criação, heterogeneidade, validação e propriedade `length`.
2. **Imutabilidade e Clonagem**: comparação por referência, spread e `structuredClone()`.
3. **Iteração e Sequências**: `for...of`, armadilha do `for...in` e geração de *ranges*.
4. **Métodos Mutadores e ES2023**: `splice`, ordenação com `localeCompare` e métodos imutáveis.
5. **Programação Funcional (HOFs)**: `map`, `filter`, `reduce` e métodos de busca/predicado.
6. **Prática e Consolidação**: execução em Node.js, exercício, desafio e revisão.

---

## Por Que Arrays Importam?

Em aplicações Web, dados de APIs, listas de banco de dados e estados de interface chegam como arrays:

- **Estrutura Fundamental**: coleções ordenadas são a espinha dorsal de quase todo algoritmo.
- **Evolução da Linguagem**: do estilo mutador clássico (`splice`) ao paradigma declarativo e imutável (`map`, `toSorted`).
- **Segurança de Referência**: mutações acidentais em referências compartilhadas são uma das maiores fontes de bugs em JavaScript.

*Regra de ouro: prefira sempre métodos imutáveis e declare referências de arrays com `const`.*

---

## Criação e Estrutura de Arrays

Arrays em JavaScript são dinâmicos (tamanho variável) e heterogêneos (múltiplos tipos):

```js
// 1. Literal de Array (sintaxe recomendada)
const numbers = [10, 20, 30, 40];
const empty = [];

// 2. Arrays heterogêneos (primitivos, objetos e aninhamentos)
const mixed = [42, "JavaScript", true, null, { role: "admin" }, [1, 2]];

// 3. Construtor Array
const items = new Array(10, 20, 30); // [10, 20, 30]
const fixed = new Array(3);          // [ <3 empty items> ]

console.log(numbers[0]);  // 10
console.log(mixed[4]);    // { role: "admin" }
console.log(mixed[5][0]); // 1 (acessando elemento do array aninhado)
```

---

## Validação de Tipos: `Array.isArray()`

Internamente, arrays são objetos. `typeof []` retorna `"object"`, gerando falsos positivos:

```js
// Errado: typeof não diferencia Array de objeto literal ou null
console.log(typeof [1, 2, 3]); // "object"
console.log(typeof {});        // "object"
console.log(typeof null);      // "object"

// Correto: Array.isArray() é a forma oficial e segura de validação
console.log(Array.isArray([1, 2, 3])); // true
console.log(Array.isArray({}));        // false
console.log(Array.isArray("texto"));   // false
console.log(Array.isArray(null));      // false
```

*Utilize sempre `Array.isArray()` em funções utilitárias e validações de parâmetros.*

---

## Acesso por Índice e Método `.at()`

Colchetes acessam posições de `0` a `length - 1`. O método `.at()` suporta índices negativos:

```js
const colors = ["vermelho", "verde", "azul"];

// Leitura posicional tradicional
console.log(colors[0]); // "vermelho"
console.log(colors[2]); // "azul"
console.log(colors[3]); // undefined (índice fora do limite)

// Método .at() (índices relativos ao final da lista)
console.log(colors.at(0));  // "vermelho"
console.log(colors.at(-1)); // "azul" (último elemento)
console.log(colors.at(-2)); // "verde" (penúltimo elemento)

// Alteração direta por índice
colors[1] = "amarelo";
console.log(colors); // [ 'vermelho', 'amarelo', 'azul' ]
```

---

## A Propriedade `length` e Arrays Esparsos

A propriedade `length` é mutável e dita o tamanho alocado do array:

```js
const fruits = ["maçã", "banana", "laranja"];
console.log(fruits.length); // 3

// Atribuir a índice distante cria posições vazias (slots esparsos):
fruits[5] = "uva";
console.log(fruits);        // [ 'maçã', 'banana', 'laranja', <2 empty items>, 'uva' ]
console.log(fruits.length); // 6
console.log(fruits[3]);     // undefined

// Reduzir length diretamente descarta/trunca elementos:
fruits.length = 2;
console.log(fruits); // [ 'maçã', 'banana' ]
```

---

## A Armadilha do Operador `delete`

O operador `delete` remove o valor, mas deixa a posição como um *empty slot*:

```js
const numbers = [10, 20, 30, 40];

// Cuidado: delete cria um array esparso sem alterar o length
delete numbers[2];

console.log(numbers);        // [ 10, 20, <1 empty item>, 40 ]
console.log(numbers.length); // 4 (o tamanho NÃO diminuiu!)
console.log(numbers[2]);     // undefined
```

*Regra: nunca use `delete` em arrays. Prefira `.splice()`, `.pop()`, `.shift()` ou `.filter()`.*

---

## Comparação por Referência (`==` e `===`)

Arrays são alocados na memória Heap. O operador `===` compara endereços, não valores:

```js
const first = [1, 2, 3];
const second = [1, 2, 3];
const alias = first; // Copia apenas o endereço de memória

console.log(first === second); // false (alocações distintas na Heap)
console.log(first === alias);  // true  (mesma referência na memória)

// Efeito colateral da referência compartilhada:
alias.push(4);
console.log(first); // [ 1, 2, 3, 4 ] (first foi modificado via alias!)
```

*Para evitar mutação acidental, crie cópias explícitas com spread ou `structuredClone()`.*

---

## Operador Spread (`...`) e Cópia Rasa

O operador spread desempacota elementos, criando um novo array independente no 1º nível:

```js
const original = [1, 2, 3];

// 1. Cópia superficial (shallow copy)
const copy = [...original];
copy.push(4);

console.log(original); // [ 1, 2, 3 ] (original permanece intacto)
console.log(copy);     // [ 1, 2, 3, 4 ]
console.log(original === copy); // false (endereços distintos)

// 2. Concatenação declarativa de múltiplos arrays
const front = ["HTML", "CSS"];
const back = ["Node.js", "SQL"];
const fullstack = [...front, "JavaScript", ...back];
console.log(fullstack); // [ 'HTML', 'CSS', 'JavaScript', 'Node.js', 'SQL' ]
```

---

## Cópia Rasa vs Profunda (`structuredClone`)

Em matrizes e arrays de objetos, o spread compartilha ponteiros dos itens internos:

```js
const matrix = [[1, 2], [3, 4]];

// 1. Cópia Rasa com spread: subarrays continuam compartilhados
const shallow = [...matrix];
shallow[0].push(99);
console.log(matrix[0]); // [ 1, 2, 99 ] (afetou a matriz original!)

// 2. Cópia Profunda com structuredClone(): duplica todos os níveis
const originalMatrix = [[1, 2], [3, 4]];
const deep = structuredClone(originalMatrix);
deep[0].push(99);

console.log(originalMatrix[0]); // [ 1, 2 ] (original preservado)
console.log(deep[0]);           // [ 1, 2, 99 ] (100% isolado)
```

---

## Desestruturação de Arrays

Extrai valores posicionais diretamente para variáveis locais:

```js
const coords = [10, 20, 30];

// 1. Extração por posição e valor padrão
const [x, y] = coords;
console.log(x, y); // 10 20

const [first, , third, fourth = 0] = [100, 200, 300];
console.log(first, third, fourth); // 100 300 0

// 2. Coleta com operador Rest (...)
const [leader, vice, ...others] = ["Ana", "Bruno", "Carlos", "Daniela"];
console.log(leader); // "Ana"
console.log(others); // [ 'Carlos', 'Daniela' ]
```

---

## Troca de Variáveis (*Swap*)

A desestruturação permite inverter variáveis sem necessidade de variável temporária:

```js
let a = 1;
let b = 2;

// Inversão atômica com notação posicional:
[a, b] = [b, a];

console.log(a); // 2
console.log(b); // 1
```

*Também é comum ao receber retornos de tuplas ou hooks de bibliotecas modernas.*

---

## Iteração em Arrays

```js
const langs = ["JavaScript", "Python", "Java"];

// 1. for...of: itera diretamente sobre os VALORES (mais legível)
for (const lang of langs) {
  console.log(lang); // "JavaScript" -> "Python" -> "Java"
}

// 2. for...of com .entries(): índice e valor sem contador manual
for (const [i, lang] of langs.entries()) {
  console.log(`${i}: ${lang}`); // "0: JavaScript", "1: Python", "2: Java"
}

// 3. .forEach(): iteração orientada a efeitos colaterais
langs.forEach((lang, i) => console.log(`${i + 1}. ${lang}`));
```

*Evite `for...in` em arrays: ele percorre propriedades do objeto e converte índices em string.*

---

## Geração de Intervalos Numéricos (*Range*)

JavaScript não possui `range()` nativo, mas permite criar sequências facilmente:

```js
// 1. Array.from() com { length } e função mapeadora (mais idiomático)
const range = (start, end, step = 1) =>
  Array.from({ length: Math.ceil((end - start) / step) }, (_, i) => start + i * step);

console.log(range(1, 6));       // [ 1, 2, 3, 4, 5 ]
console.log(range(10, 40, 10)); // [ 10, 20, 30 ]

// 2. Spread com Array.prototype.keys()
const keys0to4 = [...Array(5).keys()]; // [ 0, 1, 2, 3, 4 ]

// 3. Array().fill() + map()
const filled = Array(4).fill(0).map((_, i) => (i + 1) * 10);
console.log(filled); // [ 10, 20, 30, 40 ]
```

---

## Categorias de Métodos em Array

O protótipo `Array.prototype` organiza seus métodos em quatro grupos principais:

| Categoria | Comportamento | Exemplos |
| --------- | ------------- | -------- |
| **Mutadores** | Alteram o array *in-place* | `push`, `pop`, `splice`, `sort`, `reverse` |
| **Não-Mutadores (ES2023)** | Retornam nova cópia alterada | `toSorted`, `toReversed`, `toSpliced`, `with` |
| **Acessores / Consulta** | Retornam valor calculado ou fatia | `includes`, `indexOf`, `slice`, `join`, `flat` |
| **Iteradores / HOFs** | Processam itens com callback | `map`, `filter`, `reduce`, `find`, `every` |

---

## Inserção e Remoção nas Extremidades

Métodos clássicos para manipulação de pilhas (*stack*) e filas (*queue*):

```js
const stack = [10, 20];

// Inserção e remoção no FINAL (O(1) - rápido)
stack.push(30);              // Insere no fim -> [ 10, 20, 30 ]
const last = stack.pop();    // Remove do fim -> 30 (stack fica [ 10, 20 ])

// Inserção e remoção no INÍCIO (O(n) - reindexa o array)
stack.unshift(5);            // Insere no início -> [ 5, 10, 20 ]
const first = stack.shift(); // Remove do início -> 5 (stack fica [ 10, 20 ])

console.log(last, first); // 30 5
console.log(stack);       // [ 10, 20 ]
```

---

## Alteração com `.splice()`

Adiciona, remove e substitui elementos em qualquer posição *in-place*:

```js
const months = ["Jan", "Mar", "Abr", "Jun"];

// 1. Inserção: no índice 1, remove 0 e insere "Fev"
months.splice(1, 0, "Fev");
console.log(months); // [ 'Jan', 'Fev', 'Mar', 'Abr', 'Jun' ]

// 2. Substituição: no índice 4, remove 1 e insere "Maio"
months.splice(4, 1, "Maio");
console.log(months); // [ 'Jan', 'Fev', 'Mar', 'Abr', 'Maio' ]

// 3. Remoção: no índice 1, remove 2 itens
const removed = months.splice(1, 2);
console.log(removed); // [ 'Fev', 'Mar' ]
console.log(months);  // [ 'Jan', 'Abr', 'Maio' ]
```

---

## Ordenação com `.sort()` e Comparadores

Por padrão, `.sort()` converte itens em string e ordena por código Unicode:

```js
const numbers = [10, 2, 5, 1, 20];

// Errado: padrão lexicográfico, incorreto para números
numbers.sort();
console.log(numbers); // [ 1, 10, 2, 20, 5 ]

// Correto: função de comparação numérica crescente
numbers.sort((a, b) => a - b);
console.log(numbers); // [ 1, 2, 5, 10, 20 ]

// Ordenação numérica decrescente:
numbers.sort((a, b) => b - a);
console.log(numbers); // [ 20, 10, 5, 2, 1 ]
```

*V8 utiliza o algoritmo Timsort (estável, O(n log n)).*

---

## Ordenação de Strings: `localeCompare`

A ordenação Unicode falha com caracteres acentuados e maiúsculas/minúsculas:

```js
const fruits = ["Maçã", "abacaxi", "Água", "banana"];

// Errado: padrão Unicode, acentos e maiúsculas quebram a ordem alfabética
fruits.sort();
console.log(fruits); // [ 'Maçã', 'banana', 'abacaxi', 'Água' ]

// Correto: ordem gramatical em português (pt-BR)
fruits.sort((a, b) => a.localeCompare(b, "pt-BR"));
console.log(fruits); // [ 'abacaxi', 'Água', 'banana', 'Maçã' ]
```

*`a.localeCompare(b, "pt-BR")` retorna `-1`, `0` ou `1` respeitando as regras do idioma.*

---

## Métodos Não-Mutadores do ES2023

Operam como *Change Array by Copy*, gerando um novo array sem alterar o original:

```js
const numbers = [3, 1, 4, 1, 5];

// 1. toSorted(): cópia ordenada
const sorted = numbers.toSorted((a, b) => a - b);
console.log(sorted);  // [ 1, 1, 3, 4, 5 ]
console.log(numbers); // [ 3, 1, 4, 1, 5 ] (original preservado!)

// 2. with(index, valor): cópia com substituição em posição específica
const updated = numbers.with(0, 99);
console.log(updated); // [ 99, 1, 4, 1, 5 ]

// 3. toReversed(): cópia invertida
console.log(numbers.toReversed()); // [ 5, 1, 4, 1, 3 ]
```

---

## Métodos Acessores e de Consulta

Calculam e retornam novos valores sem modificar o array original:

```js
const items = ["a", "b", "c", "d"];

// 1. slice(start, end): extrai sub-array (end não incluído)
console.log(items.slice(1, 3)); // [ 'b', 'c' ]

// 2. join(separador): converte para string delimitada
console.log(items.join(" - ")); // "a - b - c - d"

// 3. includes(valor) e indexOf(valor)
console.log(items.includes("c")); // true
console.log(items.indexOf("b"));  // 1

// 4. flat(profundidade): achata matrizes aninhadas
console.log([1, [2, [3]]].flat(2)); // [ 1, 2, 3 ]
```

---

## Programação Funcional: Pipeline de Dados

Higher-Order Functions (HOFs) recebem callbacks e encadeiam transformações:

```txt
[ 1, 2, 3, 4, 5, 6 ]  (Array Original)
        │
        ▼ .filter(n => n % 2 === 0)
   [ 2, 4, 6 ]         (Apenas Pares)
        │
        ▼ .map(n => n * 10)
  [ 20, 40, 60 ]       (Transformados)
        │
        ▼ .reduce((acc, n) => acc + n, 0)
      120              (Resultado Acumulado)
```

*Vantagens: estilo declarativo, imutabilidade e ausência de variáveis mutáveis de controle.*

---

## Métodos Funcionais: `map`, `filter` e `forEach`

```js
const products = [
  { name: "Teclado", price: 150, category: "hardware" },
  { name: "Mouse", price: 80, category: "hardware" },
  { name: "Livro JS", price: 50, category: "livros" },
];

// 1. filter: seleciona itens por predicado booleano
const hardware = products.filter((p) => p.category === "hardware");
console.log(hardware.length); // 2

// 2. map: transforma 1:1 e retorna novo array
const names = products.map((p) => p.name);
console.log(names); // [ 'Teclado', 'Mouse', 'Livro JS' ]

// 3. forEach: iteração voltada a efeitos colaterais
products.forEach((p) => console.log(`${p.name}: R$ ${p.price}`));
```

---

## Agregação com `.reduce()`

Reduz a coleção a um único valor acumulado (número, string ou objeto):

```js
const cart = [
  { item: "Notebook", price: 3500 },
  { item: "Mouse", price: 120 },
  { item: "Teclado", price: 250 },
];

// 1. Totalização numérica
const total = cart.reduce((acc, prod) => acc + prod.price, 0);
console.log(total); // 3870

// 2. Agrupamento e contagem de ocorrências
const tags = ["js", "web", "js", "node", "web", "js"];
const counts = tags.reduce((acc, tag) => {
  acc[tag] = (acc[tag] || 0) + 1;
  return acc;
}, {});
console.log(counts); // { js: 3, web: 2, node: 1 }
```

---

## Busca e Validação com Predicados

```js
const users = [
  { id: 1, name: "Ana", active: true },
  { id: 2, name: "Bob", active: false },
  { id: 3, name: "Carla", active: true },
];

// 1. find() e findIndex(): localiza primeiro item ou índice
console.log(users.find((u) => u.id === 2)); // { id: 2, name: 'Bob', active: false }
console.log(users.findIndex((u) => u.id === 3)); // 2

// 2. some(): retorna true se AO MENOS UM atender ao predicado
console.log(users.some((u) => !u.active)); // true

// 3. every(): retorna true se TODOS atenderem ao predicado
console.log(users.every((u) => u.active)); // false
```

---

## Execução Prática com Node.js

1. Criar o arquivo `array-demo.js`:

```js
// array-demo.js
const numbers = [10, 20, 30, 40, 50];
const filtered = numbers.filter((n) => n > 20);
const doubled = filtered.map((n) => n * 2);
const sum = doubled.reduce((total, n) => total + n, 0);

console.log("Filtrados (> 20):", filtered);
console.log("Dobrados:", doubled);
console.log("Soma Total:", sum);
```

2. Executar no terminal:
```bash
$ node array-demo.js
Filtrados (> 20): [ 30, 40, 50 ]
Dobrados: [ 60, 80, 100 ]
Soma Total: 240
```

---

## Exercício Prático: Pipeline de Vendas

Considere a seguinte lista de pedidos em um sistema de e-commerce:

```js
const orders = [
  { id: 1, amount: 200, status: "pago" },
  { id: 2, amount: 150, status: "pendente" },
  { id: 3, amount: 300, status: "pago" },
  { id: 4, amount: 80,  status: "cancelado" },
];
```

**Requisitos:**
1. Filtre apenas os pedidos com status `"pago"`.
2. Aplique um desconto de 10% em cada valor (`amount * 0.9`).
3. Calcule o faturamento total com desconto usando `.reduce()`.

---

## Solução do Exercício: Pipeline de Vendas

```js
const orders = [
  { id: 1, amount: 200, status: "pago" },
  { id: 2, amount: 150, status: "pendente" },
  { id: 3, amount: 300, status: "pago" },
  { id: 4, amount: 80,  status: "cancelado" },
];

const totalRevenue = orders
  .filter((order) => order.status === "pago")
  .map((order) => order.amount * 0.9)
  .reduce((acc, val) => acc + val, 0);

console.log(totalRevenue); // 450 (180 + 270)
```

---

## Desafio: Ordenação e Estatísticas

Considere o seguinte catálogo de produtos alimentícios:

```js
const catalog = [
  { name: "Óleo", price: 12 },
  { name: "Arroz", price: 25 },
  { name: "Açúcar", price: 8 },
  { name: "Feijão", price: 10 },
];
```

**Requisitos:**
1. Ordene o catálogo em ordem alfabética em português de forma imutável (`toSorted` e `localeCompare`).
2. Encontre o produto mais caro utilizando `.reduce()`.

---

## Solução do Desafio: Ordenação e Estatísticas

```js
const catalog = [
  { name: "Óleo", price: 12 },
  { name: "Arroz", price: 25 },
  { name: "Açúcar", price: 8 },
  { name: "Feijão", price: 10 },
];

// 1. Ordenação imutável com toSorted e localeCompare:
const sorted = catalog.toSorted((a, b) => a.name.localeCompare(b.name, "pt-BR"));
console.log(sorted.map((item) => item.name));
// [ 'Açúcar', 'Arroz', 'Feijão', 'Óleo' ]

// 2. Produto com maior preço via reduce:
const mostExpensive = catalog.reduce((max, cur) => cur.price > max.price ? cur : max);
console.log(mostExpensive);
// { name: 'Arroz', price: 25 }
```

---

## Perguntas de Revisão

- Por que `typeof []` retorna `"object"` e como validar arrays com segurança?
- Como os operadores `==` e `===` se comportam ao comparar dois arrays com mesmos valores?
- Qual a diferença entre cópia rasa com `...spread` e cópia profunda com `structuredClone()`?
- Por que `[10, 2, 5].sort()` não ordena numericamente e como corrigir?
- Como o método `localeCompare()` resolve ordenação de strings com acentos no idioma português?
- Quais as vantagens dos métodos não-mutadores do ES2023 (`toSorted`, `with`) sobre os clássicos?
- Em quais cenários devemos utilizar `reduce()` em vez de `map()` ou `filter()`?

---

## Resumo do Tópico

- **Criação e Tipagem**: declare com `[]`, valide com `Array.isArray()` e cuide do `length`.
- **Imutabilidade e Clonagem**: `===` compara endereços na Heap; use `spread` ou `structuredClone()`.
- **Iteração Limpa**: utilize `for...of` e `.entries()`, evitando a armadilha do `for...in`.
- **Mutação vs ES2023**: escolha métodos mutadores conscientemente ou prefira alternativas imutáveis.
- **Ordenação Precisa**: forneça comparador numérico `(a, b) => a - b` e `localeCompare("pt-BR")`.
- **Pipelines Funcionais**: combine `filter`, `map` e `reduce` para processar coleções com elegância.
