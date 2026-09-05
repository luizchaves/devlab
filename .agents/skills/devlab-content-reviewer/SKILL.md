---
name: devlab-content-reviewer
description: >-
  Revisa e audita conteúdo já escrito do DevLab (páginas `.mdx` de tópico, slides `.slide.md`
  e mapas mentais `.mindmap.md`) contra as convenções reais do repositório, avaliando
  estrutura, didática, português do Brasil, fidelidade técnica e paridade com os materiais.
  Use sempre que o usuário pedir para revisar, auditar, conferir, "dar uma olhada" ou validar
  uma página, um curso inteiro ou as alterações de um diff antes do commit.
---

# DevLab — Revisor de Conteúdo

Esta skill **avalia** conteúdo existente. Ela não é a que escreve: quem cria e expande páginas
é a `devlab-topic-docs-generator`, quem produz decks é a `marp-slides-generator` e quem produz
mapas mentais é a `markmap-mindmap-generator`. O revisor lê essas três como fonte das regras e
verifica o que já está escrito.

> **Fonte da verdade**: `AGENTS.md` na raiz e as skills de geração. Uma divergência entre este
> arquivo e elas é defeito **deste** arquivo, e deve ser corrigida aqui.

---

## 🎯 O que este revisor faz e o que não faz

| Faz | Não faz |
| --- | --- |
| Aponta violação de regra com arquivo, linha e a regra violada. | Reescrever a página inteira sem pedido explícito. |
| Executa as verificações mecânicas do repositório e relata a saída. | Declarar "está tudo certo" sem ter executado nada. |
| Diz explicitamente quando um item está correto. | Inventar problema para parecer produtivo. |
| Classifica cada achado por severidade. | Misturar preferência pessoal com regra do repositório. |
| Sugere a correção em uma frase. | Aplicar correções silenciosamente durante a revisão. |

**Regra central**: todo achado precisa citar **a regra** que foi violada e **onde**. "O texto
poderia ficar melhor" não é achado. "Tabela na linha 212 colada no `###`, viola a regra do
parágrafo de entrada" é.

Quando o usuário pedir apenas a revisão, entregue o relatório e **pare**. Aplique correções em
uma segunda etapa, depois que ele escolher o que aceitar.

---

## 🚦 Escopo da revisão

Antes de começar, defina o escopo com o usuário ou pelo contexto:

| Pedido típico | Escopo |
| ------------- | ------ |
| "revise esta página" | O `.mdx` citado, mais os materiais correspondentes. |
| "revise o que eu mudei" | Apenas o diff (`git diff` / `git diff --staged`). |
| "revise o curso X" | Todas as páginas do curso, com relatório agregado por página. |
| "está pronto para commit?" | Diff + verificações mecânicas completas. |

Em revisão de curso inteiro, **não** produza um relatório gigante: entregue a tabela agregada
com a contagem de achados por página e detalhe apenas as três páginas com mais problemas,
perguntando se deve seguir para as demais.

---

## 1️⃣ Fase mecânica: o que a máquina responde

Rode primeiro o que não depende de julgamento, e relate a saída real. Nunca afirme que passou
sem ter executado:

```bash
pnpm lint
```

```bash
pnpm check
```

```bash
pnpm build && pnpm check:links
```

```bash
pnpm check:doc-lines
```

`check:doc-lines` confere `mark`, `collapse` e `lines` do `<SourceCode>` contra os arquivos
reais de `examples/`. A variante `node scripts/check-doc-lines.mjs --prosa` é heurística e
informativa: ela aponta citações de linha no texto que podem ter envelhecido.

### Blocos de código: sintaxe, execução e comentários de saída

O build do site trata todo bloco cercado como texto: um `}` faltando, uma sessão de terminal
marcada como `js` ou um `console.log()` cuja saída documentada envelheceu passam por `pnpm
build` sem qualquer aviso. O script desta skill cobre exatamente essa lacuna:

```bash
node .agents/skills/devlab-content-reviewer/scripts/check-code-blocks.mjs <arquivo.mdx>
```

```bash
node .agents/skills/devlab-content-reviewer/scripts/check-code-blocks.mjs "src/content/docs/courses/ecmascript/**/*.mdx" --run
```

Ele trabalha em duas camadas:

