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
title: "JavaScript: Introdução e Ecossistema"
description: "Slides completos do tópico JavaScript: Introdução e Ecossistema."
---

<!-- _class: lead -->

# JavaScript: Introdução e Ecossistema

História, ECMA-262, TC39, motores e ambientes de execução.

---

## Objetivo

- Entender a origem do **JavaScript**
- Diferenciar **JavaScript**, **ECMAScript** e **Web APIs**
- Reconhecer o papel do **TC39** e da **ECMA-262**
- Identificar motores, runtimes e ferramentas do ecossistema
- Executar JavaScript no navegador e no Node.js

---

## Mapa do Tópico

- Por Que JavaScript Importa?
- De Onde Vêm os Nomes JavaScript e ECMAScript?
- Padronização, TC39 e Evolução
- O Que a Linguagem Oferece?
- Como Executar JavaScript?

---

## Introdução

- Antes de manipular páginas, vale entender o papel do JavaScript
- JavaScript não é apenas "a linguagem do navegador"
- Hoje ele roda em navegadores, servidores e ferramentas
- Nesta disciplina, JavaScript será usado nos dois lados da aplicação Web
- Navegador: comportamento da interface
- Servidor: APIs HTTP com Node.js e Express

---

## Por Que JavaScript Importa?

- JavaScript se tornou uma das linguagens centrais da Web porque é suportada pelos navegadores
- Reage a cliques, valida formulários e altera elementos
- Busca dados de APIs e atualiza a interface
- Com Node.js, a linguagem também passou a ser usada fora do navegador
- Hoje ela aparece em servidores, CLIs, automações e testes
- HTML estrutura o conteúdo, CSS define a apresentação visual e JavaScript adiciona comportamento

---

## De Onde Vêm os Nomes JavaScript e ECMAScript?

- JavaScript foi criado em maio de 1995 por Brendan Eich enquanto trabalhava na Netscape
- O protótipo foi desenvolvido em 10 dias
- O objetivo inicial era adicionar comportamento dinâmico às páginas

---

## A Evolução dos Nomes da Linguagem

- Transição rápida de nomes no primeiro ano da linguagem (1995–1996)
- **Mocha**: codinome do protótipo desenvolvido em 10 dias por Brendan Eich na Netscape
- **LiveScript**: primeiro lançamento comercial no Netscape Navigator 2.0 (beta)
- **JavaScript**: estratégia conjunta entre Netscape e Sun para alavancar a marca Java
- **ECMAScript**: padronização aberta pela Ecma International (ECMA-262) garantindo neutralidade

---

## A Evolução dos Nomes da Linguagem: Comparação

| Nome | Ano | Contexto |
| :--- | :--- | :--- |
| **Mocha** | Maio / 1995 | Nome interno do protótipo. |
| **LiveScript** | Setembro / 1995 | Primeiro lançamento comercial. |
| **JavaScript** | Dezembro / 1995 | Estratégia de marketing com a marca Java. |
| **ECMAScript** | 1996 - Presente | Especificação oficial ECMA-262. |

---

## Padronização ECMA-262, TC39 e Evolução

- **ECMAScript**: especificação formal mantida pelo TC39
- **JavaScript**: implementação prática do padrão executada nos ambientes
- Publicação anual consolidada no padrão oficial **ECMA-262**
- O comitê TC39 organiza propostas em estágios (*stages*) de maturação
- Processo aberto com testes, implementação em motores e feedback
- Novas edições formais da especificação publicadas anualmente

---

## Estágios do TC39 (Stages)

| Estágio | Ideia geral |
| ------- | ----------- |
| Stage 0 | Ideia inicial, ainda muito experimental |
| Stage 1 | Proposta com problema e direção discutidos |
| Stage 2 | Rascunho mais concreto da solução |
| Stage 3 | Candidato próximo de finalização |
| Stage 4 | Recurso finalizado, pronto para entrar na especificação |

---

## Principais Edições do ECMAScript

| Edição | Exemplos importantes |
| ------ | -------------------- |
| ES2015 | `let`, `const`, arrow functions, classes, modules, promises |
| ES2017 | `async`/`await` |
| ES2020 | optional chaining (`?.`), nullish coalescing (`??`), `BigInt` |
| ES2022 | class fields, private fields (`#name`), top-level `await` |
| ES2024 | `Object.groupBy()`, `Map.groupBy()`, `Promise.withResolvers()` |

---

## O Que a Linguagem Oferece?

- No uso diário, é comum dizer apenas "JavaScript"
- A aplicação combina a linguagem ECMAScript com APIs fornecidas pelo ambiente
- **Linguagem**: `Array`, `Object`, `Promise` e `Map`
- **Ambiente Web**: `document.querySelector`, `addEventListener` e `localStorage`
- **Ambiente Node.js**: `process`, `Buffer`, `node:fs` e `node:http`

