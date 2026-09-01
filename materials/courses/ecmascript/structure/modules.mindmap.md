---
title: 'JavaScript: Módulos ES (ESM)'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# JavaScript: Módulos ES (ESM)

## Ideia Central

- **Isolamento de Escopo**: arquivos isolados com variáveis e funções privadas por padrão.
- **Modularização**: compartilhamento explícito de código entre arquivos via `export` e `import`.

## Sistemas de Módulos

- **CommonJS (CJS)**:
  - Padrão legado do Node.js com `require()` e `module.exports`.
  - Carregamento síncrono em tempo de execução.
- **ES Modules (ESM)**:
  - Padrão oficial do ECMAScript (ES6+) para Browsers e Node.js moderno.
  - Carregamento estático, assíncrono e nativo.

## Sintaxes de Exportação e Importação

- **Named Exports**:
  - Múltiplas exportações nomeadas por arquivo (`export function sum()`, `export { a, b }`).
  - Importação com desestruturação `{ sum, subtract }`.
  - Aliases: renomeação local usando `import { sum as add }`.
- **Export Default**:
  - Exposição do membro principal (limite de 1 por módulo).
  - Importação sem chaves `{}` com identificador livre.
  - Exportações combinadas: `import DefaultVal, { namedVal } from './lib.js'`.
- **Namespace Import (`import * as`)**:
  - Agrupa todas as exportações em um único objeto prefixado.
  - Objeto de namespace é estritamente imutável (*read-only*).
- **Dynamic Imports (`import()`)**:
  - Carregamento condicional e sob demanda dentro de funções ou blocos.
  - Retorna uma `Promise` consumível via `await import()`.

## Semântica e Ciclo de Vida

- **Avaliação Única (*Singleton*)**: o código do módulo executa uma única vez e é cacheado.
- **Live Bindings (Vínculos Vivos)**: variáveis importadas refletem mutações feitas pelo módulo de origem.
- **Vínculos de Apenas Leitura**: o módulo receptor não pode reatribuir diretamente variáveis importadas.

## Configuração e Resolução no Node.js

- **`package.json`**: ativação de ESM nativo com `"type": "module"`.
- **Extensão Obrigatória**: especificadores relativos (`./` e `../`) exigem `.js`.
- **Especificadores de Pacote**: identificadores sem `./` buscam pastas em `node_modules/`.
- **Versionamento Semântico (SemVer)**:
  - Formato `MAJOR.MINOR.PATCH`.
  - `^` (caret): aceita MINOR e PATCH (padrão npm).
  - `~` (tilde): aceita apenas PATCH.
  - Arquivo de trava (`lockfile`): garante integridade do grafo de dependências.

## Boas Práticas

- **Adicione `node_modules/` no `.gitignore`** para manter o repositório leve.
- **Utilize ESM por padrão** em projetos modernos de Node.js e Front-end.
- **Explicite extensões `.js`** para garantir compatibilidade com padrões web e Node.js nativo.
