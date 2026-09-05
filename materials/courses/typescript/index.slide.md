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
title: "Guia de TypeScript"
description: "Guia de referência do TypeScript: tipos, inferência, narrowing, interfaces, generics, utility types, configuração do compilador, React, Node.js e migração de JavaScript."

---


<!-- _class: lead -->

# Guia de TypeScript

Da primeira anotação de tipo à manipulação avançada, com o compilador cobrando os contratos.


---


## Objetivo

Percorrer o TypeScript de forma progressiva:

- Entender o que o compilador **acrescenta** ao JavaScript.
- Anotar e inferir com precisão, sem ruído.
- Modelar o domínio com objetos, uniões e generics.
- Configurar o projeto e executar o código.
- Aplicar no back-end, no front-end e em base legada.


---


## O Que é TypeScript?

- **Superset** do JavaScript: todo JS válido é TS válido.
- Acrescenta um sistema de tipos que existe **só no desenvolvimento**.
- O compilador verifica, aponta o erro e depois **apaga** os tipos.

*Nada de tipos sobra em produção: o runtime executa JavaScript comum.*


---


## Seis Trilhas

| Trilha | Cobre |
| :--- | :--- |
| **Fundamentos** | Compilador, anotações, inferência, funções, narrowing |
| **Sistema de Tipos** | Objetos, interfaces, uniões, generics |
| **Tipos Avançados** | Utility types, mapeados, condicionais, classes |
| **Ferramentas** | `tsconfig.json`, módulos, execução e build |
| **Na Prática** | Migração, Node.js, React |
| **Referência Rápida** | Versões, comparativo, armadilhas, IA, assinaturas |


---


## Fundamentos

- **Introdução**: o compilador, o apagamento de tipos, o primeiro projeto.
- **Tipos Básicos**: primitivos, arrays, tuplas, `any`, `unknown`, `never`.
- **Funções**: parâmetros opcionais, sobrecargas, `this` tipado.
- **Narrowing**: análise de fluxo, `typeof`, `in`, *type predicates*.

*Regra que atravessa a trilha: anote nas fronteiras, deixe inferir no meio.*


---


## Sistema de Tipos

- **Objetos e Interfaces**: `interface` ou `type`, modificadores, composição.
- **Uniões e Interseções**: literais, uniões discriminadas, exaustividade.
- **Generics**: parâmetros de tipo, restrições, inferência.

*É aqui que o domínio da aplicação é descrito.*


---


## Tipos Avançados

- **Utility Types**: `Partial`, `Pick`, `Omit`, `Record`, `ReturnType`.
- **Manipulação de Tipos**: mapeados, condicionais, `infer`, template literals.
- **Classes**: modificadores, `implements`, abstratas, `#campo`.

*Poder que vicia: cada página tem uma seção sobre quando parar.*


---


## Ferramentas e Prática

| Página | Responde |
| :--- | :--- |
| `tsconfig.json` | Quanto rigor o projeto exige? |
| Módulos e Declarações | Como o compilador acha e descreve módulos? |
| Execução e Build | Quem executa e quem verifica? |
| Migrando de JavaScript | Como converter sem migração de fachada? |
| TypeScript no Node.js | Como tipar uma API de ponta a ponta? |
| TypeScript no React | Como tipar props, hooks e contexto? |


---


## Referência Rápida

- **Evolução e Versões**: da 1.0 ao compilador nativo em Go do 7.0.
- **Comparativo com JavaScript**: o que muda e o que continua igual.
- **Casos "Bizarros"**: as surpresas do sistema de tipos, e por que existem.
- **Desenvolvimento com IA**: especificar, gerar, verificar e revisar.
- **Guia de Referência**: assinaturas para conferência rápida.


---


## Quem Executa e Quem Verifica?

| Ambiente | Executa `.ts`? | Verifica os tipos? |
| :--- | :--- | :--- |
| `tsc` | Não executa | **Sim** |
| Navegador | Não | Não |
| Node.js 22+ | Sim, removendo tipos | Não |
| Deno | Sim | **Sim** |
| Bun | Sim | Não |
| `tsx` e empacotadores | Sim | Não |

*Executar é rápido porque quase ninguém verifica. `tsc --noEmit` vai no CI.*


---


## Ferramentas de Prática

| Categoria | Ferramenta |
| :--- | :--- |
| Compilador | TypeScript |
| Editor | Visual Studio Code |
| Execução direta | `tsx` |
| Empacotamento | Vite, esbuild |
| Tipos de terceiros | DefinitelyTyped (`@types/*`) |
| Validação em execução | Zod |
| Playground | TS Playground |

*O Playground mostra código, JavaScript gerado e erros lado a lado, sem instalar nada.*


---


## Versão de Referência

- O guia usa a série **TypeScript 5.x**.
- Recursos com versão mínima ficam sinalizados: `satisfies` (5.0), `using` (5.2).
- Sob o **6.0**, `strict` já vem ligado e vários padrões mudam.

```bash
npx tsc --version
```


---

## Resumo (Parte 1)

- TypeScript é um superset: acrescenta verificação, não muda o runtime.
- A trilha vai de anotações a tipos manipulados, e depois ao projeto.
- Anote as fronteiras; a inferência resolve o meio.

---

## Resumo (Parte 2)

- Todo dado externo entra como `unknown` e sai validado.
- Executar e verificar são passos diferentes: `tsc --noEmit` no CI.
- A trilha de referência existe para consulta, não para leitura linear.
