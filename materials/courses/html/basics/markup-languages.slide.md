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
title: "Linguagens de Marcação"
description: "Slides completos da aula de linguagens de marcação (Markdown, LaTeX, XML, HTML)."

---


<!-- _class: lead -->

# Linguagens de Marcação

Conceitos, significado vs. apresentação, comparativo entre Markdown, LaTeX, XML e HTML.


---


## Objetivo

Compreender o conceito e o papel das Linguagens de Marcação:

- Entender que marcar texto é **adicionar estrutura e significado**, e não definir aparência visual.
- Reconhecer que **HTML não é uma linguagem de programação** (não executa lógica ou algoritmos).
- Comparar a sintaxe de diferentes linguagens de marcação (Markdown, LaTeX, XML, HTML).
- Explorar formatos baseados em marcação além de texto corrido (SVG, MathML, KML, EPUB).
- Separar adequadamente a estrutura semântica da apresentação visual.


---


## O Problema do Texto Puro

Um arquivo de texto sem marcação possui conteúdo, mas não possui estrutura explícita:

```txt
Lorem ipsum
Lorem ipsum dolor sit amet consectetur...
```

- Para um humano, a primeira linha *parece* ser um título.
- Para um programa/computador, é apenas uma sequência genérica de caracteres sem hierarquia.
- **A marcação resolve isso**: ela transforma intenção em sintaxe explícita interpretável por máquinas.


---


## Marcação != Apresentação Visual

> **Significado Semântico** é diferente de **Estilo Visual**.

- **Marcação (Significado)**: Indica que um trecho é um título (`<h1>`), um parágrafo (`<p>`), um item importante (`<strong>`) ou uma ênfase (`<em>`).
- **Apresentação (Estilo)**: Define a cor, a fonte, o tamanho em pixels e o espaçamento.

*HTML cuida da estrutura e do significado; o CSS ou a ferramenta de renderização cuidam da apresentação.*


---


## Mesmo Conteúdo em Marcações Diferentes

| Linguagem | Uso Principal | Interpretador | Sintaxe de Título Principal |
| --- | --- | --- | --- |
| **Markdown** | Documentação, README, textos rápidos | Renderizador Markdown | `# Título` |
| **LaTeX** | Artigos científicos, fórmulas | Compilador LaTeX | `\section*{Título}` |
| **XML / ODT** | Troca de dados e documentos de escritório | Editor XML / LibreOffice | `<text:h>Título</text:h>` |
| **HTML** | Páginas Web | Navegador Web | `<h1>Título</h1>` |


---


## Comparativo de Sintaxe

| Estrutura | Markdown | LaTeX | OpenDocument XML | HTML |
| --- | --- | --- | --- | --- |
| **Título** | `# Título` | `\section*{Título}` | `<text:h>` | `<h1>` |
| **Parágrafo** | Linha em branco | Linha em branco | `<text:p>` | `<p>` |
| **Ênfase** | `_texto_` / `*texto*` | `\emph{texto}` | `<text:span>` (itálico) | `<em>` |
| **Importância** | `**texto**` / `__texto__` | `\textbf{texto}` | `<text:span>` (negrito) | `<strong>` |


---

## O Caso do HTML

No HTML, a marcação é feita utilizando **tags** e **elementos**:

```html
<h1>Lorem ipsum</h1>
<p>
  Lorem <strong>ipsum</strong> <em>dolor</em> sit amet.
</p>
```

- **`<h1>`**: Título de nível principal.
- **`<p>`**: Bloco de parágrafo.
- **`<strong>`**: Forte importância. **`<em>`**: Ênfase no texto.

*Evite usar apenas `<div>` e `<span>` desprovidos de semântica (acessibilidade e SEO).*

---


## Formatos baseados em Marcação além de Texto

A marcação não é usada apenas para documentos de texto corrido:

- **SVG**: Descreve gráficos vetoriais (formas, caminhos, cores) usando XML.
- **MathML**: Descreve a estrutura de fórmulas matemáticas em XML.
- **KML / GPX**: Descreve pontos geográficos, rotas e dados de GPS.
- **EPUB**: Formato de livro digital que empacota arquivos HTML, CSS e metadados.
- **DOCX / ODT**: Documentos de escritório que são arquivos zipados contendo XMLs internamente.


---


## Como Pensar em Marcação?

1. **Identifique a função**: Determine se o trecho é um título, parágrafo, lista, citação ou imagem.
2. **Escolha o marcador correto**: Selecione a tag ou símbolo semântico correspondente.
3. **Use o interpretador adequado**: Navegador, compilador LaTeX, visualizador de Markdown.
4. **Separe estrutura de estilo**: Primeiro marque com precisão semântica; depois estilize com CSS.


---


## Resumo da Aula

- Linguagens de marcação adicionam **sinais de estrutura e função** ao texto puro.
- **HTML não é linguagem de programação**: ele não executa laços ou funções, apenas estrutura dados.
- O mesmo conteúdo pode ser marcado em **Markdown**, **LaTeX**, **XML** ou **HTML**.
- Escolha tags semânticas para garantir **acessibilidade**, boa indexação e fácil manutenção.
