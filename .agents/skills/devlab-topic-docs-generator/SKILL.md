---
name: devlab-topic-docs-generator
description: >-
  Cria e mantém páginas de tópicos do DevLab em Astro Starlight (`.md` / `.mdx`) sob
  `src/content/docs/courses/`. Use sempre que o usuário pedir para criar, atualizar,
  expandir ou revisar um tópico de disciplina/guia (ECMAScript, Arrays, Strings,
  Funções, HTML, CSS, Express, Prisma, etc.).
---

# DevLab — Gerador de Páginas de Tópicos

Guia para escrever tópicos e guias do DevLab seguindo as convenções **reais** do repositório.

> **Fonte da verdade**: o `README.md` da raiz (seções "Como criar uma disciplina",
> "Como criar uma página `.md`", "Quando usar `.mdx`", "Componentes" e "Expressive Code").
> Em caso de conflito entre este guia e o README, o README vence — e este arquivo
> deve ser corrigido.

---

## 📁 Localização e nomes

```
src/content/docs/courses/<course-id>/<categoria>/<topico>.(md|mdx)
```

- `course-id` existentes: `dw-cstrc-jp` (Desenvolvimento Web), `lp2-ctii-jp`, `pw2-csbes-jp`.
- Categorias de `dw-cstrc-jp`: `html`, `css`, `javascript`, `browser`, `node`,
  `express`, `database`, `packages`, `projects`, `extra`.
- Nome do arquivo em **kebab-case, inglês**, igual ao slug da URL
  (`expressions-operators.mdx`, `error-handling.mdx`).
- A URL final tem **barra no fim** (`trailingSlash: 'always'`):
  `/courses/ecmascript/data/arrays/`.

### `.md` ou `.mdx`?

Use `.md` por padrão. Só troque para `.mdx` quando a página **precisar de componentes**:

| Precisa de…                                    | Extensão |
| ---------------------------------------------- | -------- |
| Texto, listas, tabelas, blocos de código        | `.md`    |
| Callouts `:::tip[Título]` … `:::`               | `.md`    |
| `<Aside>`, `<Steps>`, `<Tabs>`, `<Card>`        | `.mdx`   |
| `<SourceCode>`, `<CodeTabs>`, `<FileTree>`      | `.mdx`   |
| `<ApiRequest>`, `<ApiResponse>`, `<HtmlPreview>`| `.mdx`   |
| Expressões JS (`{projects.map(…)}`)             | `.mdx`   |

Tópicos longos de JavaScript normalmente acabam em `.mdx` (usam `<Aside>` e `<Steps>`);
tópicos curtos de conceito podem ficar em `.md` com `:::tip[…]`.

---

## 📄 Frontmatter

```mdx
---
title: "JavaScript: Arrays"
description: "Criação, geração de intervalos (range), manipulação, iteração, desestruturação, operador spread e principais métodos de Array em JavaScript."
course: dw-cstrc-jp
sidebar:
  label: Arrays
  order: 8
---
```

- `title`: prefixado pela trilha (`JavaScript: …`, `HTML: …`, `CSS: …`) e **idêntico**
  ao `title` dos slides e do mapa mental do mesmo tópico.
- `description`: uma frase densa listando o que a página cobre (vira `<meta>`).
- `course`: obrigatório nos tópicos (schema estendido em `src/content.config.ts`).
- `project`: opcional, aponta para um projeto de `examples/`.
- `sidebar.label`: rótulo curto para a navegação quando o `title` é longo
  (`label: "Map e Set"` para `title: "JavaScript: Map e Set"`). Usado em ~40% das páginas.
- `sidebar.order`: só tem efeito em disciplinas cuja sidebar usa `autogenerate`;
  `dw-cstrc-jp` tem sidebar **explícita** em `astro.config.mjs` (ver "Registro na sidebar").

Depois do frontmatter, em `.mdx`, importe **apenas** o que for usado:

```mdx
import { Aside, Card, CardGrid, Steps, Tabs, TabItem } from '@astrojs/starlight/components';
import SourceCode from '@components/SourceCode.astro';
import FileTree from '@components/FileTree.astro';
```

---

## 🔗 Linha de materiais

**Posicionamento obrigatório**: A linha de materiais deve ficar **sempre depois do parágrafo de introdução** e antes de `## Objetivo`. Nunca posicione a linha `Materiais:` antes do parágrafo de abertura nem colada diretamente após os imports.

Logo após o parágrafo de abertura ("Este tópico apresenta…"), inclua a linha de
materiais quando existirem slides/mapa mental do tópico:

```mdx
Materiais: [slides do tópico](../../../../slides/courses/ecmascript/data/arrays/) e [mapa mental](../../../../mindmaps/courses/ecmascript/data/arrays/).
```

**Profundidade do `../`** — conte os segmentos da URL da página, não as pastas do disco:

| URL da página                                   | Prefixo          |
| ----------------------------------------------- | ---------------- |
| `/courses/<curso>/<categoria>/<topico>/`         | `../../../../`   |
| `/courses/<curso>/<topico>/` (ex.: `project`)    | `../../../`      |
| `/courses/<curso>/<categoria>/` (`index`)        | `../../../`      |

Só cite materiais que **existem** em `slides/` e `mindmaps/`. Não linke arquivos
`.excalidraw`: eles não são copiados para `public/` e o `pnpm check:links` quebra.

---

## 📐 Estrutura do tópico

Ordem observada nos tópicos de `ecmascript`. Nem toda seção é obrigatória,
mas **`Objetivo`, `Exercício` e `Próximo tópico` são**, e a ordem relativa deve ser mantida.

1. **Parágrafo de abertura** — o que o tópico apresenta, em 1–3 linhas (iniciando preferencialmente por *"Este tópico apresenta..."*).
2. **`Materiais: …`** — slides e mapa mental (obrigatoriamente **após** o parágrafo de introdução, nunca antes).
3. **`## Objetivo`** — Formato bipartido obrigatório (**Geral + Específico**), inspirado no modelo pedagógico de referência de `functions.mdx`, `arrays.mdx` e `objects.mdx`:
   - **Objetivo Geral (1 parágrafo introdutório)**: Inicia com um verbo abrangente no infinitivo (*Dominar*, *Compreender*, *Construir*), contextualizando a jornada pedagógica do fundamento à aplicação prática avançada. Encerra obrigatoriamente com a frase canônica de transição: `Ao final do tópico, o leitor deve ser capaz de:`.
   - **Objetivos Específicos (lista de 4 a 6 marcadores)**: Cada item inicia obrigatoriamente com um verbo de ação no infinitivo (*Diferenciar*, *Manipular*, *Escolher*, *Aplicar*, *Explicar*), cobrindo as grandes seções do tópico. Termos técnicos em inglês ficam em itálico (`*guard clause*`, `*callbacks*`) e identificadores em código (`===`, `return`). Cada item termina com ponto final (`.`).
