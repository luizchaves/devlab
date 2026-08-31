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
title: "JavaScript: Introdução e Ecossistema"
description: "História do JavaScript, especificação ECMA-262, papel do comitê TC39, motores de execução (V8) e ambientes (Navegador vs Node.js)."
---

<!-- _class: lead -->

# JavaScript: Introdução e Ecossistema

História do JavaScript, especificação ECMA-262, papel do comitê TC39, motores de execução (V8) e ambientes (Navegador vs Node.js).

---

## Objetivo

- Entender a origem do JavaScript, diferenciar JavaScript de ECMAScript, reconhecer o papel das Web APIs.

---

## Mapa da Aula

- Por Que JavaScript Importa?
- Origem e a História dos Nomes
- JavaScript, ECMAScript e Web APIs
- Onde o Código Executa?
- O Que a Linguagem Oferece?
- Características Importantes

---

## Por Que JavaScript Importa?

- JavaScript se tornou uma das linguagens centrais da Web porque é suportada pelos navegadores.
- Quando uma página precisa reagir a cliques, validar um formulário, alterar elementos.
- Com Node.js, a linguagem também passou a ser usada fora do navegador.
- Isso permitiu usar JavaScript para escrever servidores, ferramentas de linha de comando, scripts de automação, testes.
- HTML estrutura o conteúdo, CSS define a apresentação visual e JavaScript adiciona comportamento.

---

## Origem e a História dos Nomes

- JavaScript foi criado em maio de 1995 por Brendan Eich enquanto trabalhava na Netscape.

---

## A Evolução dos Nomes da Linguagem

- Mocha (Maio de 1995): Nome de código original do protótipo desenvolvido por Brendan Eich na Netscape.
- LiveScript (Setembro de 1995): Primeiro nome comercial oficial utilizado no lançamento beta do Netscape Navigator 2.0.
- ECMAScript (1996 - Presente): Com o surgimento de implementações concorrentes (como o JScript da Microsoft).
- A linguagem passou por diversas mudanças de nome em um curto período antes de se consolidar mundialmente
- Apesar da semelhança no nome, Java e JavaScript são linguagens completamente diferentes em paradigma, regras de sintaxe.

---

## A Evolução dos Nomes da Linguagem (Comparação)

| Nome | Ano | Contexto e Motivação |
| :--- | :--- | :--- |
| **Mocha** | Maio / 1995 | Nome interno do projeto durante o desenvolvimento do protótipo por Brendan Eich. |
| **LiveScript** | Setembro / 1995 | Nome da primeira versão lançada comercialmente no Netscape Navigator 2.0. |
| **JavaScript** | Dezembro / 1995 | Parceria de marketing com a Sun Microsystems (marca hoje pertencente à Oracle). |
| **ECMAScript** | 1996 - Presente | Especificação técnica oficial e padronizada pela Ecma International (ECMA-262). |

---

## Padronização ECMA-262 e o TC39

- Em termos simples, ECMAScript é a especificação teórica da linguagem.

```txt
Código JavaScript
        │
        ▼
Scanner e parser ──► AST
        │
        ▼
Ignition ──► bytecode
        │
        ▼
TurboFan ──► código otimizado
```

---

## JavaScript, ECMAScript e Web APIs

- No uso diário, é comum dizer apenas "JavaScript".
- Tecnicamente, porém, uma página no navegador mistura a linguagem ECMAScript com APIs fornecidas pelo ambiente.
- Por isso, `Array`, `Object`, `Promise` e `Map` pertencem à linguagem.
- Já `document.querySelector`, `addEventListener`, `fetch` no navegador e `localStorage` são recursos do ambiente Web.
- Um código pode ser JavaScript válido e ainda assim não funcionar em todos os lugares.

---

## JavaScript, ECMAScript e Web APIs (Comparação)

| Termo | Papel | Exemplos |
| ----- | ----- | -------- |
| ECMAScript | Define a linguagem base | variáveis, funções, objetos, arrays, classes, módulos, promises |
| JavaScript | Nome comum da linguagem usada pelos desenvolvedores | código escrito em arquivos `.js` ou dentro de `<script>` |
| Web APIs | Recursos oferecidos pelo navegador | DOM, eventos, `fetch`, `localStorage`, timers, console |
| Node.js APIs | Recursos oferecidos pelo Node.js | sistema de arquivos, processos, servidor HTTP, módulos nativos |
| npm | Ecossistema de pacotes | Express, Vite, Prisma, Chart.js, bibliotecas de teste |

---

## Onde o Código Executa?

