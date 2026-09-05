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
title: "TypeScript: Comparativo com JavaScript"
description: "Slides do comparativo entre TypeScript e JavaScript: superset, tipagem estática e dinâmica, o que o compilador detecta, o que continua sendo runtime e quando usar cada um."

---


<!-- _class: lead -->

# TypeScript: Comparativo com JavaScript

O que muda, o que continua igual e quando cada linguagem compensa.


---


## Objetivo

Situar as duas linguagens uma em relação à outra:

- Explicar por que TypeScript é chamado de **superset**.
- Identificar os erros que o compilador detecta **antes** da execução.
- Reconhecer o que continua sendo responsabilidade do **runtime**.
- Decidir quando manter um projeto em JavaScript puro.


---


## Superset: o Caminho do Código

```
arquivo .js              também é aceito
JavaScript comum   -->   como TypeScript
                              |
                              v
                         arquivo .ts
                          JS + tipos
                              |
                         tsc / bundler
                              |
                              v
                         arquivo .js          runtime
                       tipos removidos  -->   navegador ou servidor
```

*O runtime nunca vê um tipo: ele executa o JavaScript gerado.*


---


## Onde Cada Uma Vive?

| Aspecto | JavaScript | TypeScript |
| :--- | :--- | :--- |
| Padrão | ECMAScript | Criada sobre o JavaScript |
| Arquivos | `.js`, `.mjs`, `.cjs` | `.ts`, `.tsx` (e analisa `.js`) |
| Tipagem | Dinâmica, no runtime | Estática no dev, dinâmica no runtime |
| Execução | Direta | Precisa ser transformada |
| Saída final | O próprio código | JavaScript com tipos apagados |


---


## O Mesmo Erro, Duas Fases

```js
// JavaScript: erro percebido ao executar
function total(price, quantity) {
  return price * quantity;
}

console.log(total("R$ 10", 3)); // NaN
```

```ts
// TypeScript: erro percebido no editor
function total(price: number, quantity: number): number {
  return price * quantity;
}

// total("R$ 10", 3);  // string onde number é esperado
```

*A assinatura transforma a intenção em contrato verificável.*


---


## O Que TypeScript Detecta?

| Situação | JavaScript | TypeScript |
| :--- | :--- | :--- |
| Nome de propriedade errado | Vira `undefined` | Erro de compilação |
| Argumento do tipo errado | Só na execução | Erro antes de rodar |
| Retorno incompatível | Quebra quem chama | Erro na função ou na chamada |
| Campo opcional sem checagem | `Cannot read properties…` | Exige a checagem |
| JSON vindo de API | Dado externo não confiável | **Continua** não confiável |


---


## Contrato de Objeto

```ts
type User = {
  id: number;
  name: string;
  email?: string;
};

function label(user: User): string {
  return user.email ? `${user.name} <${user.email}>` : user.name;
}

label({ id: 1, name: "Ana" });     // Ana
// label({ id: 1, nome: "Ana" });  // erro: a propriedade é name
```

*O campo opcional obriga a checagem antes do uso.*


---


## Tipo Não É Validação

O compilador acredita no que você afirma sobre dados externos:

```ts
// O servidor devolve { "nome": "Ana" }
const user = await response.json() as User;

user.name;  // undefined em runtime, sem nenhum erro de compilação
```

- O tipo descreve uma **expectativa**, não uma garantia.
- Dado de rede, formulário e arquivo precisam de validação real.


---


## O Que Continua Igual?

```ts
const result = 0.1 + 0.2;
console.log(result);          // 0.30000000000000004
console.log(result === 0.3);  // false

const value = Number.NaN;
console.log(value === value); // false
```

- Coerção, protótipos, closures, `this`, event loop, Promises.
- Quando algo quebra em produção, quem executa é o **JavaScript**.


---


## Quando Usar Cada Um?

| Cenário | Escolha comum | Motivo |
| :--- | :--- | :--- |
| Script curto de automação | JavaScript | Menos configuração |
| Página com poucas interações | JavaScript | Setup custa mais que o ganho |
| Aplicação React, Vue ou Angular | TypeScript | Props e componentes ganham muito |
| API com regras de negócio | TypeScript | Contratos entre camadas |
| Biblioteca publicada | TypeScript | Os tipos documentam a API |
| Sistema legado | TypeScript incremental | Arquivo a arquivo |


---


## Executando

```bash
node comparison.js
```

```txt
19.90
TypeError: value.toFixed is not a function
```

```bash
npx tsc comparison.ts --noEmit
```

*O mesmo defeito: no primeiro fluxo ele aparece em produção, no segundo antes de rodar.*


---


## Exercício

Escreva o mesmo módulo nas duas linguagens:

1. `formatPrice(value)` em `.js` e em `.ts`;
2. Chame as duas versões com um número e com uma string;
3. Registre **em que momento** cada erro apareceu;
4. Explique qual dos dois erros chegaria ao usuário final.


---

## Solução do Exercício

```ts
function formatPrice(value: number): string {
  return value.toFixed(2);
}

// formatPrice("19.9");
// Argument of type 'string' is not assignable to parameter of type 'number'.
```

- Em JavaScript o erro é um `TypeError` em runtime, com o usuário na frente.
- Em TypeScript é um diagnóstico no editor, antes do commit.


---

## Resumo (Parte 1)

- **Superset**: todo JavaScript válido é TypeScript válido.
- Os tipos são apagados: o runtime executa JavaScript comum.
- O compilador pega contrato quebrado, não dado externo inválido.

---

## Resumo (Parte 2)

- Coerção, `NaN`, ponto flutuante e `this` continuam iguais.
- Aprender JavaScript continua obrigatório.
- Projeto pequeno pode ficar em JS; domínio rico e vida longa pedem TS.
