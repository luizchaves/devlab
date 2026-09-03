---
name: marp-slides-generator
description: >-
  Cria e mantém decks de slides didáticos em Markdown para o Marp CLI (`materials/**/*.slide.md`)
  do DevLab, compilados em HTML por `pnpm build:slides`. Use sempre que o usuário pedir
  slides de tópico, apresentação de um tópico, deck Marp ou material de projeção.
---

# DevLab — Gerador de Slides Marp

Guia para escrever decks Marp seguindo o padrão **real** dos decks existentes em
`materials/courses/`.

---

## 📁 Localização e nomes

```
materials/courses/<course-id>/<categoria>/<topico>.slide.md
```

O caminho **espelha** o do tópico, e o build gera a URL pública:

| Arquivo | Resultado |
| ------- | --------- |
| `src/content/docs/courses/ecmascript/data/arrays.mdx` | tópico |
| `materials/courses/ecmascript/data/arrays.slide.md`   | fonte do deck |
| `public/slides/courses/ecmascript/data/arrays/index.html` | HTML gerado |
| `/slides/courses/ecmascript/data/arrays/`             | URL linkada no tópico |

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
- páginas de projeto, guias, referências e tópicos conceituais têm estruturas diferentes:
  não force sempre o mesmo roteiro; comece com a estrutura sugerida em `Arco do deck`,
  mas adapte para que a sequência preserve a intenção didática da página;
- o deck pode resumir, mas não deve reduzir uma página longa a 5-8 slides genéricos;
- mantenha densidade proporcional: tópicos de 500+ linhas normalmente precisam de 25-50
  slides, e tópicos muito densos podem passar disso se os slides continuarem legíveis;
- preserve o arco do tópico: objetivo, conceitos, exemplos, execução/exercício quando a
  página tiver esse material, resumo.

Use o deck como roteiro de exposição, não como índice superficial. Se um tópico existe na
página porque ensina uma regra, uma exceção ou uma comparação importante, ele precisa ter
representação no slide.

Antes de fechar o deck, faça uma revisão de cobertura: liste mentalmente as seções da
página, confira se cada uma virou slide, trecho de código, visual ou parte de um resumo, e
ajuste qualquer ponto em que a explicação tenha ficado rasa demais para uma exposição ao vivo.

Antes de entregar, faça uma revisão didática final:

- corte redundância entre slides vizinhos;
- confirme que cada slide tem um único ponto principal;
- una slides vizinhos do mesmo tema quando houver espaço, principalmente quando um slide
  apenas introduz um tipo de código, comentário ou comando e o próximo mostra a aplicação;
- evite slides com muito espaço branco quando a explicação e o exemplo relacionado cabem
  juntos sem prejudicar leitura, ritmo ou foco visual;
- preserve margem visual no fim do slide: não una blocos se a fusão aproximar código,
  tabela ou bullets da paginação ou criar risco de overflow no rodapé;
- em comentários, comandos e exemplos curtos, prefira agrupar explicação e aplicação do
  mesmo subtipo. Separe subtipos diferentes quando a fusão deixar o slide alto demais;
- depois de fundir slides, revise novamente os novos pares adjacentes, porque a numeração
  muda e pode revelar outra quebra artificial do mesmo tema;
- compacte bullets para uma linha sempre que possível;
- remova frases incompletas, reticências de truncamento e placeholders como
  "Diagrama da página";
- remova referências que dependem do slide seguinte para fazer sentido;
- confirme que exercícios, desafio, revisão e resumo fecham o arco sem misturar conteúdo
  de outro tópico;
- não crie slide ou seção `Próximo Tópico`; links de continuidade pertencem à página `.mdx`,
  não ao deck de projeção.

---

## 🧭 Tipos de página

Use o formato da página como guia para a estrutura do deck:

- **Tópico conceitual**: priorize definição, motivação, regra, exceção, exemplo mínimo e
  resumo. Código entra para provar a regra, não para listar todos os casos.
- **Página de projeto**: preserve contexto, requisitos, árvore de arquivos, tarefas,
  fluxo de execução, trechos reais e validação. O deck precisa mostrar onde mexer no
  projeto e por quê.
