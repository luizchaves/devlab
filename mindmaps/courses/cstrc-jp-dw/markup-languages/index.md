---
title: 'Linguagens de Marcação'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Linguagens de Marcação

## Ideia Central

- Adicionar sinais e marcadores ao texto puro para indicar a função de cada parte
- Marcação define **estrutura e significado**, não estilo visual
- HTML descreve estrutura; a ferramenta/navegador renderiza

## Comparativo de Linguagens

### Markdown
- Marcação leve e legível como texto puro
- `# Título`, `**negrito**`, `_itálico_`
- Usada em documentações, READMEs e notas

### LaTeX
- Voltada para documentos acadêmicos e fórmulas
- `\section*{}`, `\textbf{}`, `\emph{}`
- Requer compilador LaTeX para gerar PDF

### XML / ODT
- Estrutura genérica baseada em tags personalizadas
- `<text:h>`, `<text:p>`, `<text:span>`
- Depende de vocabulário específico (ex: OpenDocument)

### HTML
- Linguagem de marcação oficial da Web
- `<h1>`, `<p>`, `<strong>`, `<em>`
- Interpretada nativamente pelos navegadores Web

## Formatos baseados em Marcação

- **SVG**: Gráficos e imagens vetoriais em XML
- **MathML**: Expressões e fórmulas matemáticas
- **KML / GPX**: Dados geográficos e rotas de GPS
- **EPUB**: Livros digitais (HTML + CSS empacotados)
- **DOCX / ODT**: Documentos de escritório (XMLs compactados)

## Passos para Marcar Conteúdo

1. Identificar a função semântica (título, parágrafo, lista, ênfase)
2. Escolher a tag/marcador semântico adequado
3. Separar estrutura (HTML) de apresentação (CSS)
4. Usar a ferramenta correta para renderização
