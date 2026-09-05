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
title: "JavaScript: Date e Manipulação de Datas"
description: "Slides completos do tópico JavaScript: Date e Manipulação de Datas."
---

<!-- _class: lead -->

# JavaScript: Date e Manipulação de Datas

Instanciação do objeto Date, timestamps, fusos horários e o padrão ISO 8601, manipulação de componentes de data e formatação com Intl.DateTimeFormat em JavaScript.

---

## Objetivo

Dominar a representação e a manipulação de datas e horários em JavaScript:

- Instanciar datas com timestamps, strings ISO 8601 e componentes de calendário
- Identificar e contornar armadilhas de fusos horários e indexação base zero dos meses
- Extrair e modificar componentes de calendário e horário tanto no fuso local quanto em UTC
- Realizar cálculos de intervalos e diferenças com coerção numérica e validação segura
- Formatar datas completas, intervalos e tempo relativo com a API `Intl`
- Comparar bibliotecas do ecossistema com os tipos imutáveis da nova API `Temporal`

---

## Mapa do Tópico

- O Objeto Date e o Conceito de Timestamp
- Fusos Horários e o Padrão ISO 8601
- Métodos de Leitura e Alteração de Componentes
- Cálculo de Diferenças, Coerção e Validação
- A Nova API Temporal (TC39)
- Formatação com a API Intl
- Bibliotecas do Ecossistema
- Resumo e Boas Práticas

---

## O Objeto Date e o Unix Timestamp

- O objeto `Date` representa um único momento no tempo
- Internamente, armazena um número inteiro de 64 bits em ponto flutuante
- Contabiliza os milissegundos decorridos desde **1º de janeiro de 1970 00:00:00 UTC** (*Unix Epoch*)
- Todas as operações aritméticas e métodos operam com base nesse timestamp bruto

---

## Formas de Instanciação do Objeto Date

| Forma de Construtor | Descrição | Exemplo |
| ------------------- | --------- | ------- |
| `new Date()` | Data e hora do instante exato de execução | `new Date()` |
| `new Date(timestamp)` | Instancia a partir de milissegundos Epoch | `new Date(1700000000000)` |
| `new Date(isoString)` | Análise de string no padrão ISO 8601 | `new Date("2026-08-22T09:30:00Z")` |
| `new Date(ano, mês, dia, ...)` | Componentes numéricos (mês base zero) | `new Date(2026, 7, 22)` // Agosto |

---

## Instanciação na Prática

```js
// 1. Momento presente
const now = new Date();

// 2. Timestamp atual numérico (sem instanciar objeto)
const timestamp = Date.now(); // Ex: 1787304600000

// 3. String ISO 8601 com fuso UTC
const specificDate = new Date("2026-08-22T14:30:00.000Z");

// 4. Componentes numéricos (Atenção: mês 7 representa Agosto)
const manualDate = new Date(2026, 7, 22, 14, 30);
console.log(manualDate.toLocaleDateString("pt-BR")); // "22/08/2026"
```

---

## Armadilha: Date() sem new versus new Date()

- Chamar `Date()` como função regular ignora argumentos e devolve uma *string primitiva*
- Apenas `new Date(...)` instancia um objeto manipulável do tipo `Date`

```js
// Sem 'new': retorna string do momento atual (ignora argumentos)
const str = Date(2026, 0, 1);
console.log(typeof str); // "string"

// Com 'new': instancia um objeto Date
const obj = new Date(2026, 0, 1);
console.log(typeof obj); // "object"
console.log(obj instanceof Date); // true
console.log(obj.getFullYear()); // 2026
```

---

## Armadilha: Meses com Base Zero

- No construtor com argumentos numéricos `new Date(ano, mês, dia)`, os meses são **indexados em zero**:
  - `0` = Janeiro, `1` = Fevereiro, `6` = Julho, `7` = Agosto, `11` = Dezembro
- Passar `new Date(2026, 8, 22)` criará uma data em **Setembro**, e não em Agosto
- Dias do mês (`day`), horas e minutos usam indexação convencional normal

---

## Fusos Horários e o Padrão ISO 8601

Padrão internacional recomendado para serialização textual de datas:

`YYYY-MM-DDTHH:mm:ss.sssZ`