4. **Seções de conteúdo** (`## …`, subdivididas com `### …`) — conceito a conceito,
   cada uma com: explicação → tabela comparativa quando houver taxonomia → bloco de
   código comentado → `<Aside>` de armadilha ou dica.
5. **`## <Tema> na Era da Inteligência Artificial`** — recomendada em tópicos cujo trabalho real
   mudou com assistentes de código (ver a seção "🤖 Seção e asides sobre código gerado por IA").
6. **`## Resumo e Boas Práticas`** / **`## Boas práticas`** — recomendado em tópicos longos ou guias com muitos
   conceitos práticos; estruturado preferencialmente em tabela de duas colunas (`| Prática | Motivo |`) acompanhada de um bloco executável ````js title="Resumo prático"```` consolidando o uso combinado das regras.
7. **`## Executando`** — passo a passo em `<Steps>` para rodar o exemplo
   (arquivo `.js` → `node arquivo.js` → bloco `txt title="Output"` ou `bash title="Terminal"` → teste alternativo de precedência ou erro).
8. **`## Exercício`** — enunciado numerado (5–10 itens), com parágrafo introdutório antes da lista e parágrafo de transição antes do
   `<details><summary>Possível resposta</summary>` com a solução comentada.
9. **`## Desafio`** — variação mais complexa, mesmo formato de `<details>` e com parágrafo de transição prévio.
10. **`## Perguntas de revisão`** — 8–12 perguntas em negrito e numeradas, agrupadas por
   `### <Subtema>`, cada pergunta terminando obrigatoriamente com ponto de interrogação (`?`), com `<details><summary>Possível resposta</summary>`.
11. **`## Referências`** — links MDN/spec agrupados por assunto, formato
    `[Array | MDN](https://developer.mozilla.org/…)`.
12. **`## Próximo tópico`** — 1 frase de ligação + link relativo para o próximo tópico:
    `[Strings](../strings/): Criação, template literals e métodos do objeto String.`

Padrão do bloco de resposta:

```mdx
<details>
  <summary>Possível resposta</summary>

  `splice()` é mutador e altera o array original. `slice()` é acessor e devolve uma cópia.
</details>
```

---

## 🧪 Seções de Teste e Didática de Testes

Ao escrever ou atualizar seções de testes em tópicos de conceito ou de projetos práticos:

1. **Parágrafos explicativos obrigatórios por teste**: Sempre inclua um parágrafo (`<p>` ou texto Markdown) antes de cada bloco de código ou caso de teste individual. Explique explicitamente a intenção do teste, o cenário avaliado, o código HTTP esperado e a razão de cada asserção.
2. **Requisições `.http` recolhíveis (`<details>`)**: Em testes de endpoints de API, forneça o trecho correspondente do arquivo `requests.http` em um bloco recolhível `<details><summary>Requisição .http correspondente</summary>...</details>`.

Exemplo:

```mdx
O teste a seguir valida a rota de cadastro. Ele garante que um payload válido retorna status `201 Created` e que dados sensíveis como a senha não são retornados no corpo da resposta.

<details>
  <summary>Requisição .http correspondente</summary>

  ```http
  POST http://localhost:3000/api/users
  Content-Type: application/json

  {
    "name": "Ana Maria",
    "email": "ana@example.com"
  }
  ```
</details>
```

---

## 🤖 Seção e asides sobre código gerado por IA

Assistentes de código mudaram o custo de escrever JavaScript: o esforço saiu de **lembrar a
sintaxe** e foi para **especificar o comportamento e verificar o que foi gerado**. Sempre que
um tópico tratar de algo que a IA gera com facilidade e erra com frequência, o tópico deve
dizer isso ao leitor, em vez de fingir que o código nasce sempre digitado à mão.

A página de referência é `src/content/docs/courses/ecmascript/stdlib/regex.mdx`
(`## Expressões Regulares na Era da Inteligência Artificial`). Use-a como **exemplo do nível de
profundidade esperado**, não como formulário a ser copiado: cada tópico adapta as subseções ao
que a IA erra naquele assunto.

### Quando incluir a seção completa

A seção `## <Tema> na Era da Inteligência Artificial` só se justifica quando houver conteúdo
específico do tópico, não conselho genérico sobre IA. Use a tabela para decidir:

| Sinal do tópico | Exemplo | Decisão |
| :--- | :--- | :--- |
| A IA gera o artefato inteiro em uma linha e o leitor não consegue auditar | Expressões Regulares, `Intl`, datas | Seção completa. |
| O erro gerado passa nos testes felizes e falha em produção | assíncrono, tratamento de erros, imutabilidade | Seção completa. |
| O modelo mistura dialetos ou versões da linguagem | ECMAScript × Python, CommonJS × ESM | Seção completa. |
| O tópico é fundamento sintático curto, sem armadilha própria de IA | tipos primitivos, operadores básicos | Apenas `<Aside>` pontual. |
| A página é referência, tabela ou linha do tempo | *cheat sheet*, evolução do TC39 | Apenas `<Aside>` pontual. |

Posicione a seção **depois das seções de conteúdo e antes de `## Resumo e Boas Práticas`**,
para que o resumo já possa citar a revisão de código gerado como boa prática.

### Estrutura interna da seção

**A seção não tem forma fixa.** As subseções abaixo são um repertório, não um gabarito: escolha
as que o tópico realmente pede, na ordem que fizer sentido para ele, e **crie subseções que só
existam naquela página** quando o tema tiver uma armadilha própria (fuso horário em datas,
`__dirname` em módulos, normalização Unicode em strings, concorrência em assíncrono). Duas
páginas com as mesmas seis subseções e os mesmos títulos são sinal de conteúdo genérico.

O mínimo que qualquer versão da seção precisa entregar: **um exemplo plausível gerado por IA que
falha**, **uma verificação executável dessa falha** e **um fechamento com o que revisar antes do
*merge***. O resto varia.

O repertório de subseções, com a pergunta que cada uma responde:

