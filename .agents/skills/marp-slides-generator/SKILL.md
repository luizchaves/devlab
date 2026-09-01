---
name: marp-slides-generator
description: >-
  Cria e mantém decks de slides didáticos em Markdown para o Marp CLI (`materials/**/*.slide.md`)
  do DevLab, compilados em HTML por `pnpm build:slides`. Use sempre que o usuário pedir
  slides de aula, apresentação de um tópico, deck Marp ou material de projeção.
---

# DevLab — Gerador de Slides Marp

Guia para escrever decks Marp seguindo o padrão **real** dos decks existentes em
`materials/courses/`.

---

## 📁 Localização e nomes

```
materials/courses/<course-id>/<categoria>/<topico>.slide.md
```

O caminho **espelha** o da aula, e o build gera a URL pública:

| Arquivo | Resultado |
| ------- | --------- |
| `src/content/docs/courses/ecmascript/data/arrays.mdx` | aula |
| `materials/courses/ecmascript/data/arrays.slide.md`   | fonte do deck |
| `public/slides/courses/ecmascript/data/arrays/index.html` | HTML gerado |
| `/slides/courses/ecmascript/data/arrays/`             | URL linkada na aula |

`public/slides/` é gitignorado: **versione apenas o `.md`**.

## 🔎 Cobertura da página

Antes de criar ou revisar um deck, leia a página correspondente em
`src/content/docs/courses/<course-id>/<categoria>/<topico>.mdx` e use sua estrutura como
fonte principal:

- compare os `##` e `###` da página com os slides existentes antes de escrever;
- preserve o máximo possível das seções da página, ajustando a granularidade para projeção;
- todo `##` conceitual relevante deve aparecer no deck como um ou mais slides;
- subseções densas (`###`) devem virar slide próprio, tabela, diagrama, imagem útil ou
  exemplo curto;
- páginas de projeto, guias, referências e aulas conceituais têm estruturas diferentes:
  não force sempre o mesmo roteiro; comece com a estrutura sugerida em `Arco do deck`,
  mas adapte para que a sequência preserve a intenção didática da página;
- o deck pode resumir, mas não deve reduzir uma página longa a 5-8 slides genéricos;
- mantenha densidade proporcional: aulas de 500+ linhas normalmente precisam de 25-50
  slides, e aulas muito densas podem passar disso se os slides continuarem legíveis;
- preserve o arco da aula: objetivo, conceitos, exemplos, execução/exercício quando a
  página tiver esse material, resumo.

Use o deck como roteiro de aula, não como índice superficial. Se um tópico existe na
página porque ensina uma regra, uma exceção ou uma comparação importante, ele precisa ter
representação no slide.

Antes de fechar o deck, faça uma revisão de cobertura: liste mentalmente as seções da
página, confira se cada uma virou slide, trecho de código, visual ou parte de um resumo, e
ajuste qualquer ponto em que a explicação tenha ficado rasa demais para uma aula ao vivo.

Antes de entregar, faça uma revisão didática final:

- corte redundância entre slides vizinhos;
- confirme que cada slide tem um único ponto principal;
- compacte bullets para uma linha sempre que possível;
- remova frases incompletas, reticências de truncamento e placeholders como
  "Diagrama da página";
- remova referências que dependem do slide seguinte para fazer sentido;
- confirme que exercícios, desafio, revisão e resumo fecham o arco sem misturar conteúdo
  de outro tópico;
- não crie slide ou seção `Próximo Tópico` ou `Próxima Aula`; links de continuidade pertencem à página `.mdx`,
  não ao deck de projeção.

---

## 🧭 Tipos de página

Use o formato da página como guia para a estrutura do deck:

- **Aula conceitual**: priorize definição, motivação, regra, exceção, exemplo mínimo e
  resumo. Código entra para provar a regra, não para listar todos os casos.
- **Página de projeto**: preserve contexto, requisitos, árvore de arquivos, tarefas,
  fluxo de execução, trechos reais e validação. O deck precisa mostrar onde mexer no
  projeto e por quê.
- **Guia de referência**: agrupe por famílias de uso, compare opções em tabelas e mostre
  exemplos curtos. Evite transformar o deck em catálogo linha a linha.