- `T`: separador literal entre data e hora
- `Z`: indicador de fuso **UTC** (*Coordinated Universal Time* / Zulu Time)
- `-03:00` ou `+02:00`: deslocamento explícito (*offset*) em relação ao meridiano UTC
- Garante integridade temporal entre clientes, servidores e bancos de dados

---

## Fusos Horários no Parsing de Datas

```js
// Data em UTC (sufixo Z)
const utcDate = new Date("2026-08-22T03:00:00.000Z");

// Data com deslocamento de Brasília (UTC-3)
const brtDate = new Date("2026-08-22T00:00:00.000-03:00");

// Ambos os objetos representam o mesmo instante físico:
console.log(utcDate.getTime() === brtDate.getTime()); // true
console.log(utcDate.toISOString()); // "2026-08-22T03:00:00.000Z"
console.log(brtDate.toISOString()); // "2026-08-22T03:00:00.000Z"
```

---

## Armadilha do Dia Anterior com Strings de Data

- Strings fornecidas apenas como `"YYYY-MM-DD"` são parseadas em **00:00:00 UTC**
- No Brasil (UTC-3), o recuo de 3 horas gera `21:00:00 do dia anterior`
- **Solução recomendada**:
  - Fornecer hora explícita: `new Date("2026-08-22T00:00:00")` (fuso local)
  - Ou utilizar argumentos numéricos: `new Date(2026, 7, 22)`

---

## Serialização Automática em JSON

- `JSON.stringify()` invoca internamente o método `Date.prototype.toJSON()`
- Esse método repassa a serialização para `Date.prototype.toISOString()`

```js
const appointment = {
  service: "Consultoria",
  scheduledAt: new Date(Date.UTC(2026, 7, 22, 14, 0, 0)),
};

console.log(JSON.stringify(appointment));
// {"service":"Consultoria","scheduledAt":"2026-08-22T14:00:00.000Z"}
```

---

## Leitura e Alteração de Componentes

| Componente | Leitura Local | Leitura UTC | Escala |
| ---------- | ------------- | ----------- | ------ |
| **Ano** | `.getFullYear()` | `.getUTCFullYear()` | Ex: `2026` |
| **Mês** | `.getMonth()` | `.getUTCMonth()` | `0` a `11` |
| **Dia do Mês** | `.getDate()` | `.getUTCDate()` | `1` a `31` |
| **Dia da Semana**| `.getDay()` | `.getUTCDay()` | `0` (Dom) a `6` (Sáb) |
| **Horas** | `.getHours()` | `.getUTCHours()` | `0` a `23` |
| **Timestamp** | `.getTime()` | `.getTime()` | Milissegundos Epoch |

---

## Exemplo: Extração e Modificação

```js
const event = new Date("2026-08-20T10:00:00");

// Extração local
console.log(event.getFullYear()); // 2026
console.log(event.getMonth() + 1); // 8 (Agosto)
console.log(event.getDate()); // 20

// Modificação direta (o objeto Date é mutável)
event.setDate(35); // Ultrapassa Agosto; avança para 4 de Setembro!
console.log(event.toLocaleDateString("pt-BR")); // "04/09/2026"
```

---

## Cálculo de Diferença entre Datas (Diffs)

- Subtrair duas datas (`d2 - d1`) força a coerção numérica via `valueOf()`
- O resultado é a diferença bruta expressa em milissegundos

```js
const start = new Date("2026-08-01T00:00:00");
const end = new Date("2026-08-22T00:00:00");

const diffMs = end - start; // Milissegundos decorridos
const msPerDay = 1000 * 60 * 60 * 24;
const diffDays = Math.floor(diffMs / msPerDay);

console.log(`Diferença: ${diffDays} dias`); // "Diferença: 21 dias"
```

---

## Armadilha: Coerção com Adição (+) vs Subtração (-)

- `Date.prototype[Symbol.toPrimitive]` adota por padrão o *hint* `"string"`
- `date + ms` converte a data em string e concatena textualmente!

```js
const date = new Date("2026-08-22T10:00:00Z");

// ARMADILHA: concatenação textual silenciosa
const bad = date + 1000;
console.log(typeof bad); // "string"

// CORRETO: coerção numérica unária ou via .getTime()
const correct = new Date(+date + 1000);
console.log(correct.toISOString()); // "2026-08-22T10:00:01.000Z"
```

---

