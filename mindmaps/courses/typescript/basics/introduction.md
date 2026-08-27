---
title: 'TypeScript: Introdução'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# TypeScript: Introdução

## Ideia Central

- Superset tipado do JavaScript, compilado para JavaScript comum
- Os tipos existem só em desenvolvimento: são **apagados** na emissão

## O Que É

- **Superset**: todo `.js` válido é `.ts` válido
- **Tipado**: o compilador verifica o uso antes de executar
- **Compilado**: o runtime continua sendo JavaScript
- Criado pela Microsoft em 2012

## O Compilador

### Duas responsabilidades
- **Verificar**: aponta erros no editor e no build
- **Emitir**: gera JavaScript com os tipos removidos

### Type erasure
- `interface` e `type` desaparecem por completo
- Custo zero em tempo de execução
- E, por isso, nenhuma validação de dados externos

## Fronteiras da Verificação

### Detecta
- Propriedade inexistente ou com nome errado
- Argumento e retorno de tipo incompatível
- Variável possivelmente indefinida

### Não detecta
- `null` vindo de uma API que prometeu objeto
- Erro de lógica no algoritmo
- Falha de rede, arquivo ausente, condição de corrida

## Instalação

- Sempre **por projeto**: `pnpm add -D typescript`
- Instalação global faz projetos compartilharem a mesma versão
- `tsc --init` gera um `tsconfig.json` comentado
- `tsc --version` confirma a versão em uso

## tsconfig Mínimo

- `target`: versão de JavaScript gerada
- `module` / `moduleResolution`: sistema de módulos
- `rootDir` / `outDir`: fonte e saída
- `strict`: **sempre** ligado em projeto novo
- `skipLibCheck`: acelera muito o build

## Ecossistema de Tipos

- Bibliotecas modernas publicam tipos no próprio pacote
- **DefinitelyTyped**: pacotes `@types/*` mantidos pela comunidade
- Sem tipos nenhum: declare em um `.d.ts` do projeto

## O Que Sobrevive à Compilação

- **Sobrevivem**: `class` (vira classe JS) e `enum` (vira objeto)
- **Desaparecem**: `interface`, `type` e todas as anotações
- Espaço de tipos e espaço de valores são separados

## Boas Práticas

- **Ligue `strict` desde o dia 1** em projeto novo
- **Instale por projeto**, nunca global
- **Use `tsc --noEmit` na CI**, mesmo quando o build é de outro
- **Desconfie de `as`**: ele afirma sem verificar
