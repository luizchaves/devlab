---
title: 'TypeScript no React'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# TypeScript no React

## Ideia Central

- O componente é uma função com **contrato de entrada** (props)
- Tipar o contrato transforma tela em branco em erro de compilação
- Fundamentos de React são assunto do Guia de React

## Props

- Declarar um `type` e anotar o parâmetro do componente
- Retorno não precisa de anotação: o JSX é inferido
- Opcional leva `?` no tipo **e** valor padrão na desestruturação
- `React.FC<Props>` caiu em desuso: `children` implícito e atrito com genéricos

## children

- `ReactNode`: elementos, texto, número, array, `null` — padrão para `children`
- `ReactElement`: só um elemento JSX, recusa texto puro
- `ComponentType<P>`: prop que recebe o componente, não o resultado
- `children?: ReactNode` quando o conteúdo é dispensável

## useState

### Quando inferir?
- Valor inicial que já representa o tipo final (`useState("")`)

### Quando anotar?
- Array vazio, que seria `never[]`
- `null` inicial, que não revela o tipo futuro
- Regra: anote quando o inicial **não representa o tipo completo**

## useReducer

- União discriminada de ações, com `type` literal em cada membro
- Dentro de cada `case`, só os campos daquele ramo existem
- `default` com `const exaustivo: never = acao` prova a exaustividade
- Ação nova sem tratamento quebra a compilação

## Estado como União

- Objeto de booleanos permite combinações impossíveis
- União discriminada por `status` representa só os estados reais
- A renderização dispensa checagens defensivas em cascata
- O compilador libera `dados` apenas no ramo `"pronto"`

## useRef

- `useRef<HTMLInputElement>(null)`: o React preenche, `current` é somente leitura
- `useRef(0)`: valor mutável entre renderizações, `current` é gravável
- `current` é `null` na primeira renderização: o `?.` é obrigatório
- Não dispara nova renderização ao mudar

## Eventos

- `ChangeEvent<HTMLInputElement>`, `FormEvent<HTMLFormElement>`, `MouseEvent`
- No JSX, a **tipagem contextual** deduz o tipo: anotar ali é ruído
- `currentTarget`: quem registrou o manipulador, tipado com precisão
- `target`: onde o evento nasceu, tipo mais largo

## Contexto

- `createContext<Sessao | undefined>(undefined)` evita o `as`
- Hook próprio que lança quando o valor é `undefined`
- O `throw` estreita o tipo de retorno e dá a mensagem certa
- Componentes consumidores não precisam checar nada

## Componentes Genéricos

- `<T>` preserva o tipo do item entre prop e callbacks
- Sem genérico, o item chegaria como `unknown` ou `any`
- Em `.tsx`, arrow genérica precisa de `<T,>` com vírgula
- Declaração com `function` não tem essa ambiguidade

## Validação na Fronteira

- `response.json()` devolve `any`; `as User` só troca o rótulo
- Validar antes de colocar no estado faz tipo e dado concordarem
- `z.infer<typeof Schema>` elimina a duplicação da definição
- Toda entrada externa é suspeita: API, rota, formulário, armazenamento

## Boas Práticas

- **Anote as props**, deixe o retorno inferir
- **Modele estado como união**, não como conjunto de flags
- **Nunca `as`** em dado que veio da rede
- **Prove a exaustividade** com `never` em todo redutor
