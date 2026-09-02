---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Introdução e Ecossistema"
description: "Slides completos da aula JavaScript: Introdução e Ecossistema."
---

<!-- _class: lead -->

# JavaScript: Introdução e Ecossistema

História do JavaScript, especificação ECMA-262, papel do comitê TC39, motores de execução (V8) e ambientes (Navegador vs Node.js).

---

## Objetivo

- Entender a origem do JavaScript, diferenciar JavaScript de ECMAScript, reconhecer o papel das Web APIs, identificar onde...

---

## Mapa da Aula

- Por Que JavaScript Importa?
- Origem e a História dos Nomes
- JavaScript, ECMAScript e Web APIs
- Onde o Código Executa?
- O Que a Linguagem Oferece?
- Características Importantes
- Comentários em JavaScript
- Evolução da Linguagem

---

## Introdução

- Antes de manipular páginas, consumir APIs ou construir servidores com Node.js, vale entender o que é JavaScript e por que...
- JavaScript não é apenas "a linguagem do navegador"
- hoje ela roda em navegadores, servidores, ferramentas de build, aplicações desktop, automações e ambientes de teste
- Nesta disciplina, JavaScript será usado nos dois lados da aplicação Web
- no navegador, para adicionar comportamento à interface, e no servidor, para construir APIs HTTP com Node.js e Express

---

## Por Que JavaScript Importa?

- JavaScript se tornou uma das linguagens centrais da Web porque é suportada pelos navegadores
- Quando uma página precisa reagir a cliques, validar um formulário, alterar elementos, buscar dados de uma API ou...
- Com Node.js, a linguagem também passou a ser usada fora do navegador
- Isso permitiu usar JavaScript para escrever servidores, ferramentas de linha de comando, scripts de automação, testes,...
- HTML estrutura o conteúdo, CSS define a apresentação visual e JavaScript adiciona comportamento

---

## Origem e a História dos Nomes

- JavaScript foi criado em maio de 1995 por Brendan Eich enquanto trabalhava na Netscape
- A linguagem foi desenvolvida em apenas 10 dias com o objetivo de adicionar comportamento dinâmico e interatividade às...

---

## A Evolução dos Nomes da Linguagem

- Transição rápida de nomes no primeiro ano da linguagem (1995–1996)
- **Mocha**: codinome do protótipo desenvolvido em 10 dias por Brendan Eich na Netscape
- **LiveScript**: primeiro lançamento comercial no Netscape Navigator 2.0 (beta)
- **JavaScript**: estratégia conjunta entre Netscape e Sun para alavancar a marca Java
- **ECMAScript**: padronização aberta pela Ecma International (ECMA-262) garantindo neutralidade

---

## A Evolução dos Nomes da Linguagem: Comparação

| Nome | Ano | Contexto e Motivação |
| :--- | :--- | :--- |
| **Mocha** | Maio / 1995 | Nome interno do projeto durante o desenvolvimento do protótipo por Brendan Eich. |
| **LiveScript** | Setembro / 1995 | Nome da primeira versão lançada comercialmente no Netscape Navigator 2.0. |
| **JavaScript** | Dezembro / 1995 | Parceria de marketing com a Sun Microsystems (marca hoje pertencente à Oracle). |
| **ECMAScript** | 1996 - Presente | Especificação técnica oficial e padronizada pela Ecma International (ECMA-262). |

---

## Padronização ECMA-262 e o TC39

- **ECMAScript**: especificação formal da linguagem mantida pelo comitê TC39 da Ecma International
- **JavaScript**: implementação prática do padrão executada nos ambientes
- **Motores (*engines*)**: programas que executam o código (V8 no Chrome/Node.js, SpiderMonkey, JavaScriptCore)
- Publicação anual consolidada no padrão oficial **ECMA-262**

---

## Fluxo do Motor V8 (JIT Compiler)

