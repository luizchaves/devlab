---
title: 'TypeScript: Migrando de JavaScript'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# TypeScript: Migrando de JavaScript

## Ideia Central

- Migração é incremental: `.js` e `.ts` convivem no mesmo build
- Cada fase entrega valor sozinha — dá para parar em qualquer uma

## Fase 1: Preparar

- Instalar `typescript` e gerar o `tsconfig.json`
- `allowJs: true` para o `.js` entrar no programa
- `checkJs: false` e `strict: false` — permissivo de propósito
- `noEmit: true`: o build atual continua com quem já fazia
- Não troque o empacotador na mesma semana

## Fase 2: Verificar o JavaScript

### Marcadores
- `// @ts-check` liga a verificação por arquivo
- `// @ts-nocheck` desliga em arquivo legado
- `// @ts-expect-error` avisa quando o erro some
- `// @ts-ignore` fica silencioso para sempre — evitar

### JSDoc
- `@typedef` e `@property` no lugar de `interface`
- `@param` e `@returns` para funções
- `@template` para generics
- `/** @type {T} */ (valor)` no lugar de `as`

## Fase 3: Renomear

- Ordem: utilitários → domínio → serviços → interface → entrada
- Comece pelas folhas: sem dependências e com tipos simples
- Um arquivo por commit: revisão legível e reversão isolada
- O JSDoc já escrito vira anotação nativa

## Fase 4: Endurecer

- `noImplicitAny` primeiro: fecha buracos na verificação
- `strictFunctionTypes` e `strictBindCallApply`: baixo custo
- **`strictNullChecks`**: a etapa que trava migrações
- Ligue por diretório, com um `tsconfig` de escopo menor
- Ao final, troque tudo por `strict: true`

## Fase 5: Manter

- `tsc --noEmit` bloqueando o merge na CI
- Regra impedindo arquivos `.js` novos
- `no-explicit-any` como aviso de lint
- Relatório de progresso acompanhado ao longo do tempo

## Dependências Sem Tipos

- Procurar `@types/nome` no DefinitelyTyped
- Não existindo, declarar o mínimo usado em um `.d.ts`
- `declare module "nome"` sem corpo é dívida documentada

## Boas Práticas

- **Comece permissivo**: rigor no dia 1 mata a migração
- **Tipe com JSDoc** antes de renomear
- **Um arquivo por commit**
- **Trave na CI**, ou a base regride sozinha
