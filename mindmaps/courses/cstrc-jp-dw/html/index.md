---
title: 'HTML: Introdução'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# HTML: Introdução

## Ideia central

- HTML é linguagem de marcação
- Descreve o significado do conteúdo
- Ajuda navegador, leitor de tela e buscador

## Objetivo

- Escrever um documento HTML válido
- Escolher elementos pelo significado
- Usar atributos comuns
- Criar texto, listas, links, imagens e tabelas

## Sintaxe

### Elementos e tags

- Estrutura de um elemento
  - Tag de abertura
  - Conteúdo
  - Tag de fechamento
- Elementos vazios
  - `<meta>`
  - `<img>`
  - `<br>`
  - `<hr>`
- Aninhamento
  - Tags precisam fechar na ordem correta
  - O que abre por último fecha primeiro
- Semântica
  - Escolha a tag pelo significado
  - Use CSS para mudar aparência
  - `<strong>` comunica importância
  - `<b>` indica destaque visual

### Atributos

- Estrutura de um atributo
  - Ajustam comportamento ou metadados
  - Formato `nome="valor"`

- Globais
  - `id`
  - `class`
  - `lang`
  - `title`
  - `style`
  - `hidden`
  - `data-*`

- Específicos
  - `<a>` usa `href`, `target`, `rel`
  - `<img>` usa `src`, `alt`, `width`, `height`
  - `<meta>` usa `charset`, `name`, `content`
  - `<th>` usa `scope`

## Entidades

- Exibem caracteres especiais como texto
- `&lt;` mostra `<`
- `&gt;` mostra `>`
- `&amp;` mostra `&`
- `&copy;` mostra `©`

## Estrutura do documento

### Base

- `<!DOCTYPE html>`
- `<html lang="pt-BR">`
- `<head>`
- `<body>`

### `head`

- Metadados
- Codificação
- Título da aba
- Descrição
- Arquivos auxiliares

### `body`

- Conteúdo exibido na página
- Títulos
- Parágrafos
- Listas
- Links
- Imagens
- Tabelas

### Elementos semânticos

- `<header>`
- `<nav>`
- `<main>`
- `<article>`
- `<section>`
- `<aside>`
- `<footer>`

## Conteúdo de texto

- `<h1>` a `<h6>` organizam títulos
- Use um `<h1>` por página
- Não pule níveis para mudar tamanho
- `<p>` marca parágrafo
- `<strong>` marca importância
- `<em>` marca ênfase
- `<blockquote>` marca citação em bloco
- `<code>` marca código ou texto literal

## Listas

### Não ordenada

- `<ul>`
- `<li>`
- Itens sem ordem obrigatória

### Ordenada

- `<ol>`
- `<li>`
- Etapas, posições ou sequência

### Descrição

- `<dl>`
- `<dt>`
- `<dd>`
- Termo e descrição

### Menu

- Menu também é lista
- Navegação costuma usar `<nav>` com `<ul>`
- O CSS pode remover marcadores visuais

## Links

- `<a>` cria link
- O texto é a parte clicável
- `href` define o destino

### Formas de `href`

- URL absoluta
- Caminho a partir da raiz
- Caminho relativo
- Fragmento com `#id`
- Ação como `mailto:`

### Fragmentos

- Apontam para um elemento com `id`
- Permitem navegar dentro da mesma página
- Úteis em sumários e menus internos

## Imagens

- `<img>` insere imagem
- `src` aponta para a origem
- `alt` descreve função ou conteúdo
- `width` e `height` reservam espaço

### Boas práticas

- `alt` não é opcional
- Use imagens próximas ao tamanho exibido
- Prefira arquivo real para imagens grandes
- Use Data URI apenas em exemplos pequenos

### Tipos

- Vetorial
  - `.svg`
  - Logotipos, ícones e diagramas
- Matricial
  - `.jpg`
  - `.png`
  - `.webp`
  - Fotos e capturas de tela

### Figura

- `<figure>` agrupa mídia e legenda
- `<figcaption>` define legenda

## Tabelas

- Use para dados tabulares
- A informação depende de linha e coluna
- Não use tabela só para layout visual

### Tags

- `<table>`
- `<caption>`
- `<thead>`
- `<tbody>`
- `<tr>`
- `<th>`
- `<td>`

### Acessibilidade

- `scope="col"` indica cabeçalho de coluna
- `scope="row"` indica cabeçalho de linha
- Leitores de tela relacionam dado e cabeçalho

### Aparência

- Use CSS para borda, largura e cor
- `border-collapse` controla o colapso das bordas
- Atributos antigos ainda existem, mas não são a prática atual

<!-- ## Executando

- Abrir o HTML direto no navegador
- Usar Live Preview no VS Code
- Usar Live Server no VS Code
- Clonar o repositório e abrir o projeto

## Validação e estudo

- O navegador pode corrigir erros silenciosamente
- Use o validador W3C
- Formate o HTML no VS Code
- Consulte MDN e HTML Standard -->
