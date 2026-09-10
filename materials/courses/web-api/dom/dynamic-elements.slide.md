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
title: "Web APIs: Elementos Dinâmicos"
description: "Slides completos do tópico Web APIs: Elementos Dinâmicos."
---

<!-- _class: lead -->

# Web APIs: Elementos Dinâmicos

Página estática x dinâmica · criação de nós · `DocumentFragment` · `<template>`

---

## Objetivo

- Diferenciar **página estática** de interface dinâmica no cliente.
- Criar nós com `createElement()` e inseri-los com `appendChild()`.
- Usar `insertAdjacentHTML()` quando a marcação controlada vem como string.
- Reduzir *reflows* agrupando inserções com `DocumentFragment`.
- Clonar estruturas declaradas em `<template>` sem concatenar HTML.

---

## Mapa do Tópico

- **Modelo mental**: quando o HTML pronto vira interface reativa.
- **Criação de nós**: elemento em memória, conteúdo e inserção.
- **Inserção por posição**: `insertAdjacentHTML()` em pontos específicos.
- **Performance**: lote em memória com `DocumentFragment`.
- **Reutilização**: `<template>` como molde inerte.

---

## Página Estática x Dinâmica

O ponto de virada é o DOM mudar depois do carregamento inicial.

| Modelo | Mudança na tela | APIs principais |
| --- | --- | --- |
| Estática | HTML já contém o conteúdo | DOM para leitura |
| Dinâmica no cliente | JS altera partes da interface | DOM, eventos, `fetch`, storage |
| Dinâmica com servidor | servidor entrega dados ou marcação | REST, GraphQL, SSR, CORS |

---

## Fluxo de uma Interface Dinâmica

Dados e eventos entram; nós DOM saem como atualização visual.

```txt title="Fluxo de uma interface dinâmica"
┌────────────┐   ┌─────────────┐   ┌──────────────┐
│ evento ou  │──>│ JavaScript  │──>│ novos nós DOM │
│ dados API  │   │ decide      │   │ entram na UI  │
└────────────┘   └─────────────┘   └──────────────┘
                         │
                         └── estado, validação e segurança
```

---

## Criação de Nós

A criação acontece fora da árvore visível; a inserção torna o nó parte da página.

```js title="Criação e inserção de um card"
const card = document.createElement('div');
card.classList.add('card-produto');

const titulo = document.createElement('h3');
titulo.textContent = 'Notebook Gamer';

card.appendChild(titulo);
document.querySelector('#lista-produtos').appendChild(card);
```

---

## Inserção por Posição

`insertAdjacentHTML()` escolhe onde a marcação entra em relação ao elemento alvo.

```txt title="Posições do insertAdjacentHTML"
beforebegin
<div id="container">
  afterbegin
  ...conteúdo atual...
  beforeend
</div>
afterend
```

```js title="Inserção antes do fechamento"
container.insertAdjacentHTML(
  'beforeend',
  '<div class="item">Novo item</div>'
);
```

---

## Performance com `DocumentFragment`

Monte o lote em memória e faça uma inserção visível.

```txt title="Lote em memória antes do DOM"
Memória                         DOM visível
┌──────────────────────┐        ┌──────────────┐
│ DocumentFragment     │        │ ul#lista      │
│ ├─ li Teclado        │──1x───>│ ├─ li Teclado │
│ ├─ li Mouse          │ append │ ├─ li Mouse   │
│ └─ li Monitor        │        │ └─ li Monitor │
└──────────────────────┘        └──────────────┘
```

*Menos inserções diretas reduzem recálculos de layout.*

---

## `DocumentFragment`: Exemplo

O fragmento recebe todos os itens antes de tocar a árvore principal.

```js title="Inserção em lote com fragmento"
const produtos = ['Teclado', 'Mouse', 'Monitor'];
const fragmento = document.createDocumentFragment();

produtos.forEach((nome) => {
  const item = document.createElement('li');
  item.textContent = nome;
  fragmento.appendChild(item);
});

document.querySelector('#lista').appendChild(fragmento);
```

---

## `<template>` como Molde

O conteúdo do `<template>` é lido pelo navegador, mas não aparece até ser clonado.

```html title="Molde HTML inerte"
<template id="card-template">
  <div class="card">
    <h3 class="card-title"></h3>
    <button>Ver detalhes</button>
  </div>
</template>
```

```js title="Clonagem e preenchimento do template"
const clone = template.content.cloneNode(true);
clone.querySelector('.card-title').textContent = 'Projeto Alpha';
container.appendChild(clone);
```

---

## Escolha da Técnica

A técnica depende do volume, da origem da marcação e do risco de segurança.

| Situação | Escolha |
| --- | --- |
| Um elemento isolado | `createElement()` + `appendChild()` |
| Lista grande | `DocumentFragment` |
| Estrutura repetida no HTML | `<template>` + `cloneNode(true)` |
| Texto externo | `textContent`, não `innerHTML` |

---

## Executando

Teste a criação dinâmica no Console do DevTools.

```js title="Criação dinâmica no Console"
const novoParagrafo = document.createElement('p');
novoParagrafo.textContent = 'Parágrafo criado dinamicamente!';
novoParagrafo.style.color = '#16a34a';
document.body.appendChild(novoParagrafo);
```

**Resultado esperado:** um parágrafo verde aparece no final da página.

---

## Exercício Prático

1. Explique por que 50 `appendChild()` diretos podem causar 50 recálculos.
2. Crie uma tag `<a>` com texto `Ir para o topo` usando `createElement()`.
3. Insira o link no início do `<body>` com `insertAdjacentElement()`.
4. Compare quando usar `textContent` e quando usar `insertAdjacentHTML()`.

---

## Desafio

Crie `renderizarTabela(dados)` para preencher uma tabela existente.

1. Receba objetos com `{ id, produto, preco }`.
2. Crie as linhas `<tr>` com `createElement()`.
3. Agrupe as linhas em um `DocumentFragment`.
4. Limpe o `<tbody>` e insira tudo em uma operação.

---

## Perguntas de revisão

1. O que torna uma página dinâmica do ponto de vista do navegador?
2. O que acontece com os filhos de um `DocumentFragment` após `appendChild(fragmento)`?
3. Quando `insertAdjacentHTML()` é aceitável e quando vira risco?
4. Por que `<template>` é inerte antes de ser clonado?
5. Qual é o papel de `true` em `cloneNode(true)`?

---

## Resumo do Tópico

- **Dinâmica**: JavaScript altera a interface após o carregamento.
- **Nós**: crie em memória antes de inserir no DOM visível.
- **Posição**: `insertAdjacentHTML()` controla onde a marcação entra.
- **Performance**: `DocumentFragment` agrupa inserções repetidas.
- **Molde**: `<template>` reutiliza estruturas HTML inertes.
