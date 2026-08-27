---
title: 'TypeScript: Utility Types'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# TypeScript: Utility Types

## Ideia Central

- Derivam tipos a partir de outros: uma fonte da verdade, várias projeções
- São escritos em TypeScript, com recursos que você também pode usar

## Objeto

- **`Partial<T>`**: todas as propriedades opcionais
- **`Required<T>`**: todas obrigatórias
- **`Readonly<T>`**: todas somente leitura
- **`Pick<T, K>`**: só as chaves listadas
- **`Omit<T, K>`**: todas menos as listadas
- **`Record<K, V>`**: objeto com chaves `K` e valores `V`

## Pick x Omit

- `Omit` envelhece melhor: campos novos entram automaticamente
- `Pick` exige lembrar de atualizar a lista
- Para "tudo menos a senha", `Omit` comunica melhor a intenção

## Record

- Exige **todas** as chaves quando `K` é uma união literal
- Dá exaustividade a mapas de configuração
- `Record<string, V>` descreve dicionário de chaves livres
- Combine com `Partial` quando nem toda chave for obrigatória

## União

- **`Exclude<T, U>`**: remove de `T` os membros atribuíveis a `U`
- **`Extract<T, U>`**: mantém apenas esses membros
- **`NonNullable<T>`**: remove `null` e `undefined`

## Função e Promise

- **`ReturnType<F>`**: o tipo devolvido
- **`Parameters<F>`**: tupla dos parâmetros
- **`ConstructorParameters<C>`** e **`InstanceType<C>`**
- **`Awaited<T>`**: o tipo resolvido de uma `Promise`
- Usam `typeof` do espaço de tipos sobre um valor existente

## String

- `Uppercase`, `Lowercase`, `Capitalize`, `Uncapitalize`
- Combinam com template literal types
- Geram nomes derivados: `` `on${Capitalize<Event>}` ``

## Composição

- `Omit<T, "id" | "createdAt">` para entrada de criação
- `Partial<Omit<T, …>>` para atualização
- `Omit<T, K> & Partial<Pick<T, K>>` torna algumas chaves opcionais
- Acima de dois ou três níveis, nomeie o tipo intermediário

## Boas Práticas

- **Derive em vez de declarar** cada variação do mesmo dado
- **Prefira `Omit`** quando o tipo de origem tende a crescer
- **Use `Record<Uniao, V>`** para mapas que precisam ser exaustivos
- **Pare quando ficar ilegível**: mensagens de erro pioram junto
