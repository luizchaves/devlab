---
title: 'Guia de TypeScript'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# Guia de TypeScript

## Ideia Central

- **Superset** do JavaScript: todo JS válido é TS válido
- O sistema de tipos existe só no desenvolvimento e é **apagado** na compilação
- O ganho aparece em código que você não escreveu: autocompletar, refatoração, contrato

## Fundamentos

- **Introdução**: o compilador, o apagamento de tipos, o primeiro projeto
- **Tipos Básicos**: primitivos, arrays, tuplas, `any`, `unknown`, `never`, literais
- **Funções**: parâmetros opcionais e rest, sobrecargas, `this` tipado
- **Narrowing**: análise de fluxo, `typeof`, `in`, `instanceof`, *type predicates*
- Regra da trilha: **anote nas fronteiras, deixe inferir no meio**

## Sistema de Tipos

- **Objetos e Interfaces**: `interface` ou `type`, modificadores, composição
- **Uniões e Interseções**: literais, uniões discriminadas, exaustividade com `never`
- **Generics**: parâmetros de tipo, restrições com `extends`, inferência
- É aqui que o domínio da aplicação é descrito

## Tipos Avançados

- **Utility Types**: `Partial`, `Pick`, `Omit`, `Record`, `ReturnType`, `Awaited`
- **Manipulação de Tipos**: mapeados, condicionais, `infer`, template literals
- **Classes**: modificadores de acesso, `implements`, abstratas, `#campo`
- Cada página traz o contraponto: quando parar de manipular tipos

## Ferramentas

- **`tsconfig.json`**: `strict` e as verificações que ficam fora dele
- **Módulos e Declarações**: ESM e CommonJS, `import type`, arquivos `.d.ts`
- **Execução e Build**: `tsc`, `tsx`, empacotadores, verificação em CI

## Na Prática

- **Migrando de JavaScript**: `allowJs`, `checkJs`, JSDoc, endurecimento gradual
- **TypeScript no Node.js**: API tipada de ponta a ponta, validação em runtime
- **TypeScript no React**: props, `useState`, `useReducer`, eventos, contexto, genéricos

## Referência Rápida

- **Evolução e Versões**: da 1.0 ao compilador nativo em Go do 7.0
- **Comparativo com JavaScript**: o que muda e o que continua igual
- **Casos "Bizarros"**: estrutural, apagamento e compatibilidade com o JavaScript
- **Desenvolvimento com IA**: especificar, gerar, verificar e revisar
- **Guia de Referência**: assinaturas para conferência rápida

## Executar e Verificar

- `tsc` não executa e **verifica**; o navegador não faz nenhum dos dois
- Node.js 22+, Bun, `tsx` e empacotadores executam **removendo** tipos, sem verificar
- Deno executa e verifica por padrão
- Executar é rápido porque quase ninguém verifica: `tsc --noEmit` vai no CI

## Versão de Referência

- O guia usa a série **TypeScript 5.x**
- Recursos com versão mínima são sinalizados: `satisfies` (5.0), `using` (5.2)
- Sob o **6.0**, `strict` já vem ligado e vários padrões mudam
- Conferir com `npx tsc --version`

## Boas Práticas

- **Não anote o que já é inferido**
- **`unknown` em vez de `any`** em tudo que vem de fora
- **Valide na fronteira**: o tipo é expectativa, a validação é garantia
- **Modele estado como união**, não como conjunto de flags