- **Aula de ferramenta ou ambiente**: mostre comandos, arquivos de configuração e erros
  comuns em sequência operacional.

Quando a página já tem uma ordem didática clara, siga essa ordem. Quando a página é muito
densa, abra o deck com um mapa de 3-6 blocos e use esses blocos como divisões internas.

---

## 💻 Código no slide

Código real tem prioridade quando a página usa `<SourceCode>`, `<CodeTabs>` ou projetos em
`examples/`:

- tente usar o máximo de código **relevante** da página, sem copiar arquivos inteiros;
- escolha trechos que expliquem uma decisão, uma regra ou uma transição do projeto;
- mantenha o código fiel ao arquivo real sempre que possível, preservando nomes,
  chamadas, imports importantes e comportamento;
- quando o trecho for extenso, reduza para o núcleo didático ou divida em etapas
  (`Parte 1`, `Parte 2`, `Parte 3`) com títulos que indiquem o papel de cada etapa;
- prefira resumir linhas repetitivas, dados longos e detalhes periféricos com comentários
  curtos, reticências ou uma tabela de apoio;
- não substitua código real por pseudocódigo se o trecho original couber com boa leitura;
- se a página usa marcações `lines`, `mark`, `ins`, `del` ou `region`, respeite a intenção
  desses recortes ao escolher o trecho do slide.

Use limites por legibilidade, não como número absoluto:

| Conteúdo no slide | Faixa confortável | Quando passar disso |
| ----------------- | ----------------- | ------------------- |
| Código sozinho | 12-18 linhas | dividir por etapa ou remover ruído |
| Código + explicação | 8-12 linhas + 2-3 bullets | separar explicação e exemplo |
| Comando/terminal | 4-10 linhas | recortar saída e destacar só o sinal importante |
| Saída esperada | até ~12 linhas | mostrar só o output ou dividir em partes |
| Tabela | 3-6 linhas de dados | dividir por família ou transformar em comparação curta |

Um slide pode ocupar bem a área visível sem ficar lotado. O objetivo é que a turma leia o
trecho durante a explicação, então evite blocos que só funcionam quando o aluno abre a
página depois.

### Comentários em código

Comentários dentro do bloco devem ajudar a leitura do slide:

- reduza comentários longos da página para frases curtas;
- prefira comentários que expliquem o **porquê** ou o efeito observado;
- identifique ou cite as linhas de código relevantes (ex: no texto `Na linha 3...` ou via comentário curto `// linha 4: ...`) para guiar a atenção visual da turma;
- remova comentários que repetem exatamente o que a linha já diz;
- prefira saída esperada no fim da própria linha quando couber, por exemplo
  `console.log(total); // 55`;
- quando houver várias saídas, mantenha no comentário apenas o sinal didático principal e
  mova a saída completa para um bloco `txt` separado;
- quando o comentário competir com o código, mova a explicação para 1-2 bullets antes ou
  depois do bloco;
- mantenha saídas esperadas como comentário curto em todos os exemplos, exercícios e desafios.

---

## 🧩 Composição de cada slide

Um slide não deve parecer uma página de texto comprimida. Construa cada slide ao redor de
um ponto de aprendizagem:

- prefira títulos diretos e específicos (`## Ordem das Condições`, `## Fall-through`) em
  vez de frases longas;
- use bullets compactos como apoio à fala, normalmente 3-5 por slide;
- cada bullet deve ter uma ideia só e, por padrão, caber em uma linha;
- quando um bullet passar de uma linha, corte palavras, divida o slide ou troque por
  tabela, código ou diagrama;
- nunca deixe frases incompletas, reticências de truncamento ou placeholders no deck final;
- quando houver imagem, SVG, diagrama ou código bom, reduza os bullets para abrir espaço;
- não repita em bullet o que o código ou a imagem já mostram claramente;
- prefira código, imagem ou tabela quando isso ensinar melhor do que texto corrido;
- em slides de output ou saída esperada, prefira mostrar apenas o bloco `txt`; não adicione
  bullets explicando o que o próprio output já evidencia;