| Subseção | Pergunta que responde | Elemento obrigatório |
| :--- | :--- | :--- |
| Abertura sem `###` | O que mudou no trabalho com este tema? | Parágrafo + `<Mermaid>` do ciclo ou tabela "o que mudou × o que permanece". |
| Especificar o pedido | Como pedir de um jeito que produza código confiável? | Tabela de elementos do *prompt* + bloco ` ```txt title="Prompt…" `. |
| Verificar o resultado | Como provar que o código gerado faz o que promete? | Teste executável com `node:test` + `bash title="Terminal"` + `txt title="Output"`. |
| Entender o herdado | Como ler um trecho que ninguém da equipe explica? | Tabela de decomposição trecho a trecho + refatoração legível. |
| Armadilhas frequentes | O que este modelo costuma errar neste tema? | Tabela `\| Armadilha \| Como se manifesta \| Como mitigar \|` + exemplo que falha em silêncio. |
| Checklist de revisão | O que conferir antes do *merge*? | Lista numerada de 5 a 8 verificações. |
| Subseção própria do tópico | Qual armadilha só existe aqui? | Livre: comparação de dialetos, medição de tempo, diagrama de concorrência, tabela de fusos. |

Regras de conteúdo dessa seção:

1. **Nada de conselho genérico sobre IA.** Cada linha de tabela e cada exemplo precisa citar
   um identificador, uma *flag* ou um comportamento do tópico. "Revise o que a IA gera" não é
   conteúdo; "`\z` não existe em ECMAScript e vira o literal `z`" é.
2. **O exemplo errado vem antes do certo.** Mostre o código plausível que o assistente produz,
   execute, deixe o teste falhar no `Output` e só então apresente a correção.
3. **A verificação é executável.** Prefira o executor nativo (`node --test`) e uma tabela de
   casos versionada a dois `console.log()` de amostragem.
4. **Prompts são código didático.** Escreva-os em ` ```txt title="Prompt de …" `, com dialeto,
   limites, exemplos que devem passar e exemplos que devem falhar. Os `<Aside>` da seção seguem
   a mesma exigência em escala menor, com a linha `**Prompt:**` descrita adiante.
5. **A responsabilidade fica com quem assina o *commit*.** Feche a seção com essa ideia, sem
   moralismo e sem previsão sobre o futuro da profissão.
6. **Varie a forma entre páginas.** Use `<Mermaid>` do ciclo apenas onde o processo é o ponto;
   em tópicos com armadilha pontual, comece direto pelo código que falha. Alterne o formato do
   fechamento (tabela de práticas em uma página, lista numerada em outra) e evite repetir
   títulos de subseção idênticos em tópicos vizinhos.

### Asides isolados nas demais páginas

Páginas que não recebem a seção completa ganham de um a dois `<Aside>` pontuais, colocados
exatamente onde a armadilha aparece no texto, nunca agrupados no fim.

**Prefixo obrigatório no título: `Dica de IA:`.** Todo aside que trate de código gerado por
assistente, dentro ou fora da seção completa, começa por esse prefixo
(`title="Dica de IA: Corrija o \`var\` que o assistente ainda sugere"`). O prefixo dá ao leitor uma
marca visual única em todo o curso, permite localizar o assunto com a busca do site e evita que
o callout se confunda com as armadilhas comuns da linguagem. Nenhum outro `<Aside>` do portal
usa esse prefixo.

Cada aside cumpre um dos cinco papéis abaixo:

| Papel | `type` | O que o aside entrega |
| :--- | :--- | :--- |
| **Sugerir** | `tip` | O *prompt* que produz a versão boa do trecho recém-explicado. |
| **Entender** | `note` | O pedido de decomposição de um trecho denso ou herdado. |
| **Orientar** | `tip` | A regra de decisão que o modelo não conhece (convenção do projeto, API nativa preferida). |
| **Validar** | `caution` | O caso negativo ou teste que precisa existir antes de aceitar a sugestão. |
| **Corrigir** | `caution` | O erro recorrente do modelo naquele tema e a forma correta. |

**Todo aside termina com um prompt pronto para usar**, sempre que o assunto comportar um
(e quase sempre comporta). A última linha do aside é `**Prompt:** *"..."*`, separada do texto
por uma linha em branco. O corpo explica **por que** aquilo falha; o prompt entrega **o que
digitar** no assistente, sem o leitor precisar traduzir o conselho em pedido.

Regras do prompt sugerido:

1. **Escrito na voz de quem pede**, no imperativo e endereçado ao assistente
   (*"Reescreva…"*, *"Liste dez…"*, *"Explique passo a passo…"*), nunca em terceira pessoa.
2. **Ancorado no exemplo da página**, citando identificadores, valores ou APIs que acabaram de
   aparecer no texto. Um prompt que serviria para qualquer tópico não serve para nenhum.
3. **Executável como está**: quem copiar a linha e colar no assistente, junto do próprio código,
   deve receber algo aproveitável, sem preencher lacunas.
4. **Pede verificação, não só código**: prefira formulações que exijam contraexemplos, testes,
   explicação trecho a trecho ou comparação entre alternativas.
5. **Uma linha só**, entre aspas e em itálico. Quando o pedido precisar de várias cláusulas, use
   ponto e vírgula em vez de quebrar em lista.

O modelo de escrita de um aside de validação é o abaixo, com título afirmativo, corpo curto e
prompt fechando o bloco:

```mdx
<Aside type="caution" title="Dica de IA: Confira o caso negativo antes de aceitar a sugestão">
  Assistentes costumam devolver `arr.sort((a, b) => a - b)` mesmo quando o array tem strings, e
  a ordenação errada não lança erro: ela apenas devolve outra ordem.

  **Prompt:** *"Mostre cinco entradas que quebram esta ordenação, incluindo strings numéricas e
  valores `undefined`, e transforme cada uma em um caso de teste."*
</Aside>
```

Evite mais de dois asides de IA por página, evite repetir o mesmo texto entre páginas e nunca
use o aside para vender ou criticar uma ferramenta específica: o assunto é o código, não o
assistente.

---

## 🔀 Página de conceito × página de projeto

**Um tópico rende duas páginas, nunca uma só.** Conceito e projeto têm leitores e ritmos
diferentes: quem estuda *o que é um JWT* não quer rolar por dez arquivos de um app real,
e quem vai rodar o app não quer reler a teoria. Misturar os dois produz a página-despejo
— um título seguido de dez `<SourceCode>` sem texto entre eles.

| Página              | Onde vive                        | O que contém                                                                 |
| ------------------- | -------------------------------- | ---------------------------------------------------------------------------- |
| **Conceito**        | `<curso>/<categoria>/<topico>/`  | definição, diagrama, tabela comparativa, trechos **mínimos** e autocontidos, armadilhas, exercício, perguntas de revisão |
| **Projeto**         | `<curso>/practice/<projeto>/`    | árvore de arquivos, código real completo via `<SourceCode>`, passo a passo de execução, rotas, capturas de tela |

Regras de divisão:

1. A página de conceito só mostra o trecho **que ilustra a ideia** — cinco a quinze linhas,
   escritas à mão ou recortadas com `lines=` / `region=`. Nunca o arquivo inteiro.
2. Todo código completo, `package.json`, `.env.example`, `requests.http`, árvore de
   diretórios e captura de tela pertence à página de projeto.
3. Cada uma linka a outra: a de conceito termina apontando "veja aplicado em
   [Projeto X](../../practice/x/)"; a de projeto abre dizendo quais tópicos ela aplica.
4. Se um projeto aparece em dois tópicos de conceito, ele continua tendo **uma** página de
   projeto — os dois tópicos apontam para ela.
5. Materiais de turmas diferentes sobre a mesma aplicação (LP2, DW) viram **uma página de
   projeto por aplicação**, não seções "Exemplo completo (LP2)" penduradas no fim da página
   de conceito.

