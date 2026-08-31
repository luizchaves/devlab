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
title: "JavaScript: Arrays e Métodos Funcionais"
description: "Criação, geração de intervalos (range), manipulação, iteração, desestruturação, operador spread e principais métodos de Array em JavaScript."
---

<!-- _class: lead -->

# JavaScript: Arrays e Métodos Funcionais

Criação, geração de intervalos (range), manipulação, iteração, desestruturação, operador spread e principais métodos de Array em JavaScript.

---

## Objetivo

- Reconhecer a estrutura de dados de Array em JavaScript, dominar técnicas de criação, geração de intervalos numéricos (range).

---

## Mapa da Aula

- Criação e Estrutura de Arrays
- Acesso, Modificação e Propriedade length
- Operador Spread e Desestruturação (Destructuring)
- Iteração em Arrays
- Métodos do Objeto Array
- Resumo e Boas Práticas

---

## Criação e Estrutura de Arrays

- Em JavaScript, um Array é uma lista ordenada de valores.
- O exemplo a seguir demonstra as principais formas de declarar e instanciar arrays em JavaScript
- Referência: Array | MDN.

---

## Criação e Estrutura de Arrays (Comparação)

| Característica | Descrição | Exemplo |
| -------------- | --------- | ------- |
| **Notação Literal** | Forma mais comum e recomendada de criar arrays | `const items = [1, 2, 3];` |
| **Indexação** | Elementos são acessados por índices inteiros a partir de 0 | `items[0]` // `1` |
| **Heterogeneidade** | Pode armazenar primitivos, objetos e até outros arrays | `[42, "texto", true, { id: 1 }]` |
| **Tipo de Dado** | Internamente é um objeto especial | `typeof []` // `"object"` |
| **Verificação** | Teste oficial para checar se um valor é array | `Array.isArray([])` // `true` |

---

## Criação e Estrutura de Arrays (Exemplo)

```js
// 1. Literal de Array (forma recomendada)
const numbers = [10, 20, 30, 40];
const empty = [];

// 2. Arrays com múltiplos tipos de dados
const mixed = [42, "JavaScript", true, null, { role: "admin" }, [1, 2]];

// 3. Construtor Array
const items = new Array(10, 20, 30); // [10, 20, 30]
const fixedLength = new Array(5);    // Cria um array com 5 posições vazias (<5 empty items>)

// 4. Array.from() - Cria array a partir de iteráveis ou coleções
// ...
```

---

## Acesso, Modificação e Propriedade length

- Os elementos de um array são acessados e modificados usando colchetes e índices numéricos inteiros.
- O primeiro elemento fica no índice `0` e o último no índice `array.length - 1`.

---

## Notação de Colchetes e .at()

- O acesso aos elementos de um array pode ser feito utilizando colchetes com índices inteiros a partir de `0` ou através do método `.

---

## Notação de Colchetes e .at() (Exemplo)

```js
const colors = ["vermelho", "verde", "azul"];

// Leitura por índice
console.log(colors[0]); // "vermelho"
console.log(colors[2]); // "azul"
console.log(colors[3]); // undefined (índice inexistente)

// Novo método .at() (aceita índices negativos a partir do final)
console.log(colors.at(0));  // "vermelho"
console.log(colors.at(-1)); // "azul" (último elemento)
console.log(colors.at(-2)); // "verde" (penúltimo elemento)

// ...
```

---

## A Propriedade length e Arrays Esparsos

- A propriedade `length` indica o número de posições do array.

---

## A Propriedade length e Arrays Esparsos (Exemplo)

```js
const fruits = ["maçã", "banana", "laranja"];
console.log(fruits.length); // 3

// Atribuindo valor a um índice distante cria posições vazias (array esparso)
fruits[5] = "uva";
console.log(fruits);        // [ 'maçã', 'banana', 'laranja', <2 empty items>, 'uva' ]
console.log(fruits.length); // 6
console.log(fruits[3]);     // undefined