- **Scanner & Parser**: divide o código em tokens e constrói a AST (Árvore Sintática Abstrata)
- **Interpretador Ignition**: gera *bytecode* e inicia execução imediata com *profiling*
- **Compilador JIT TurboFan**: compila funções frequentes (*hot code*) em código de máquina nativo
- **Desotimização (*Deopt*)**: reverte ao Ignition se os tipos observados mudarem em tempo de execução

---

## JavaScript, ECMAScript e Web APIs

- No uso diário, é comum dizer apenas "JavaScript"
- Tecnicamente, porém, uma página no navegador mistura a linguagem ECMAScript com APIs fornecidas pelo ambiente
- Por isso, `Array`, `Object`, `Promise` e `Map` pertencem à linguagem
- Já `document.querySelector`, `addEventListener`, `fetch` no navegador e `localStorage` são recursos do ambiente Web
- Um código pode ser JavaScript válido e ainda assim não funcionar em todos os lugares

---

## JavaScript, ECMAScript e Web APIs: Comparação

| Termo | Papel | Exemplos |
| ----- | ----- | -------- |
| ECMAScript | Define a linguagem base | variáveis, funções, objetos, arrays, classes, módulos, promises |
| JavaScript | Nome comum da linguagem usada pelos desenvolvedores | código escrito em arquivos `.js` ou dentro de `<script>` |
| Web APIs | Recursos oferecidos pelo navegador | DOM, eventos, `fetch`, `localStorage`, timers, console |
| Node.js APIs | Recursos oferecidos pelo Node.js | sistema de arquivos, processos, servidor HTTP, módulos nativos |
| npm | Ecossistema de pacotes | Express, Vite, Prisma, Chart.js, bibliotecas de teste |

---

## Onde o Código Executa?

- O mesmo núcleo da linguagem pode aparecer em ambientes diferentes
- Cada ambiente adiciona suas próprias APIs e restrições
- Executa scripts associados a páginas Web
- É o ambiente usado para manipular DOM, responder a eventos, validar formulários e consumir APIs pela interface
- Executa JavaScript fora do navegador

---

## O Que a Linguagem Oferece?

- ECMAScript define a base da linguagem que será usada nas próximas aulas
- A tabela abaixo mostra partes que aparecerão com frequência durante a disciplina
- Aprender JavaScript não significa memorizar todas as bibliotecas
- Primeiro vem a linguagem
- valores, funções, objetos, arrays, módulos e assincronismo

---

## O Que a Linguagem Oferece?: Comparação

| Área | Exemplos | Por que importa |
| ---- | -------- | --------------- |
| Valores e tipos | `number`, `string`, `boolean`, `undefined`, `null`, objetos | Representar dados da aplicação |
| Variáveis | `let`, `const` | Guardar valores e controlar escopo |
| Expressões e operadores | `+`, `===`, `&&`, `??`, `?.` | Calcular, comparar e compor valores |
| Controle de fluxo | `if`, `switch`, `for`, `while` | Decidir caminhos e repetir tarefas |
| Funções | declarações, arrow functions, callbacks | Organizar comportamento reutilizável |
| ... | ... | ... |

---

## Características Importantes

- JavaScript é uma linguagem de alto nível, dinâmica e multiparadigma
- Essas palavras resumem decisões que afetam a forma de escrever e depurar código
- Esses comportamentos não são "erros" da linguagem, mas exigem disciplina
- Ao longo da disciplina, vamos preferir comparações estritas (`===`), nomes claros e código legível para reduzir surpresas

---

## Características Importantes: Comparação

| Característica | Ideia principal | Exemplo prático |
| -------------- | --------------- | --------------- |
| Alto nível | Esconde muitos detalhes de memória e máquina | criar objetos e arrays sem alocar memória manualmente |
| Interpretada | Não há etapa de compilação separada; o motor lê e executa o código | basta `node arquivo.js` para rodar |
| Linguagem de script | Nasceu para automatizar comportamento dentro de um ambiente hospedeiro | um `<script>` que reage a um clique na página |
| Tipagem dinâmica | O tipo pertence ao valor, não à variável | uma variável pode receber número e depois string |
| Tipagem fraca | Algumas conversões podem ocorrer automaticamente | `'5' * 2` resulta em `10` |
| ... | ... | ... |