---

## Linguagem vs APIs de Ambiente

| Termo | Papel | Exemplos |
| ----- | ----- | -------- |
| ECMAScript | Linguagem base | variáveis, funções, objetos |
| JavaScript | Nome comum | arquivos `.js` e `<script>` |
| Web APIs | Recursos do navegador | DOM, eventos, `fetch` |
| Node.js APIs | Recursos do Node.js | arquivos, processos, HTTP |
| npm | Ecossistema | Express, Vite, Prisma |

---

## O Que a Linguagem Oferece?

- ECMAScript define a base da linguagem que será usada nos próximos tópicos
- Algumas partes aparecerão durante toda a disciplina
- Aprender JavaScript não significa memorizar todas as bibliotecas
- Primeiro vem a linguagem: valores, funções, objetos e módulos

---

## O Que a Linguagem Oferece?: Comparação

| Área | Exemplos | Por que importa |
| ---- | -------- | --------------- |
| Valores e tipos | `number`, `string`, `boolean`, objetos | Representar dados |
| Variáveis | `let`, `const` | Guardar valores e controlar escopo |
| Expressões e operadores | `+`, `===`, `&&`, `??`, `?.` | Calcular, comparar e compor valores |
| Controle de fluxo | `if`, `switch`, `for`, `while` | Decidir caminhos e repetir tarefas |
| Funções | declarações, arrow functions, callbacks | Organizar comportamento reutilizável |

---

## Características Importantes

- JavaScript é uma linguagem de alto nível, dinâmica e multiparadigma
- Essas palavras resumem decisões que afetam a forma de escrever e depurar código
- Esses comportamentos não são "erros" da linguagem, mas exigem disciplina
- Prefira `===`, nomes claros e código legível

---

## Características Importantes: Comparação

| Característica | Ideia | Exemplo |
| -------------- | ----- | ------- |
| Alto nível | Abstrai memória | objetos sem alocação manual |
| Interpretada | Motor executa o código | `node arquivo.js` |
| Script | Roda em ambiente hospedeiro | `<script>` no navegador |
| Tipagem dinâmica | Tipo pertence ao valor | número vira string |
| Tipagem fraca | Converte automaticamente | `'5' * 2` resulta em `10` |

---

## Características Importantes: Arquitetura

- **Alto nível**: gerenciamento de memória automático com *Garbage Collector*
- **Multiparadigma**: funções, objetos e eventos convivem
- **Protótipos**: objetos herdam por *prototype chain*
- **ASI**: inserção automática de ponto e vírgula pelo analisador sintático

---

## Tipagem dinâmica

```js
let value = 10;
console.log(typeof value); // "number"

value = "10";
console.log(typeof value); // "string"
```

- O tipo pertence ao valor em memória, não ao nome da variável
- Permite reatribuição com tipos distintos em tempo de execução

---

## Conversão automática

```js
console.log("5" * 2); // 10
console.log("5" + 2); // "52"
```

- Multiplicação (`*`): força conversão numérica (`"5"` vira `5`, resultado `10`)
- Adição (`+`): prioriza concatenação quando há string (`2` vira `"2"`, resultado `"52"`)

---

## Comentário de Linha Única (`//`)

- Anotações no código ignoradas pelo motor de execução
- Documentam intenções, decisões e regras
- Linha única (`//`): nota curta até o fim da linha

```js
// Define a taxa de desconto para clientes VIP
const VIP_DISCOUNT = 0.15;

const total = 100; // Valor base da compra
```

---

## Comentário de Bloco (`/* ... */`)

- Útil para explicações maiores
- Também pode desativar trechos temporários
- Remova código morto antes de versionar

```js
/*
Cálculo de tributação para produtos importados.
Considera a alíquota estadual (ICMS) e federal.
Atualizado conforme a legislação vigente.
*/
function calculateTax(amount) {
  return amount * 0.20;
}
```

---

## Comentários JSDoc

- Use para documentar contratos de funções
- Explique parâmetros, retorno e intenção
- Evite código morto comentado

```js
/**
 * Calcula o preço final aplicando desconto.
 *
 * @param {number} price - Preço original.
 * @param {number} discount - Taxa de 0 a 1.
 * @returns {number} Valor final.
 */
function applyDiscount(price, discount) {
  return price * (1 - discount);
}
```

---

## Como Executar JavaScript?

- O mesmo núcleo da linguagem pode ser executado em múltiplos ambientes
- Primeiro vem o motor que interpreta e otimiza
- Depois vem o ambiente com suas APIs
- Por fim entram ferramentas, pacotes e comandos

