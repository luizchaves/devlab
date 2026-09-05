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
title: "TypeScript: Desenvolvimento com IA"
description: "Slides sobre escrever TypeScript com assistentes de código: contexto do projeto, pedidos com contrato, verificação com tsc e as armadilhas por tópico."

---


<!-- _class: lead -->

# TypeScript: Desenvolvimento com IA

Especificar, gerar, verificar e revisar.


---


## Objetivo

Estabelecer um ciclo de trabalho verificável:

- Especificar o **contrato** antes de gerar.
- Fornecer o contexto de projeto que o modelo não enxerga.
- Verificar com o compilador e os testes.
- Revisar procurando o que o `tsc` **não** pega.


---


## O Gargalo Se Desloca

- Sem assistente: escrever e entender custam o mesmo.
- Com assistente: escrever fica de graça, entender custa igual.

*O gargalo sai da produção e vai para a **revisão**.*


---


## Compila ≠ Está Correto

| O `tsc` pega | O `tsc` não pega |
| :--- | :--- |
| Argumento incompatível | Tipo que descreve mal o dado real |
| Propriedade inexistente | `as` que silencia a verificação |
| Retorno fora do contrato | Lógica de negócio invertida |
| Caso faltante em união | `any` implícito de biblioteca sem tipos |
| Nulo sem checagem | Efeito colateral não pedido |

*A coluna da direita é o trabalho humano.*


---


## O Que o Assistente Não Adivinha?

- **Rigor ativo**: `strict`, `noUncheckedIndexedAccess`.
- **Versão**: `satisfies` (5.0), `using` (5.2), predicados inferidos (5.5).
- **Resolução de módulos**: `nodenext`, `bundler`, `paths`.
- **Forma de execução**: `tsc`, `tsx`, `erasableSyntaxOnly`.
- **Convenção**: união literal ou `enum`, biblioteca de validação.

*Colar o `tsconfig.json` resolve a maior parte com uma mensagem.*


---


## Pedido Vago x Pedido com Contrato

```txt
Faz uma função pra buscar usuário na API.
```

```txt
Escreva `fetchUser(id: number): Promise<User>` em src/services/user.ts.

Sucesso:    resolve com User validado, não apenas asserido
Falha 404:  lança NotFoundError com "usuário 42 não encontrado"
Falha rede: propaga o erro original
Restrições: sem `as`, sem `any`, valide com Zod
Não mude:   a assinatura das outras funções do arquivo
```

*O segundo descreve o comportamento observável, não a implementação.*


---


## Regra Vira Configuração

- Instrução escrita **não** é garantia de execução.
- Modelos perdem instruções antigas conforme o diálogo cresce.

| Em vez de repetir no prompt | Configure |
| :--- | :--- |
| "Não use `any`" | `noImplicitAny` |
| "Cuidado com índice de array" | `noUncheckedIndexedAccess` |
| "Não use `as` em dado externo" | Regra de lint |

*O que o compilador cobra não depende da memória do modelo.*


---


## Verificação em 5 Passos

```bash
npx tsc --noEmit                  # 1. tipos
git diff | grep -nE '\bas [A-Z]|@ts-ignore|: any\b'   # 2. contornos
npx tsc --noEmit --noImplicitAny  # 3. any implícito
npm run lint && npm test          # 4. lint e testes
```

**5. Execute com dado FORA do formato esperado.**

*Só o passo 5 revela um tipo que mente sobre a realidade.*


---


## Armadilhas por Tópico (Parte 1)

| Tópico | Armadilha |
| :--- | :--- |
| Tipos Básicos | `any` como escape; `enum` onde união bastaria |
| Narrowing | `as` no lugar do estreitamento |
| Objetos | Campos redeclarados em vez de compostos |
| Uniões | União sem discriminante, forçando `as` |
| Generics | Genérico onde nada varia |


---


## Armadilhas por Tópico (Parte 2)

| Tópico | Armadilha |
| :--- | :--- |
| Utility Types | `DeepPartial` e `Mutable` como se fossem nativos |
| Classes | `private` tratado como privacidade de runtime |
| tsconfig | Opções copiadas, com `strict` desligado sem aviso |
| Módulos | `import` sem `type`, arrastando módulo ao runtime |
| Migração | Arquivo cheio de `any`, declarado "migrado" |
| Node.js | Corpo de requisição asserido, sem validação |


---


## Três Perguntas Antes do Merge

1. Você consegue **explicar por que cada tipo é aquele**?
2. Existe algum `as` que você **não pediu**?
3. Os testes **falham** se a lógica for removida?

*Desconforto em qualquer uma: peça a explicação antes da correção.*


---


## Os Limites do Modelo

| Limite | Como aparece em TypeScript |
| :--- | :--- |
| **Data de corte** | Anota predicado que o 5.5 já infere |
| **Contexto limitado** | Reinventa tipo que existe em outro arquivo |
| **Concordância** | Concorda com a sua afirmação errada e reescreve |

*A defesa contra os três é a mesma: verificar com o compilador, não com a conversa.*


---


## Segurança

- **Não cole segredo** na conversa: chave, token, `.env`.
- **Confira toda dependência sugerida**, inclusive `@types/*` que já não existem.
- **Trate esquema de validação como código de segurança**: campo a mais, tamanho não validado.


---


## Exercício

Conduza o ciclo completo em uma função sua:

1. Escreva o pedido com contrato declarado;
2. Gere o código com um assistente;
3. Rode os cinco passos de verificação;
4. Registre o que cada camada pegou, em `revisao.md`;
5. Classifique cada defeito na tabela "o que o `tsc` pega".


---

## Resumo (Parte 1)

- Informe **contexto de projeto** no início: versão, rigor, módulos, convenções.
- Peça o **contrato**, não a implementação.
- **Regra em configuração** vale mais que regra no prompt.

---

## Resumo (Parte 2)

- Verifique com `tsc --noEmit`, lint e testes.
- Execute com dado fora do formato: é o passo que falta em código gerado.
- Procure `as`, `@ts-ignore` e `any` implícito no diff.
