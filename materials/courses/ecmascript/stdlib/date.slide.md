---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "JavaScript: Date e Manipulação de Datas"
description: "Slides completos da aula JavaScript: Date e Manipulação de Datas."
---

<!-- _class: lead -->

# JavaScript: Date e Manipulação de Datas

Instanciação do objeto Date, timestamps, fusos horários e o padrão ISO 8601, manipulação de componentes de data e formatação com Intl.DateTimeFormat em JavaScript.

---

## Objetivo

- Compreender o armazenamento e a representação de datas em JavaScript, dominar a criação com `Date` e strings no formato...

---

## Mapa da Aula

- O Objeto Date e o Conceito de Timestamp
- Fusos Horários (Timezones) e o Padrão ISO 8601
- Métodos de Leitura e Alteração de Componentes
- Cálculo de Diferenças de Datas (Diffs)
- Formatação com a API Intl (Internacionalização)
- Bibliotecas do Ecossistema (date-fns, dayjs, luxon, moment)
- Resumo e Boas Práticas
- Executando

---

## Introdução

- Esta aula apresenta a manipulação de Datas e Horas em JavaScript
- desde o funcionamento do objeto tradicional `Date` e o conceito de *Unix Timestamp*, passando pelas armadilhas de fusos...

---

## O Objeto Date e o Conceito de Timestamp

- `0` = Janeiro, `1` = Fevereiro, `6` = Julho, `7` = Agosto, `11` = Dezembro.

---

## O Objeto Date e o Conceito de Timestamp: Comparação

| Forma de Construtor | Descrição | Exemplo |
| ------------------- | --------- | ------- |
| `new Date()` | Instancia a data e a hora exatas do instante atual | `new Date()` |
| `new Date(timestamp)` | Instancia a data a partir de milissegundos Epoch | `new Date(1700000000000)` |
| `new Date(isoString)` | Instancia a partir de uma string no padrão ISO 8601 | `new Date("2026-08-22T09:30:00Z")` |
| `new Date(ano, mês, dia, ...)` | Instancia com componentes individuais (mês base zero) | `new Date(2026, 7, 22)` // 22 de Agosto! |

---

## Formas de instanciação do objeto Date

```js
// 1. Momento atual
const now = new Date();
console.log(now); // Exibe data/hora atual em formato ISO

// 2. Timestamp atual (milissegundos desde 1970)
const timestamp = Date.now();
console.log(timestamp); // Ex: 1787304600000

// 3. Instanciação com String ISO 8601
const specificDate = new Date("2026-08-22T14:30:00.000Z");

// 4. Componentes individuais (CUIDADO: Mês começa em 0!)
// Ano, Mês (0=Jan, 7=Ago), Dia, Hora, Minuto
const manualDate = new Date(2026, 7, 22, 14, 30);
console.log(manualDate.toLocaleDateString("pt-BR")); // "22/08/2026"
```

---

## Fusos Horários (Timezones) e o Padrão ISO 8601

- `T` separa a data da hora.
- `Z` indica o fuso UTC (*Coordinated Universal Time* / Zulu Time).
- `-03:00` indica um deslocamento (*offset*) de 3 horas atrás do UTC (ex: Horário de Brasília).
- Forneça a hora explícita: `new Date("2026-08-22T00:00:00")` (parseia no fuso local).
- Ou utilize componentes numéricos: `new Date(2026, 7, 22)`.

---

## Entendendo fusos horários no parsing de datas

```js
// Data em UTC (sufixo Z)
const utcDate = new Date("2026-08-22T03:00:00.000Z");

// Data com deslocamento explícito de Brasília (UTC-3)
const brtDate = new Date("2026-08-22T00:00:00.000-03:00");

// Ambos os objetos representam exatamente o mesmo instante!
console.log(utcDate.getTime() === brtDate.getTime()); // true
```

---

## Métodos de Leitura e Alteração de Componentes

