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
title: "HTML: Introdução"
description: "Slides da aula de introdução ao HTML."

---


<!--
Conversão para HTML:
pnpm run build:slides
-->

<!-- _class: lead -->

# HTML: Introdução

Sintaxe, estrutura de documento e elementos essenciais para conteúdo web.


---


## Objetivo

Escrever um documento HTML válido do zero.

Ao final, você deve conseguir:

* reconhecer a estrutura de uma página HTML
* escolher elementos pelo significado do conteúdo
* usar atributos comuns com segurança
* criar texto, listas, links, imagens e tabelas


---


## O que é HTML?

HTML significa *HyperText Markup Language*.

HTML é uma linguagem de **marcação**.

Ela não executa lógica. Ela descreve o que cada parte do conteúdo é.


---

## Marcação (Parte 1)

HTML informa ao navegador:

* isto é um título
* isto é um parágrafo
* isto é uma lista

---

## Marcação (Parte 2)

* isto é um link
* isto é uma imagem
* isto é uma tabela

---


## Elemento

Um elemento envolve um trecho de conteúdo e declara seu significado.

```html
<p>Lorem ipsum dolor.</p>
```

Partes:

* tag de abertura: `<p>`
* conteúdo: `Lorem ipsum dolor.`
* tag de fechamento: `</p>`


---


## Elementos vazios

Alguns elementos não envolvem conteúdo e não têm tag de fechamento.

```html
<meta charset="utf-8" />
<img src="logo.svg" alt="Logotipo" />
<br />
<hr />
```


---


## Aninhamento

A ordem de fechamento importa.

```html
<!-- errado -->
<p>Um texto <strong>importante</p></strong>

<!-- certo -->
<p>Um texto <strong>importante</strong></p>
```


---


## Semântica

Escolha a tag pelo significado, não pela aparência.

```html
<strong>importante</strong>
<b>negrito visual</b>
```

`<strong>` comunica importância.

`<b>` apenas destaca visualmente.


---


## Atributos

Atributos ajustam como um elemento se comporta.

```html
<img src="logo.svg" alt="Logotipo" />
```

Formato:

```plaintext
nome="valor"
```


---


## Atributos comuns

| Elemento | Atributos |
| -------- | --------- |
| Global | `id`, `class`, `lang`, `title`, `style`, `hidden`, `data-*` |
| `<a>` | `href`, `target`, `rel`, `download` |
| `<img>` | `src`, `alt`, `width`, `height`, `loading` |
| `<meta>` | `name`, `content`, `charset` |
| `<th>` | `scope`, `colspan`, `rowspan` |


---


## Entidades

Alguns caracteres têm papel especial na sintaxe.

Para exibi-los como texto, use entidades.

| Caractere | Entidade |
| --------- | -------- |
| `<` | `&lt;` |
| `>` | `&gt;` |
| `&` | `&amp;` |
| `"` | `&quot;` |
| `©` | `&copy;` |


---

## Estrutura mínima (Parte 1)

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<title>Bem-vindos</title>
</head>
```

---

## Estrutura mínima (Parte 2)

```html
<body>
<h1>Olá, turma!</h1>
<p>Meu primeiro parágrafo</p>
<p>&copy; 2026 Ana Souza</p>
</body>
</html>
```

---


## `head` e `body`

`<head>` guarda metadados sobre a página.

Exemplos:

* codificação
* título da aba
* descrição
* arquivos auxiliares

`<body>` guarda o conteúdo renderizado na página.


---


## Elementos semânticos

| Elemento | Papel |
| -------- | ----- |
| `<header>` | Cabeçalho |
| `<nav>` | Navegação principal |
| `<main>` | Conteúdo único da página |
| `<article>` | Conteúdo independente |
| `<section>` | Agrupamento temático |
| `<aside>` | Conteúdo complementar |
| `<footer>` | Rodapé |


---


## Conteúdo de texto

Tags comuns:

| Tag | Papel |
| --- | ----- |
| `<h1>` | Título principal |
| `<h2>` | Subtítulo |
| `<p>` | Parágrafo |
| `<strong>` | Importância |
| `<em>` | Ênfase |
| `<blockquote>` | Citação em bloco |
| `<code>` | Código ou texto literal |


---


## Títulos

Títulos vão de `<h1>` a `<h6>`.

Eles formam o sumário do documento.

Boas práticas:

* use um `<h1>` por página
* não pule níveis apenas para mudar tamanho visual
* use CSS para aparência


---


## Listas

Sempre que o conteúdo for uma sequência de itens, ele pode ser uma lista.

| Tipo | Elementos | Uso |
| ---- | --------- | --- |
| Não ordenada | `<ul>`, `<li>` | Itens sem ordem obrigatória |
| Ordenada | `<ol>`, `<li>` | Etapas ou ranking |
| Descrição | `<dl>`, `<dt>`, `<dd>` | Termo e descrição |


---


## Menu também é lista

Um menu de navegação é uma lista de links.

```html
<nav>
  <ul>
    <li><a href="index.html">Início</a></li>
    <li><a href="contato.html">Contato</a></li>
  </ul>
