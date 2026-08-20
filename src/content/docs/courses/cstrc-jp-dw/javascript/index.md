---
title: Introdução ao JavaScript
description: Sintaxe moderna de JavaScript usada ao longo da disciplina.
course: cstrc-jp-dw
sidebar:
  label: Introdução ao JavaScript
  order: 1
---

Se o [HTML](../html/) descreve *o que* a página contém, o JavaScript descreve *o que
ela faz*. Esta aula revisa a sintaxe moderna (ES2015+) que aparece em todo o restante
da disciplina — tanto no navegador quanto no servidor.

## Declaração de variáveis

Use `const` por padrão e `let` apenas quando o valor precisar mudar. `var` não é
usado em código moderno.

```js title="variaveis.js"
const nome = 'Ana';
let contador = 0;

contador += 1;
```

## Funções

Funções de seta são a forma mais comum em callbacks e retornos curtos.

```js title="funcoes.js" {5-7}
function somar(a, b) {
  return a + b;
}

const dobrar = (numero) => numero * 2;

const usuarios = [1, 2, 3].map(dobrar);
```

## Objetos e desestruturação

A desestruturação aparece constantemente ao ler dados de uma requisição.

```js title="objetos.js" showLineNumbers
const usuario = { id: 1, name: 'Ana', email: 'ana@example.com' };

const { name, email } = usuario;

const copia = { ...usuario, name: 'Ana Silva' };
```

## Arrays

Os métodos abaixo substituem quase todos os `for` que você escreveria:

```js title="arrays.js"
const usuarios = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Bruno' },
];

const nomes = usuarios.map((usuario) => usuario.name);
const encontrado = usuarios.find((usuario) => usuario.id === 2);
const filtrados = usuarios.filter((usuario) => usuario.name.startsWith('A'));
```

## Template literals

```js title="templates.js"
const name = 'Ana';

console.log(`Olá, ${name}!`);
```

## Operadores úteis

```js title="operadores.js" {4,7}
const config = {};

// Encadeamento opcional: não quebra se `servidor` não existir.
const porta = config.servidor?.porta;

// Coalescência nula: usa o padrão apenas se for null/undefined.
const portaFinal = porta ?? 3000;
```

## Exercício

Crie um arquivo `exercicio.js` com um array de produtos (`id`, `nome`, `preco`) e:

1. imprima o nome de todos os produtos;
2. calcule o preço total com `reduce`;
3. encontre o produto mais caro.

## Próxima aula

[Modules](modules/) — como dividir o código em arquivos.