- O mesmo núcleo da linguagem pode aparecer em ambientes diferentes.
- Cada ambiente adiciona suas próprias APIs e restrições.
- Executa scripts associados a páginas Web.
- É o ambiente usado para manipular DOM, responder a eventos, validar formulários e consumir APIs pela interface.
- Executa JavaScript fora do navegador.

---

## O Que a Linguagem Oferece?

- ECMAScript define a base da linguagem que será usada nas próximas aulas.
- A tabela abaixo mostra partes que aparecerão com frequência durante a disciplina.
- Aprender JavaScript não significa memorizar todas as bibliotecas.
- Primeiro vem a linguagem: valores, funções, objetos, arrays, módulos e assincronismo.
- Depois fica mais fácil entender bibliotecas como Express, Vite, Prisma e Chart.js.

---

## O Que a Linguagem Oferece? (Comparação)

| Área | Exemplos | Por que importa |
| ---- | -------- | --------------- |
| Valores e tipos | `number`, `string`, `boolean`, `undefined`, `null`, objetos | Representar dados da aplicação |
| Variáveis | `let`, `const` | Guardar valores e controlar escopo |
| Expressões e operadores | `+`, `===`, `&&`, `??`, `?.` | Calcular, comparar e compor valores |
| Controle de fluxo | `if`, `switch`, `for`, `while` | Decidir caminhos e repetir tarefas |
| Funções | declarações, arrow functions, callbacks | Organizar comportamento reutilizável |

---

## Características Importantes

- JavaScript é uma linguagem de alto nível, dinâmica e multiparadigma.
- Essas palavras resumem decisões que afetam a forma de escrever e depurar código.
- Esses comportamentos não são "erros" da linguagem, mas exigem disciplina.
- Ao longo da disciplina, vamos preferir comparações estritas (`===`), nomes claros e código legível para reduzir surpresas.

---

## Características Importantes (Comparação)

| Característica | Ideia principal | Exemplo prático |
| -------------- | --------------- | --------------- |
| Alto nível | Esconde muitos detalhes de memória e máquina | criar objetos e arrays sem alocar memória manualmente |
| Interpretada | Não há etapa de compilação separada; o motor lê e executa o código | basta `node arquivo.js` para rodar |
| Linguagem de script | Nasceu para automatizar comportamento dentro de um ambiente hospedeiro | um `<script>` que reage a um clique na página |
| Tipagem dinâmica | O tipo pertence ao valor, não à variável | uma variável pode receber número e depois string |
| Tipagem fraca | Algumas conversões podem ocorrer automaticamente | `'5' * 2` resulta em `10` |

---

## Características Importantes (Exemplo)

```js
let value = 10;
console.log(typeof value); // "number"

value = "10";
console.log(typeof value); // "string"
```

---

## Comentários em JavaScript

- Comentários são anotações inseridas no código que o motor de execução ignora totalmente.
- Eles servem para documentar intenções, explicar regras de negócio ou desativar temporariamente instruções durante o desenvolvimento.
- JavaScript suporta três formatos de comentários

---

## 1. Comentário de Linha Única (`//`)

- Inicia com duas barras (`//`) e estende-se até o fim da linha.
- É ideal para notas curtas e diretas.

---

## 1. Comentário de Linha Única (`//`) (Exemplo)

```js
// Define a taxa de desconto para clientes VIP
const VIP_DISCOUNT = 0.15;

const total = 100; // Valor base da compra
```

---

## 2. Comentário de Múltiplas Linhas (`/* ... */`)

- Inicia com `/` e encerra em `/`.
- É utilizado para explicações mais detalhadas ou para desativar blocos inteiros de código.

---

## 2. Comentário de Múltiplas Linhas (`/* ... */`) (Exemplo)

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

## 3. Comentários de Documentação JSDoc (`/** ... */`)

