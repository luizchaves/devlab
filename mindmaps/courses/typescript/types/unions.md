---
title: 'TypeScript: Uniões e Interseções'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# TypeScript: Uniões e Interseções

## Ideia Central

- `|` descreve alternativas; `&` combina exigências
- União discriminada é o padrão mais útil do TypeScript

## União

- Aceita valores de qualquer variação
- Oferece só o que é **comum** a todas, até estreitar
- Mais valores possíveis, menos operações disponíveis
- Depois do narrowing, tudo do tipo estreitado fica disponível

## Tipos Literais

- Conjunto fechado de valores: `"debug" | "info" | "error"`
- Autocompletar no editor e erro em valor inválido
- `keyof typeof OBJ` deriva a união das chaves
- `(typeof OBJ)[keyof typeof OBJ]` deriva a união dos valores

## Uniões Discriminadas

### Anatomia
- Propriedade comum presente em todas as variações
- Tipo literal distinto em cada uma (o discriminante)
- `switch` ou `if` sobre ela ativa o narrowing

### Ganho
- Campos de outra variação viram erro de compilação
- Cada ramo conhece exatamente os campos disponíveis

## Exaustividade

- `const exhaustive: never = value` no `default`
- Variação nova deixa de compilar, apontando o local exato
- Refatoração deixa de depender de memória

## Interseção

- Exige satisfazer **todos** os tipos ao mesmo tempo
- Compõe contratos: `type User = Entity & Timestamped & { … }`
- Chaves iguais com tipos incompatíveis produzem `never`
- O erro só aparece na hora de criar o objeto

## Precedência

- `(string | number)[]`: array misto
- `string[] | number[]`: um array **ou** outro, sem mistura
- União de funções torna os parâmetros uma interseção
- Prefira uma função que aceite a união nos parâmetros

## Modelagem de Estados

- Campos booleanos independentes permitem estados impossíveis
- União discriminada representa **só** os estados válidos
- `{ status: "loading" }` e `{ status: "failure"; error }` não se misturam
- Cada leitura dispensa reconferir a coerência

## Boas Práticas

- **Dê um discriminante** a toda união de objetos
- **Termine o `switch` com `never`** para garantir exaustividade
- **Modele estados por união**, não por combinação de flags
- **Verifique colisões de chave** antes de compor com `&`