// Reduzindo o length diretamente altera/trunca o array!
fruits.length = 2;
console.log(fruits); // [ 'maçã', 'banana' ] (elementos excedentes foram descartados)
```

---

## O Operador delete

- O operador `delete` pode ser usado em arrays, mas deve ser evitado na maioria dos cenários.
- O operador `delete` remove o valor mas mantém a chave/posição como um slot vazio (empty).
- Para remover elementos reajustando o tamanho do array, utilize métodos como `.splice()`, `.pop()`, `.shift()` ou `.filter()`.

---

## O Operador delete (Exemplo)

```js
const numbers = [10, 20, 30, 40];
delete numbers[2];

console.log(numbers);        // [ 10, 20, <1 empty item>, 40 ]
console.log(numbers.length); // 4 (o tamanho NÃO diminuiu)
console.log(numbers[2]);     // undefined
```

---

## Operador Spread (`...`)

- O operador `...` permite espalhar os elementos de um array dentro de outro array ou como argumentos de uma função.

---

## Operador Spread (`...`) (Exemplo)

```js
const original = [1, 2, 3];

// Cópia superficial (novo array na memória)
const copy = [...original];
copy.push(4);
console.log(original); // [ 1, 2, 3 ] (permanece inalterado)
console.log(copy);     // [ 1, 2, 3, 4 ]

// Concatenação de múltiplos arrays
const front = ["HTML", "CSS"];
const back = ["Node.js", "SQL"];
const fullstack = [...front, "JavaScript", ...back];

console.log(fullstack); // [ 'HTML', 'CSS', 'JavaScript', 'Node.js', 'SQL' ]
```

---

## Desestruturação de Arrays

- A desestruturação permite extrair valores de um array diretamente para variáveis de forma posicional.
- Referência: Destructuring assignment | MDN.

---

## Desestruturação de Arrays (Exemplo)

```js
const coords = [10, 20, 30];

// Extraindo posições por ordem
const [x, y] = coords;
console.log(x); // 10
console.log(y); // 20

// Pulando posições e definindo valor padrão
const [first, , third, fourth = 0] = [100, 200, 300];
console.log(first);  // 100
console.log(third);  // 300
console.log(fourth); // 0 (assumiu valor padrão por falta de elemento)
// ...
```

---

## Iteração em Arrays

- Os índices são convertidos para `string` (ex: `"0"`, `"1"`).
- A ordem de iteração não é garantidamente numérico-sequencial.
- Propriedades adicionais ou herdadas do protótipo também serão percorridas.
- Iterar sobre os elementos de um array é uma das operações mais frequentes em programação Web.
- JavaScript oferece diversas formas de percorrer arrays.

---

## Iteração em Arrays (Comparação)

| Estrutura | Sintaxe | Uso Principal |
| --------- | ------- | ------------- |
| `for` tradicional | `for (let i = 0; i < arr.length; i++)` | Controle total sobre índices e passos |
| `for...of` | `for (const item of arr)` | Percorrer valores de forma simples e legível |
| `forEach()` | `arr.forEach((item, index) => ...)` | Executar uma função para cada elemento |

---

## Iteração em Arrays (Exemplo)

```js
const languages = ["JavaScript", "Python", "Java", "C#"];

// 1. Laço for tradicional
console.log("--- Laço for ---");
for (let i = 0; i < languages.length; i++) {
  console.log(`Índice ${i}: ${languages[i]}`); // "Índice 0: JavaScript", "Índice 1: Python", ...
}