---

## Motores de Execução

- Ambientes como navegadores, Node.js, Deno e Bun precisam de um motor para executar JavaScript
- **V8**: usado no Google Chrome e no Node.js
- **SpiderMonkey**: usado no Mozilla Firefox
- **JavaScriptCore**: usado no Safari da Apple
- A especificação define a linguagem
- Os motores implementam e otimizam sua execução

---

## Fluxo do Motor V8 (JIT Compiler)

- **Scanner & Parser**: divide o código em tokens e constrói a AST (Árvore Sintática Abstrata)
- **Interpretador Ignition**: gera *bytecode* e inicia execução imediata com *profiling*
- **TurboFan**: compila funções frequentes em código de máquina
- **Deopt**: volta ao interpretador quando os tipos mudam

---

## Navegador, Node.js e npm

- Quando usamos JavaScript no navegador, o arquivo normalmente faz parte de uma página Web
- Quando usamos JavaScript no Node.js, o arquivo é executado como programa no sistema operacional
- O `npm` será importante porque muitos projetos Web dependem de pacotes
- Vite, Express e Prisma entram no projeto por pacotes
- Mas o ecossistema JavaScript não depende apenas do `npm`

---

## Outras Ferramentas do Ecossistema

| Ambiente | Como executar | Uso comum |
| -------- | ------------- | --------- |
| Navegador | `<script>`, Console, DevTools | interagir com HTML, CSS, eventos, DOM e APIs Web |
| Node.js | `node arquivo.js` | criar scripts, servidores, APIs e automações |
| npm | `npm install`, `npm run`, `npx` | instalar pacotes e executar tarefas do projeto |

---

## Navegador, Node.js e npm: Comparação

| Ferramenta | Tipo | Uso comum |
| ---------- | ---- | --------- |
| [pnpm](https://pnpm.io/) | Pacotes | Instalação rápida e monorepos |
| [Yarn](https://yarnpkg.com/) | Pacotes | Instalações reproduzíveis |
| [Bun](https://bun.com/) | Runtime/toolkit | Executar, testar e empacotar |
| [Deno](https://deno.com/) | Runtime/toolkit | Permissões e ferramentas integradas |
| [JSR](https://jsr.io/) | Registro | Pacotes modernos em ESM/TypeScript |

---

## Execução com Node.js

1. Criar o arquivo `main.js`:

```js
// main.js
console.log("Olá, Node.js");
```

2. Executar no terminal e conferir a saída:

```bash
$ node main.js
Olá, Node.js
```

Se o comando falhar, leia a mensagem completa: ela costuma indicar tipo do erro,
arquivo e linha. Se rodar estranho ou lento, use `console.log()`, `console.table()` ou
`console.time()` para tornar a execução visível.

---

## Node.js: Modo Interativo (REPL)

- Digite `node` sem argumentos para abrir o prompt interativo (`>`):

```bash
$ node
> const name = "DevLab";
undefined
> `Olá, ${name}!`;
'Olá, DevLab!'
> .exit
```

---

## Execução no Navegador

- **Console do DevTools** (teste e inspeção rápida):

```js
console.log("Olá, navegador"); // Saída na aba Console do DevTools
```

- **Arquivo vinculado via HTML**:

```html
<!-- index.html -->
<script src="main.js"></script>
```

```js
// main.js
console.log("Olá, página"); // Executado ao carregar a página
```

---

## O que você vai aprender?

- O módulo de JavaScript / ECMAScript é estruturado de forma incremental
- Ao longo dos próximos tópicos, você estudará os seguintes conteúdos
- Tipos, variáveis, operadores e controle de fluxo
- Funções, escopos, callbacks e módulos
- Arrays, strings, números, datas, regex e coleções
- Assincronismo, erros e organização de código

---

## Exercício

- No navegador: teste uma API da página
- No Node.js: teste uma API do runtime
- Nos dois ambientes: execute código ECMAScript puro

```js
console.log(document.title); // título da página atual

console.log(process.version); // "v24.19.0"

const message = "JavaScript";
console.log(message.toUpperCase()); // "JAVASCRIPT"
```

---

## Perguntas de revisão

- Qual é a diferença entre JavaScript e ECMAScript?
- Por que o JavaScript se tornou tão importante na Web?
- O que são Web APIs?
- Por que `document` funciona no navegador e não em um script Node comum?
- Para que serve o Node.js?

---

## Resumo do Tópico

- Revise por que JavaScript importa
- Revise de onde vêm os nomes JavaScript e ECMAScript
- Revise padronização ECMA-262, TC39 e evolução da linguagem
- Revise o que a linguagem oferece
- Revise como JavaScript é executado em motores, navegadores, runtimes e ferramentas
