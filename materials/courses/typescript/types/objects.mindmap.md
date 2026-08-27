---
title: 'TypeScript: Objetos e Interfaces'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# TypeScript: Objetos e Interfaces

## Ideia Central

- `interface` e `type` descrevem a forma dos dados do domínio
- A compatibilidade é **estrutural**: quem tem a forma é aceito

## interface x type

### Só interface
- *Declaration merging*: declarações com o mesmo nome se fundem
- Permite estender tipos de bibliotecas de terceiros

### Só type
- Uniões, tuplas e primitivos
- Tipos mapeados e condicionais
- Genéricos com união

### Regra prática
- `interface` para objetos e contratos públicos
- `type` para o resto — e seja consistente

## Modificadores

- `campo?`: opcional, tipo inclui `undefined`
- `readonly campo`: impede reatribuição — mas é **raso**
- `[chave: string]: T`: index signature para chaves dinâmicas
- `readonly T[]` protege o conteúdo do array

## Extensão e Composição

- `interface B extends A` acrescenta campos
- `type B = A & { … }` funde por interseção
- Interface pode estender várias de uma vez
- Chaves conflitantes na interseção produzem `never`

## Tipagem Estrutural

- Compatibilidade pela forma, não pelo nome
- Não é preciso declarar `implements` para ser aceito
- Classes também são comparadas estruturalmente
- Propriedades extras não atrapalham — com uma exceção

## Excess Property Checks

- Literais "frescos" recebem verificação extra
- Objetivo: pegar erro de digitação em opções
- Variável já tipada passa só pela compatibilidade estrutural
- Para aceitar extras: index signature, variável intermediária ou `as`

## Reaproveitando Partes

- `keyof T` devolve a união das chaves
- `T["campo"]` devolve o tipo daquela propriedade
- `Partial`, `Omit` e `Pick` derivam projeções sem duplicar
- Uma fonte da verdade evita tipos fora de sincronia

## Boas Práticas

- **Nomeie os tipos do domínio**: evite objetos inline repetidos
- **`readonly` no que não deve mudar**, ciente de que é raso
- **Derive em vez de declarar** variações do mesmo dado
- **Deixe o compilador reclamar do literal**: ele está pegando digitação errada