- **Guia de referência**: agrupe por famílias de uso, compare opções em tabelas e mostre
  exemplos curtos. Evite transformar o deck em catálogo linha a linha.
- **Tópico de ferramenta ou ambiente**: mostre comandos, arquivos de configuração e erros
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

### Simplificação de exemplos para evitar overflow vertical

- **Nunca omita a saída esperada para economizar espaço vertical**: slides didáticos devem ser completos e demonstrar visualmente o resultado observado de cada instrução relevante (`console.log`, prints e retornos).
- **Simplifique os dados de entrada quando a saída for multilinha**: se a saída esperada ocupar várias linhas (como objetos formatados com `JSON.stringify(..., null, 2)`, estruturas de dados aninhadas ou arrays extensos), reduza a quantidade de campos ou elementos do exemplo de entrada (ex: de 4 propriedades para 2). Dessa forma, tanto a declaração quanto a saída esperada completa cabem no slide com folga visual e sem risco de corte/overflow.
- **Simplifique código extenso para preservar margem inferior**: o conteúdo do slide nunca deve encostar na borda inferior nem colidir com a paginação (`P / N`). Em classes, funções ou construtores, condense métodos de 1 linha (ex: `constructor(initial) { this.#balance = initial; }`, `get balance() { return this.#balance; }`) ou remova validações secundárias para manter o bloco de código enxuto (~10-14 linhas).
- **Evite bullet solitário (item único na lista)**: nunca use uma lista de um único bullet no final de um slide ou após um bloco de código (ex: `- Nota: ...`). Quando houver apenas uma observação complementar, use um parágrafo formatado com ênfase (ex: `*Nota: \`Object.freeze()\` realiza congelamento raso (shallow freeze).*` ou `*Dica: ...*`) em vez de abrir um marcador de lista isolado.

### Passo a passo de execução e comandos no terminal

Em slides que ensinam comandos, terminal, criação/execução de arquivos ou passo a passo operacional:

- **Causalidade explícita (Causa → Ação → Efeito)**: Todo procedimento prático deve mostrar com total clareza **como o resultado final foi gerado**. O slide não pode saltar etapas essenciais.
- **Explicação distribuída conjuntamente com a ação (Co-localização)**:
  - Nunca coloque uma lista de bullets explicativos no topo do slide e em seguida jogue blocos de código/comandos empilhados embaixo de forma desconectada.
  - O texto explicativo (o que fazer ou observar) deve ser distribuído **junto** a cada etapa ou bloco prático, intercalando explicação, código e resultado.
- **Tríade de Execução de Código**:
  1. **Origem / Arquivo**: Identifique o arquivo criado ou editado (ex: comentário inicial `// main.js` ou `<!-- index.html -->`).
  2. **Comando de execução**: Mostre exatamente o comando digitado no terminal (ex: `$ node main.js`, `$ pnpm dev`).
  3. **Saída gerada**: Apresente a saída real resultante (no terminal ou no console da ferramenta).
- **Sessões de terminal com prompt `$ `**: Para comandos com saída no terminal, use o prefixo `$ ` na linha de comando e o texto seguinte para a saída:
  ```bash
  $ node main.js
  Olá, Node.js
  ```
- **Sessões interativas (REPL / DevTools)**: Use os prompts característicos do ambiente (ex: `>` no REPL do Node.js) para que fique evidente que se trata de uma sessão interativa:
  ```bash
  $ node
  > const total = 10 * 2;
  undefined
  > total;
  20
  > .exit
  ```
- **Não misture fluxos desconexos no mesmo slide**: Se o tópico ensina "Executar arquivo com Node", "Testar no REPL" e "Executar no Navegador", **não** comprima tudo em uma lista superficial de bullets com blocos soltos. Dedique um slide para cada fluxo ou separe em lâminas sequenciais bem encadeadas.
- **Identificação clara de ambiente**: No navegador, diferencie explicitamente o teste rápido no **Console do DevTools** da importação de script em um documento HTML via `<script src="...">`.

---

## 🧩 Composição de cada slide

Um slide não deve parecer uma página de texto comprimida. Construa cada slide ao redor de
um ponto de aprendizagem:

