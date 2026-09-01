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
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "JavaScript: Arrays e Métodos Funcionais"
description: "Criação, geração de intervalos (range), manipulação, iteração, desestruturação, operador spread e principais métodos de Array em JavaScript."
---

<!-- _class: lead -->

# JavaScript: Arrays e Métodos Funcionais

Criação, desestruturação, `spread`, métodos funcionais (`map`/`filter`/`reduce`) e ES2023.

---

## Objetivo

Compreender a estrutura de dados de Array e dominar manipulações imperativas e funcionais.

- Criar arrays literais e gerar sequências com **`Array.from()`**.
- Acessar e modificar elementos com **`[i]`**, **`.at()`** e **desestruturação**.
- Clonar e concatenar listas usando o **operador Spread (`...`)**.
- Aplicar métodos mutadores (**`push`**, **`pop`**, **`splice`**, **`sort`**).
- Ordenar números (`(a, b) => a - b`) e strings com **`localeCompare("pt-BR")`**.
- Utilizar alternativas imutáveis do **ES2023** (**`toSorted`**, **`toReversed`**, **`with`**).
- Transformar e agregar coleções com **`map`**, **`filter`** e **`reduce`**.

---

## Mapa da Aula

- Criação, Verificação (`Array.isArray`) e Sequências (`Array.from`)
- Indexação, `length`, `.at()` e Desestruturação
- Operador Spread (`...`) e Iteração (`for...of`)
- Métodos Mutadores Clássicos (`splice`, `sort`)
- Ordenação de Números e Strings com `localeCompare`
- Métodos Não-Mutadores do ES2023 (`toSorted`, `with`)
- Métodos Funcionais de Coleção (`map`, `filter`, `reduce`)
- Busca, Verificação e Achatamento (`find`, `flat`)
- Exercício, Desafio e Revisão

---

## Criação e Estrutura de Arrays

Arrays em JavaScript são listas indexadas, dinâmicas e heterogêneas:

```js
// 1. Literal de Array (recomendado)
const numbers = [10, 20, 30, 40];
const mixed = [42, "JavaScript", true, { id: 1 }];

// 2. Verificação oficial com Array.isArray()
console.log(typeof numbers);        // "object"
console.log(Array.isArray(numbers)); // true
console.log(Array.isArray({}));      // false

// 3. Geração de sequências (range 1..5) com Array.from()
const range = Array.from({ length: 5 }, (_, i) => i + 1);
console.log(range); // [ 1, 2, 3, 4, 5 ]
```

---

## Acesso, Modificação e Método `.at()`

```js
const fruits = ["Maçã", "Banana", "Laranja", "Uva"];

// Leitura por colchetes e length
console.log(fruits.length); // 4
console.log(fruits[0]);     // "Maçã"

// Método .at() com suporte a índices negativos:
console.log(fruits.at(-1)); // "Uva" (último elemento)
console.log(fruits.at(-2)); // "Laranja" (penúltimo)

// Modificação direta
fruits[1] = "Manga";
console.log(fruits); // [ 'Maçã', 'Manga', 'Laranja', 'Uva' ]
```

---

## Desestruturação e Troca de Variáveis (Swap)

Extrai elementos posicionais para variáveis independentes:

```js
const colors = ["vermelho", "verde", "azul", "amarelo"];

// Desestruturação com operador Rest (...)
const [first, second, ...rest] = colors;
console.log(first);  // "vermelho"
console.log(second); // "verde"
console.log(rest);   // [ 'azul', 'amarelo' ]

// Troca de variáveis (Swap) sem variável temporária:
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2 1
```

---

## Operador Spread (`...`) e Cópia Rasa

Permite espalhar elementos para clonagem e fusão sem mutação:

```js
const frontend = ["HTML", "CSS"];
const backend = ["Node.js", "Express"];

// 1. Fusão de múltiplos arrays
const fullstack = [...frontend, "JavaScript", ...backend];
console.log(fullstack);
// [ 'HTML', 'CSS', 'JavaScript', 'Node.js', 'Express' ]

// 2. Cópia rasa (shallow copy)
const original = [1, 2, 3];
const copy = [...original];
copy.push(4);
console.log(original); // [ 1, 2, 3 ] (intocado)
```

---

## Iteração: `for...of` vs `for...in`

```js
const stack = ["React", "Astro", "Vue"];

// ✅ Recomendado: for...of itera sobre os VALORES
for (const item of stack) {
  console.log(item); // "React" -> "Astro" -> "Vue"
}

// ❌ Evite for...in: itera sobre chaves/índices e propriedades herdadas
for (const index in stack) {
  console.log(index, typeof index); // "0" 'string', "1" 'string'...
}
```