## Aritmética de Calendário e Horário de Verão

- Adicionar `86_400_000 ms` para representar um dia é arriscado em dias com transição de Horário de Verão (DST), que possuem 23 ou 25 horas
- Prefira manipular o calendário com o método nativo `.setDate()`:

```js
const current = new Date("2026-08-20T12:00:00");

// Adiciona 15 dias delegando a virada de mês e horário ao motor JS
const deadline = new Date(current);
deadline.setDate(deadline.getDate() + 15);

console.log(deadline.toLocaleDateString("pt-BR")); // "04/09/2026"
```

---

## Validação de Integridade de Datas

- Strings inválidas fornecidas a `new Date()` não geram erros em tempo de execução
- O objeto é criado com timestamp `NaN` e string `"Invalid Date"`

```js
function isValidDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

console.log(isValidDate(new Date("2026-08-22"))); // true
console.log(isValidDate(new Date("texto-invalido"))); // false
```

---

## A Nova API Temporal (TC39)

A proposta Temporal resolve as limitações históricas do objeto `Date`:

| Característica | Objeto `Date` Tradicional | Nova API `Temporal` |
| -------------- | ------------------------- | ------------------- |
| **Mutabilidade** | Mutável (propaga efeitos) | **Totalmente Imutável** |
| **Indexação de Mês** | `0` a `11` (Janeiro = 0) | `1` a `12` (Janeiro = 1) |
| **Cálculo de Diffs** | Manual em milissegundos | Nativo (`.until()`, `.since()`) |
| **Tipos Específicos** | Apenas `Date` genérico | `PlainDate`, `PlainTime`, `ZonedDateTime` |

---

## Tipos Fundamentais da API Temporal

- `Temporal.PlainDate`: data pura sem horário ou fuso (ex: aniversários)
- `Temporal.PlainTime`: horário de relógio sem data (ex: reuniões diárias)
- `Temporal.ZonedDateTime`: instante exato associado a fuso IANA
- `Temporal.Duration`: representação semântica de período decorrido

```js
const today = Temporal.PlainDate.from("2026-08-22");
const event = Temporal.PlainDate.from("2026-09-10");

const diff = today.until(event, { unit: "days" });
console.log(`Faltam ${diff.days} dias.`); // "Faltam 19 dias."
```

---

## Formatação com Intl.DateTimeFormat

Formatação internacionalizada sem concatenação manual de strings:

```js
const date = new Date("2026-08-22T14:30:00Z");

const formatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "full",
  timeStyle: "short",
  timeZone: "America/Sao_Paulo",
});

console.log(formatter.format(date));
// "sábado, 22 de agosto de 2026 às 11:30"
```

---

## Formatação de Intervalos com formatRange()

Formata períodos contínuos de forma natural conforme as regras da cultura:

```js
const start = new Date("2026-08-20T09:00:00Z");
const end = new Date("2026-08-25T18:00:00Z");

const rangeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

console.log(rangeFormatter.formatRange(start, end));
// "20 de ago. – 25 de ago. de 2026"
```

---

## Tempo Relativo com Intl.RelativeTimeFormat

Gera frases humanas de tempo relativo adaptadas ao idioma:

```js
const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

console.log(rtf.format(-1, "day")); // "ontem"
console.log(rtf.format(1, "day")); // "amanhã"
console.log(rtf.format(-5, "minute")); // "há 5 minutos"
console.log(rtf.format(2, "month")); // "em 2 meses"
```

---

## Bibliotecas do Ecossistema

| Biblioteca | Tamanho | Paradigma | Cenário no Mercado |
| ---------- | ------- | --------- | ------------------ |
| **date-fns** | Modular | Funcional, imutável, *tree-shakeable* | **Mais recomendada** |
| **dayjs** | ~2 KB | Fluente, estilo Moment, leve | Muito usada em SPAs |
| **Luxon** | Médio | Orientado a objetos, suporte a fusos | Foco em fusos IANA |
| **Moment.js**| ~70 KB | Mutável, objetos monolíticos | **Legado** |

---

## Comparativo Prático: date-fns vs dayjs

```js
// Abordagem funcional com date-fns
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

const nextWeek = addDays(new Date(), 7);
console.log(format(nextWeek, "EEEE, dd 'de' MMMM", { locale: ptBR }));

// Abordagem orientada a objetos fluente com dayjs
import dayjs from "dayjs";
console.log(dayjs().add(7, "day").format("DD/MM/YYYY"));
```

