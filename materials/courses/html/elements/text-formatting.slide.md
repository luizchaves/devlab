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
title: "HTML: Texto, Listas e Links"
description: "Estruturação de textos, hierarquia de títulos, listas ordenadas/não-ordenadas e hiperlinks com a tag <a>."
---

<!-- _class: lead -->

# Texto, Listas e Links

Estruturando conteúdo textual: cabeçalhos `<h1>`-`<h6>`, parágrafos, ênfases semânticas, listas (`<ul>`, `<ol>`, `<dl>`) e hiperlinks (`<a>`).

---

## Objetivos

Dominar os elementos essenciais de marcação de texto:

- Estruturar a hierarquia de títulos (`<h1>` a `<h6>`).
- Aplicar ênfase semântica (`<strong>`, `<em>`, `<code>`, `<mark>`).
- Construir listas ordenadas, não-ordenadas e de definição.
- Criar conexões de hipertexto internas e externas com o elemento `<a>`.

---

## Por Que Isso Importa?

- **Legibilidade & Leitura**: Texto bem estruturado permite leitura rápida e escaneabilidade visual.
- **Hipertexto**: Links (`<a>`) são a espinha dorsal que conecta páginas em todo o planeta.
- **Hierarquia Semântica**: Leitores de tela e navegadores dependem dos títulos para navegação.

---

## Hierarquia de Cabeçalhos (`<h1>` a `<h6>`)

- **`<h1>`**: Título principal da página (geralmente único).
- **`<h2>`**: Seções principais da página.
- **`<h3>`**: Subseções vinculadas a um `<h2>`.

```html
<h1>Guia de HTML5</h1>
<h2>Fundamentos de Marcação</h2>
<h3>Hierarquia de Títulos</h3>
```

*Regra de Ouro: Nunca escolha a tag do título pelo seu tamanho visual. Altere o tamanho com CSS.*

---

## Ênfase Semântica e Marcação de Texto

| Tag | Significado Semântico | Aparência Padrão |
| --- | --- | --- |
| **`<strong>`** | Alta importância / urgência | Negrito |
| **`<em>`** | Ênfase no significado da frase | Itálico |
| **`<code>`** | Código de computador / instrução | Fonte Monoespaçada |
| **`<mark>`** | Trecho destacado / relevante | Fundo Amarelo |

```html
<p>O estudo de <strong>HTML5</strong> é <em>essencial</em>.</p>
```

---

## Listas em HTML

- **`<ul>` (Unordered List)**: Lista de itens sem ordem numérica (marcadores por ponto).
- **`<ol>` (Ordered List)**: Lista sequencial com numeração ordenada.
- **`<dl>` (Description List)**: Lista de termos (`<dt>`) e definições (`<dd>`).

```html
<ul>
  <li>HTML5</li>
  <li>CSS3</li>
</ul>

<ol>
  <li>Planejamento</li>
  <li>Desenvolvimento</li>
</ol>
```

---

## Hiperlinks (`<a href="...">`)

- O atributo **`href`** define o destino do link (URL externa ou caminho relativo).
- Atributo **`target="_blank"`**: Abre o link em uma nova aba do navegador.
- Atributo **`rel="noopener noreferrer"`**: Segurança ao abrir links externos em nova aba.

```html
<!-- Link Interno -->
<a href="/courses/html/basics/">Ir para Fundamentos</a>

<!-- Link Externo -->
<a href="https://w3.org" target="_blank" rel="noopener noreferrer">W3C Oficial</a>
```

---

## Exercício Prático & Desafio

- **Exercício**: Crie uma lista ordenada com os 3 passos para criar um site e adicione um link interno para a página inicial.
- **Desafio Extra**: Use uma lista de definição (`<dl>`, `<dt>`, `<dd>`) para mapear 3 termos de HTML e seus significados.

---

## Resumo & Revisão

- Mantenha a sequência lógica de cabeçalhos (`h1` ➔ `h2` ➔ `h3`).
- Use **`<strong>`** e **`<em>`** para sentido, não apenas decoração.
- Use **`<ul>`** para listas gerais e **`<ol>`** para etapas sequenciais.
- Sempre use **`rel="noopener noreferrer"`** em links com `target="_blank"`.

---

## Referências & Links Úteis

- **MDN Web Docs**: [HTML Text Formatting](https://developer.mozilla.org/pt-BR/docs/Learn/HTML/Introduction_to_HTML/HTML_text_fundamentals)
- **MDN Web Docs**: [The Links Element `<a>`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/a)