- prefira títulos diretos e específicos (`## Ordem das Condições`, `## Fall-through`, `## Execução com Node.js`) em
  vez de frases longas;
- em slides de procedimentos e execução prática, estruture as etapas em sequência numerada (`1. Criar o arquivo...`, `2. Executar no terminal...`), distribuindo e conectando a explicação diretamente a cada bloco de código/comando;
- use bullets compactos como apoio à fala, normalmente 3-5 por slide;
- cada bullet deve ter uma ideia só e, por padrão, caber em uma linha;
- quando um bullet passar de uma linha, corte palavras, divida o slide ou troque por
  tabela, código ou diagrama;
- nunca deixe frases incompletas, reticências de truncamento ou placeholders no deck final;
- quando houver imagem, SVG, diagrama ou código bom, reduza os bullets para abrir espaço;
- não repita em bullet o que o código ou a imagem já mostram claramente;
- prefira código, imagem ou tabela quando isso ensinar melhor do que texto corrido;
- não quebre explicação e exemplo em slides separados quando eles couberem juntos com
  boa legibilidade, especialmente em tópicos de código, comentários e comandos curtos;
- se um slide ficar visualmente vazio, procure combiná-lo com o slide anterior ou seguinte
  do mesmo tema antes de criar uma lâmina nova;
- se a combinação deixar pouco respiro no rodapé, volte atrás e divida por subtipo
  didático, por exemplo comentário de linha, comentário de bloco e JSDoc;
- em slides de output ou saída esperada, prefira mostrar apenas o bloco `txt`; não adicione
  bullets explicando o que o próprio output já evidencia;
- no slide final de resumo (`## Resumo do Tópico`), feche o arco espelhando os eixos do `## Mapa do Tópico`, usando 4-6 bullets compactos de 1 linha (como checklist `Revise...` ou termos-chave em negrito);
- se a explicação precisa de muitos bullets, divida em dois slides com títulos mais
  específicos.

Prioridade visual sugerida:

1. **Código real** quando o tópico ensina sintaxe, API, fluxo de projeto ou comportamento.
2. **Imagem/SVG versionado** quando existe uma tela, arquitetura, fluxo ou diagrama pronto.
3. **Tabela curta** quando o tópico compara opções.
4. **Diagrama ASCII** quando não há asset pronto e o fluxo precisa ser visual.
5. **Bullets** para contexto, regra, cuidado e síntese.

Para comparações de estado, antes/depois, permissões, responsabilidades ou efeitos de uma
operação, prefira uma tabela curta quando ela ficar mais clara que setas em ASCII. Use
diagrama ASCII apenas quando a forma espacial ajudar de verdade; se o desenho parecer
improvisado, troque por tabela ou divida a explicação em slides menores.

Em slides de código, a melhor composição costuma ser:

- título curto e focado;
- **1 frase descritiva contextualizando a regra ou o que observar** (evite slides vazios contendo apenas título e código solto; inclua sempre uma linha de introdução antes do bloco de código quando não houver risco de overflow);
- bloco de código legível com dados essenciais;
- comentários curtos no próprio código mostrando saída esperada (`// output`), efeito ou decisão importante.

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
title: "JavaScript: Arrays"
description: "Slides completos do tópico Arrays em JavaScript (criação, índices, métodos mutadores e acessores, HOFs)."
---
```

- `title` **idêntico** ao `title` do tópico `.mdx` e do mapa mental.
- Não invente tema: todos os decks usam `theme: default`.
- O bloco `style` é o que produz a paginação `3 / 21`.
- O `padding-bottom: 70px` no `section` reserva o respiro inferior do conteúdo.
- O `font-size: 1.5rem` no `section` padroniza o tamanho tipográfico confortável (~24px) para leitura em projeção 16:9 e acomoda blocos de código de 10-16 linhas com comentários sem risco de overflow.
- A numeração em `section::after` é posicionada com `position: absolute; bottom: 24px; right: 32px; padding: 0;` no canto inferior direito, fora da área útil do conteúdo, evitando sobreposição (*overlap*) com códigos, tabelas ou listas longas.
- A paginação deve ficar pequena (`0.6em`) e discreta.

---

## 📐 Estrutura do deck

Ordem de um deck:

1. **Capa** - `<!-- _class: lead -->`, `# <título do tópico>` e uma linha de subtítulo listando os eixos do tópico.
2. **`## Objetivo`** - frase de abertura ou bullets com verbos no infinitivo ("Entender…", "Diferenciar…", "Executar…"), termos-chave em **negrito**.
3. **`## Mapa do Tópico`** (ou `## Agenda`) - 3-6 blocos quando a página for longa, de projeto ou tiver muitas seções.
4. **`## Por Que <Tópico> Importa?`** (ou `## Motivação`) - impacto no navegador / servidor / ferramentas + linha em *itálico* com a regra de ouro.
5. **Conceito a conceito / Passo a passo operacional** - 2-4 slides por conceito principal:
   - slide 1: definição, sintaxe e regras;
   - slide 2: exemplo de código mínimo e focado;
   - slide 3 (opcional): armadilha comum, comparação, caso limite ou passo a passo de execução (arquivo → comando → saída).
