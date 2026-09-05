---
title: 'TypeScript: Comparativo com JavaScript'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# TypeScript: Comparativo com JavaScript

## Ideia Central

- TypeScript é um **superset**: começa no JavaScript e acrescenta verificação estática
- Os tipos existem só no desenvolvimento; o runtime executa JavaScript comum

## Relação Entre as Linguagens

### Caminho do código
- `.js` já é aceito como TypeScript
- `.ts` acrescenta anotações ao mesmo código
- `tsc` ou bundler apaga os tipos e emite `.js`
- O runtime recebe JavaScript, nunca tipos

### Diferenças de superfície
- Arquivos: `.js`, `.mjs`, `.cjs` contra `.ts` e `.tsx`
- Execução direta contra passo de transformação
- Simplicidade contra contratos explícitos

## Tipagem

### Dinâmica (JavaScript)
- O tipo é decidido durante a execução
- `total("R$ 10", 3)` devolve `NaN` sem reclamar
- O defeito chega ao usuário

### Estática (TypeScript)
- A assinatura vira contrato verificável
- O erro aparece no editor, antes do commit
- O tipo é documentação que o compilador cobra

## O Que o Compilador Detecta

- Propriedade com nome errado em objeto de tipo conhecido
- Argumento de tipo incompatível
- Retorno que não bate com a assinatura
- Campo opcional usado sem checagem
- **Não** detecta: JSON de API com formato diferente do declarado

## O Que Continua Igual

- Coerção, protótipos, closures e `this`
- Event loop, Promises e módulos
- `0.1 + 0.2 !== 0.3` e `NaN !== NaN`
- Aprender JavaScript continua obrigatório

## Tipo Não É Validação

- `as User` faz o compilador acreditar, sem verificar nada
- Dado de rede, formulário e arquivo são externos
- Combine tipos com validação em runtime nas fronteiras

## Quando Usar Cada Um

### JavaScript basta
- Script curto de automação
- Página simples, com poucas interações
- Protótipo descartável

### TypeScript se paga
- Aplicação React, Vue ou Angular
- API com regras de negócio entre camadas
- Biblioteca publicada para terceiros
- Legado, migrando arquivo a arquivo com `allowJs`

## Boas Práticas

- **Anote as fronteiras** e deixe o compilador inferir o resto
- **Valide o dado externo** antes de confiar no tipo declarado
- **Migre aos poucos**, aumentando o rigor do `tsconfig.json`