## 🔗 Botões de acesso ao código (GitHub e Codespaces)

**Toda página de projeto abre com `<ProjectLinks>`.** O aluno precisa de dois caminhos:
ler o código no GitHub e abrir um ambiente já configurado no GitHub Codespaces, sem
instalar nada na máquina.

```mdx
import ProjectLinks from '@components/ProjectLinks.astro';

<ProjectLinks path="examples/courses/expressjs/projects/mvc" devcontainer="express-mvc" />
```

| Prop           | Uso |
| -------------- | --- |
| `path`         | caminho do projeto no repositório, sem barra inicial (obrigatório) |
| `repo`         | repositório externo em `owner/name`; omita para o próprio DevLab |
| `branch`       | branch a abrir — usada nos projetos que evoluem por branch |
| `devcontainer` | pasta em `.devcontainer/`; omitida, é deduzida do último segmento de `path` (só no DevLab); `{false}` esconde o botão |
| `preview`      | URL de uma demonstração publicada, quando existir |

O botão do Codespaces só funciona se existir `.devcontainer/<pasta>/devcontainer.json` no
repositório. Ao criar um projeto novo em `examples/`, crie também a pasta correspondente
(copie a mais parecida e ajuste `name`, `workspaceFolder`, `postCreateCommand` e
`postAttachCommand`) — o `.devcontainer/README.md` descreve cada campo. Sem a pasta,
passe `devcontainer={false}` em vez de deixar um botão que leva a erro.

Projetos que moram em outro repositório — o material de uma disciplina, por exemplo — usam
as props `repo` e `branch`. É assim que uma aplicação que evolui por branch ganha uma página
por etapa, cada uma abrindo o Codespaces já na branch certa:

```mdx
<ProjectLinks repo="luizchaves/lp2-2026" branch="sqlite" path="classroom/back-end/investment-api" />
```

Em repositório externo a pasta de `.devcontainer/` **não** é deduzida: sem a prop, o
Codespaces sobe com a imagem padrão na branch indicada — suficiente para um projeto Node que
só precisa de `npm install`.

## 📝 Regra do parágrafo de entrada e didática do texto

**Apresentação e explicação obrigatórias de qualquer elemento que difere de `<p>`:**
Toda tabela, lista, imagem, diagrama (`<Mermaid>`), bloco de código (fence ou `<SourceCode>`),
preview interativo (`<HtmlPreview>`), grade de cartões (`<CardGrid>`) ou callout (`<Aside>`)
deve ser obrigatoriamente apresentado, contextualizado e explicado por um parágrafo (`<p>`)
anterior.

**Tabelas não são autoexplicativas:**
Toda tabela precisa de texto auxiliar suficiente para ensinar como ela deve ser lida. Em tabelas
comparativas, não basta escrever "a tabela a seguir compara...": explique o significado das
colunas, destaque as linhas decisivas e conecte a comparação ao próximo exemplo, decisão ou
regra prática. Quando a tabela tiver mais de três colunas, inclua pelo menos um parágrafo
posterior consolidando a leitura antes de avançar para código, callout, lista ou nova seção.

**Nenhum elemento não-`<p>` colado em título ou em outro elemento:**
1. **Nunca cole um elemento logo abaixo de um título**: sempre escreva ao menos um parágrafo
   explicativo entre o `##`/`###` e a tabela, lista, imagem, diagrama ou código.
2. **Nunca encadeie elementos sem texto explicativo intermediário**:
   - Uma lista seguida diretamente de uma tabela precisa de um parágrafo de ligação e introdução.
   - Uma tabela seguida de um bloco de código precisa de uma frase explicativa entre eles.
   - Dois blocos de código consecutivos precisam de uma frase contextualizando o que o segundo bloco demonstra.
   - Um callout (`<Aside>`) seguido de uma tabela ou diagrama precisa de texto introdutório antes do elemento visual.
3. **Exceções**: blocos de código encadeados diretamente dentro de `<Steps>` (onde os itens
   numerados já exercem a função condutora) e blocos de saída (`txt title="Output"`) que sucedem
   imediatamente o comando de execução.

**Uso de parágrafos curtos e didáticos:** Prefira fragmentar as explicações em múltiplos
parágrafos curtos em vez de criar blocos de texto longos e monolíticos. O uso frequente de
parágrafos espaçados torna a leitura mais fluida, melhora a escaneabilidade do conteúdo e
ajuda o estudante a absorver cada conceito passo a passo.

**Pontuação em perguntas e títulos interrogativos:** Toda pergunta didática deve terminar
com ponto de interrogação (`?`), independentemente de aparecer como título (`##`/`###`),
item de revisão, bullet, callout ou enunciado. Trate como pergunta qualquer frase iniciada
por formas interrogativas como "O que", "Por que", "Como", "Quando", "Qual", "Quais",
"Quem", "Onde" e "Para que". Se a intenção for apenas nomear uma seção, reescreva como
título declarativo (`Observações sobre alias`) em vez de deixar uma pergunta sem `?`
(`O que observar no alias`).

**Linearidade e coesão entre seções:** Antes de finalizar um tópico, revise a sequência de
`##`, `###` e parágrafos (`<p>`) como uma narrativa contínua. Cada seção deve preparar a
próxima, evitar saltos conceituais e manter textos relacionados no mesmo bloco temático.
Quando um parágrafo, tabela, lista ou `<Aside>` parecer deslocado, mova-o para a seção onde
ele reforça o raciocínio principal ou reescreva a transição para explicitar a conexão.

**Resumo e Boas Práticas legível:** Em tópicos extensos e páginas de guia, use
`## Resumo e Boas Práticas` antes de `## Executando` para consolidar decisões práticas.
Prefira subtítulos `###` com parágrafos curtos e listas de 2–4 itens, agrupando recomendações
por intenção de uso. Evite `<CardGrid>` em páginas comuns de tópico quando cada item tiver
várias linhas; com a navegação lateral ativa, cartões ficam estreitos e prejudicam a leitura.
Reserve `<CardGrid>` para páginas `index`, visões gerais ou destaques realmente curtos.

Exemplos de correção de encadeamento:

Errado (tabela colada no título ou lista sem introdução da tabela):

```mdx
### A Evolução dos Nomes

1. **Mocha** (1995): protótipo.
2. **LiveScript** (1995): lançamento comercial.

| Nome | Ano | Contexto |
| :--- | :--- | :--- |
| **Mocha** | 1995 | Protótipo. |
```

Certo (com parágrafo introdutório apresentando a tabela):

```mdx
### A Evolução dos Nomes

A linguagem passou por transições rápidas nos seus primeiros meses de vida:

1. **Mocha** (1995): protótipo.
2. **LiveScript** (1995): lançamento comercial.

A tabela a seguir resume essa cronologia e o contexto histórico de cada mudança de nome:

| Nome | Ano | Contexto |
| :--- | :--- | :--- |
| **Mocha** | 1995 | Protótipo. |
```

