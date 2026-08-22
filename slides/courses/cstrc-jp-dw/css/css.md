---
marp: true
theme: default
paginate: true
lang: pt-BR
title: "CSS: Fundamentos"
description: "Slides da aula de introdução e fundamentos do CSS."
---

<!--
Conversão para HTML:
pnpm run build:slides
-->

<!-- _class: lead -->

# CSS: Fundamentos

Sintaxe, formas de aplicar estilos, seletores, cascata, especificidade e propriedades essenciais.

---

## Objetivo

Escrever CSS básico do zero.

Ao final, você deve conseguir:

* conectar uma folha de estilos externa a um HTML
* declarar propriedades, valores e seletores com precisão
* entender a cascata, especificidade e herança
* utilizar variáveis CSS e media queries
* evitar conflitos de estilo inspecionando pelo DevTools

---

## O que é CSS?

CSS significa *Cascading Style Sheets* (Folhas de Estilo em Cascata).

É uma linguagem de **apresentação**.

Ela descreve como elementos HTML são renderizados em tela, papel ou outros meios.

* HTML = conteúdo e estrutura
* CSS = aparência e layout

---

## Separação de responsabilidades

No início da Web, era comum usar tags visuais como `<center>` ou `<font>`.

Hoje elas são **obsoletas**.

* HTML: diz o que o conteúdo *é*
* CSS: define como o conteúdo *aparece*

---

## Sintaxe do CSS

Uma regra CSS junta um **seletor** e um bloco de **declarações**.

```css
h1 {
  color: blue;
  text-align: center;
}
```

* Seletor: `h1`
* Declaração: `propriedade: valor;`
* Exemplo: `color: blue;`

---

## Comentários em CSS

Comentários iniciam com `/*` e terminam com `*/`.

O navegador ignora seu conteúdo.

```css
/* Estilo do aviso principal */
.aviso {
  color: #92400e;
}
```

---

## Como o CSS entra na página

Três formas principais de aplicar CSS:

| Forma | Onde fica | Quando usar |
| ----- | --------- | ----------- |
| Inline | Atributo `style` no elemento | Testes rápidos ou JS dinâmico |
| Interno | Tag `<style>` no `<head>` | Protótipos e páginas únicas |
| Externo | Arquivo `.css` via `<link>` | Projetos reais e produção |

---

## CSS Externo (Recomendado)

Carregado no `<head>` do documento HTML:

```html
<link rel="stylesheet" href="css/style.css" />
```

Facilita a manutenção, reutilização de código entre páginas e organização.

---

## Cascata, especificidade e herança

Quando várias regras disputam o mesmo elemento, o navegador decide o vencedor considerando:

1. **Importância**: `!important` supera regras normais
2. **Especificidade**: ID > Classe > Elemento
3. **Ordem**: se equivalentes, a última regra declarada vence
4. **Herança**: algumas propriedades (ex.: `color`, `font-family`) passam para elementos filhos

---

## Contêineres genéricos: `div` e `span`

Usados para agrupar conteúdo quando não há tag semântica específica.

* `<div>`: elemento de bloco (*block*)
* `<span>`: elemento inline (*inline*)

Aplicações de propriedades herdáveis em um `<div>` pai são repassadas a todos os seus filhos.

---

## Propriedades e valores

Propriedades alteram aspectos específicos do elemento:

| Grupo | Propriedades comuns | Exemplos |
| ----- | ------------------- | -------- |
| Texto | `color`, `font-family`, `font-size`, `text-align` | `#1d4ed8`, `Arial`, `1rem` |
| Espaço | `margin`, `padding`, `gap` | `0`, `1rem`, `2rem` |
| Caixa | `width`, `max-width`, `border`, `border-radius` | `40rem`, `1px solid #ccc` |
| Fundo | `background-color` | `#f8fafc`, `#dbeafe` |

---

## Propriedades Abreviadas (Shorthand)

Permitem definir múltiplos valores em uma única declaração.

```css
/* Abreviado: */
font: italic bold 20px Times;

/* Equivalente a: */
font-style: italic;
font-weight: bold;
font-size: 20px;
font-family: Times;
```

Outros exemplos: `margin`, `padding`, `border`, `background`.

---

## Cores no CSS

* **Palavras-chave (nominais)**: `red`, `blue` (limitadas, ~148 cores, sem opacidade)
* **Hexadecimal**: `#2563eb` (precisão RGB de 6/8 dígitos)
* **`rgb()` / `rgba()`**: `rgb(37 99 235)` (valores de vermelho, verde e azul)
* **`hsl()`**: `hsl(221 83% 53%)` (matiz, saturação, luminosidade)
* **`oklch()`**: percepção de brilho uniforme e cores modernas

---

## Variáveis CSS (Custom Properties)

Iniciam com `--` e são acessadas com `var()`.

```css
:root {
  --cor-destaque: #2563eb;
  --espaco: 1rem;
}

.botao {
  color: var(--cor-destaque);
  padding: var(--espaco);
}
```

Muito utilizadas na implementação de temas claro e escuro (*Light / Dark mode*).

---

## Tipos de seletores

| Seletor | Tipo | O que seleciona |
| ------- | ---- | --------------- |
| `body` | Elemento | Todos os elementos `<body>` |
| `#principal` | ID | Elemento único com `id="principal"` |
| `.cartao` | Classe | Elementos com `class="cartao"` |
| `.cartao p` | Descendente | Parágrafos dentro de `.cartao` |
| `.botao:hover` | Pseudo-classe | Estado do elemento no ponteiro |

---

## Classes utilitárias

Classes como `.text-center` focam em uma única responsabilidade.

Essa abordagem de reutilização é a base de frameworks CSS populares como:

* [Bootstrap](https://getbootstrap.com/)
* [Tailwind CSS](https://tailwindcss.com/)

---

## At-rules (`@`)

Instruções CSS que começam com `@`.

```css
@font-face {
  font-family: "MinhaFonte";
  src: url("fonts/minha-fonte.woff2") format("woff2");
}
```

* Outros exemplos: `@import`, `@keyframes`, `@supports`, `@media`
* O Google Fonts gera regras `@font-face` automaticamente via `<link>` ou `@import`.

---

## Media queries: Sintaxe

Aplicam regras CSS apenas quando condições de ambiente são atendidas.

```css
h1 {
  text-align: center;
  color: #f00;
}

@media print {
  h1 {
    text-align: left;
    color: #000;
  }
}
```

---

## Media queries: Tipos de Condições

Condições comuns de ambiente:
- Largura de tela (`min-width: 768px`, `max-width: 1024px`)
- Orientação (`orientation: landscape`)
- Preferência de tema (`prefers-color-scheme: dark`)

---

## Executando e inspecionando

No navegador:

* Abra o DevTools com `F12`
* Na aba **Elements** / **Styles**, inspecione regras aplicadas e canceladas
* Veja propriedades calculadas na aba **Computed**

---

## Revisão

* Qual a diferença entre CSS inline, interno e externo?
* Como funciona a especificidade (ID vs Classe vs Elemento)?
* O que é uma propriedade shorthand?
* Para que servem variáveis CSS e media queries?

---

## Referências

* CSS no MDN: https://developer.mozilla.org/pt-BR/docs/Web/CSS
* Sintaxe CSS: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Syntax/Introduction
* Seletores CSS: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors
* Cascata CSS: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Introduction
