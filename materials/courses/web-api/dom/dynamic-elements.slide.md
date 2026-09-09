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

Criação e Inserção Básica de Nós · Otimização de Performance com `DocumentFragment` · O Elemento `<script>` · Quando usar, e quando não usar?

---

## Objetivo

- Criar e inserir nós com `createElement()`, `append()`, `prepend()` e `insertAdjacentHTML()`.
- Remover nós com `remove()` e limpar um contêiner sem deixar ouvintes órfãos.
- Explicar o que é um *reflow* e por que inserir em laço direto no documento o provoca repetidas vezes.
- Montar um lote de elementos fora da árvore com `DocumentFragment` e inseri-lo de uma vez.
- Clonar marcação declarada em `<template>` para gerar listas sem concatenar HTML em string.

---

## Mapa do Tópico

- **Criação e Inserção Básica de Nós**.
- **Otimização de Performance com `DocumentFragment`**.
- **O Elemento `<script>`**.
- **Quando usar, e quando não usar?**.

---

## Motivação

- **Recurso nativo**: use o navegador como parte da arquitetura.
- **Contrato claro**: identifique entrada, saída, evento, permissão e erro.
- **Experiência real**: preserve resposta visual, teclado, foco e acessibilidade.

*Regra de ouro: uma Web API boa reduz código próprio e aumenta previsibilidade.*

---

## Criação e Inserção Básica de Nós

Para construir elementos via JavaScript, o navegador oferece a API de criação de nós do objeto `document`.

- **Métodos `createElement` e `appendChild`**: A criação de um nó acontece em duas etapas separadas: primeiro o elemento passa a existir na memória.
- **Inserção com `insertAdjacentHTML`**: O método `insertAdjacentHTML()` permite inserir uma string de marcação HTML em uma posição específica.

---

## Criação e Inserção Básica de Nós: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```js
const container = document.querySelector('#container');

// Insere a marcação HTML antes do final do container
container.insertAdjacentHTML('beforeend', '<div class="item">Novo Item</div>');
```

---

## Otimização de Performance com `DocumentFragment`

Quando manipulamos o DOM, cada chamada direta como.

- appendChild(el).
- Inserir 100 itens diretamente no DOM em um laço de repetição causará 100 recálculos de layout, desacelerando a aplicação.
- O `DocumentFragment` é uma versão leve do objeto `Document` que existe apenas em memória.

---

## O Elemento `<script>`

A tag `<script>` do HTML5 permite declarar blocos de marcação que permanecem completamente inertes.

- <Aside type="tip" title="Projeto Prático"> Para ver esses conceitos aplicados em uma arquitetura completa de componentes dinâmicos e tabelas.
- ---.

---

## O Elemento `<script>`: Exemplo

Observe o ponto mínimo que demonstra a regra da seção.

```html
<template id="card-template">
  <div class="card">
    <h3 class="card-title"></h3>
    <button class="btn-detalhes">Ver detalhes</button>
  </div>
</template>

<div id="container-cards"></div>
```

---

## Quando usar, e quando não usar?

Nem toda inserção precisa de `DocumentFragment` ou de `<script>`.

- **Inserir um único elemento**: Fragmento, que não tem o que agrupar.
- **Renderizar uma lista de dezenas ou centenas de i**: `append()` dentro do laço, que provoca um *reflow* por item.
- **Estrutura fixa e repetida, já escrita no HTML**: Concatenação de strings, que perde o realce e valida nada.
- **Inserir texto vindo do usuário ou de uma API**: `innerHTML`, que executa marcação injetada.
- **Trocar o conteúdo inteiro de um contêiner**: `innerHTML = ''` seguido de novas inserções.

---

## Executando

1. Pressione <kbd>F12</kbd> e abra a aba Console.
2. Cole o código.
3. Pressione <kbd>Enter</kbd> e observe o parágrafo verde sendo renderizado no final da página.

---

## Executando: Comando

```js
const novoParagrafo = document.createElement('p');
   novoParagrafo.textContent = 'Parágrafo criado dinamicamente!';
   novoParagrafo.style.color = '#16a34a';
   document.body.appendChild(novoParagrafo);
```

---

## Exercício Prático

1. Qual a diferença de performance entre fazer.
2. Por que a tag `<script>` é considerada inerte antes de ser clonada?
3. Escreva um trecho de código que crie uma tag `<script>` com o texto "Ir.
4. Fazer 50 inserções diretas no DOM causa 50 recálculos de layout (*reflows*) e renderizações (*repaints*), desacelerando a aplicação.
5. Porque o navegador lê a marcação do `<script>`, mas não a renderiza na tela.

---

## Desafio

Crie uma função `renderizarTabela(dados)` que receba um array de objetos.

1. Adicione tratamento de erro ou permissão.
2. Separe responsabilidades em funções pequenas.
3. Valide no navegador e documente o resultado.

---

## Perguntas de revisão

1. O que acontece com os nós filhos contidos em um `DocumentFragment` após ele ser adicionado a um nó do DOM com `appendChild(fragmento)`?
2. Como remover um elemento do DOM utilizando a API moderna?
3. Por que o conteúdo dentro de uma tag `<script>` não é exibido nem executa scripts durante o carregamento inicial da página?
4. Qual é o papel do argumento `true` no método `template.content.cloneNode(true)`?

---

## Resumo do Tópico

- **Criação e Inserção Básica de Nós**: revise o papel desse eixo no uso da API.
- **Otimização de Performance com `DocumentFragment`**: revise o papel desse eixo no uso da API.
- **O Elemento `<script>`**: revise o papel desse eixo no uso da API.
- **Quando usar, e quando não usar?**: revise o papel desse eixo no uso da API.