// 2. Laço for...of (Recomendado para iterar valores)
console.log("--- Laço for...of ---");
for (const lang of languages) {
  console.log(lang); // "JavaScript", "Python", "Java", "C#"
// ...
```

---

## Métodos do Objeto Array

- Mutadores: Alteram o array original (in-place).
- Não-Mutadores Modernos (ES2023): Alternativas imutáveis (Change Array by Copy) para alteração de elementos.
- Acessores / Consulta: Não alteram o array original e retornam um novo valor ou array.
- Iteradores / Funcionais (Higher-Order Functions): Recebem uma função de callback para processar os elementos.
- Geradores de Intervalos (Range): Técnicas avançadas com `Array.from()`, `fill()`.

---

## Métodos Mutadores (Modificam o Array Original)

- Estes métodos alteram diretamente o array sobre o qual foram chamados.
- O código a seguir exemplifica a utilização dos métodos mutadores para inserção, remoção e alteração de elementos no array
- Por padrão, o método `.sort()` converte os elementos em `string` e os ordena em ordem lexicográfica (alfabética).
- Para ordenar números ou objetos de forma customizada, é necessário passar uma função de comparação `(a, b) => ...`.
- Algoritmo de Ordenação (Timsort): Nas engines JavaScript modernas (como a V8 do Node.js e Chrome).

---

## Métodos Mutadores (Modificam o Array Original) (Comparação)

| Método | Ação | Retorno |
| ------ | ---- | ------- |
| `push(...items)` | Adiciona um ou mais elementos ao **final** | Novo `length` |
| `pop()` | Remove e retorna o **último** elemento | O elemento removido |
| `unshift(...items)` | Adiciona um ou mais elementos no **início** | Novo `length` |
| `shift()` | Remove e retorna o **primeiro** elemento | O elemento removido |
| `splice(start, deleteCount, ...items)` | Adiciona/remove elementos em qualquer posição | Array com elementos removidos |

---

## Métodos Mutadores (Modificam o Array Original) (Exemplo)

```js
const stack = [10, 20];

// Inserção e remoção nas extremidades
stack.push(30);       // Adiciona 30 no final -> [10, 20, 30]
stack.unshift(5);     // Adiciona 5 no início -> [5, 10, 20, 30]
const last = stack.pop();   // Remove 30 -> stack fica [5, 10, 20]
const first = stack.shift(); // Remove 5  -> stack fica [10, 20]

console.log(last, first); // 30 5
console.log(stack);       // [ 10, 20 ]

// Uso do splice() para alteração, inserção e remoção no meio do array
// ...
```

---

## Métodos Não-Mutadores Modernos (ES2023)

- No ES2023, o JavaScript introduziu o conjunto de métodos Change Array by Copy (`toSorted`, `toReversed`, `toSpliced` e `with`).
- Eles oferecem alternativas imutáveis para operações clássicas de manipulação de arrays.

---

## Métodos Não-Mutadores Modernos (ES2023) (Comparação)

| Método Mutador / Clássico | Equivalente Não-Mutador (ES2023) | Descrição do Resultado |
| ------------------------- | -------------------------------- | --------------------- |
| `sort(compareFn)` | `toSorted(compareFn)` | Retorna um novo array ordenado |
| `reverse()` | `toReversed()` | Retorna um novo array invertido |
| `splice(start, deleteCount, ...items)` | `toSpliced(start, deleteCount, ...items)` | Retorna um novo array com as alterações aplicadas |
| `arr[index] = newValue` | `with(index, newValue)` | Retorna um novo array substituindo a posição informada |
| `find(fn)` | `findLast(fn)` | Retorna o **último** elemento que atende à condição |

---

## Métodos Não-Mutadores Modernos (ES2023) (Exemplo)

```js
const numbers = [3, 1, 4, 1, 5, 9];

// 1. toSorted(): Cópia ordenada (original inalterado)
const sorted = numbers.toSorted((a, b) => a - b);
console.log(sorted);  // [ 1, 1, 3, 4, 5, 9 ]
console.log(numbers); // [ 3, 1, 4, 1, 5, 9 ]

// 2. toReversed(): Cópia invertida (original inalterado)
const reversed = numbers.toReversed();
console.log(reversed); // [ 9, 5, 1, 4, 1, 3 ]
console.log(numbers);  // [ 3, 1, 4, 1, 5, 9 ]

// ...
```

---

## Métodos Acessores e de Consulta (Preservam o Array Original)

- Estes métodos não modificam o array original.
- Em vez disso, calculam e retornam um novo valor ou uma nova cópia de parte do array.
- O exemplo abaixo demonstra como utilizar os métodos acessores para realizar buscas.

---

## Métodos Acessores e de Consulta (Preservam o Array Original) (Comparação)

| Método | Descrição | Retorno |
| ------ | --------- | ------- |
| `includes(value)` | Verifica se um valor existe no array | `boolean` |
| `indexOf(value)` | Procura o primeiro índice do valor | Índice ou `-1` se não achar |
| `lastIndexOf(value)` | Procura o último índice do valor | Índice ou `-1` se não achar |
| `join(separator)` | Concatena todos os elementos em uma string | `string` |
| `slice(start, end)` | Extrai uma fatia do array sem alterar o original | Novo `Array` |

---

## Métodos Acessores e de Consulta (Preservam o Array Original) (Exemplo)

```js
const letters = ["a", "b", "c", "d", "b"];

// Busca de valores e índices
console.log(letters.includes("c"));   // true
console.log(letters.includes("z"));   // false
console.log(letters.indexOf("b"));    // 1
console.log(letters.lastIndexOf("b"));// 4

// Conversão para string com join()
const tags = ["web", "javascript", "frontend"];
console.log(tags.join(" - ")); // "web - javascript - frontend"

// ...
```

---

## Métodos de Iteração e Programação Funcional (Higher-Order Functions)

- Estilo Declarativo: Em vez de controlar manualmente variáveis e índices em laços `for` (estilo imperativo).
- Imutabilidade e Funções Puras: Os métodos funcionais não alteram o array original.
- Encadeamento (Chaining): Permite compor pipelines de dados elegantes encadeando chamadas consecutivas (ex: `arr.filter(...).map(...)`).
- Em JavaScript, funções são cidadãs de primeira classe (First-Class Citizens).
- O uso de HOFs aproxima o desenvolvimento do Paradigma Funcional, trazendo vantagens essenciais

---

## Métodos de Iteração e Programação Funcional (Higher-Order Functions) (Comparação)

| Método | O que a função callback deve retornar | Retorno do método |
| ------ | ------------------------------------- | ----------------- |
| `map(fn)` | O novo valor transformado | Novo array com valores transformados |
| `filter(fn)` | `true` para manter o item, `false` para descartar | Novo array com itens filtrados |
| `reduce(fn, init)` | O acumulador atualizado a cada iteração | Valor único acumulado |
| `every(fn)` | `true` se o item atende à condição | `true` se **todos** atenderem |
| `some(fn)` | `true` se o item atende à condição | `true` se **ao menos um** atender |

---

## Métodos de Iteração e Programação Funcional (Higher-Order Functions) (Exemplo)

```js
const numbers = [1, 2, 3, 4, 5, 6];

// map(): Cria um novo array dobrando os valores
const doubled = numbers.map((n) => n * 2);
console.log(doubled); // [ 2, 4, 6, 8, 10, 12 ]

// filter(): Cria um novo array contendo apenas os números pares
const evens = numbers.filter((n) => n % 2 === 0);
console.log(evens); // [ 2, 4, 6 ]

// Encadeamento (Chaining) de métodos funcionais
const result = numbers
// ...
```

---

## Resumo e Boas Práticas

- Use a notação literal `[]` para criar arrays.
- Teste se um valor é um array com `Array.isArray(valor)`.
- Evite o operador `delete`; prefira métodos mutadores ou imutáveis.
- Em aplicações modernas, dê preferência a métodos que não alteram o original (`map`, `filter`, `reduce`, `concat`, `slice`.
- Para ordenação sem alterar o original, utilize os métodos imutáveis modernos como `.toSorted()`.

---

## Gerando Intervalos e Sequências Numéricas (*Range*)

- Ao contrário de linguagens como Python (que possuem a função nativa `range()`).
- No entanto, é muito comum precisar gerar sequências numéricas para repetições ou iterações.
- Existem diversas formas idiomáticas de criar um range em JavaScript utilizando os métodos estáticos e funcionais do `Array`

---

## Gerando Intervalos e Sequências Numéricas (*Range*) (Exemplo)

```js
// 1. Usando Array.from() com { length } e função mapeadora (Mais Elegante e Recomendado)
const range = (start, end, step = 1) =>
  Array.from({ length: Math.ceil((end - start) / step) }, (_, i) => start + i * step);

console.log(range(1, 6));      // [1, 2, 3, 4, 5]
console.log(range(10, 50, 10)); // [10, 20, 30, 40]

// 2. Usando operador Spread com Array.prototype.keys()
const range0to4 = [...Array(5).keys()]; // [0, 1, 2, 3, 4]
const range1to5 = [...Array(5).keys()].map(n => n + 1); // [1, 2, 3, 4, 5]

// 3. Usando Array().fill() + map()
// ...
```

---

## Criação e Acesso

- Qual é a diferença entre acessar um índice inexistente em um Array e tentar acessar uma propriedade em um valor `undefined`?
- Acessar um índice inexistente em um array (ex: `arr[99]`) retorna `undefined`.
- Tentar acessar uma propriedade ou índice de algo que já é `undefined` (ex: `undefined[0]`) lança um erro `TypeError`.
- Por que o operador `typeof` não é suficiente para confirmar se um valor é um Array?
- Porque em JavaScript arrays são objetos, logo `typeof []` retorna `"object"`.

---

## Métodos e Mutabilidade

- Qual é a diferença essencial entre métodos Mutadores e Acessores?
- Métodos mutadores (como `push`, `pop`, `splice`, `sort`) alteram o array original na memória.
- Métodos acessores (como `slice`, `concat`, `includes`, `join`) não modificam o array original e retornam um novo array ou valor.
- Por que `[10, 2, 5].sort()` não ordena os números em ordem crescente por padrão e qual algoritmo as engines utilizam?
- Porque o método `.sort()` sem parâmetros converte os elementos em strings e compara seus caracteres lexicograficamente.

---

## Programação Funcional e HOFs

- Qual é a principal diferença entre os métodos `.forEach()` e `.map()`?
- `.forEach()` apenas executa uma função de callback para cada elemento para produzir efeitos colaterais e retorna `undefined`.
- `.map()` executa o callback e constrói um novo array com os valores retornados por cada execução.
- Quando se deve usar `.find()` em vez de `.filter()`?
- Use `.find()` quando desejar obter apenas o primeiro elemento que satisfaça a condição (ou `undefined`).

---

## Executando

- Crie um arquivo chamado `array-demo.js`
- Execute o arquivo com Node.js no terminal
- Modifique os valores do array e teste outros métodos funcionais para fixar o aprendizado.
- Os conceitos de manipulação de Arrays podem ser testados diretamente no terminal com o Node.js.

---

## Exercício

- Crie um array inicial `products` contendo os nomes: `"Teclado"`, `"Mouse"`, `"Monitor"`;
- Adicione `"Headset"` no final do array e `"Webcam"` no início;
- Verifique se o item `"Mouse"` existe no array e exiba seu índice;
- Remova o último elemento do array e armazene-o em uma variável `removedItem`;
- Imprima a lista final de produtos ordenada em ordem alfabética e o item removido.

---

## Desafio

- Crie um array `inventory` contendo objetos com as propriedades `id`, `name`, `price` e `stock`;
- Utilize `filter` para selecionar apenas os produtos que possuem estoque disponível (`stock > 0`);
- Utilize `map` para criar um novo array de produtos aplicando um desconto de `10%` no preço de cada item;
- Utilize `reduce` para calcular o valor total investido no estoque atual (soma de `price * stock` de todos os produtos);
- Exiba no console a lista final de produtos com desconto e o valor total acumulado do estoque.

---

## Resumo da Aula

- **Estrutura & Verificação**: Coleções dinâmicas e heterogêneas; verificação oficial com `Array.isArray(arr)`.
- **Mutadores vs Imutáveis**: `push`, `pop`, `splice`, `sort` alteram o original; `slice`, `concat` geram novas instâncias.
- **Métodos por Cópia (ES2023)**: `toSorted()`, `toReversed()`, `toSpliced()` e `with(index, val)` para transformações puras e imutáveis.
- **HOFs de Iteração**: `map()` para transformação 1:1, `filter()` para filtragem booleana e `reduce()` para acumulação de valores.
- **Buscas Avançadas**: `find()`, `findIndex()`, `findLast()`, `some()`, `every()` e `includes()`.