O parágrafo de entrada de um elemento visual ou bloco de código costuma terminar em dois-pontos
e nomear explicitamente o que o leitor observará ("O exemplo a seguir demonstra as principais formas de declarar arrays:", "A tabela abaixo compara as principais diferenças de ambiente:").

### 🪜 Progressão didática: apresentação básica antes do aprofundamento

**O aprofundamento de um recurso deve ficar sempre depois da sua citação e demonstração básica.**

1. **Nunca amontoe variações antes do primeiro contato**: Ao introduzir uma sintaxe ou recurso (como desestruturação, classes, funções ou métodos), apresente primeiro o caso fundamental com seu respectivo exemplo mínimo. Não liste renomeações, valores padrão, aliases, flags secundárias ou casos de borda no parágrafo que introduz o conceito básico.
2. **Ciclo Didático Contínuo (Conceito Base → Exemplo Mínimo → Variação/Aprofundamento → Exemplo da Variação)**:
   - **Etapa 1 (Fundamento)**: Apresente o que o recurso faz em sua essência e demonstre com um trecho de código conciso e focado.
   - **Etapa 2 (Aprofundamento)**: Apresente as variações ou extensões sintáticas (ex: renomeação de variáveis, valores padrão, operador rest) em parágrafo próprio, sucedido pelo exemplo prático correspondente.
3. **Coerência entre explicação e exemplo**: Não mencione recursos avançados em um parágrafo introdutório se o bloco de código logo abaixo demonstra apenas a forma básica. Mantenha cada explicação estritamente conectada ao trecho visual ou executável apresentado.

**Tópicos de sintaxe simbólica exigem modelo mental antes de catálogo:**
Em assuntos como RegExp, seletores CSS, operadores, expressões, SQL ou comandos de terminal,
não comece por uma lista longa de símbolos. Primeiro apresente um modelo mental do fluxo
(`entrada -> regra/padrão -> operação -> resultado`), depois uma anatomia mínima da sintaxe e
só então as tabelas de referência. Cada exemplo deve deixar explícitos a entrada analisada, o
padrão/comando aplicado e o resultado observado.

### 🎯 Consistência e fidelidade semântica nos exemplos de código

**Todo código de exemplo, identificador, função ou variável deve possuir semântica real e coerente com seu propósito no domínio:**

1. **Nunca distorça o comportamento da função apenas para gerar um exemplo artificial ou diferente**: uma função chamada `sum` ou `sumAll` **nunca** deve multiplicar (`a * b` ou `sum * multiplier`), subtrair ou realizar ações incoerentes com seu nome. Se a função multiplica a soma por um fator, nomeie-a de forma clara e semântica, como `scaleSum(factor, ...numbers)` ou `multiplySum(multiplier, ...numbers)`.
2. **Demonstrações de *case sensitivity* ou sobreposição de escopo**: utilize implementações válidas e semânticas no domínio. Por exemplo:
   - `function power(base, exponent) { return base ** exponent; }` vs `function Power(base, exponent) { return Math.pow(base, exponent); }` (ambas calculam potência de formas válidas, mantendo fidelidade semântica ao nome enquanto provam que identificadores com caixas diferentes são símbolos distintos no interpretador).
   - Ou `function multiply(a, b) { return a * b; }` vs `function Multiply(a, b) { ... }`.
3. **Nomes de parâmetros e variáveis descritivos**: utilize nomes que indiquem seu papel no cálculo (`base, exponent` ou `factor, multiplier` em vez de identificadores genéricos como `param1, param`).

### 🚫 Proibição de travessões (`—`) para orações intercaladas e apostos

**Não utilize travessões (`— ... —` ou `—`) para isolar orações intercaladas, apostos explicativos, exemplos ou comentários.** O uso de travessões no meio de períodos é considerado um antipadrão e vício de escrita gerada por IA.

Em vez de travessões, utilize a pontuação padrão da língua portuguesa:
1. **Vírgulas (`,`)**: para apostos e orações explicativas fluidas.
   - *Errado:* `Com o surgimento de implementações concorrentes — como o JScript da Microsoft —, a Netscape...`
   - *Certo:* `Com o surgimento de implementações concorrentes, como o JScript da Microsoft, a Netscape...`
2. **Parênteses (`(...)`)**: para esclarecimentos adicionais, siglas, formatos ou listagens pontuais.
   - *Errado:* `As interfaces do navegador — DOM, eventos, armazenamento e rede — e as ferramentas...`
   - *Certo:* `As interfaces do navegador (DOM, eventos, armazenamento e rede) e as ferramentas...`
3. **Dois-pontos (`:`) ou períodos separados**: para explicações que concluem um raciocínio.
   - *Errado:* `O comando acima imprime cada passo da busca — a ferramenta certa quando um import falha.`
   - *Certo:* `O comando acima imprime cada passo da busca: é a ferramenta certa quando um import falha.`

---

## 🧱 Subseções e diagramas

**Toda seção abre com enunciado.** Um `##` nunca começa direto em `###`. Escreva ao menos um
parágrafo entre os dois títulos, apresentando o que a seção reúne e como ela se divide. Sem esse
enunciado o leitor salta de um título para outro sem saber o que vem pela frente, e o índice
lateral exibe dois níveis encadeados sem conteúdo entre eles.

Errado:

```mdx
## Conversão Numérica e Métodos do Protótipo

### Conversão Explícita: `Number()`, `parseInt()` e `parseFloat()`
```

Certo:

```mdx
## Conversão Numérica e Métodos do Protótipo

Transformar texto em número e número em texto são operações distintas: a primeira depende de
funções de conversão, a segunda dos métodos de formatação do protótipo.

### Conversão Explícita: `Number()`, `parseInt()` e `parseFloat()`
```

A única exceção é `## Perguntas de revisão`, cujos `###` são apenas rótulos de agrupamento das
perguntas.

**Título de seção não é item de lista numerada.** Não prefixe `##`, `###` ou `####` com
`1.`, `2.`, `3.` Os títulos já aparecem em ordem no documento e no índice lateral, então o
número só repete o que a posição informa, polui o `tableOfContents` e fica desatualizado assim
que uma seção é inserida, removida ou reordenada. Quando a ordem for realmente obrigatória
(um passo a passo), use `<Steps>` ou uma lista ordenada dentro da seção, não o título.

Errado:

```mdx
### 1. Formatação de Moedas (*Currency*)

### 2. Formatação de Porcentagem (*Percent*)
```

Certo:

```mdx
### Formatação de Moedas (*Currency*)

### Formatação de Porcentagem (*Percent*)
```

**Subseção isolada não se justifica.** Só abra `###` dentro de um `##` quando houver **duas
ou mais** — uma única subseção é apenas o corpo da seção com um título a mais. Se sobrar uma
sozinha, dissolva o título no texto ou promova a subseção a `##`.