- O objeto `Date` oferece métodos para extrair e modificar componentes específicos da data, tanto no fuso horário local do...

---

## Métodos de Leitura e Alteração de Componentes: Comparação

| Componente | Leitura Local | Leitura UTC | Escala |
| ---------- | ------------- | ----------- | ------ |
| **Ano** | `.getFullYear()` | `.getUTCFullYear()` | Ex: `2026` |
| **Mês** | `.getMonth()` | `.getUTCMonth()` | `0` a `11` |
| **Dia do Mês** | `.getDate()` | `.getUTCDate()` | `1` a `31` |
| **Dia da Semana** | `.getDay()` | `.getUTCDay()` | `0` (Dom) a `6` (Sáb) |
| **Hora** | `.getHours()` | `.getUTCHours()` | `0` a `23` |
| ... | ... | ... | ... |

---

## Exemplo de extração de componentes

```js
const now = new Date();

const year = now.getFullYear();
const month = now.getMonth() + 1; // Soma 1 para exibir 1..12
const day = now.getDate();
const hours = now.getHours();

console.log(`Hoje é ${day}/${month}/${year} às ${hours}h`);
```

---

## Cálculo de Diferenças de Datas (Diffs)

- Calcular a diferença entre duas datas ou adicionar/subtrair períodos são tarefas frequentes em aplicações Web

---

## Cálculo de Diferença em Milissegundos (Diffs Matemáticos)

- Subtrair dois objetos `Date` converte-os automaticamente em timestamps (milissegundos)
- A partir dessa diferença, podemos converter o valor para segundos, minutos, horas ou dias

---

## Calculando a diferença de dias entre duas datas

```js
const startDate = new Date("2026-08-01T00:00:00");
const endDate = new Date("2026-08-22T00:00:00");

// Diferença em milissegundos
const diffMs = endDate.getTime() - startDate.getTime();

// Conversão: ms -> segundos -> minutos -> horas -> dias
const msPerDay = 1000 * 60 * 60 * 24;
const diffDays = Math.floor(diffMs / msPerDay);

console.log(`Diferença: ${diffDays} dias`); // "Diferença: 21 dias"
```

---

## Adicionando e Subtraindo Dias

- O método `.setDate()` ajusta automaticamente viradas de mês e ano quando passamos valores que ultrapassam o limite do mês...

---

## Adicionando 15 dias a uma data

```js
const today = new Date("2026-08-20");

// Adiciona 15 dias (JavaScript ajusta para Setembro automaticamente!)
today.setDate(today.getDate() + 15);

console.log(today.toLocaleDateString("pt-BR")); // "04/09/2026"
```

---

## A Nova API Temporal (O Futuro Nativo do JavaScript)