| Camada | O que faz | Quando roda |
| ------ | --------- | ----------- |
| **Sintaxe** | Escreve cada bloco `js`/`ts` em um arquivo temporário e roda `node --check`. | Sempre. Falha aqui é **ERRO**. |
| **Execução** | Executa os blocos autocontidos e compara a saída real com o que a página promete. | Só com `--run`. Divergência é **AVISO**. |

A comparação da segunda camada usa as duas formas que a página adota para documentar saída:

1. o bloco ` ```txt title="Output" ` imediatamente seguinte, comparado por inteiro;
2. os **comentários de saída na própria linha**, como `console.log(soma(2, 3)); // 5`,
   verificados por presença na saída real, o que tolera ordem e linhas extras.

O script já conhece as convenções do portal e não reclama delas: aspas de anotação
(`// "texto"`), motivo entre parênteses (`// false (um dígito a menos)`), ênfase (`// true!`),
espaçamento de array (`[1, 2]` contra `[ 1, 2 ]`), blocos com mais de um arquivo separados por
`// arquivo.js`, fragmentos com `return` fora de função, assinaturas com parâmetro opcional e
código assíncrono, cuja ordem de saída não acompanha a ordem das linhas.

Os avisos que **valem investigação**, em ordem de gravidade:

| Aviso | O que costuma significar |
| ----- | ------------------------ |
| `sintaxe invalida` (ERRO) | Chave não fechada, ou transcrição de terminal marcada como `js` (use ` ```txt `). |
| `a saida real difere do bloco Output` | O `Output` da página envelheceu, ou o exemplo mudou sem atualizar a saída. |
| `comentario promete X, ausente na saida real` | O comentário de saída não corresponde ao que o código imprime hoje. |
| `o bloco nao executa ate o fim` | Exemplo quebrado, **ou** erro proposital de didática: confira antes de "corrigir". |
| `bloco sem title` | Falta o `title="..."` obrigatório do Expressive Code. |
| `terminal sem output` | Comando que produz saída relevante (`node arquivo.js`, `node --test`) sem o ` ```txt title="Output" frame="terminal" ` em seguida. Exceção: sessões com prompt visível, em que comando e resposta já vêm juntos. |
| `nao e JavaScript valido; se for assinatura` | Assinatura ou pseudocódigo marcado como `js`. |

É uma ferramenta heurística, como o `check-doc-lines --prosa`: ela aponta candidatos, e a
decisão continua sendo de quem revisa. Trate **ERRO** como bloqueio e leia cada **AVISO** antes
de descartá-lo.

Para páginas com diagramas, meça a largura renderizada com o `pnpm dev` aberto:

```js
[...document.querySelectorAll('.mermaid-figure')].map((f) => ({
  legenda: f.querySelector('figcaption')?.textContent,
  largura: Math.round(f.querySelector('svg').viewBox.baseVal.width),
}));
```

Acima de ~850 px o diagrama é reduzido pelo `max-width: 100%` e o texto fica pequeno: isso é
achado de severidade **Corrigir**, com a escada de correção descrita na
`devlab-topic-docs-generator`.

---

## 2️⃣ Estrutura e navegação

Confira, na ordem em que aparecem no arquivo:

1. **Frontmatter**: `title` com o prefixo da trilha, `description` densa, `course` correto e
   `sidebar.label` curto quando o título for longo.
2. **Parágrafo de abertura** antes da linha `Materiais:`, nunca depois.
3. **Linha `Materiais:`** apontando para arquivos que **existem** em `materials/`, com a
   profundidade de `../` correta.
4. **Seções obrigatórias**: `## Objetivo`, `## Exercício` e `## Próximo tópico`.
5. **Ordem das seções** conforme a estrutura da skill de geração.
6. **`## Objetivo` bipartido**: parágrafo geral encerrado por "Ao final do tópico, o leitor
   deve ser capaz de:" e de 4 a 6 marcadores começando por verbo no infinitivo.
7. **Registro na sidebar** (`astro.config.mjs`) e na página `index.mdx` do curso.
8. **`## Próximo tópico`** com link relativo válido e uma frase de ligação.
9. **Imports**: todo componente usado está importado, e nenhum import sobra.

---

## 3️⃣ Didática

Esta é a fase que mais rende, e a que nenhum script cobre:

| Verificação | Achado quando falha |
| ----------- | ------------------- |
| Todo elemento não-`<p>` (tabela, lista, código, diagrama, `<Aside>`) tem parágrafo de apresentação antes. | Elemento colado em título ou em outro elemento. |
| Tabelas são explicadas, não apenas anunciadas. | "A tabela a seguir mostra…" sem dizer como lê-la. |
| Blocos `<SourceCode>` citam linha, variável ou função no texto anterior. | Código apresentado sem ponto de entrada para o leitor. |
| Apresentação simples antes do aprofundamento. | O primeiro exemplo do conceito já vem com três recursos avançados. |
| Progressão entre seções sem salto conceitual. | Uma seção usa algo que só será explicado depois. |
| Conceito abstrato tem recurso visual. | Escopo, ciclo de vida, arquitetura ou eixos sem diagrama. |
| Diagramas têm `title` e são apresentados no texto. | Figura sem legenda ou sem introdução. |
| Nenhuma subseção solitária. | Um único `###` dentro de um `##`. |
| Parágrafos curtos, sem blocos monolíticos. | Parágrafo com mais de seis ou sete linhas densas. |
| Exercício e Desafio com parágrafo de transição antes do `<details>`. | Resposta colada no enunciado. |
| Perguntas de revisão agrupadas por `###`, numeradas e em negrito. | Formato divergente do restante do curso. |

---

## 4️⃣ Português do Brasil

O texto é didático e escrito para estudantes brasileiros. Verifique:

1. **Travessão (`—`) para oração intercalada ou aposto**: proibido. Substitua por vírgula,
   parênteses ou dois-pontos. É o vício mais comum em texto gerado por IA.
2. **Pergunta sem `?`**: todo título, item ou frase iniciada por "O que", "Por que", "Como",
   "Quando", "Qual" e similares termina em interrogação, ou vira título declarativo.
3. **Bullet solitário**: lista de um item só vira parágrafo.
4. **Termos técnicos em inglês** em itálico (`*callback*`, `*hoisting*`), identificadores em
   código (`const`, `Array.prototype.map()`).
5. **Vocabulário incomum no português do Brasil**: prefira a palavra corrente. Exemplos que já
   apareceram: "prosa" (use *texto*, *texto livre*, *texto corrido*), "outrossim", "destarte",
   "amiúde", "por conseguinte".
6. **Voz e pessoa consistentes** com o restante do curso, sem alternar entre "você" e "o
   leitor" no mesmo parágrafo.
7. **Concordância, crase e regência**, com atenção especial a trechos gerados por IA em
   sequência.
8. **Repetição de conectivo**: "portanto", "no entanto" e "dessa forma" abrindo três parágrafos
   seguidos indicam texto que precisa de reescrita.
9. **Anglicismo desnecessário**: *deletar*, *startar*, *deployar*. Use apagar, iniciar, publicar.

---

## 5️⃣ Fidelidade técnica

O conteúdo do DevLab afirma coisas sobre a linguagem e sobre ferramentas, e essas afirmações
precisam ser verdadeiras hoje:

1. **Saídas de terminal são reais?** Todo bloco `txt title="Output"` deve ter sido produzido
   por uma execução, não escrito de memória. O `check-code-blocks.mjs --run` compara
   automaticamente; na dúvida, execute à mão.
2. **Todo comando que gera saída relevante mostra essa saída?** Um `bash title="Terminal"` com
   `node arquivo.js` ou `node --test` sem o `Output` seguinte obriga o leitor a executar para
   saber o que esperar. A recíproca vale igualmente: saída sem o comando que a produziu.
   Comandos sem retorno útil (`cd`, `mkdir`, `code .`) e instalações longas são a exceção.
3. **O código do bloco roda?** A camada de sintaxe do script pega o que não compila; a de
   execução pega o que compila e não faz o que a página diz.
4. **A API existe na versão citada?** Confirme com `node --eval` ou na MDN, principalmente em
   recursos recentes (`toSorted`, `Object.groupBy`, `import.meta.dirname`).
5. **A versão citada bate com a do repositório?** Node.js e dependências mudam.
6. **Comandos e caminhos existem?** `pnpm run <script>` precisa estar no `package.json`, e o
   caminho de `<SourceCode>` precisa existir em `examples/`.
7. **Links externos**: MDN e especificação, sem encurtador e sem link morto.

---

## 6️⃣ Slides, mapas mentais e paridade

Esta fase vale nos dois sentidos: quando a página muda e os materiais precisam acompanhar, e
quando o material acabou de ser gerado e precisa ser conferido antes da entrega.

Primeiro, a paridade entre os três arquivos do mesmo tópico:

| Verificação | Onde olhar |
| ----------- | ---------- |
| `title` idêntico nos três arquivos. | `.mdx`, `.slide.md` e `.mindmap.md`. |
| Seções novas ou removidas refletidas no deck e no mapa. | `materials/**/`. |
| Código alterado na página também alterado no deck. | Blocos do `.slide.md`. |
| Diagramas Mermaid **não** copiados para os materiais. | Marp e Markmap não renderizam Mermaid: lá o desenho é ASCII. |

Depois, o que é específico de cada artefato. Em um deck recém-gerado (`pnpm build:slides`, com
o HTML aberto em `public/slides/`):

1. **Nenhum slide estoura a paginação**: código longo, tabela grande e listas extensas são os
   suspeitos; separe por subtipo ou corte ruído em vez de reduzir a fonte.
2. **Sem bullet solitário**: lista de um item vira parágrafo.
3. **Um slide, uma ideia**: se o título precisa de "e" para caber, provavelmente são dois.
4. **Cobertura da página**: as seções principais do `.mdx` aparecem no deck, na mesma ordem.
5. **Código executável de verdade**, com o mesmo comportamento do que está na página.

Em um mapa mental recém-gerado (`pnpm build:mindmaps`, com o HTML aberto em
`public/mindmaps/`):

1. **Profundidade coerente**: ramos irmãos com nível de detalhe parecido, sem um galho com
   cinco níveis e outro com um.
2. **Folhas conceituais**, não blocos de código nem HTML copiados da página.
3. **Cobertura**: um mapa muito curto para uma página longa está omitindo conceito.
4. **Rótulos curtos**: folha de mapa mental é sintagma, não frase completa.

---

## 7️⃣ Code review: o código que a página mostra

Boa parte do conteúdo do DevLab aponta para código que roda de verdade em `examples/`, e é
esse código que o leitor vai copiar. Quando o diff toca `examples/`, `scripts/` ou
`src/components/`, a revisão de conteúdo passa a incluir revisão de código.

**Ordem da leitura**: comportamento primeiro, estilo por último. O `lint` já cobre estilo, e
gastar a revisão com formatação é o erro mais comum de quem revisa cansado.

| O que verificar | Achado típico neste repositório |
| --------------- | ------------------------------- |
| **O código roda?** | Exemplo que não executa por `import` sem extensão ou dependência ausente. |
| **A saída documentada confere?** | Bloco `txt title="Output"` diferente do que o comando imprime hoje. |
| **Mutação inesperada** | `sort()`, `reverse()`, `splice()` ou `set*` de `Date` alterando o dado recebido. |
| **Erro engolido** | `catch` que só registra no console e devolve valor padrão. |
| **Assíncrono** | `await` em fila para chamadas independentes, `await` dentro de `forEach()`, `return` sem `await` dentro de `try`. |
| **Entrada não confiável** | Corpo de requisição interpolado em HTML ou em consulta sem parametrização. |
| **Dependência nova** | Existe no registro, é necessária e está justificada no `README.md` ou `PRD.md` do projeto? |
| **Nomes** | Identificadores em inglês, exceto textos de interface, conforme o `AGENTS.md`. |
| **Coerência com a trilha** | O projeto continua o anterior, sem regredir de TypeScript para JavaScript nem perder o banco. |
| **Fronteira de exemplo** | `examples/` tem `package.json` próprio; nada deve ser adicionado ao workspace raiz. |

Duas verificações específicas de conteúdo didático, que um revisor de código comum não faria:

1. **O exemplo ensina o que a página diz que ensina?** Um trecho correto mas que resolve o
   problema por outro caminho confunde mais do que ajuda.
2. **As âncoras do `<SourceCode>` continuam apontando para o trecho certo?** Alterar o arquivo
   em `examples/` desloca `mark` e `collapse`; `pnpm check:doc-lines` acusa, e a citação de
   linha escrita no texto não é coberta por ele.

Para revisar um diff de código com apoio de assistente, o pedido abaixo funciona melhor do que
"revise este código", porque nomeia o que procurar e autoriza dizer que está correto:

```txt
Revise apenas o diff, sem escrever código novo. Verifique, item a item:
1. alguma função altera argumento recebido sem que isso esteja no contrato?
2. existe erro capturado sem tradução, contexto ou repropagação?
3. há await em sequência para chamadas independentes, ou await dentro de forEach?
4. algum caminho novo ficou sem teste, principalmente entrada inválida e lista vazia?
5. entrada de usuário chega a HTML, SQL ou caminho de arquivo sem tratamento?
6. alguma dependência foi adicionada? ela existe, é necessária e está justificada?

Responda no formato arquivo:linha, problema em uma frase, correção sugerida.
Se um item estiver correto, diga que está correto e siga.
```

Antes de aprovar, rode o que o projeto de exemplo oferece: os testes com `node --test`, e o
exemplo em si com `node <arquivo>`. Um exemplo que não roda é o defeito mais caro do portal,
porque o leitor descobre sozinho, sem ter como saber se o erro é dele ou da página.

---

## 📋 Formato do relatório

Entregue sempre nesta forma, do mais grave para o mais leve:

```md
## Revisão — <arquivo>

**Mecânico**: lint ok · check ok · check:links ok · check:doc-lines 2 avisos

### Bloqueia o merge
| Onde | Achado | Regra | Correção |
| ---- | ------ | ----- | -------- |
| arquivo.mdx:212 | Tabela colada no `###` | Parágrafo de entrada | Escrever uma frase de apresentação |

### Corrigir antes de publicar
…

### Sugestões
…

**Correto e conferido**: estrutura de seções, objetivo bipartido, links relativos, paridade
com slides.
```

As três severidades:

| Severidade | Critério |
| ---------- | -------- |
| **Bloqueia o merge** | Quebra build, link ou `check:doc-lines`; informação tecnicamente errada; código que não roda. |
| **Corrigir antes de publicar** | Viola convenção declarada (parágrafo de entrada, travessão, subseção solitária, diagrama largo demais). |
| **Sugestão** | Melhoria de clareza, ordem ou exemplo, sem regra violada. Deixe explícito que é opcional. |

A última linha, com o que foi conferido e está correto, é obrigatória. Sem ela o usuário não
sabe o que a revisão cobriu e o que ela não olhou.

---

## 🤖 Delegar a revisão a outro agente

Quando a revisão for de um diff grande, vale rodá-la em uma sessão separada, sem o histórico
que produziu o conteúdo. O pedido abaixo carrega o essencial:

```txt
Você é revisor de conteúdo do DevLab. Não escreva conteúdo novo.

Leia `.agents/skills/devlab-content-reviewer/SKILL.md` e aplique as fases 2 a 7
ao diff atual (`git diff`). As verificações da fase 1 já foram executadas e o
resultado é: <cole a saída>.

Para cada achado responda: arquivo:linha, o problema em uma frase, a regra violada
e a correção sugerida. Classifique por severidade. Se um item estiver correto,
diga que está correto e siga. Não invente problema para preencher a lista.
```

Lembre-se de que o revisor automatizado erra nos dois sentidos, apontando o que não existe e
deixando passar o que existe. Ele **adiciona** uma camada; a leitura de quem publica continua
obrigatória.

---

## ⚠️ Armadilhas do próprio revisor

1. **Relatório sem execução**: afirmar que "o build passa" sem ter rodado.
2. **Achado sem regra**: opinião de estilo apresentada como violação.
3. **Revisão que vira reescrita**: alterar a página durante a revisão, sem pedido.
4. **Excesso de achados de baixa severidade**: trinta sugestões escondem os dois defeitos reais.
5. **Ignorar o que está certo**: sem a lista do que foi conferido, o usuário não sabe o alcance.
6. **Revisar o texto e não o código**: o bloco que não roda é o defeito mais caro da página.
7. **Esquecer os materiais**: página revisada, deck e mapa mental desatualizados.
