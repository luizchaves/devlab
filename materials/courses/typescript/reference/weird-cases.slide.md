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
title: "TypeScript: Casos Bizarros"
description: "Comportamentos surpreendentes do sistema de tipos: tipagem estrutural, excess property checks, bivariância de métodos, readonly apagado, never e o abismo entre tipo e runtime."

---


<!-- _class: lead -->

# TypeScript: Casos "Bizarros"

O compilador parece errado. Quase sempre, ele não está.


---


## Objetivo

Entender os comportamentos contraintuitivos do sistema de tipos:

- Reconhecer de **onde** cada estranheza vem.
- Aplicar a alternativa correta em cada caso.
- Parar de recorrer a `as` e `@ts-ignore` quando o erro incomoda.


---


## Três Fontes de Estranheza

| Origem | Significa | Exemplo |
| :--- | :--- | :--- |
| **Tipagem estrutural** | Vale a forma, não o nome | Tipos sem relação se aceitam |
| **Apagamento** | Tipos somem antes de rodar | `readonly` não protege em runtime |
| **Compatibilidade com JS** | Verificar o legado exige concessões | Métodos são bivariantes |

*Praticamente tudo nesta página cabe em uma das três.*


---


## Tipos Sem Relação se Aceitam

```ts
interface Metros { valor: number }
interface Reais  { valor: number }

function distancia(m: Metros): number {
  return m.valor * 2;
}

const preco: Reais = { valor: 100 };
distancia(preco); // 200, e ninguém reclamou
```

*A comparação é pela **forma**, não pelo nome.*


---


## A Correção: Branded Types

```ts
type Metros = number & { readonly __marca: "metros" };
type Reais  = number & { readonly __marca: "reais" };

const preco = 100 as Reais;
// const d: Metros = preco;  // agora é erro
```

- Dar formas de fato diferentes devolve a distinção.
- Estrutural não é defeito: é o que permite tipar bibliotecas JS existentes.


---


## Literal é Verificado, Variável Não

```ts
interface Config { host: string }

// const a: Config = { host: "x", porta: 3000 };  // ERRO

const bruto = { host: "x", porta: 3000 };
const b: Config = bruto;  // compila
```

- *Excess property check* só vale para o **literal atribuído direto**.
- Existe para pegar erro de digitação, onde o extra quase sempre é engano.
- Para barrar também na variável: `satisfies` na origem.


---


## `any` Desliga Tudo em Silêncio

```ts
const dados: any = JSON.parse('{"nome":"Ana"}');

const nome: number = dados.nome;  // sem erro
nome.toFixed(2);                  // sem erro; explode em runtime
dados.metodoQueNaoExiste();       // sem erro
```

*O `any` mais perigoso é o que você não escreveu: `JSON.parse`, `catch` e biblioteca sem tipos.*


---


## Método é Bivariante, Propriedade Não

```ts
interface ComMetodo {
  ao(evento: Event): void;      // NÃO verificado
}
interface ComPropriedade {
  ao: (evento: Event) => void;  // verificado
}

const a: ComMetodo = { ao: (e: MouseEvent) => e.clientX };  // compila
```

*A sintaxe do membro muda a verificação. Declare como propriedade de função.*


---


## `readonly` Não Existe em Runtime

```ts
interface Ponto { readonly x: number }

const p: Ponto = { x: 1 };
// p.x = 2;  // erro de compilação

const solto = p as { x: number };
solto.x = 2;

console.log(p.x); // 2
```

*Para imutabilidade real, `Object.freeze()`. O `readonly` documenta a intenção.*


---


## `never` Absorve a União

```ts
type A = string | never;   // string
type B = never[];          // array sem elementos possíveis

const lista = [];          // never[]
// lista.push(1);          // erro difícil de ler
```

*Usado de propósito, é a prova de exaustividade em `switch`.*


---


## Condicional Distribui

```ts
type EhString<T> = T extends string ? "sim" : "nao";
type A = EhString<string | number>;        // "sim" | "nao"

type Estrito<T> = [T] extends [string] ? "sim" : "nao";
type B = Estrito<string | number>;         // "nao"
```

- Parâmetro **nu** percorre a união membro a membro.
- Envolver em tupla desliga a distribuição.
- É a distributividade que faz `Exclude` funcionar.


---


## `Omit` Não Valida a Chave

```ts
interface User { id: number; email: string }

// type A = Pick<User, "emial">;  // ERRO
type B = Omit<User, "emial">;     // compila; devolve User inteiro
```

*`Pick` verifica, `Omit` não. O erro de digitação passa em silêncio.*


---


## Enum Numérico Tem o Dobro de Chaves

```ts
enum Nivel { Info, Erro }

Object.keys(Nivel);
// ["0", "1", "Info", "Erro"]
```

- Mapeamento reverso: valor aponta de volta para a chave.
- `enum` de string não tem esse comportamento.
- União literal com `as const` evita o problema sem emitir código.


---


## O Tipo Mente Sobre o Dado Externo

```ts
const user = (await resposta.json()) as User;

user.name.toUpperCase();
// TypeError se o servidor devolveu { "nome": "Ana" }
```

*`json()` devolve `any`; a asserção só troca o rótulo.*


---


## A Correção: Validar na Fronteira

```ts
import { z } from "zod";

const UserSchema = z.object({ name: z.string() });
const user = UserSchema.parse(await resposta.json());
```

- Tipo é **expectativa**; validação é **garantia**.
- Suspeitos: API, corpo de requisição, env, arquivo, `localStorage`, rota.


---


## Exercício

Reúna os casos em `armadilhas.ts`:

1. Colisão estrutural e a correção com *branded types*;
2. Método contra propriedade de função, sob `strictFunctionTypes`;
3. Prova de que `readonly` não impede mutação em runtime;
4. Condicional distributiva e a versão com tupla;
5. O erro de digitação que `Omit` deixa passar.

*Em cada item, diga a qual das três origens o caso pertence.*


---

## Resumo (Parte 1)

- Tipagem **estrutural**: a forma manda, não o nome.
- *Excess property check* só alcança o literal atribuído direto.
- `any` propaga e apaga os erros seguintes; `unknown` obriga a verificar.

---

## Resumo (Parte 2)

- Método é bivariante; propriedade de função é verificada.
- `readonly` e os modificadores de acesso são **apagáveis**.
- Condicional distribui sobre união, a menos que envolvida em tupla.
- Asserção sobre dado externo não garante nada: valide na fronteira.