</nav>
```

O CSS pode remover os marcadores visuais sem mudar a semântica.


---


## Links

Um link combina destino e conteúdo clicável.

```html
<a href="paginas/contato.html">Entre em contato</a>
```

O texto é o que a pessoa clica.

`href` é o destino.


---


## `href`

O valor de `href` pode ser absoluto ou relativo.

| Forma | Resolve para |
| ----- | ------------ |
| `https://exemplo.com/sobre.html` | URL completa |
| `/sobre.html` | Caminho a partir da raiz do site |
| `contato.html` | Arquivo ao lado do atual |
| `../index.html` | Sobe um diretório |
| `#links` | Fragmento da própria página |
| `mailto:ana@exemplo.com` | Cliente de correio eletrônico |


---


## Fragmentos

Fragmentos começam com `#`.

Eles apontam para um elemento com `id` correspondente.

```html
<a href="#html">HTML</a>

<section id="html">
  <h2>HTML</h2>
  <p>HTML marca a estrutura do conteúdo.</p>
</section>
```


---


## Imagens

```html
<img
  src="img/logo.svg"
  alt="Logotipo azul com a palavra HTML"
  width="160"
  height="90"
/>
```

`src` aponta para o arquivo.

`alt` descreve a função da imagem.


---


## `alt`

`alt` não é opcional.

Use para:

* descrever a função da imagem
* informar o conteúdo quando a imagem falha
* permitir acesso por leitores de tela

Imagem decorativa:

```html
<img src="img/logo.svg" alt="" />
```


---


## Performance de imagens

Declare `width` e `height`.

Isso reserva espaço antes do carregamento e evita que o texto pule.

Use arquivos próximos ao tamanho exibido.

Uma foto muito maior que o necessário desperdiça dados, memória e tempo.


---


## Vetorial e matricial

| Tipo | Extensões | Uso |
| ---- | --------- | --- |
| Vetorial | `.svg` | Logotipos, ícones, diagramas |
| Matricial | `.jpg`, `.png`, `.webp` | Fotos e capturas de tela |

SVG pode ser carregado por `<img>` ou escrito diretamente no HTML com `<svg>`.


---


## Data URI

`src` pode receber uma **Data URI**, também chamada de **data URL**.

SVG costuma aparecer com caracteres codificados por URL.

```html
<img
  src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%3E%3C/svg%3E"
  alt="Imagem vetorial embutida"
/>
```


---


## Base64

Imagem matricial em Data URI normalmente usa base64.

```html
<img
  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAE..."
  alt="Quadrado azul"
/>
```

Data URI é útil em exemplos pequenos.

Em imagens maiores, prefira arquivos reais.


---


## Tabelas

Tabelas servem para dados tabulares.

Use quando a informação depende do cruzamento entre linha e coluna.

```html
<table>
  <tr>
    <th scope="col">Linguagem</th>
    <th scope="col">Utilização</th>
  </tr>
</table>
```


---


## Tags de tabela

| Tag | Papel |
| --- | ----- |
| `<table>` | Define a tabela |
| `<caption>` | Título ou resumo curto |
| `<thead>` | Linhas de cabeçalho |
| `<tbody>` | Linhas principais |
| `<tr>` | Linha |
| `<th>` | Célula de cabeçalho |
| `<td>` | Célula de dados |


---


## Acessibilidade em tabela

`<th scope="col">` indica cabeçalho de coluna.

`<th scope="row">` indica cabeçalho de linha.

Isso ajuda leitores de tela a relacionar cada dado com o cabeçalho correto.


---


## Executando

HTML pode ser aberto direto no navegador.

```bash
cd examples/html-basics
open index.html
```

No Linux:

```bash
xdg-open index.html
```


---


## VS Code

Opções úteis:

* Live Preview para ver a página dentro do VS Code
* Live Server para servir a página com recarregamento
* Format Document para formatar HTML
* Format On Save para formatar ao salvar
* Prettier ou Biome como formatadores


---


## Validação

O navegador tenta corrigir erros de HTML silenciosamente.

Isso pode esconder problemas.

Valide a marcação no W3C:

https://validator.w3.org/nu/


---

## Revisão (Parte 1)

Perguntas para checar entendimento:

* Por que HTML é marcação e não programação?
* Qual é a diferença entre `<strong>` e `<b>`?
* Quando usar lista ordenada?

---

## Revisão (Parte 2)

* Como funciona `href="#html"`?
* Por que `alt`, `width` e `height` importam?
* Para que serve `scope` em `<th>`?

---


## Referências

* HTML no MDN: https://developer.mozilla.org/pt-BR/docs/Web/HTML
* Elementos HTML: https://developer.mozilla.org/pt-BR/docs/Web/HTML/Reference/Elements
* Atributos HTML: https://developer.mozilla.org/pt-BR/docs/Web/HTML/Reference/Attributes
* HTML Standard: https://html.spec.whatwg.org/multipage/