- Para obter índice e valor ao mesmo tempo, use `stack.entries()`.

---

## Métodos Mutadores Clássicos

Alteram o array original na memória:

```js
const list = [2, 3];

list.push(4);        // Insere no fim: [ 2, 3, 4 ]
list.unshift(1);     // Insere no início: [ 1, 2, 3, 4 ]
const last = list.pop();     // Remove do fim (4): [ 1, 2, 3 ]
const first = list.shift();  // Remove do início (1): [ 2, 3 ]

// splice(início, deleteCount, ...itens)
const months = ["Jan", "Fev", "Mar", "Abr"];
months.splice(1, 2, "Novo"); // No índice 1, remove 2 e insere "Novo"
console.log(months); // [ 'Jan', 'Novo', 'Abr' ]
```

---

## O Método `.sort()` e Ordenação Numérica

Por padrão, `.sort()` converte itens para string e compara códigos Unicode:

```js
const nums = [10, 2, 5, 1, 20];

// ❌ Ordenação padrão (comportamento alfabético incorreto para números):
nums.sort();
console.log(nums); // [ 1, 10, 2, 20, 5 ]

// ✅ Ordenação numérica crescente correta (função comparadora):
nums.sort((a, b) => a - b);
console.log(nums); // [ 1, 2, 5, 10, 20 ]

// Ordenação decrescente:
nums.sort((a, b) => b - a);
console.log(nums); // [ 20, 10, 5, 2, 1 ]
```

---

## Ordenação de Strings com `localeCompare`

Operadores padrão colocam maiúsculas e acentos fora da ordem alfabética:

```js
const fruits = ["Maçã", "abacaxi", "Água", "banana"];

// ❌ Padrão Unicode: 'M' e 'Á' ficam fora da ordem gramatical
fruits.sort();
console.log(fruits); // [ 'Maçã', 'banana', 'abacaxi', 'Água' ]

// ✅ Ordem gramatical correta em português (pt-BR) com localeCompare:
fruits.sort((a, b) => a.localeCompare(b, "pt-BR"));
console.log(fruits); // [ 'abacaxi', 'Água', 'banana', 'Maçã' ]
```

- `strA.localeCompare(strB, "pt-BR")` respeita acentos e regras do idioma.

---

## Métodos Não-Mutadores Modernos (ES2023)

Retornam uma **nova cópia processada** sem alterar o array original:

```js
const numbers = [3, 1, 4, 1, 5];

// 1. toSorted(): cópia ordenada
const sorted = numbers.toSorted((a, b) => a - b);
console.log(sorted);  // [ 1, 1, 3, 4, 5 ]
console.log(numbers); // [ 3, 1, 4, 1, 5 ] (inalterado)

// 2. with(): substituição em posição específica
const updated = numbers.with(0, 99);
console.log(updated); // [ 99, 1, 4, 1, 5 ]

// 3. toReversed(): cópia invertida
console.log(numbers.toReversed()); // [ 5, 1, 4, 1, 3 ]
```

---

## Métodos Funcionais: `map` e `filter`

Transformação e filtragem puras sem mutação:

```js
const products = [
  { name: "Teclado", price: 150, category: "hardware" },
  { name: "Mouse", price: 80, category: "hardware" },
  { name: "Livro JS", price: 50, category: "livros" },
];

// 1. filter(): seleciona itens que atendem ao critério
const hardware = products.filter((p) => p.category === "hardware");
console.log(hardware.length); // 2

// 2. map(): transforma cada item em um novo valor
const productNames = products.map((p) => p.name);
console.log(productNames); // [ 'Teclado', 'Mouse', 'Livro JS' ]
```

---

## Agregação com `.reduce()`

Reduz a coleção inteira a um único valor final acumulado:

```js
const cart = [
  { item: "Notebook", price: 3500 },
  { item: "Mouse", price: 120 },
  { item: "Teclado", price: 250 },
];

// Calcula o total acumulando o preço (valor inicial: 0)
const total = cart.reduce((acc, prod) => acc + prod.price, 0);
console.log(total); // 3870

// Contagem de ocorrências por categoria
const tags = ["js", "web", "js", "node", "web", "js"];
const counts = tags.reduce((acc, tag) => {
  acc[tag] = (acc[tag] || 0) + 1;
  return acc;
}, {});
console.log(counts); // { js: 3, web: 2, node: 1 }
```

---

## Busca e Verificação em Arrays