6. **`## Arquitetura`** ou **`## Fluxo de Execução`** (quando aplicável) - diagrama ASCII em bloco `txt` ou tabela comparativa.
7. **`## Boas Práticas`** ou **`## Cuidados e Armadilhas`** - 3-5 alertas cruciais.
8. **`## Exercício Prático: <Tema>`** e **`## Desafio: <Tema>`** - **SEMPRE inclua o enunciado completo com as instruções e etapas claras** do exercício/desafio.
   - **Separação de slides (Enunciado vs Solução)**: Nunca omita o enunciado para colocar apenas o código de solução. Quando o enunciado junto com o código/saída ultrapassar o limite visual do slide, **divida obrigatoriamente em dois slides**:
     - Slide 1: `## Exercício Prático: <Tema>` (ou `## Desafio: <Tema>`) contendo apenas o enunciado e os requisitos numerados;
     - Slide 2: `## Solução do Exercício: <Tema>` (ou `## Solução do Desafio: <Tema>`) contendo o código de resolução com as saídas esperadas (`// output`).
9. **`## Solução do Exercício` / `## Solução do Desafio`** - **SEMPRE inclua comentários de saída esperada** (`// output`) em `console.log()` ou chamadas de função, ou um bloco `txt` de saída, permitindo visualizar o resultado da execução imediatamente.
10. **`## Perguntas de revisão`** - 3-5 perguntas conceituais para fixação. **Toda pergunta DEVE obrigatoriamente terminar com ponto de interrogação (`?`)**.
11. **`## Resumo do Tópico`** - 4-6 bullets fechando o arco didático da aula, alinhados diretamente com os eixos apresentados no `## Mapa do Tópico`. Pode seguir dois padrões recomendados:
    - **Padrão Checklist de Revisão**: Bullets objetivos orientados à ação recapitulando os eixos centrais (ex: `- Revise por que...`, `- Revise a evolução...`, `- Revise o que a linguagem oferece...`, `- Revise como executar...`).
    - **Padrão Síntese Conceitual**: Bullets com termos destacados em negrito e resumo direto da lição principal de cada eixo (ex: `- **Conceito**: síntese da regra de ouro...`).
    - Se o resumo passar de 6-7 bullets, divida em `## Resumo do Tópico (Parte 1)` e `## Resumo do Tópico (Parte 2)`.

Separe **todo** slide com `---` em linha isolada.

Tamanho real dos decks: 128-547 linhas (~15 a 45 slides). Tópicos de fundamento ficam
perto de 150 linhas; tópicos densos (objetos, módulos, HTML) passam de 400.

---

## ✍️ Convenções de escrita

- Português (pt-BR), termos técnicos em inglês em *itálico* (`*shallow copy*`,
  `*empty slots*`) e identificadores em `` `crase` ``.
- **Pontuação obrigatória em perguntas**: Em slides de `## Perguntas de revisão` e em qualquer questionamento didático, **toda pergunta DEVE terminar com ponto de interrogação (`?`)**. Nunca deixe perguntas sem interrogação ou com ponto final.
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