- se a explicação precisa de muitos bullets, divida em dois slides com títulos mais
  específicos.

Prioridade visual sugerida:

1. **Código real** quando a aula ensina sintaxe, API, fluxo de projeto ou comportamento.
2. **Imagem/SVG versionado** quando existe uma tela, arquitetura, fluxo ou diagrama pronto.
3. **Tabela curta** quando a aula compara opções.
4. **Diagrama ASCII** quando não há asset pronto e o fluxo precisa ser visual.
5. **Bullets** para contexto, regra, cuidado e síntese.

Para comparações de estado, antes/depois, permissões, responsabilidades ou efeitos de uma
operação, prefira uma tabela curta quando ela ficar mais clara que setas em ASCII. Use
diagrama ASCII apenas quando a forma espacial ajudar de verdade; se o desenho parecer
improvisado, troque por tabela ou divida a explicação em slides menores.

Em slides de código, a melhor composição costuma ser:

- título curto;
- 1 frase ou 2 bullets dizendo o que observar;
- bloco de código legível;
- comentários curtos no próprio código mostrando saída, efeito ou decisão importante.

---

## 🎨 Frontmatter (copiar literalmente)

```yaml
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
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "JavaScript: Arrays"
description: "Slides completos da aula de Arrays em JavaScript (criação, índices, métodos mutadores e acessores, HOFs)."
---
```

- `title` **idêntico** ao `title` da aula `.mdx` e do mapa mental.
- Não invente tema: todos os decks usam `theme: default`.
- O bloco `style` é o que produz a paginação `3 / 21`.
- O `padding-bottom` reserva rodapé e evita colisão entre paginação e conteúdo.
- A paginação deve ficar pequena (`0.6em`) e discreta.

---

## 📐 Arco do deck

1. **Capa** - `<!-- _class: lead -->`, `# <título da aula>` e uma linha de subtítulo
   listando os eixos da aula.
2. **`## Objetivo`** - frase de abertura + 4-6 bullets com verbo no infinitivo
   ("Entender…", "Diferenciar…", "Executar…"), termos-chave em **negrito**.
3. **`## Mapa da Aula`** - 3-6 blocos quando a página for longa, de projeto ou tiver
   muitas seções.
4. **`## Por Que <Tópico> Importa?`** (opcional, comum nas aulas de abertura) - impacto
   no navegador / servidor / ferramentas + linha em *itálico* com a regra de ouro.
## 📐 Estrutura do deck

Ordem de um deck:

1. **Slide de título** - `theme: devlab`, `title`, `description`, `paginate: true`, etc.
2. **`## Agenda`** ou **`## Roteiro`** - 4-6 tópicos principais do que será coberto.
3. **`## Motivação`** ou **`## Por Que ...?`** - contexto e problema que o tópico resolve.
4. **Conceito a conceito** - 2-4 slides por conceito principal:
   - slide 1: definição, sintaxe e regras;
   - slide 2: exemplo de código mínimo e focado;
   - slide 3 (opcional): armadilha comum, comparação ou caso limite.
5. **`## Arquitetura`** ou **`## Fluxo de Execução`** (quando aplicável) - diagrama
   Mermaid ou tabela comparativa.
6. **`## Boas Práticas`** ou **`## Cuidados e Armadilhas`** - 3-5 alertas cruciais.
7. **`## Exercício Prático`** - enunciado de fixação com objetivo claro.
8. **`## Solução do Exercício`** (ou bloco de código do exercício/desafio) - **SEMPRE inclua comentários de saída esperada** (`// output`) em `console.log()` ou chamadas de função, ou um bloco `txt` de saída, permitindo visualizar o resultado da execução imediatamente.
9. **`## Resumo do Tópico`** - 5-7 bullets de fechamento. Se passar disso, divida em
   `## Resumo do Tópico (Parte 1)` e `## Resumo do Tópico (Parte 2)`.

Separe **todo** slide com `---` em linha isolada.


Tamanho real dos decks: 128-547 linhas (~15 a 45 slides). Aulas de fundamento ficam
perto de 150 linhas; aulas densas (objetos, módulos, HTML) passam de 400.

