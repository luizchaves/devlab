---
title: 'TypeScript: Evolução e Versões'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# TypeScript: Evolução e Versões

## Ideia Central

- Produto da Microsoft com ciclo próprio, não um padrão de comitê
- A sintaxe de execução vem do TC39; o TypeScript acrescenta só o que é apagável

## Como Evolui?

### Ciclo
- Lançamentos aproximadamente trimestrais
- Fase beta, *release candidate* e estável no npm
- `major.minor`, mas **não é SemVer estrito**
- Verificação mais precisa conta como correção, não como quebra

### Objetivos de projeto
- **Alinhamento com o ECMAScript**: sintaxe nova vem do TC39
- **Apagamento completo**: tipos não influenciam o runtime
- **Solidez pragmática**: algumas brechas são conscientes
- Exceção histórica: `enum` e `namespace`, hoje considerados legado

## Linha do Tempo

### 1.x — A fundação (2014)
- Anotações com dois-pontos, `interface`, generics
- Arquivos de declaração `.d.ts`
- `enum` e `namespace`, anteriores aos módulos do JavaScript

### 2.x — O rigor (2016 a 2018)
- **`strictNullChecks`**: `null` e `undefined` deixam de pertencer a todo tipo
- Uniões discriminadas, `never`, `readonly`, tipos literais
- 2.8: tipos condicionais e `infer`, base dos utility types

### 3.x — `unknown` e projetos (2018 a 2019)
- `unknown` como alternativa segura ao `any`
- Tuplas espalhadas em parâmetros rest
- 3.7: `?.`, `??` e funções de asserção, seguindo o TC39

### 4.x — Tipos como linguagem (2020 a 2021)
- Tuplas variádicas e elementos nomeados
- **Template literal types** e remapeamento de chaves com `as`
- `catch` com `unknown`; modificador `override`

### 5.0 a 5.2 (2023)
- Decorators do padrão ECMAScript
- **`satisfies`**: verifica sem alargar a inferência
- Parâmetros de tipo `const` e `verbatimModuleSyntax`
- `using` e `await using` para descarte determinístico

### 5.4 a 5.9 (2024 a 2025)
- Estreitamento preservado dentro de closures; `NoInfer`
- **Predicados de tipo inferidos** em funções de filtro
- `erasableSyntaxOnly`, alinhado à remoção de tipos do Node.js
- `import defer` e `module: node20`

## TypeScript 6.0 — Transição

### Padrões que mudam
- `strict` passa a ser `true`
- `module` passa a `esnext`; `target`, à versão ES do ano
- `noUncheckedSideEffectImports` liga; `libReplacement` desliga

### Depreciações
- `target: es5` e `downlevelIteration`
- `moduleResolution: node`, migrando para `nodenext` ou `bundler`
- `module` com `amd`, `umd`, `systemjs` e `none`
- `"ignoreDeprecations": "6.0"` é prazo, não solução

## TypeScript 7.0 — Compilador Nativo

- Reescrita do compilador em **Go**, `tsgo` durante o desenvolvimento
- Objetivo declarado: desempenho em bases grandes
- **A linguagem não muda**: tipos, sintaxe e semântica continuam iguais
- As opções depreciadas no 6.0 são removidas
- A API de compilador é reescrita: plugins precisam de adaptação

## Executar e Verificar

- Navegador não executa `.ts` e não verifica
- Node.js 22+, Bun, `tsx` e bundlers executam **removendo** tipos, sem verificar
- Deno executa e verifica por padrão
- `tsc --noEmit` só verifica, e é o que precisa rodar no CI

## Boas Práticas

- **Confirme a versão** com `npx tsc --version` antes de copiar configuração
- **Atualize para o 6.0 primeiro**, corrija os avisos e só então avance
- **Pergunte a partir de qual versão** um recurso existe antes de aceitar sugestão de IA
