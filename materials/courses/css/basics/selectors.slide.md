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
title: "CSS: Seletores, Pseudo-classes e Pseudo-elementos"
description: "Seletores fundamentais, combinadores, pseudo-classes de estado e pseudo-elementos em CSS."
---

<!-- _class: lead -->

# Seletores, Pseudo-classes e Pseudo-elementos

Selecionando elementos no DOM com precisão: seletores básicos, combinadores, estados interativos e pseudo-elementos.

---

## Objetivos

Dominar o direcionamento de estilos no CSS:

- Utilizar seletores básicos de elemento, classe, ID e atributo.
- Combinar seletores com combinadores de descendência, filho direto e irmão.
- Estilizar estados interativos com **pseudo-classes** (`:hover`, `:focus`, `:nth-child`).
- Inserir conteúdo decorativo com **pseudo-elementos** (`::before`, `::after`).

---

## Por Que Isso Importa?

- **Reutilização**: Classes bem planejadas (`.btn`, `.card`) evitam duplicação de código CSS.
- **Interatividade Nativa**: Pseudo-classes como `:hover` e `:focus` criam feedback visual sem JavaScript.
- **Limpeza de HTML**: Pseudo-elementos (`::before`, `::after`) inserem ícones ou enfeites sem poluir a marcação HTML.

---

## Seletores Fundamentais

| Seletor | Sintaxe | Exemplo | Descrição |
| --- | --- | --- | --- |
| **Elemento** | `tag` | `p { ... }` | Seleciona todas as tags `p`. |
| **Classe** | `.classe` | `.card { ... }` | Reutilizável em múltiplos elementos. |
| **ID** | `#id` | `#header { ... }` | Elemento único na página (especificidade alta). |
| **Atributo** | `[attr]` | `input[type="text"]` | Filtra por atributo HTML e valor. |

---

## Combinadores CSS

- **Descendente (`article p`)**: Todos os `<p>` dentro de `<article>`.
- **Filho Direto (`article > p`)**: Apenas os `<p>` que são filhos diretos de `<article>`.
- **Irmão Adjacente (`h2 + p`)**: O primeiro `<p>` imediatamente após `<h2>`.
- **Irmão Geral (`h2 ~ p`)**: Todos os `<p>` irmãos após `<h2>`.

```css
/* Seleciona apenas parágrafos diretos de um card */
.card > p {
  color: #374151;
}
```

---

## Pseudo-classes (`:hover`, `:focus`, `:nth-child`)

Representam **estados do elemento** ou sua posição na árvore do DOM:

- **`:hover`**: Quando o ponteiro do mouse está sobre o elemento.
- **`:focus`**: Quando o campo recebe foco do teclado/clique.
- **`:nth-child(even)`**: Seleciona linhas pares em tabelas ou listas.

```css
button:hover {
  background-color: #2563eb;
}
input:focus {
  outline: 2px solid #3b82f6;
}
```

---

## Pseudo-elementos (`::before` e `::after`)

Permitem criar elementos cosméticos antes ou depois do conteúdo:

```css
/* Adiciona um ícone visual antes de links externos */
a.external::after {
  content: " ↗";
  font-size: 0.8em;
  color: #6b7280;
}
```

*Nota: O atributo `content: ""` é obrigatório para que `::before` e `::after` funcionem.*

---

## Exercício Prático & Desafio

- **Exercício**: Crie um seletor `.btn:hover` que altera a cor de fundo e diminui a opacidade do botão.
- **Desafio Extra**: Use `ul > li:nth-child(odd)` para aplicar cor zebrada em itens ímpares de uma lista.

---

## Resumo & Revisão

- Prefira **classes** (`.nome`) para estilos reutilizáveis.
- Evite abuso de **IDs** (`#nome`) devido à alta especificidade.
- Use **`:focus`** sempre que usar **`:hover`** para garantir acessibilidade via teclado.
- **`::before`** e **`::after`** exigem a propriedade `content`.

---

## Referências & Links Úteis

- **MDN Web Docs**: [CSS Selectors](https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_Selectors)
- **MDN Web Docs**: [Pseudo-classes](https://developer.mozilla.org/pt-BR/docs/Web/CSS/Pseudo-classes)