Roda lint + `astro check` + build completo + `check:links` — use quando o tópico linkar
o deck pela primeira vez (o link só resolve depois que o HTML existe).

### Validação da Skill

Ao atualizar regras ou templates nesta skill:
1. Valide o impacto no arquivo de slide em foco (`pnpm build:slides`).
2. Inspecione o HTML gerado em `public/slides/<caminho>/index.html` para certificar-se de que a formatação, paginação e clareza visual atendem às novas diretrizes.
3. Não altere ou regere desnecessariamente outros slides existentes do repositório.

---

## ⚠️ Armadilhas

1. **Slide sem `---`**: o conteúdo gruda no slide anterior e estoura a área visível.
2. **Excesso de conteúdo**: acima de ~5 bullets, ~18 linhas de código sozinho ou ~12
   linhas de código com explicação, o texto tende a vazar. Divida em `(Parte 1)` /
   `(Parte 2)` ou corte ruído.
3. **Perder o bloco `style`**: a paginação passa a mostrar só o número, sem o total.
4. **Título fora de sincronia** com o tópico e o mapa mental correspondente.
5. **Cercas aninhadas**: ao mostrar Markdown dentro de Markdown, use cercas externas de
   4 crases.
6. **Editar `public/slides/`**: é saída de build, sobrescrita e gitignorada.
7. **Slide em branco no início**: depois do frontmatter, a primeira coisa visível deve ser
   `<!-- _class: lead -->`; não coloque um `---` extra logo após o frontmatter.
8. **Cobertura fraca**: se a página tem várias seções e o deck só cobre os títulos mais
   óbvios, revise contra o sumário da página antes de entregar.
9. **Código de menos em página prática**: se o tópico é baseado em projeto e quase não há
   trechos de código, o deck vira palestra abstrata. Volte aos `<SourceCode>` e escolha
   recortes melhores.
10. **Visual sem propósito**: imagens e SVGs são bem-vindos quando explicam fluxo,
    arquitetura ou tela; se só ocupam espaço, remova.
11. **Falta de output em código e exercícios**: nunca deixe chamadas de `console.log()`
    ou resoluções de exercícios/desafios sem a respectiva saída esperada documentada
    em comentário `// output` ou bloco `txt`.
12. **Passo a passo de execução incompleto ou desconexo**: listar bullets genéricos de etapas (ex: "verifique a versão", "crie arquivo", "use REPL") e soltar comandos e códigos fragmentados sem mostrar a criação do arquivo, o comando exato de execução (`$ node main.js`) e a saída gerada no terminal, deixando incompreensível como o resultado foi gerado.
13. **Separação em bloco de explicação e ação**: empilhar todos os bullets explicativos no topo do slide e soltar blocos de código/terminal embaixo sem vinculação direta. A explicação de cada passo deve sempre ser distribuída junto com o bloco prático correspondente.
14. **Blocos de código sem identificação de contexto**: soltar trechos de código em slides práticos sem indicar o nome do arquivo (`// main.js`, `<!-- index.html -->`) ou o ambiente onde rodam (terminal, REPL ou console do navegador).
15. **Comando ou saída sem correspondência**: mostrar um comando de terminal sem sua saída esperada, ou mostrar uma saída sem o comando que a gerou.
16. **Quebra artificial de tema**: não separe introdução e exemplo de um mesmo código,
    comentário ou comando quando houver espaço para manter tudo em um slide legível.
17. **Espaço branco excessivo**: um slide com poucos bullets e muito vazio costuma indicar
    que a explicação pode ser fundida a um exemplo, tabela curta ou slide vizinho do mesmo tema.
18. **Fusão incompleta**: depois de unir dois slides, revise o novo slide seguinte. Ele pode
    ter virado o próximo candidato a fusão por tratar do mesmo código, comentário ou comando.
19. **Fusão com risco de overflow**: não resolva espaço branco criando slides lotados.
    Se código, tabela ou bullets ficarem próximos da paginação, separe por subtipo ou
    corte ruído.
20. **Pergunta sem ponto de interrogação**: omitir o ponto de interrogação (`?`) ao final dos itens em slides de `## Perguntas de revisão` ou em questionamentos conceituais.