Errado:

```mdx
## Operadores lógicos

### Curto-circuito

...texto único...
```

Certo:

```mdx
## Operadores lógicos

...texto...

### Curto-circuito

...

### Precedência entre and e or

...
```

Isso também mantém o índice lateral limpo: o `tableOfContents` do site vai até o nível 3.

### Diagramas e Recursos Visuais

**Obrigatoriedade de Recursos Visuais**: Sempre que o tópico abordar conceitos abstratos, arquiteturas, fluxos de execução, hierarquias, eixos de layout (como Box Model, Flexbox, Grid, escopos, ciclo de vida) ou comparações de modelos, **é obrigatório incluir diagramas visuais ou recursos gráficos** para reforçar a didática.

**Obrigatoriedade de Legenda / Caption**: **Todo diagrama, figura ou imagem deve obrigatoriamente possuir uma legenda ou título descritivo (`caption`)**.
- Em diagramas `<Mermaid>`, o atributo `title="..."` é **obrigatório** (ex: `<Mermaid title="Fluxo de execução da Fetch API">`).
- Em imagens ou figuras estáticas (`![...]`), inclua a legenda/descrição explicativa de forma clara no atributo `alt` e/ou em um texto de legenda associado.
- Em blocos de código e saídas, forneça o atributo `title="..."` (ex: ````js title="Exemplo de manipulação do DOM"````).

**Código antes de diagrama dependente de código**: Quando um diagrama representa o comportamento
de um trecho específico de código, apresente primeiro o código e depois o diagrama. O texto entre
eles deve explicar que o visual sintetiza a execução recém-observada. Reserve diagramas antes do
código apenas para modelos conceituais amplos, arquiteturas ou mapas que preparam uma seção inteira,
não para figuras que dependem de uma atribuição, chamada, mutação ou fluxo demonstrado logo em seguida.

**Largura máxima de diagrama (regra dura)**: a coluna de conteúdo do Starlight tem cerca de
**720 px**. O `<Mermaid>` aplica `max-width: 100%` no SVG, então um diagrama mais largo **não**
ganha barra de rolagem: ele é **reduzido proporcionalmente**, e o texto das caixas encolhe junto.
Um diagrama de 1400 px chega ao leitor em 50% do tamanho, com fonte de ~8 px.

Como medir, com a página aberta no `pnpm dev`:

```js
// no console do navegador, na página do tópico
[...document.querySelectorAll('.mermaid-figure')].map((f) => ({
  legenda: f.querySelector('figcaption')?.textContent,
  largura: Math.round(f.querySelector('svg').viewBox.baseVal.width),
}));
```

Interprete o resultado assim:

| Largura intrínseca | Situação | Ação |
| :--- | :--- | :--- |
| até ~720 px | Renderiza em tamanho real. | Nada a fazer. |
| 720 a 850 px | Redução de até 15%, ainda legível. | Aceitável; encurte rótulos se for fácil. |
| acima de ~850 px | Texto visivelmente pequeno. | **Refazer o diagrama.** |

O sintoma clássico é **muitos elementos em sequência horizontal com rótulos longos**: cinco ou seis
caixas de duas linhas em `flowchart LR` passam facilmente de 1300 px. Aplique as correções nesta
ordem, medindo de novo a cada passo:

1. **Trocar a direção para `TD`.** Resolve a maioria dos casos, porque troca largura por altura, e
   altura não é reduzida. Uma cadeia linear ou uma decisão com dois ramos fica melhor na vertical.
2. **Encurtar e quebrar rótulos.** Use `<br/>` para dividir em duas linhas curtas e remova
   parênteses explicativos que podem ir para o parágrafo anterior ou para a legenda.
3. **Empilhar subgrafos.** Subgrafos sem ligação entre si são posicionados lado a lado. Ligações
   invisíveis (`A ~~~ B`) forçam o empilhamento vertical em `flowchart TB`.
4. **Inverter a direção em árvores.** Uma árvore com muitas folhas fica larga em `TD` e estreita em
   `LR`, porque as folhas passam a crescer para baixo, e não para os lados.
5. **Escrever um SVG próprio** quando nenhum dos anteriores resolver.

**Meça sempre depois de mudar a direção.** A troca nem sempre melhora: em diagramas compostos por
subgrafos lado a lado, `TD` pode aumentar a largura em vez de reduzir. Se o número piorar, volte
atrás e vá para o passo seguinte.

**Quando escrever SVG em vez de Mermaid**: o Mermaid decide o posicionamento sozinho, e há arranjos
que ele não produz. Crie um componente em `src/components/diagrams/<Nome>Diagram.astro` quando:

- o diagrama exigir **grade** (painéis lado a lado com a mesma altura), que o Mermaid empilha ou
  espalha conforme o número de nós;
- a versão vertical ficar **desproporcionalmente alta** (por exemplo, 320 × 1050 px para três
  fluxos triviais, como aconteceu com o curto-circuito de `&&`, `||` e `??`);
- a figura precisar de **posicionamento fino** de rótulos, notas ou legendas que o Mermaid não expõe.

Siga o padrão dos componentes existentes (`DataTypesDiagram.astro`, `ShortCircuitDiagram.astro`):
`viewBox` com no máximo 690 de largura, `width: 100%` com `max-width` em pixels, cores por
`var(--sl-color-…)` com valor de reserva, `role="img"` e `aria-label` descritivo. Componentes de
SVG dispensam o `title` do `<Mermaid>`: a apresentação fica no parágrafo anterior, como em
`<DataTypesDiagram />`.