- Explique o PORQUÊ, não o O QUÊ: Evite comentar o que o código já deixa óbvio (`let x = 10.
- Priorize Código Autoexplicativo: Nomes claros para variáveis e funções reduzem drasticamente a necessidade de comentários informativos.
- Evite Código Morto: Remova códigos velhos comentados antes de enviar o projeto para produção ou controle de versão (Git).
- Iniciam com `/*` e encerram com `/`.
- O JSDoc é o padrão oficial de documentação da comunidade JavaScript.

---

## 3. Comentários de Documentação JSDoc (`/** ... */`) (Exemplo)

```js
/**
 * Calcula o preço final aplicando desconto.
 *
 * @param {number} price - Preço original do produto.
 * @param {number} discount - Taxa de desconto de 0 a 1 (ex: 0.10 para 10%).
 * @returns {number} Valor final com o desconto aplicado.
 */
function applyDiscount(price, discount) {
  return price * (1 - discount);
}
```

---

## Evolução da Linguagem

- TC39 Proposals, com propostas ativas;
- Finished Proposals,
- ECMAScript draft, com o rascunho vivo da próxima
- JavaScript continua evoluindo.
- O comitê TC39 organiza propostas de novas funcionalidades em estágios.

---

## Evolução da Linguagem (Comparação)

| Estágio | Ideia geral |
| ------- | ----------- |
| Stage 0 | Ideia inicial, ainda muito experimental |
| Stage 1 | Proposta com problema e direção discutidos |
| Stage 2 | Rascunho mais concreto da solução |
| Stage 3 | Candidato próximo de finalização |
| Stage 4 | Recurso finalizado, pronto para entrar na especificação |

---

## Como Executar JavaScript

- Existem várias formas de executar um primeiro código JavaScript.
- Elas não são uma sequência obrigatória; são cenários diferentes.
- Escolha o ambiente conforme o que você quer testar.
- Executa arquivos JavaScript pelo terminal, sem depender de uma página HTML.
- Node.js será a referência da disciplina, mas Deno e Bun também são opções.

---

## Runtimes fora do navegador

- Verifique a versão instalada
- Crie um arquivo JavaScript
- Execute o arquivo pelo terminal
- Modo Interativo (Node.js REPL)
- Teste TypeScript quando fizer sentido

---

## Console do navegador

- Abra o DevTools do navegador e use a aba Console para testar expressões rápidas.

---

## Console do navegador (Exemplo)

```js
console.log("Olá, navegador");
```

---

## Arquivo carregado pelo navegador

- Crie a página HTML
- Crie o arquivo JavaScript
- Abra a página no navegador
- Nesse cenário, o JavaScript é carregado por uma página HTML.
- O output de `console.log()` não aparece no corpo da página; ele aparece no Console do DevTools.

---

## Navegador, Node.js e npm

- Quando usamos JavaScript no navegador, o arquivo normalmente faz parte de uma página Web.
- Quando usamos JavaScript no Node.js, o arquivo é executado como programa no sistema operacional.
- O `npm` será importante porque muitos projetos Web dependem de pacotes.
- Vite, Bootstrap, Tailwind, Express, Prisma e várias ferramentas de teste ou build entram no projeto por meio do ecossistema npm.
- Mas o ecossistema JavaScript não depende apenas do `npm`.

---

## Navegador, Node.js e npm (Comparação)

| Ambiente | Como executar | Uso comum |
| -------- | ------------- | --------- |
| Navegador | `<script>`, Console, DevTools | interagir com HTML, CSS, eventos, DOM e APIs Web |
| Node.js | `node arquivo.js` | criar scripts, servidores, APIs e automações |
| npm | `npm install`, `npm run`, `npx` | instalar pacotes e executar tarefas do projeto |

---

## O que você vai aprender?

- O módulo de JavaScript / ECMAScript é estruturado de forma incremental.
- Ao longo das próximas aulas, você estudará os seguintes tópicos
- Conceitos essenciais da linguagem, declaração de variáveis, coerção de tipos, operadores e estruturas de controle de fluxo.
- Declaração de funções, Arrow Functions, escopos, closures, callbacks e organização modular de código com ES Modules e CommonJS.
- Manipulação de listas imutáveis com HOFs, fatiamento de texto, precisão numérica, fusos horários.

---

## Exercício

- No console do navegador
- Em um arquivo `main.js` executado com Node.js
- Nos dois ambientes
- Execute os três testes abaixo e observe onde cada um funciona
- Depois, responda: quais comandos pertencem à linguagem e quais dependem do ambiente de execução?

---

## Resumo da Aula

- **Origem & Evolução**: Criado em 1995 (Mocha → LiveScript → JavaScript); padronizado como ECMA-262 para garantir neutralidade.
- **JavaScript vs ECMAScript**: ECMAScript é a especificação formal (mantida pelo TC39); JavaScript é a implementação prática nos motores.
- **Motor V8**: Pipeline de execução com Scanner/Parser (AST) → Interpretador Ignition (Bytecode) → Compilador TurboFan (JIT otimizado).
- **Ambientes**: O núcleo da linguagem é complementado por Web APIs no navegador (DOM, fetch) e Node APIs no servidor (fs, http).
- **Processo TC39**: Evolução anual baseada em 5 estágios (Stage 0 a Stage 4) com critérios rigorosos de aceitação.