- O objeto `Date` tradicional possui limitações históricas conhecidas (meses base zero, mutabilidade, falta de suporte...
- Para resolver definitivamente esses problemas, a TC39 desenvolveu a API Temporal (Stage 3/4), que traz tipos imutáveis...
- A API `Temporal` elimina a necessidade de carregar bibliotecas pesadas de terceiros para realizar tarefas simples como...
- Temporal Proposal | TC39

---

## A Nova API Temporal (O Futuro Nativo do JavaScript): Comparação

| Recurso | Objeto `Date` Antigo | Nova API `Temporal` |
| ------- | --------------------- | ------------------- |
| **Mutabilidade** | Mutável (pode causar bugs) | **Totalmente Imutável** |
| **Mês Inicial** | `0` (Janeiro) | `1` (Janeiro) |
| **Cálculo de Diffs** | Manual em milissegundos | Nativo: `d1.until(d2, { unit: 'days' })` |
| **Tipos Específicos** | Apenas um tipo genérico | `PlainDate`, `PlainTime`, `ZonedDateTime` |

---

## Exemplo da API Temporal (Proposta Oficial TC39)

```js
// Exemplo conceitual da API Temporal (disponível via polyfill ou suporte nativo recente)
// 1. Criando datas imutáveis sem confusão de mês
const today = Temporal.PlainDate.from("2026-08-22");
const eventDate = Temporal.PlainDate.from("2026-09-10");

// 2. Calculando a diferença (diff) de forma nativa e direta!
const diff = today.until(eventDate, { unit: "days" });
console.log(`Faltam ${diff.days} dias para o evento!`); // "Faltam 19 dias para o evento!"

// 3. Adicionando períodos
const futureDate = today.add({ months: 2, days: 5 });
console.log(futureDate.toString()); // "2026-10-27"
```

---

## Formatação com a API Intl (Internacionalização)

- Em vez de concatenar manualmente dia, mês e ano com barras ou zeros à esquerda, o JavaScript oferece a API nativa `Intl`...

---

## Formatação de Datas com Intl.DateTimeFormat

- A API de internacionalização formata datas conforme o idioma e a região, sem montar a string manualmente:

---

## Formatação de datas e fusos com Intl.DateTimeFormat

```js
const date = new Date("2026-08-22T14:30:00Z");

// Formatação padrão para o Brasil (pt-BR)
const formatterBR = new Intl.DateTimeFormat("pt-BR", {
dateStyle: "full",
timeStyle: "short",
timeZone: "America/Sao_Paulo",
});

console.log(formatterBR.format(date));
// "sábado, 22 de agosto de 2026 às 11:30"

  // ...
month: "long",
year: "numeric",
});

console.log(customFormatter.format(date)); // "22 de agosto de 2026"
```

---

## Tempo Relativo com Intl.RelativeTimeFormat

- A API `Intl.RelativeTimeFormat` gera automaticamente frases humanas como `"há 5 minutos"`, `"ontem"`, `"em 3 dias"`
- Intl.DateTimeFormat | MDN

---

## Gerando tempo relativo com Intl.RelativeTimeFormat

```js
const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

console.log(rtf.format(-1, "day"));   // "ontem"
console.log(rtf.format(1, "day"));    // "amanhã"
console.log(rtf.format(-5, "minute"));// "há 5 minutos"
console.log(rtf.format(2, "month"));  // "em 2 meses"
```

---

## Bibliotecas do Ecossistema (date-fns, dayjs, luxon, moment)

- Embora o suporte nativo do JavaScript tenha evoluído com `Intl` e a API `Temporal`, projetos legados e aplicações...

---

## Bibliotecas do Ecossistema (date-fns, dayjs, luxon, moment): Comparação

| Biblioteca | Tamanho | Estilo / Paradigma | Estado no Mercado |
| ---------- | ------- | ------------------ | ----------------- |
| **date-fns** | Modular (tree-shakeable) | Funcional (funções puras imutáveis) | **Mais popular e recomendada** |
| **dayjs** | ~2 KB | Orientado a objetos (sintaxe estilo Moment) | Muito usada pela leveza |
| **Luxon** | Médio | Orientado a objetos imutável e timezones | Mantido pelos criadores do Moment |
| **Moment.js** | ~70 KB | Orientado a objetos mutável | **Legado** (em modo de manutenção) |

---

## Exemplo comparativo com date-fns e dayjs

```js
// Exemplo com date-fns (estilo funcional)

const today = new Date();
const nextWeek = addDays(today, 7);
console.log(format(nextWeek, "EEEE, dd 'de' MMMM", { locale: ptBR }));

// Exemplo com dayjs (estilo fluente)
console.log(dayjs().add(7, "day").format("DD/MM/YYYY"));
```

---

## Resumo e Boas Práticas

- Armazene e transite datas sempre no formato ISO 8601 em UTC (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- Lembre-se de que os meses no construtor `new Date(ano, mes, dia)` começam em 0 (Janeiro).
- Utilize a API nativa `Intl.DateTimeFormat` e `Intl.RelativeTimeFormat` para formatar datas para o usuário final.
- Acompanhe a adoção da nova API nativa `Temporal` para manipulação imutável de datas sem bibliotecas de terceiros.
- Ao parsear strings de data sem hora (`"YYYY-MM-DD"`), lembre-se do risco do "dia anterior" devido à conversão de UTC para...

---

## Executando

- Crie um arquivo chamado `date-demo.js`:
- Execute o arquivo com Node.js no terminal:
- Modifique os valores e teste o formatador de tempo relativo `Intl.RelativeTimeFormat`.

---

## date-demo.js

```js
const now = new Date();
const deadline = new Date("2026-12-31T23:59:59Z");

// Calculando diferença em dias
const diffMs = deadline.getTime() - now.getTime();
const remainingDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

// Formatação com Intl
const formatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "full",
  timeZone: "America/Sao_Paulo",
});

console.log("Data Atual:", formatter.format(now));
console.log("Prazo Final:", formatter.format(deadline));
console.log(`Dias restantes para o fim de 2026: ${remainingDays} dias`);
```

---

## Terminal

```bash
node date-demo.js
```

---

## Output

```txt
Data Atual: sábado, 22 de agosto de 2026
Prazo Final: quinta-feira, 31 de dezembro de 2026
Dias restantes para o fim de 2026: 131 dias
```

---

## Exercício

- Crie uma variável `birthDate` com a sua data de nascimento (ex: `"1998-05-15"`);
- Crie uma função `calculateAge(birthDate)` que receba a data de nascimento e retorne a idade exata em anos completos;
- Crie uma data de vencimento `dueDate` adicionando `30 dias` a partir da data atual;
- Formate a data de vencimento no padrão brasileiro `"DD/MM/AAAA"`;
- Imprima no console a idade calculada e a data de vencimento formatada.

---

## Desafio

- Crie um array `invoices` contendo objetos com `id`, `customer`, `dueDate` (string ISO) e `amount`;
- Crie uma função `processInvoices(invoices)` que percorra o array e calcule:
- Se a fatura está vencida ou em dia em relação à data atual;
- A quantidade de dias em atraso (caso vencida);
- Uma mensagem humana de tempo relativo usando `Intl.RelativeTimeFormat` (ex: `"vencida há 5 dias"` ou `"vence em 3 dias"`);

---

## Objeto Date e Timestamps

- O que é o Unix Timestamp e como ele é utilizado no objeto `Date` do JavaScript
- Por que a expressão `new Date(2026, 5, 10)` cria uma data em Junho e não em Maio
- Qual é a diferença entre `Date.now()` e `new Date().getTime()`

---

## Fusos e Armadilhas

- O que significa o sufixo `Z` em uma string de data no formato ISO 8601 como `"2026-08-22T14:00:00Z"`
- Por que passar a string `"2026-08-22"` no construtor `new Date()` pode exibir a data `21/08/2026` no Brasil

---

## Diferenças, Intl e API Temporal

- Como calcular a diferença exata em dias entre duas datas utilizando o objeto `Date` tradicional
- Quais são as vantagens de usar a API `Intl.DateTimeFormat` para formatar datas
- Para que serve o objeto `Intl.RelativeTimeFormat`
- Quais problemas históricos do objeto `Date` a nova API `Temporal` resolve
- Por que a biblioteca `Moment.js` é considerada legada em desenvolvimento Web moderno

---

## Próxima aula

- Map, Set e Coleções
- Coleções chave-valor com Map, conjuntos de valores únicos com Set e versões de referência fraca com WeakMap e WeakSet

---

## Resumo da Aula

- Revise o Objeto Date e o Conceito de Timestamp
- Revise fusos Horários (Timezones) e o Padrão ISO 8601
- Revise métodos de Leitura e Alteração de Componentes
- Revise cálculo de Diferenças de Datas (Diffs)
- Revise formatação com a API Intl (Internacionalização)
- Revise bibliotecas do Ecossistema (date-fns, dayjs, luxon, moment)
- Revise resumo e Boas Práticas