---

## Resumo e Boas Práticas

| Prática Recomendada | Motivo Técnico |
| ------------------- | -------------- |
| **Persistir em ISO 8601 UTC** | Ponto de referência temporal absoluto e independente de localidade |
| **Formatar apenas na UI** | Desacopla regras de negócio das peculiaridades de exibição |
| **Validar com `!isNaN(d.getTime())`** | Entradas incorretas produzem `NaN` sem lançar erro |
| **Usar `setDate()` para somar dias** | Trata anos bissextos, viradas de mês e Horário de Verão |
| **Evitar operador `+` para somar ms** | Coerção padrão para string concatena em vez de somar |

---

## Resumo Prático Consolidado

```js
function scheduleAppointment(startDateInput, daysToAdd) {
  const date = new Date(startDateInput);
  if (Number.isNaN(date.getTime())) throw new TypeError("Data inválida.");

  date.setDate(date.getDate() + daysToAdd);

  const formatter = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "full",
    timeZone: "America/Sao_Paulo",
  });

  return { iso: date.toISOString(), label: formatter.format(date) };
}

console.log(scheduleAppointment("2026-08-22T09:00:00-03:00", 10).label);
// "terça-feira, 1 de setembro de 2026"
```

---

## Executando: Demonstração no Terminal

1. Crie o arquivo `date-demo.js`:
```js
const now = new Date();
const deadline = new Date("2026-12-31T23:59:59Z");
const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
console.log(`Dias restantes: ${diffDays}`);
```
2. Execute no terminal:
```bash
$ node date-demo.js
Dias restantes: 131
```

---

## Exercício Prático

Crie o arquivo `date-exercise.js`:

1. Defina uma string de nascimento no padrão ISO (ex: `"2000-08-22"`)
2. Crie uma função `calculateAge(dateStr)` que valide a entrada e retorne a idade completa
3. Crie um vencimento adicionando 30 dias com `.setDate()`
4. Formate a data resultante com `Intl.DateTimeFormat` no padrão `"pt-BR"`
5. Imprima a idade e o vencimento formatado

---

## Desafio: Rastreador de Faturas

Crie o arquivo `invoice-tracker.js`:

1. Defina faturas com `id`, `cliente`, `dueDate` e `valor`
2. Zere as horas (`today.setHours(0, 0, 0, 0)`) para comparar apenas datas de calendário
3. Calcule os dias em atraso entre o vencimento e o momento atual
4. Gere a mensagem humana de tempo relativo com `Intl.RelativeTimeFormat`
5. Exiba o resultado formatado em tabela com `console.table()`

---

## Perguntas de Revisão: Objeto Date e Construtores

1. O que é o Unix Timestamp e como o objeto `Date` o armazena internamente?
2. Qual é a diferença entre invocar `Date()` sem `new` e instanciar `new Date()`?
3. Por que a instrução `new Date(2026, 5, 10)` cria uma data em Junho?
4. Qual é a vantagem de utilizar `Date.now()` em relação a `new Date().getTime()`?

---

## Perguntas de Revisão: Fusos, Coerção e Armadilhas

5. O que significa o sufixo `Z` em uma string de data no padrão ISO 8601?
6. Por que instanciar `new Date("2026-08-22")` pode exibir o dia 21 no Brasil?
7. Por que a operação `date + 1000` gera concatenação em vez de adição aritmética?
8. Como verificar programaticamente se uma data gerada é válida?

---

## Perguntas de Revisão: Aritmética, Intl e API Temporal

9. Por que somar dias com `setDate()` é mais seguro do que adicionar `86_400_000 ms`?
10. Para que serve o método `Intl.DateTimeFormat.prototype.formatRange()`?
11. Qual é a finalidade da classe `Intl.RelativeTimeFormat`?
12. Quais problemas estruturais de `Date` a nova API `Temporal` soluciona?

---

## Síntese do Tópico

- **Persistência**: sempre em ISO 8601 UTC
- **Aritmética**: manipulação de calendário via `setDate()` e coerção numérica
- **Apresentação**: formatação internacionalizada com `Intl`
- **Modernização**: adoção da API `Temporal` imutável e bibliotecas leves
