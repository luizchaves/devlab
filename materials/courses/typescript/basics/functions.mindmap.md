---
title: 'TypeScript: Funções'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# TypeScript: Funções

## Ideia Central

- Funções são a fronteira onde o contrato fica explícito
- Parâmetros sempre anotados; retorno quase sempre inferido

## Assinatura

- Parâmetro sem anotação vira `any` implícito (erro sob `strict`)
- Anote o retorno em funções exportadas e recursivas
- Anotar o retorno faz o erro aparecer **dentro** da função

## Parâmetros

### Opcional e padrão
- `title?: string` produz `string | undefined`
- Valor padrão mantém o tipo original e torna opcional na chamada
- Opcionais e com padrão vêm **depois** dos obrigatórios

### Quantidade variável
- `...values: number[]` agrupa o excedente em array
- Rest com tupla nomeada descreve posições específicas

### Restrições de passagem
- `/` marca os parâmetros somente-posicionais
- `*`... em TypeScript, use objeto de opções quando a ordem confundir

## Tipos de Função

- Sintaxe de arrow: `type Transformer = (value: string) => string`
- Assinatura de chamada em objeto permite propriedades extras
- `interface` também aceita assinatura de chamada e de construtor

## Tipagem Contextual

- O contexto informa o tipo dos parâmetros de callbacks
- `items.map((item) => …)` dispensa anotação
- É o que mantém código funcional livre de ruído

## Retornos Especiais

- **`void`**: o retorno não deve ser usado
- **`undefined`**: o valor devolvido é literalmente `undefined`
- **`never`**: a função nunca termina normalmente
- Callback `() => void` aceita função que devolve qualquer coisa

## Sobrecargas

- Declaram combinações válidas quando o retorno depende dos argumentos
- Só as assinaturas declaradas ficam visíveis para quem chama
- Verbosas e fáceis de dessincronizar: prefira união ou generic

## `this` Tipado

- O primeiro parâmetro pode declarar o tipo de `this`
- É apagado na compilação e não entra na chamada
- Arrow function não tem `this` próprio: herda do escopo léxico

## Boas Práticas

- **Anote parâmetros sempre**, retorno nas funções públicas
- **Objeto de opções** quando houver muitos parâmetros booleanos
- **Evite sobrecarga** se união ou generic expressarem o contrato
- **Prefira arrow** em métodos passados como callback