---

## Tipagem dinâmica

```js
let value = 10;
console.log(typeof value); // "number"

value = "10";
console.log(typeof value); // "string"
```

---

## Conversão automática

```js
console.log("5" * 2); // 10
console.log("5" + 2); // "52"
```

---

## Comentários em JavaScript

- Comentários são anotações inseridas no código que o motor de execução ignora totalmente
- Eles servem para documentar intenções, explicar regras de negócio ou desativar temporariamente instruções durante o...
- JavaScript suporta três formatos de comentários:

---

## Comentário de Linha Única (`//`)

- Inicia com duas barras (`//`) e estende-se até o fim da linha
- É ideal para notas curtas e diretas

---

## Comentário de linha única

```js
// Define a taxa de desconto para clientes VIP
const VIP_DISCOUNT = 0.15;

const total = 100; // Valor base da compra
```

---

## Comentário de Múltiplas Linhas (`/* ... */`)

- Inicia com `/*` e encerra em `*/`
- É utilizado para explicações mais detalhadas ou para desativar blocos inteiros de código

---

## Comentário de bloco

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

## Comentários de Documentação JSDoc (`/ ... */`)

- Explique o PORQUÊ, não o O QUÊ: Evite comentar o que o código já deixa óbvio (`let x = 10; // declara x como 10`)....
- Priorize Código Autoexplicativo: Nomes claros para variáveis e funções reduzem drasticamente a necessidade de comentários...
- Evite Código Morto: Remova códigos velhos comentados antes de enviar o projeto para produção ou controle de versão (Git).

---

## Documentação com JSDoc

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

---

## Evolução da Linguagem: Comparação

| Estágio | Ideia geral |
| ------- | ----------- |
| Stage 0 | Ideia inicial, ainda muito experimental |
| Stage 1 | Proposta com problema e direção discutidos |
| Stage 2 | Rascunho mais concreto da solução |
| Stage 3 | Candidato próximo de finalização |
| Stage 4 | Recurso finalizado, pronto para entrar na especificação |

---

## Evolução da Linguagem: Comparação

| Edição | Exemplos importantes | Por que marcou a linguagem |
| ------ | -------------------- | -------------------------- |
| ES2015 | `let`, `const`, arrow functions, classes, modules, promises | Modernizou a sintaxe e consolidou a base do JavaScript usado hoje |
| ES2017 | `async`/`await` | Tornou código assíncrono mais parecido com código sequencial |
| ES2020 | optional chaining (`?.`), nullish coalescing (`??`), `BigInt` | Reduziu verificações repetitivas de `null`/`undefined` e adicionou inteiros grandes |
| ES2021 | logical assignment (`&&=`, `\|\|=`, `??=`), `String.prototype.replaceAll()` | Melhorou atribuições condicionais e manipulação de strings |
| ES2022 | class fields, private fields (`#name`), top-level `await` | Fortaleceu a sintaxe de classes e simplificou módulos assíncronos |
| ... | ... | ... |

---

## Como Executar JavaScript

- Existem várias formas de executar um primeiro código JavaScript
- Elas não são uma sequência obrigatória
- são cenários diferentes
- Escolha o ambiente conforme o que você quer testar
- Executa arquivos JavaScript pelo terminal, sem depender de uma página HTML

---

## Runtimes fora do navegador

- Verifique a versão instalada
- Crie um arquivo JavaScript
- Execute o arquivo pelo terminal
- Modo Interativo (Node.js REPL)
- Teste TypeScript quando fizer sentido

---

## Terminal

```bash
    node -v
```

---

## Saída

```txt
    v24.19.0
```

---

## main.js

```js
    console.log("Olá, Node.js");
```

---

## Console do navegador

- Abra o DevTools do navegador e use a aba Console para testar expressões rápidas