---

## ✍️ Convenções de escrita

- Português (pt-BR), termos técnicos em inglês em *itálico* (`*shallow copy*`,
  `*empty slots*`) e identificadores em `` `crase` ``.
- Blocos de código com ` ```js ` (não `javascript`); os demais: `html`, `css`, `bash`,
  `json`, `txt`.
- Evite emojis nos slides. Eles raramente ajudam na leitura técnica e criam ruído visual.
- Não escreva "abaixo" no texto do slide; prefira "a seguir", "no próximo exemplo",
  "neste trecho" ou uma referência concreta como "na linha 12".
- Use imagens quando houver asset útil e versionado, especialmente SVGs de arquitetura,
  fluxos, telas, diagramas ou ilustrações técnicas. A imagem deve ensinar algo que texto,
  tabela ou código explicariam pior.
- Não use imagem decorativa, genérica ou sem relação direta com a explicação. Se não houver
  asset pronto, prefira diagrama ASCII antes de criar uma imagem só para enfeitar.
- **Cuidado com Mermaid**: páginas `.mdx` podem usar `<Mermaid>` ou fences
  `mermaid`, mas o build atual do Marp não renderiza Mermaid automaticamente. Não copie
  `flowchart`, `graph`, `sequenceDiagram` ou `classDiagram` para o deck. Converta para
  SVG/PNG versionado quando houver fluxo explícito de pré-render, ou para diagrama ASCII
  em bloco `txt`. Sem esse fluxo, Mermaid vira texto quebrado ou slide ruim.
- Diretivas Marp em uso: apenas `<!-- _class: lead -->` na capa. Comentários HTML
  simples (`<!-- certo -->`, `<!-- errado -->`) servem como nota de contraste.
- Alguns decks abrem com um lembrete do comando de build em comentário HTML — opcional:

  ```markdown
  <!--
  Conversão para HTML:
  pnpm run build:slides
  -->
  ```

---

## 🛠️ Build

```bash
pnpm build:slides
```

Roda `scripts/build-slides.mjs`, que percorre `materials/**/*.slide.md` e invoca
`marp --no-stdin --html <arquivo> -o public/slides/<caminho>/index.html`. O build falha
inteiro se o Marp reclamar de um arquivo.

```bash
pnpm validate
```

Roda lint + `astro check` + build completo + `check:links` — use quando a aula linkar
o deck pela primeira vez (o link só resolve depois que o HTML existe).

---

## ⚠️ Armadilhas

1. **Slide sem `---`**: o conteúdo gruda no slide anterior e estoura a área visível.
2. **Excesso de conteúdo**: acima de ~5 bullets, ~18 linhas de código sozinho ou ~12
   linhas de código com explicação, o texto tende a vazar. Divida em `(Parte 1)` /
   `(Parte 2)` ou corte ruído.
3. **Perder o bloco `style`**: a paginação passa a mostrar só o número, sem o total.
4. **Título fora de sincronia** com a aula e o mapa mental do mesmo tópico.
5. **Cercas aninhadas**: ao mostrar Markdown dentro de Markdown, use cercas externas de
   4 crases.
6. **Editar `public/slides/`**: é saída de build, sobrescrita e gitignorada.
7. **Slide em branco no início**: depois do frontmatter, a primeira coisa visível deve ser
   `<!-- _class: lead -->`; não coloque um `---` extra logo após o frontmatter.
8. **Cobertura fraca**: se a página tem várias seções e o deck só cobre os títulos mais
   óbvios, revise contra o sumário da página antes de entregar.
9. **Código de menos em página prática**: se a aula é baseada em projeto e quase não há
   trechos de código, o deck vira palestra abstrata. Volte aos `<SourceCode>` e escolha
   recortes melhores.
10. **Visual sem propósito**: imagens e SVGs são bem-vindos quando explicam fluxo,
    arquitetura ou tela; se só ocupam espaço, remova.
11. **Falta de output em código e exercícios**: nunca deixe chamadas de `console.log()`
    ou resoluções de exercícios/desafios sem a respectiva saída esperada documentada
    em comentário `// output` ou bloco `txt`.
