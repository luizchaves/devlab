---
marp: true
theme: default
paginate: true
style: |
  section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 70px;
    font-size: 1.5rem;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    position: absolute;
    bottom: 24px;
    right: 32px;
    padding: 0;
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "TypeScript no React"
description: "Slides de TypeScript aplicado ao React: props tipadas, children, useState, useReducer com união discriminada, useRef, eventos, contexto e componentes genéricos."

---


<!-- _class: lead -->

# TypeScript no React

O componente é uma função com contrato. Tipar o contrato é tudo.


---


## Objetivo

Tipar uma aplicação React com precisão:

- **Props** como contrato de entrada.
- `useState` e `useReducer` tipados.
- `useRef`, eventos e **contexto sem asserção**.
- Componentes **genéricos**.
- Validar o dado externo antes que ele vire prop.

*Fundamentos de React ficam no Guia de React.*


---


## O Componente Tipado

```tsx
type SaudacaoProps = {
  nome: string;
  destaque?: boolean;
};

function Saudacao({ nome, destaque = false }: SaudacaoProps) {
  return <h1 className={destaque ? "destaque" : ""}>Olá, {nome}</h1>;
}

// <Saudacao />            // erro: falta 'nome'
// <Saudacao nome={42} />  // erro: number onde string é esperado
```

*O retorno não precisa de anotação. `React.FC` caiu em desuso.*


---


## `children` e o Conteúdo

```tsx
import type { ReactNode } from "react";

type CartaoProps = { titulo: string; children: ReactNode };
```

| Tipo | Aceita | Quando usar |
| :--- | :--- | :--- |
| `ReactNode` | Elemento, texto, número, array, `null` | Padrão |
| `ReactElement` | Só um elemento JSX | Quando inspeciona o filho |
| `ComponentType<P>` | O componente, não o resultado | Prop que recebe componente |


---


## `useState`: Inferir ou Anotar?

```tsx
const [nome, setNome] = useState("");                 // inferido
const [itens, setItens] = useState<string[]>([]);     // senão, never[]
const [user, setUser] = useState<User | null>(null);  // inicial não revela
```

*Regra: anote quando o valor inicial **não representa o tipo completo**.*


---


## `useReducer` com União de Ações

```tsx
type Acao =
  | { type: "carregar" }
  | { type: "sucesso"; itens: string[] }
  | { type: "erro"; mensagem: string };

switch (acao.type) {
  case "sucesso": return { itens: acao.itens, carregando: false };
  default: {
    const exaustivo: never = acao;   // falha ao surgir ação nova
    return exaustivo;
  }
}
```

*Em cada `case`, só os campos daquele ramo existem.*


---


## Estado: Flags x União

```tsx
// Antes: combinações impossíveis compilam
type Estado = { carregando: boolean; erro: string | null; dados: User | null };

// Depois: só os estados reais existem
type Estado =
  | { status: "ocioso" }
  | { status: "carregando" }
  | { status: "erro"; mensagem: string }
  | { status: "pronto"; dados: User };
```

*O compilador só libera `estado.dados` no ramo em que ele existe.*


---


## `useRef`: Duas Assinaturas

```tsx
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();      // current é somente leitura

const contador = useRef<number>(0);
contador.current += 1;          // current é gravável
```

- Inicial `null`: o React preenche, `current` fica somente leitura.
- Qualquer outro inicial: `current` é gravável.
- O `?.` não é opcional: `current` é `null` na primeira renderização.


---


## Eventos

```tsx
import type { ChangeEvent, FormEvent, MouseEvent } from "react";

function aoDigitar(e: ChangeEvent<HTMLInputElement>) {
  console.log(e.target.value);  // string, sem asserção
}
```

- No JSX, a **tipagem contextual** dispensa a anotação.
- `currentTarget`: quem registrou o manipulador, tipado com precisão.
- `target`: onde o evento nasceu, tipo mais largo.


---


## Contexto Sem Asserção

```tsx
const SessaoContext = createContext<Sessao | undefined>(undefined);

function useSessao(): Sessao {
  const valor = useContext(SessaoContext);

  if (valor === undefined) {
    throw new Error("useSessao precisa estar dentro de <SessaoProvider>");
  }

  return valor; // Sessao, já estreitado
}
```

*O `throw` remove `undefined` do tipo E dá a mensagem certa a quem erra.*


---


## Componentes Genéricos

```tsx
type ListaProps<T> = {
  itens: T[];
  chave: (item: T) => string;
  render: (item: T) => ReactNode;
};

function Lista<T>({ itens, chave, render }: ListaProps<T>) { /* ... */ }
```

- `T` é inferido de `itens`; `item` chega tipado nos dois callbacks.
- Em `.tsx`, arrow genérica precisa de `<T,>` com vírgula.


---


## A Fronteira Entre o Tipo e o Dado Real

```tsx
// Compila e quebra na renderização
.then((dado) => setUser(dado as User));

// Valida antes de entrar no estado
const UserSchema = z.object({ id: z.number(), name: z.string() });
type User = z.infer<typeof UserSchema>;

.then((dado) => setUser(UserSchema.parse(dado)));
```

*`z.infer` elimina a duplicação: uma única definição, e é a que roda.*


---


## Exercício

Construa `<TabelaUsuarios>`:

1. `User` derivado de um esquema de validação;
2. Estado como união discriminada com quatro status;
3. `useReducer` com união de ações e prova de exaustividade;
4. Busca em `useEffect`, validando antes do estado, **sem `as`**;
5. Cada status renderizado em seu próprio ramo.


---

## Resumo (Parte 1)

- Anote o parâmetro do componente; esqueça `React.FC`.
- `ReactNode` é o tipo padrão de `children`.
- Anote `useState` quando o valor inicial não revela o tipo final.
- União discriminada elimina estados impossíveis.

---

## Resumo (Parte 2)

- `useRef` muda de assinatura conforme o valor inicial.
- No JSX, a tipagem contextual dispensa anotar o evento.
- Contexto com `undefined` e hook que lança dispensa `as`.
- Valide na fronteira: o tipo é expectativa, não garantia.