1. **Diagramas Mermaid (`<Mermaid>`)**:
   Diagramas de fluxo, sequência, hierarquia, estado e entidade-relacionamento são escritos como texto usando o componente `<Mermaid>` (`@components/Mermaid.astro`), que se ajusta automaticamente ao tema claro/escuro da página:

   ```mdx
   import Mermaid from '@components/Mermaid.astro';

   <Mermaid title="Do arquivo à execução">
   {`
   flowchart LR
     A[main.py] --> B[Bytecode]
     B --> C[Máquina Virtual]
   `}
   </Mermaid>
   ```

   - O diagrama vai entre crases dentro de `{...}` (como em `<FileTree>`), para evitar que o MDX interprete chaves e setas no texto.
   - Utilize estilos e cores (`style NoID fill:#...`) quando a diferenciação de áreas for didaticamente relevante (ex: camadas do Box Model, eixos do Flexbox).
   - Prefira Mermaid a desenho ASCII quando o diagrama tiver caixas e ligações; mantenha ` ```txt ` apenas para saídas de terminal, estruturas de arquivo e esquemas monoespaçados.
   - **Diagramas de Classe (`classDiagram`)**: **Obrigatório para tópicos de Classes/POO**. Todo tópico que abordar Classes e Programação Orientada a Objetos (POO) deve obrigatoriamente incluir um diagrama de classe Mermaid (`classDiagram`) ilustrando a estrutura das classes, atributos, métodos e relacionamentos de herança (`extends`):

     ```mdx
     <Mermaid title="Diagrama de Classes (UML / POO): Herança entre User e Admin">
     {`
     classDiagram
         class User {
             +String name
             +String email
             +getProfile() String
         }
         class Admin {
             +Array permissions
             +getProfile() String
         }
         User <|-- Admin : extends
     `}
     </Mermaid>
     ```

2. **Previews Interativos (`<HtmlPreview>`)**:
   Para tópicos de HTML/CSS que envolvem componentes visuais, utilize `<HtmlPreview path="examples/..." />` para exibir uma prévia viva renderizada.

3. **Imagens e Ilustrações**:
   Para capturas de tela ou esquemas gráficos estáticos, inclua imagens otimizadas sempre com legenda/caption clara e o atributo `alt` totalmente descritivo.

Diagramas Mermaid não funcionam nos slides Marp nem nos mapas mentais Markmap — lá continue com ASCII.

---

## 💻 Blocos de código (Expressive Code)

Configuração em `ec.config.mjs`. Convenções em uso:

- Linguagem sempre declarada; use ` ```js ` (não `javascript`), ` ```html `, ` ```css `,
  ` ```json `, ` ```bash `, ` ```txt `.
- **Sempre** dê um `title` descritivo: ` ```js title="Formas de criação de Arrays" `.
- Terminal: ` ```bash title="Terminal" ` (o frame de terminal é automático para
  `bash,sh,shell,zsh,console,powershell`).
- **Demonstração do Resultado / Saída**: Exemplos de código CSS e HTML não devem ficar isolados apenas com a sintaxe. Sempre acompanhe o código de sua demonstração visual ou saída esperada:
  1. **Via `<HtmlPreview path="examples/..." />`**: para mostrar o resultado vivo renderizado pelo navegador a partir de arquivos reais em `examples/`.
  2. **Via ` ```txt title="Resultado na tela" ` ou comentários explicativos**: para demonstrar/descrever exatamente como o elemento é desenhado no navegador (dimensões finais, alinhamento ou efeito visual).
- Saída de execução de terminal ou navegador: ` ```txt title="Output" ` ou ` ```txt title="Resultado na tela" `.
- **Nunca mostre a saída sem o comando que a produziu**: todo ` ```txt title="Output" ` deve vir
  imediatamente depois do ` ```bash title="Terminal" ` que o gerou, mesmo quando o comando já foi
  citado no texto. O leitor precisa ver o par completo (comando e resultado) para reproduzir o
  exemplo:

  ````mdx
  ```bash title="Terminal"
  node main.js
  ```

  ```txt title="Output"
  ReferenceError: sum is not defined
  ```
  ````
- **Mostre a árvore de diretórios com `<FileTree>` sempre que o exemplo envolver mais de um
  arquivo**: antes de exibir os `<SourceCode>` de uma pasta, apresente a estrutura para o leitor
  saber quantos arquivos existem e qual é o papel de cada um. Use o comentário depois do nome
  para dizer o papel do arquivo, e inclua também o que é gerado por ferramentas
  (`node_modules/`, arquivos de trava) quando isso fizer parte da explicação.
- Recursos disponíveis quando ajudarem: `{3}` / `{1-5}` (destaque de linhas),
  `showLineNumbers`, `mark="…"`, `ins` / `del`, `collapse={2-8}`, `wrap`.
- Comentários dentro do código explicam entrada → transformação → saída, e o
  `console.log` mostra o resultado esperado em comentário (`// [ 10, 20 ]`).
- **Explique proporcionalmente à densidade do trecho**: quando um bloco usa sintaxe
  compacta, múltiplas regras ao mesmo tempo, expressões longas, casos de segurança ou
  comportamento contraintuitivo, não basta uma frase curta antes do código. Gaste mais
  texto quando isso melhorar a aprendizagem: explique a intenção do trecho, nomeie a
  entrada usada, destaque as linhas decisivas e acrescente um parágrafo posterior
  conectando o resultado observado ao conceito. Exemplos típicos são RegExp longas,
  detecção de ReDoS, closures, escopo, coerção, recursão, promessas e trechos com erro
  proposital.

**Prefira `<SourceCode>` a colar código de `examples/`**: ele lê o arquivo real e nunca
sai de sincronia.

```mdx
<SourceCode path="examples/dw/codes/express/hello/src/app.js" mark="8-12" />
```

---

## 🧩 Componentes disponíveis

Starlight (`@astrojs/starlight/components`):

- `<Aside type="tip|caution|note|danger" title="…">` — uso real: `tip` (dica/ES moderno),
  `caution` (armadilha, coerção, mutação), `note` (contexto), `danger` (raro).
- `<Steps>` — tutoriais e a seção `## Executando`.
- `<Tabs>` / `<TabItem label="…">` — alternativas equivalentes (ESM vs CJS, npm vs pnpm).
- `<Card>` / `<CardGrid>` — grades de destaque em páginas `index`.

Do projeto (alias `@components`):

| Componente             | Uso |
| ---------------------- | --- |
| `<SourceCode path…>`   | código real de `examples/` (props extras: `region`, `mark`, `lang`) |
| `<CodeTabs files={…}>` | mesmo trecho em vários arquivos |
| `<FileTree>`           | árvore de diretórios do projeto do tópico |
| `<HtmlPreview path… height="24rem" serveFromPublic>` | preview vivo de HTML de `examples/` |
| `<PackageManagerTabs package="…" dev run="…" exec="…" create="…">` | comandos npm/pnpm/yarn |
| `<ApiRequest method="POST" path="/users" baseUrl="…">` / `<ApiResponse status={201}>` | tópicos de API |
| `<ProjectLinks path… devcontainer… preview…>` | botões "Ver no GitHub" e "Abrir no Codespaces" (obrigatório em páginas de projeto) |
| `<ProjectCard {...project}>` | listagens em `projects/index.mdx` |

Antes de criar componente novo, confira se o Starlight já resolve.

---

## 🗂️ Registro na sidebar e páginas de visão geral (index.mdx)

Sempre que uma página for **criada, renomeada ou reestruturada**, essas alterações **devem obrigatoriamente afetar**:

1. **A Sidebar (`astro.config.mjs`)**: páginas novas não aparecem sozinhas; a sidebar é explícita. Adicione/atualize a entrada no grupo correto com link absoluto e barra final (não utilize `collapsed: true` nos grupos para mantê-los expandidos por padrão):
   ```js
   { label: 'Arrays', link: '/courses/ecmascript/data/arrays/' },
   ```