---

## Console do navegador

```js
console.log("Olá, navegador");
```

---

## Arquivo carregado pelo navegador

- Crie a página HTML
- Crie o arquivo JavaScript
- Abra a página no navegador

---

## index.html

```html
<script src="main.js"></script>
```

---

## main.js

```js
console.log("Olá, página");
```

---

## Console

```txt
Olá, página
```

---

## Navegador, Node.js e npm

- Quando usamos JavaScript no navegador, o arquivo normalmente faz parte de uma página Web
- Quando usamos JavaScript no Node.js, o arquivo é executado como programa no sistema operacional
- O `npm` será importante porque muitos projetos Web dependem de pacotes
- Vite, Bootstrap, Tailwind, Express, Prisma e várias ferramentas de teste ou build entram no projeto por meio do...
- Mas o ecossistema JavaScript não depende apenas do `npm`

---

## Navegador, Node.js e npm: Comparação

| Ambiente | Como executar | Uso comum |
| -------- | ------------- | --------- |
| Navegador | `<script>`, Console, DevTools | interagir com HTML, CSS, eventos, DOM e APIs Web |
| Node.js | `node arquivo.js` | criar scripts, servidores, APIs e automações |
| npm | `npm install`, `npm run`, `npx` | instalar pacotes e executar tarefas do projeto |

---

## Navegador, Node.js e npm: Comparação

| Ferramenta | Tipo | Uso comum |
| ---------- | ---- | --------- |
| [pnpm](https://pnpm.io/) | Gerenciador de pacotes | Alternativa ao npm com foco em velocidade, economia de disco e monorepos |
| [Yarn](https://yarnpkg.com/) | Gerenciador de pacotes | Alternativa ao npm com foco em projetos reproduzíveis e organização de dependências |
| [Bun](https://bun.com/) | Runtime e toolkit | Executar JavaScript/TypeScript, instalar pacotes, rodar testes e empacotar projetos |
| [Deno](https://deno.com/) | Runtime e toolkit | Executar JavaScript/TypeScript com permissões de segurança, ferramentas integradas e suporte moderno a módulos |
| [JSR](https://jsr.io/) | Registro de pacotes | Registro moderno para JavaScript e TypeScript, com foco em ESM e TypeScript |

---

## O que você vai aprender?

- O módulo de JavaScript / ECMAScript é estruturado de forma incremental
- Ao longo das próximas aulas, você estudará os seguintes tópicos
- Conceitos essenciais da linguagem, declaração de variáveis, coerção de tipos, operadores e estruturas de controle de fluxo
- Declaração de funções, Arrow Functions, escopos, closures, callbacks e organização modular de código com ES Modules e...
- Manipulação de listas imutáveis com HOFs, fatiamento de texto, precisão numérica, fusos horários, expressões regulares e...

---

## Exercício

- No console do navegador:
- Em um arquivo `main.js` executado com Node.js:
- Nos dois ambientes:

---

## Exercício

```js
console.log(document.title);
```

---

## Exercício

```js
console.log(process.version);
```

---

## Exercício

```js
const message = "JavaScript";
console.log(message.toUpperCase());
```

---

## Perguntas de revisão

- Qual é a diferença entre JavaScript e ECMAScript
- Por que JavaScript se tornou tão importante na Web
- O que são Web APIs
- Por que `document` funciona no navegador e não em um script Node comum
- Para que serve Node.js

---

## Próxima aula

- Na próxima aula, o estudo da sintaxe da linguagem começa pela declaração e escopo de valores
- Variáveis e Escopo
- Declaração com var, let e const, escopo de bloco, hoisting e TDZ

---

## Resumo da Aula

- Revise por Que JavaScript Importa?
- Revise origem e a História dos Nomes
- Revise javaScript, ECMAScript e Web APIs
- Revise onde o Código Executa?
- Revise o Que a Linguagem Oferece?
- Revise características Importantes
- Revise comentários em JavaScript
