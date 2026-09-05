---
title: 'JavaScript: Introdução e Ecossistema'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Introdução e Ecossistema

## Objetivo
- Entender a origem do JavaScript, diferenciar JavaScript de ECMAScript, reconhecer o papel das Web APIs.

## Por Que JavaScript Importa?
- JavaScript se tornou uma das linguagens centrais da Web porque é executado pelos navegadores.
- Quando uma página precisa reagir a cliques, validar um formulário, alterar elementos ou buscar dados, normalmente existe JavaScript envolvido.
- Com Node.js, a linguagem também passou a ser usada fora do navegador.
- Isso permitiu usar JavaScript para escrever servidores, ferramentas de linha de comando, scripts de automação, testes.

## De Onde Vêm os Nomes JavaScript e ECMAScript?
- JavaScript foi criado em maio de 1995 por Brendan Eich enquanto trabalhava na Netscape.
### A Evolução dos Nomes da Linguagem
- Nome: Ano; Contexto e Motivação
- Mocha: Maio / 1995; Nome interno do projeto durante o desenvolvimento do protótipo por Brendan Eich.
- LiveScript: Setembro / 1995; Nome da primeira versão lançada comercialmente no Netscape Navigator 2.0.
- JavaScript: Dezembro / 1995; Parceria de marketing com a Sun Microsystems (marca hoje pertencente à Oracle).
- ECMAScript: 1996 - Presente; Especificação técnica oficial e padronizada pela Ecma International (ECMA-262).
### Padronização ECMA-262, TC39 e Evolução da Linguagem
- ECMAScript: especificação formal mantida pelo comitê TC39 (padrão ECMA-262)
- Edições anuais consolidam os recursos amadurecidos na especificação oficial
- Draft vivo continua evoluindo para as próximas edições
- Estágios do TC39 (Stages 0 a 4) para amadurecimento de novas propostas
- Edições anuais da especificação (ES2015/ES6 até ES2024+)
- Disponibilidade em runtimes e navegadores

## O Que a Linguagem Oferece?
- Núcleo vs Ambientes: ECMAScript (linguagem base), Web APIs (navegador), Node.js APIs (servidor), npm (pacotes)
- Valores e tipos: `number`, `string`, `boolean`, `undefined`, `null`, objetos
- Variáveis: `let`, `const` (controle de escopo)
- Expressões e operadores: `+`, `===`, `&&`, `??`, `?.`
- Controle de fluxo: `if`, `switch`, `for`, `while`
- Funções: declarações, arrow functions, callbacks
- Objetos e arrays: modelagem e manipulação de coleções
- Módulos e assincronismo: `import`/`export`, `Promise`, `async`/`await`
### Características Importantes
- Alto nível: Gerenciamento automático de memória via Garbage Collector
- Execução JIT: Combina interpretação rápida e compilação nativa em tempo de execução
- Tipagem dinâmica: Tipos vinculados aos dados em memória e não às variáveis
- Tipagem fraca: Coerção implícita de tipos durante operações aritméticas e concatenações
- Multiparadigma: Estilos funcional e orientado a eventos no navegador (callbacks e escutadores)
- Protótipos: Herança direta entre objetos por meio da cadeia de protótipos (prototype chain)
- ASI: Inserção automática de ponto e vírgula (estilos com e sem ';' padronizados por linters e formatadores)
### Comentários em JavaScript
- Anotações no código ignoradas pelo motor de execução
- Linha Única (`//`): notas curtas que vão até o fim da linha
- Múltiplas Linhas (`/* ... */`): blocos de texto ou desativação temporária de código
- Documentação JSDoc (`/** ... */`): padrão oficial com tags @param e @returns para autocompletar e inteligência no editor

## Como Executar JavaScript?
- Motor: interpreta, otimiza e executa o código.
- Ambiente: define quais APIs estão disponíveis.
- Ferramentas: instalam pacotes e executam comandos do projeto.
### Motores de Execução
- Motores executam e otimizam o código JavaScript nos ambientes
- V8: Google Chrome e Node.js
- SpiderMonkey: Mozilla Firefox
- JavaScriptCore: Safari
- Pipeline do V8: Scanner/Parser (AST) -> Ignition (Bytecode) -> TurboFan (JIT nativo) -> Desotimização (Deopt)
- Especificação ECMAScript é referência para implementadores; MDN é mais didática para estudar programação

### Navegador, Node.js e npm
- Navegador: executa scripts ligados a páginas HTML, Console e DevTools
- Node.js: executa arquivos JavaScript como programas no sistema operacional
- npm: instala pacotes, gerencia dependências e executa scripts de projeto
- Ecossistema moderno: pnpm, Yarn, Bun, Deno e JSR cumprem papéis diferentes

### Formas de execução
- Runtime fora do navegador: servidores, APIs, CLIs e automações (Node.js, Deno, Bun)
- Console do navegador: testes rápidos de expressões e Web APIs no DevTools
- Arquivo no navegador: manipulação de DOM e eventos via `<script>` em HTML
### Runtimes fora do navegador
- Verifique a versão instalada
- Crie um arquivo JavaScript
- Execute o arquivo pelo terminal
- Leia mensagens de erro completas: tipo, arquivo e linha orientam a investigação
- Use `console.log`, `console.table` e `console.time` quando a execução parecer inesperada ou lenta
- Modo Interativo (Node.js REPL)
- Teste TypeScript quando fizer sentido
### Console do navegador
- Abra o DevTools do navegador e use a aba Console para testar expressões rápidas.
### Arquivo carregado pelo navegador
- Crie a página HTML
- Crie o arquivo JavaScript
- Abra a página no navegador
- Nesse cenário, o JavaScript é carregado por uma página HTML.
- O output de `console.log()` não aparece no corpo da página; ele aparece no Console do DevTools.

## Síntese de Estudo
- **Página**: aprofunda conceitos, exemplos e exercícios
- **Slides**: organizam a exposição do tópico
- **Mapa mental**: revisa relações entre tópicos
- **Prática**: execute os exemplos antes de memorizar regras