2. **As Páginas Index / Visão Geral (`index.mdx`)**: mantenha atualizadas as listas de tópicos e cartões nas páginas de visão geral do curso e de suas respectivas categorias (`/courses/<curso>/index.mdx` ou `/courses/<curso>/topics/<categoria>.mdx`), garantindo que a estrutura geral do curso reflita todas as páginas disponíveis.

---

## 🔍 Links internos

- Sempre **relativos** (sobrevivem ao `base` do GitHub Pages).
- URLs terminam em `/`: tópico irmão é `../strings/`, categoria vizinha é `../../database/sql/`.
- Em páginas `index`, a forma direta vale: `javascript/`.
- Quando a ordem didática de tópicos mudar, atualize a cadeia inteira no mesmo ajuste:
  sidebar explícita, páginas de visão geral, badges/listas de trilha e seções
  `## Próximo tópico` das páginas afetadas. A navegação lateral e os links de continuidade
  devem contar a mesma sequência.

---

## ✅ Verificação

```bash
pnpm check
```

```bash
pnpm validate
```

`validate` roda `lint` (Biome) + `check` (astro check) + `build` (inclui slides e
mapas mentais) + `check:links` (valida cada link interno contra o `dist/`). Rode ao menos
`pnpm check` sempre; rode `pnpm validate` quando tiver mexido em links ou materiais.

---

## ⚠️ Armadilhas

1. **Componente sem import**: em `.mdx`, todo componente usado precisa estar importado —
   `astro check` acusa, mas o build pode falhar antes.
2. **`<Aside>` em `.md`**: não funciona. Em `.md` use `:::tip[Título]` … `:::`.
3. **Profundidade de link errada**: conte segmentos da **URL**, não pastas; a falta da
   barra final também quebra o `check:links`.
4. **Linkar `.excalidraw`**: o diretório `excalidraw/` não é publicado — não referencie.
5. **Esquecer a sidebar ou a página index**: a página passa a existir, mas fica inalcançável na navegação lateral ou na visão geral do curso.
6. **Duplicar código de `examples/`**: use `<SourceCode>`.
7. **Fechar tags**: `<Aside>`, `<Tabs>`, `<TabItem>`, `<Steps>`, `<details>` sempre com
   fechamento; dentro de `<details>` deixe uma linha em branco antes do conteúdo Markdown.
8. **Título divergente**: `title` do tópico, dos slides e do mapa mental devem coincidir.
9. **Elemento não-`<p>` (tabela, lista, código, diagrama, imagem) sem introdução ou colado**:
   viola a regra do parágrafo de entrada — todo elemento que difere de `<p>` deve ser
   precedido de um parágrafo explicativo que o apresenta e contextualiza.
10. **Subseção solitária**: um único `###` dentro de um `##` — dissolva no texto ou crie a
    segunda subseção.
11. **Diagrama Mermaid sem `<Mermaid>`**: uma cerca ` ```mermaid ` não é renderizada pelo
    site; o componente é obrigatório.
12. **Parágrafo monolítico**: blocos de texto muito longos e densos dificultam a leitura — divida em mais parágrafos curtos para deixar o tópico mais didático.
13. **Sequência fragmentada**: seções, parágrafos, listas ou `<Aside>` aparecem em ordem
    que quebra a narrativa do tópico. Redistribua o conteúdo ou reescreva as transições
    para manter linearidade e coesão entre os blocos.
14. **Resumo apertado em `<CardGrid>`**: usar cartões longos em uma página comum de tópico,
    deixando o texto estreito e difícil de ler. Para resumos extensos, prefira `###` com texto corrido
    curta e listas objetivas.
15. **Ausência de recurso visual em conceito abstrato**: publicar tópicos sobre eixos, layouts, arquiteturas, escopos ou ciclo de vida sem incluir diagramas `<Mermaid>`, previews ou figuras ilustrativas.
16. **Tópico de Classes sem Diagrama de Classes**: abordar Classes ou Programação Orientada a Objetos (POO) sem incluir um diagrama de classe Mermaid (`classDiagram`) demonstrando a estrutura de atributos, métodos e herança (`extends`).
17. **Diagrama ou figura sem legenda (caption)**: omitir o atributo `title="..."` em `<Mermaid>` ou a legenda/caption explicativa em imagens, figuras e blocos de código.
18. **Página-despejo**: tópico de conceito com "Exemplo completo (LP2)" no fim, despejando a
    árvore de arquivos e dez `<SourceCode>` seguidos — isso é uma página de projeto
    disfarçada; mova para `practice/` e deixe o link.
19. **Página de projeto sem `<ProjectLinks>`**: o leitor fica sem o botão do GitHub e sem o
    do Codespaces, e precisa caçar o caminho do projeto no repositório.
20. **`<ProjectLinks>` apontando para `.devcontainer/` inexistente**: o botão leva a um erro
    do Codespaces — crie a pasta ou passe `devcontainer={false}`.
21. **Diagrama ou figura excessivamente horizontal**: criar fluxogramas muito largos que vazam do viewport ou exigem rolagem lateral em dispositivos móveis — reestruture sempre na vertical (`flowchart TD`).
22. **Alterar página `.mdx` sem sincronizar materiais**: editar conceitos, remover/adicionar seções ou alterar código em um tópico e esquecer de atualizar os slides (`materials/**/*.slide.md`) e o mapa mental (`materials/**/*.mindmap.md`) correspondentes para manter paridade.
23. **Uso de travessões (`—`) para orações intercaladas**: antipadrão e vício estilístico de IA — substitua por vírgulas, parênteses ou períodos diretos.
24. **Saída sem comando**: um ` ```txt title="Output" ` solto, sem o ` ```bash title="Terminal" `
    logo acima mostrando o comando que produziu aquele resultado.
25. **Vários arquivos sem árvore**: exibir dois ou mais `<SourceCode>` da mesma pasta sem antes
    apresentar a estrutura em `<FileTree>`, deixando o leitor sem noção de quantos arquivos
    existem e do papel de cada um.
26. **Seção sem enunciado**: um `##` que começa direto em `###`, sem o parágrafo que apresenta a
    seção e anuncia as subseções. Exceção: `## Perguntas de revisão`.
27. **Título numerado**: `### 1. …`, `### 2. …` em vez de títulos simples. A ordem já vem da
    posição no documento; para sequência obrigatória, use `<Steps>` ou lista ordenada.
28. **Pergunta sem ponto de interrogação**: títulos, bullets, callouts, enunciados e perguntas
    de revisão com forma interrogativa precisam terminar em `?`; caso contrário, reescreva como
    título declarativo.
29. **Ordem didática divergente**: sidebar, índices, badges de trilha e `## Próximo tópico`
    apontando sequências diferentes. Reordene todos juntos para evitar que o estudante siga
    caminhos contraditórios.
30. **Catálogo de símbolos sem modelo mental**: tópicos de sintaxe simbólica que começam por
    tabelas de metacaracteres, flags, operadores ou comandos sem antes explicar o fluxo
    entrada -> regra -> operação -> resultado.
