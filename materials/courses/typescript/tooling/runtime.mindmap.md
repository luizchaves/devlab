---
title: 'TypeScript: Execução e Build'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# TypeScript: Execução e Build

## Ideia Central

- Nenhum runtime executa TypeScript: alguém sempre remove os tipos
- Verificação e transpilação viraram **duas etapas separadas**

## As Duas Etapas

### Verificação
- Só o `tsc` faz: lento, completo
- Acontece no editor e na CI
- `tsc --noEmit` é o comando padrão

### Transpilação
- esbuild, SWC, tsx e o Node apenas **apagam** os tipos
- Muito rápida, e sem nenhuma verificação
- Erro de tipo **não** impede o build

## Em Desenvolvimento

- **`tsx`**: executa direto, com modo `watch`
- **Node**: *type stripping* nativo em versões recentes
- **`tsc --watch`**: verifica continuamente, mas gera arquivos
- **Deno**: verifica por padrão; **Bun**: só remove os tipos

## Empacotando

- **Vite**: aplicações web, dev server e build
- **esbuild**: transpilação e bundle ultrarrápidos
- **tsup**: bibliotecas, com `--dts` para as declarações
- **tsc**: emissão simples, arquivo a arquivo
- Biblioteca sem `.d.ts` publicado entrega `any`

## Source Maps

- `sourceMap`: depurador mostra o `.ts` original
- `declarationMap`: "ir para definição" chega ao código-fonte
- `inlineSources` embute o fonte no mapa
- Node precisa de `--enable-source-maps`

## Verificação em CI

- `tsc --noEmit` bloqueando o merge
- Lint, testes e build como etapas separadas
- Editor verde não é build verde: ele só vê os arquivos abertos
- Um erro em arquivo fechado só aparece na verificação completa

## Estratégias

- **CLI simples**: `tsx` no dev, `tsc` no build
- **API Node**: `tsx watch` + `tsup`, verificação na CI
- **App web**: `vite dev` e `vite build`, verificação na CI
- **Biblioteca**: `tsup --dts` e `.d.ts` publicados
- **Monorepo**: `tsc --build` com project references

## Boas Práticas

- **Coloque `typecheck` no script de build**, antes de empacotar
- **Ative source maps** também em produção
- **Não confie no bundler** para pegar erro de tipo
- **Rode a verificação completa** antes de abrir a pull request
