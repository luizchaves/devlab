---
title: 'TypeScript: Tipos Básicos'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# TypeScript: Tipos Básicos

## Ideia Central

- A inferência resolve a maior parte: anote nas **fronteiras**
- `any` desliga a verificação; `unknown` obriga a estreitar

## Primitivos

- `string`, `number`, `boolean` — sempre em minúsculas
- `bigint` e `symbol` para casos específicos
- `null` e `undefined` como tipos próprios sob `strictNullChecks`
- `String`, `Number` e `Boolean` são objetos empacotadores: evitar

## Inferência

### Como funciona?
- O tipo vem do valor atribuído na declaração
- `const` guarda o tipo **literal**; `let` alarga para o tipo base
- Objetos e arrays têm a forma inferida item a item

### Quando anotar?
- **Sempre** em parâmetros de função
- Em retorno de função exportada, para fixar o contrato
- Em variável declarada sem valor inicial
- Em dados do domínio, via `interface` ou `type`

## Arrays e Tuplas

- `string[]` e `Array<string>` são equivalentes
- `readonly string[]` bloqueia `push`, `pop` e atribuição
- **Tupla**: tamanho fixo e tipo por posição (`[string, number]`)
- Elementos nomeados, opcionais e rest são permitidos em tuplas

## Tipos Especiais

### any
- Aceita qualquer valor e permite qualquer operação
- **Propaga**: tudo que dele deriva também vira `any`
- Uso legítimo: escape temporário em migração

### unknown
- Aceita qualquer valor, mas exige verificação antes do uso
- Escolha correta para JSON, resposta de API e `catch`

### never
- Retorno de função que sempre lança ou nunca termina
- Interseções impossíveis (`string & number`)
- Prova de exaustividade em `switch`

## Tipos Literais

- Restringem a valores específicos: `"ativo" | "inativo"`
- Documentam as opções na assinatura e dão autocompletar
- `as const` em objeto deriva a união com `keyof typeof`
- Preferíveis a `enum`, que gera código e tem regras permissivas

## Asserções

- `as Tipo`: afirma sem verificar — **risco alto**
- `as const`: torna literal e somente leitura
- `satisfies`: verifica compatibilidade preservando a inferência
- `!` non-null: remove a verificação de nulo, também arriscado

## Boas Práticas

- **Não anote o que já é inferido**
- **Prefira `unknown` a `any`** em dados externos
- **Use união literal** em vez de `enum`
- **Estreite com `if`** antes de recorrer a `as`
