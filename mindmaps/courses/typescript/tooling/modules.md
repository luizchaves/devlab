---
title: 'TypeScript: Módulos e Declarações'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# TypeScript: Módulos e Declarações

## Ideia Central

- Entre módulos circulam código **e** tipos
- O que sobrevive à compilação depende dessa distinção

## Import e Export

- Sintaxe do ECMAScript, com tipos nas mesmas listas
- Com `NodeNext`, o import exige extensão `.js` (arquivo emitido)
- Com `moduleResolution: Bundler`, a extensão pode ser omitida
- `export default` e exportações nomeadas convivem

## import type

- `import type { … }` some por completo do JavaScript
- `import { valor, type Tipo }` separa dentro da mesma linha
- `export type { … }` reexporta apenas o tipo
- `verbatimModuleSyntax` emite exatamente o que foi escrito

## ESM x CommonJS

### Diferenças
- `import`/`export` versus `require`/`module.exports`
- ESM exige extensão explícita no import
- ESM tem top-level `await`; CommonJS não

### Configuração
- `"type": "module"` no `package.json` define o padrão
- `.mts` e `.cts` forçam o formato
- `esModuleInterop` permite importar CJS com sintaxe de ESM
- `ERR_REQUIRE_ESM` e `ERR_MODULE_NOT_FOUND` são erros de runtime

## Resolução de Tipos

- Primeiro os tipos publicados pelo próprio pacote
- Depois `@types/nome` em `node_modules`
- Depois declarações locais do projeto
- Não encontrando: TS7016, *implicitly has an 'any' type*
- `tsc --traceResolution` mostra cada passo da busca

## Arquivos .d.ts

- Contêm **apenas** tipos, sem implementação
- Gerados por `declaration: true` ao publicar biblioteca
- Escritos à mão para bibliotecas sem tipos
- `export {}` transforma o arquivo em módulo e evita vazamento global

## Tipando Sem Tipos

- `declare module "nome"` sem corpo: escape sem verificação
- Declaração mínima: tipe só o que o projeto usa
- `declare global` para objetos globais como `window`
- Documente como dívida quando for escape temporário

## Estendendo Declarações

- *Declaration merging* de interfaces
- `declare module "express-serve-static-core"` para o `Request`
- `namespace NodeJS { interface ProcessEnv }` para variáveis de ambiente
- Estender protótipos nativos é possível, mas desaconselhado

## Boas Práticas

- **Marque tipos com `type`** nos imports
- **Publique `.d.ts`** ao distribuir biblioteca
- **`export {}` em todo `.d.ts`** que não deve ser global
- **Prefira `@types` oficiais** a declarações caseiras