```js
const users = [
  { id: 1, name: "Ana", active: true },
  { id: 2, name: "Bob", active: false },
  { id: 3, name: "Carla", active: true },
];

// 1. find() e findIndex(): localiza o primeiro elemento
console.log(users.find((u) => u.id === 2)); // { id: 2, name: 'Bob', active: false }
console.log(users.findIndex((u) => u.id === 3)); // 2

// 2. some() e every(): testes booleanos na coleção
console.log(users.some((u) => !u.active)); // true (existe ao menos um inativo)
console.log(users.every((u) => u.active)); // false (nem todos estão ativos)

// 3. includes(): verificação de valor primitivo
console.log([10, 20, 30].includes(20)); // true
```

---

## Fatiamento e Achatamento: `slice` e `flat`

```js
const numbers = [1, 2, 3, 4, 5];

// 1. slice(start, end): extrai cópia de trecho
console.log(numbers.slice(1, 4));  // [ 2, 3, 4 ]
console.log(numbers.slice(-2));    // [ 4, 5 ]

// 2. flat(depth): achata arrays aninhados
const nested = [1, [2, [3, 4]]];
console.log(nested.flat(1)); // [ 1, 2, [ 3, 4 ] ]
console.log(nested.flat(2)); // [ 1, 2, 3, 4 ]

// 3. flatMap(): mapeia e achata em etapa única
const phrases = ["Olá mundo", "DevLab Web"];
console.log(phrases.flatMap((p) => p.split(" ")));
// [ 'Olá', 'mundo', 'DevLab', 'Web' ]
```

---

## Exercício Prático: Pipeline de Vendas

1. Filtre apenas os pedidos com status `"pago"`.
2. Aplique 10% de desconto em cada valor com `.map()`.
3. Some o faturamento total com `.reduce()`.

```js
const orders = [
  { id: 1, amount: 200, status: "pago" },
  { id: 2, amount: 150, status: "pendente" },
  { id: 3, amount: 300, status: "pago" },
];
```

---

## Solução do Exercício

```js
const orders = [
  { id: 1, amount: 200, status: "pago" },
  { id: 2, amount: 150, status: "pendente" },
  { id: 3, amount: 300, status: "pago" },
];

const totalRevenue = orders
  .filter((order) => order.status === "pago")
  .map((order) => order.amount * 0.9)
  .reduce((acc, val) => acc + val, 0);

console.log(totalRevenue); // 450 (180 + 270)
```

---

## Desafio: Ordenação e Estatísticas

1. Crie uma lista de produtos com `name` e `price`.
2. Ordene a lista por nome alfabético em português usando `toSorted()` e `localeCompare()`.
3. Calcule o produto mais caro usando `reduce()`.

```js
const catalog = [
  { name: "Óleo", price: 12 },
  { name: "Arroz", price: 25 },
  { name: "Açúcar", price: 8 },
];
```

---

## Solução do Desafio

```js
const catalog = [
  { name: "Óleo", price: 12 },
  { name: "Arroz", price: 25 },
  { name: "Açúcar", price: 8 },
];

// 2. Ordenação correta em português com toSorted e localeCompare:
const sortedCatalog = catalog.toSorted((a, b) =>
  a.name.localeCompare(b.name, "pt-BR")
);

console.log(sortedCatalog.map((c) => c.name));
// [ 'Açúcar', 'Arroz', 'Óleo' ]

// 3. Mais caro com reduce:
const mostExpensive = catalog.reduce((max, cur) =>
  cur.price > max.price ? cur : max
);

console.log(mostExpensive);
// { name: 'Arroz', price: 25 }
```

---

## Perguntas de Revisão

- Por que `typeof []` retorna `"object"` e como testar arrays corretamente?
- Qual a diferença entre `array.sort()` e `array.toSorted()` (ES2023)?
- Por que `[10, 2, 5].sort()` resulta em `[1, 10, 2, 20, 5]` sem comparador?
- Como o método `localeCompare()` resolve ordenação de strings com acentos no array?
- Qual a diferença prática entre `map()` e `forEach()`?
- Em quais cenários devemos utilizar `reduce()`?
- Para que servem os métodos `some()` e `every()`?

---

## Resumo da Aula

- **Criação e Checagem**: use `[]`, `Array.from()` e valide com `Array.isArray()`.
- **Acesso Moderno**: utilize `.at(-1)` para índices a partir do final.
- **Imutabilidade**: prefira `spread (...)`, `map`, `filter` e métodos do ES2023 (`toSorted`, `with`).
- **Ordenação Cuidadosa**: use `(a, b) => a - b` para números e `localeCompare("pt-BR")` para strings.
- **Transformação e Redução**: encadeie `filter`, `map` e `reduce` para pipelines funcionais limpos.
