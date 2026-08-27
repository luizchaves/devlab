---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "TypeScript: Introdução"
description: "Slides da aula de introdução ao TypeScript: superset, compilador, apagamento de tipos, instalação, tsconfig e ecossistema."

---


<!-- _class: lead -->

# TypeScript: Introdução

Superset do JavaScript, papel do compilador, apagamento de tipos, primeiro projeto e ecossistema.


---


## Objetivo

Estabelecer o modelo mental antes da sintaxe:

- Entender a relação entre **TypeScript** e **JavaScript**.
- Descrever o papel do compilador e o **apagamento de tipos**.
- Reconhecer o que a verificação estática **não** protege.
- Instalar o TypeScript e configurar o `tsconfig.json` mínimo.
- Conhecer o ecossistema de tipos (`@types`, DefinitelyTyped).


---


## O Que É TypeScript

| Afirmação | Consequência |
| --- | --- |
| **Superset** | Todo `.js` válido é `.ts` válido — migração incremental |
| **Tipado** | O compilador verifica o uso antes de executar |
| **Compila para JS** | O runtime continua sendo JavaScript |

Criado pela Microsoft em 2012. Quem sabe JavaScript já sabe 90% de TypeScript.


---

## O Mesmo Código, Com e Sem Tipos (Parte 1)

```ts
// JavaScript: erro só aparece ao executar
function greet(user) {
  return `Olá, ${user.name}`;
}

// TypeScript: erro aparece no editor
interface User { name: string; age: number }

```

---

## O Mesmo Código, Com e Sem Tipos (Parte 2)

```ts
function greetTyped(user: User): string {
  return `Olá, ${user.name}`;
}

// greetTyped({ nome: "Ana" });
// error TS2353: 'nome' does not exist in type 'User'
```

---


## Apagamento de Tipos

```txt
app.ts ──▶ tsc ──┬──▶ verificação (erros no editor e na CI)
                 └──▶ emissão (tipos apagados) ──▶ app.js ──▶ Node / navegador
```

- `interface` e `type` **desaparecem** por completo.
- Custo zero em tempo de execução.
- E, pela mesma razão, nenhuma validação de dados externos.


---


## O Que Ele Detecta

| Detecta | **Não** detecta |
| --- | --- |
| Propriedade com nome errado | `null` vindo de uma API |
| Argumento de tipo incompatível | Erro de lógica |
| Retorno incompatível | Falha de rede ou disco |
| Variável possivelmente indefinida | Condição de corrida |

*O compilador acredita no que você afirma: `as Tipo` não verifica nada.*


---


## Instalando

```bash
pnpm add -D typescript @types/node
pnpm exec tsc --version
pnpm exec tsc --init
```

- Sempre **por projeto**, nunca global.
- Assim cada projeto fixa a própria versão, e editor, terminal e CI concordam.


---

## tsconfig.json Mínimo (Parte 1)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
```

---

## tsconfig.json Mínimo (Parte 2)

```json
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

---


## `strict` Não É Opcional

- Sem ele, o compilador aceita `null` em qualquer lugar.
- E infere `any` silenciosamente — removendo a proteção que motivou adotar TS.
- Em projeto novo: ligue desde o primeiro dia.
- Em migração: ligue por etapas.


---


## Ecossistema de Tipos

```bash
pnpm add express
pnpm add -D @types/express @types/node
```

| Situação | O que fazer |
| --- | --- |
| A biblioteca inclui tipos | Nada |
| Existe `@types/nome` | Instale como dev dependency |
| Não existe tipo algum | Declare em um `.d.ts` |


---


## O Que Sobrevive à Compilação

```ts
interface Point { x: number }   // apagado
type Label = "a" | "b";         // apagado
enum Status { Active }          // vira objeto JS
class Marker {}                 // vira classe JS
```

- `interface` e `type` só existem para o compilador.
- `enum` e `class` geram código real.


---


## Executando

```bash
pnpm exec tsc            # verifica e emite
pnpm exec tsc --noEmit   # só verifica (usado na CI)
pnpm exec tsc --watch    # verifica continuamente
node dist/main.js
```


---


## Exercício

Monte o projeto `agenda-ts/`:

1. Inicialize e instale `typescript` e `@types/node`;
2. Configure `strict`, `rootDir` e `outDir`;
3. Crie `Contact` com `name`, `email` e `phone?`;
4. Escreva `format(contact: Contact): string` alinhando as colunas;
5. Rode `tsc --noEmit`, compile e execute.


---

## Solução do Exercício (Parte 1)

```ts
interface Contact {
  name: string;
  email: string;
  phone?: string;
}

```

---

## Solução do Exercício (Parte 2)

```ts
function format(contact: Contact): string {
  const phone = contact.phone ?? "-";
  return `${contact.name.padEnd(14)}${contact.email.padEnd(22)}${phone}`;
}

contacts.forEach((contact) => console.log(format(contact)));
```

---

## Resumo da Aula (Parte 1)

- TypeScript é **superset tipado** do JavaScript, compilado para JavaScript comum.
- Os tipos são **apagados** na emissão: custo zero em runtime, e nenhuma validação de entrada.
- Ele detecta erros de contrato, não erros de lógica nem falhas de execução.

---

## Resumo da Aula (Parte 2)

- Instale **por projeto** e ligue `strict` desde o início.
- `interface` e `type` desaparecem; `enum` e `class` geram código.
- `tsc --noEmit` é o comando de verificação usado na CI.