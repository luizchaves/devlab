---
marp: true
theme: default
paginate: true
title: "JavaScript: Expressões Regulares (RegExp)"
description: "Slides do tópico JavaScript: Expressões Regulares (RegExp)."
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
---

<!-- _class: lead -->

# JavaScript: Expressões Regulares (RegExp)

Padrões textuais para busca, validação, extração e substituição de strings.

---

## Objetivo

Ao final deste tópico, você deve conseguir ler e escrever RegExp simples com segurança:

- Criar RegExp literal e dinâmica.
- Explicar flags, classes, conjuntos, âncoras, quantificadores e grupos.
- Escolher entre métodos de `RegExp` e métodos de `String`.
- Construir validações de formato com casos válidos e inválidos.
- Evitar armadilhas como escapes no construtor e `/g` com `test()`.

---

## Mapa do Tópico

A sequência parte do funcionamento geral antes de listar símbolos:

- Modelo mental de execução.
- Criação e flags.
- Sintaxe fundamental.
- Métodos de `RegExp` e `String`.
- Validações práticas.
- Boas práticas e revisão.

---

## Modelo Mental

Uma RegExp não é apenas uma sequência de símbolos. Ela é um padrão executado contra uma string por um método específico.

```txt
String de entrada
  -> padrão RegExp
  -> método escolhido
  -> resultado
```

---

## Exemplo do Modelo Mental

O retorno muda conforme o método usado, mesmo quando o padrão é o mesmo:

```js
const text = "Contato: ana@ifpb.edu.br";
const pattern = /[\w.-]+@[\w.-]+/;

console.log(pattern.test(text)); // true
console.log(text.match(pattern)[0]); // "ana@ifpb.edu.br"
console.log(text.replace(pattern, "[email]")); // "Contato: [email]"
```

---

## Criação de RegExp

Use literal quando o padrão já está escrito no código. Use o construtor quando o padrão vem de uma variável.

| Forma | Sintaxe | Quando usar |
| --- | --- | --- |
| Literal | `/padrão/flags` | Padrões estáticos |
| Construtor | `new RegExp("padrão", "flags")` | Padrões dinâmicos |

---

## Literal e Construtor

As duas formas criam um objeto `RegExp`, mas strings exigem escapes extras:

```js
const literal = /\d{3}/;
const constructor = new RegExp("\\d{3}");

console.log(literal.test("123")); // true
console.log(constructor.test("123")); // true
```

---

## Flags

Flags são opções de execução. Elas mudam como a busca percorre a string:

| Flag | Ideia central |
| --- | --- |
| `i` | Ignora maiúsculas/minúsculas |
| `g` | Busca todas as ocorrências |
| `m` | Trata início/fim por linha |
| `u` | Usa regras Unicode |
| `s` | `.` também casa `\n` |
| `y` | Casa exatamente em `lastIndex` |

---

## Flags na Prática

A flag `i` é comum em buscas textuais. A flag `g` é útil para extrair várias ocorrências:

```js
const language = /javascript/i;
const emails = "a@ifpb.edu.br b@ifpb.edu.br".match(/[\w.-]+@[\w.-]+/g);

console.log(language.test("JavaScript")); // true
console.log(emails); // [ "a@ifpb.edu.br", "b@ifpb.edu.br" ]
```

---

## Cuidado com `/g` e `test()`

Uma RegExp global guarda estado em `lastIndex`. Isso pode alternar resultados em validações repetidas:

```js
const pattern = /\d/g;

console.log(pattern.test("1")); // true
console.log(pattern.test("1")); // false
console.log(pattern.test("1")); // true
```

Para validações booleanas simples, evite a flag `g`.

---

## Sintaxe Fundamental

Padrões misturam caracteres literais e metacaracteres:

```txt
/^DW-\d{4}\.\d$/
 | |  |    | |
 | |  |    | fim
 | |  |    ponto literal
 | |  quatro dígitos
 | prefixo literal
 início
```

---

## Classes de Caracteres

Classes são atalhos para famílias comuns de caracteres:

| Símbolo | Leitura |
| --- | --- |
| `.` | Qualquer caractere único, exceto quebra de linha |
| `\d` | Dígito |
| `\D` | Não dígito |
| `\w` | Alfanumérico ou `_` |
| `\s` | Espaço em branco |

---

## Classes na Prática

Leia `\d+` como "um ou mais dígitos" e `\s` como "algum espaço em branco":

```js
const hasDigits = /\d+/;
const hasWhitespace = /\s/;

console.log(hasDigits.test("Código 123")); // true
console.log(hasDigits.test("Código ABC")); // false
console.log(hasWhitespace.test("SemEspaços")); // false
```

---

## Conjuntos e Intervalos

Colchetes dizem quais caracteres são aceitos em uma posição:

| Sintaxe | Leitura |
| --- | --- |
| `[abc]` | `a`, `b` ou `c` |
| `[^abc]` | qualquer caractere exceto `a`, `b` ou `c` |
| `[a-z]` | letra minúscula |
| `[0-9]` | dígito |
| `[a-zA-Z0-9]` | alfanumérico |

---

## Conjuntos na Prática

Dentro de colchetes, `^` nega o conjunto quando aparece no início:

```js
const hexColor = /^#[0-9a-fA-F]{6}$/;

console.log(hexColor.test("#ff0000")); // true
console.log(hexColor.test("#123456")); // true
console.log(hexColor.test("#zzzzzz")); // false
```

---

## Âncoras

Âncoras não casam caracteres visíveis. Elas casam posições:

| Símbolo | Leitura |
| --- | --- |
| `^` | Início da string |
| `$` | Fim da string |
| `\b` | Fronteira de palavra |

Em validação, `^` e `$` indicam que a string inteira deve obedecer ao padrão.

---

## Sem Âncoras vs. Com Âncoras

A diferença entre busca parcial e validação exata aparece neste exemplo:

```js
const looseCheck = /\d{3}/;
const exactCheck = /^\d{3}$/;

console.log(looseCheck.test("abc123xyz")); // true
console.log(exactCheck.test("abc123xyz")); // false
console.log(exactCheck.test("123")); // true
```

---

## Quantificadores

Quantificadores controlam repetição do item imediatamente anterior:

| Símbolo | Leitura |
| --- | --- |
| `*` | zero ou mais |
| `+` | um ou mais |
| `?` | zero ou um |
| `{n}` | exatamente `n` |
| `{n,}` | no mínimo `n` |
| `{n,m}` | entre `n` e `m` |

---

## Quantificadores na Prática

Compare `/ab+/` com `/(ab)+/`: o primeiro repete apenas `b`; o segundo repete o grupo `ab`.

```js
const urlPattern = /^https?:\/\//;
const yearPattern = /^\d{4}$/;

console.log(urlPattern.test("http://ifpb.edu.br")); // true
console.log(urlPattern.test("https://ifpb.edu.br")); // true
console.log(yearPattern.test("2026")); // true
console.log(yearPattern.test("26")); // false
```

---

## Greedy vs. Lazy

Quantificadores gulosos capturam o maior trecho possível. Quantificadores lazy capturam o menor trecho possível:

| Tipo | Exemplo | Resultado |
| --- | --- | --- |
| Greedy | `/<.*>/` | vai até o último `>` possível |
| Lazy | `/<.*?>/` | para no primeiro `>` possível |

---

## Greedy vs. Lazy na Prática

Esse comportamento fica claro quando delimitadores se repetem no texto:

```js
const html = "<div>Primeira</div><div>Segunda</div>";

const greedy = /<div>.*<\/div>/;
const lazy = /<div>.*?<\/div>/;

console.log(html.match(greedy)[0]); // "<div>Primeira</div><div>Segunda</div>"
console.log(html.match(lazy)[0]); // "<div>Primeira</div>"
```

---

## Segurança: ReDoS e Backtracking

Quantificadores aninhados (`^(\d+)+$`) geram ambiguidade exponencial ($2^{n-1}$ partições):

- A engine tenta todas as combinações de particionamento (`["123"]`, `["12", "3"]`...).
- O `'X'` final força o teste exaustivo de milhões de caminhos antes de retornar `false`.

```js
const unsafeDigits = /^(\d+)+$/; // Exponencial O(2^n)
const safeDigits = /^\d+$/;       // Linear O(n)
const attackInput = "111111111111111111X";

console.log(unsafeDigits.test(attackInput)); // Trava a thread síncrona
console.log(safeDigits.test(attackInput));   // false (resolvido em microssegundos)
```

- **Correção:** elimine quantificadores aninhados e use expressões lineares.

---

## Grupos e Alternância

Parênteses organizam padrões e podem capturar partes da correspondência:

| Tipo | Sintaxe | Uso |
| --- | --- | --- |
| Captura | `(padrão)` | guardar em `match[1]` |
| Nomeado | `(?<nome>padrão)` | guardar em `groups.nome` |
| Não captura | `(?:padrão)` | agrupar sem salvar |
| Alternância | `a|b` | aceitar uma opção ou outra |

---

## Grupos na Prática

Use captura quando o trecho encontrado será usado depois:

```js
const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const match = "22/08/2026".match(datePattern);

console.log(match[1]); // "22"
console.log(match[2]); // "08"
console.log(match[3]); // "2026"
```

---

## Captura Nomeada

Grupos nomeados deixam o acesso mais claro em expressões com muitos campos:

```js
const isoDatePattern = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = "2026-08-22".match(isoDatePattern);

console.log(match.groups.year); // "2026"
console.log(match.groups.month); // "08"
console.log(match.groups.day); // "22"
```

---

## Lookaround

Asserções verificam contexto sem consumir caracteres:

| Sintaxe | Leitura |
| --- | --- |
| `(?=padrão)` | deve haver algo depois |
| `(?!padrão)` | não deve haver algo depois |
| `(?<=padrão)` | deve haver algo antes |
| `(?<!padrão)` | não deve haver algo antes |

---

## Lookaround na Prática

O prefixo `R$` precisa existir, mas não entra no resultado:

```js
const priceText = "Total: R$150";
const priceMatch = priceText.match(/(?<=R\$)\d+/);

console.log(priceMatch[0]); // "150"
```

---

## Métodos de RegExp

Use os métodos da própria RegExp quando o padrão é o centro da operação:

| Método | Pergunta | Retorno |
| --- | --- | --- |
| `test(str)` | Casa ou não casa? | `boolean` |
| `exec(str)` | O que foi encontrado? | Array ou `null` |

---

## `test()` e `exec()`

`test()` valida existência. `exec()` permite ler grupos capturados:

```js
const pattern = /DW-(\d{4})/;
const text = "Turma DW-2026 de Desenvolvimento Web";

console.log(pattern.test(text)); // true

const result = pattern.exec(text);
console.log(result[0]); // "DW-2026"
console.log(result[1]); // "2026"
```

---

## Métodos de String

Use métodos de `String` quando a string é o centro da operação:

| Método | Intenção |
| --- | --- |
| `search(regexp)` | encontrar posição |
| `match(regexp)` | capturar ocorrências |
| `matchAll(regexp)` | iterar ocorrências com grupos |
| `replace(regexp, text)` | substituir |
| `split(regexp)` | dividir por padrão |

---

## Métodos de String na Prática

O mesmo texto pode ser buscado, transformado ou quebrado com padrões diferentes:

```js
const text = "Ana, Bruno; Carla";

console.log(text.search(/Bruno/)); // 5
console.log(text.replace(/[;,]/g, "|")); // "Ana| Bruno| Carla"
console.log(text.split(/[,;]\s*/)); // [ "Ana", "Bruno", "Carla" ]
```

---

## Validação com RegExp

Regex valida formato textual. Ela não confirma existência, unicidade ou regra de negócio.

```txt
CEP: (início) -> 8 dígitos ou 5 dígitos + "-" + 3 dígitos -> (fim)
CPF: (início) -> 11 dígitos ou 3 "." 3 "." 3 "-" 2 dígitos -> (fim)
Hora: (início) -> (00-19 | 20-23) -> ":" -> (00-59) -> (fim)
E-mail: (início) -> local -> "@" -> domínio -> "." -> sufixo -> (fim)
Data: (início) -> 2 dígitos -> "/" -> 2 dígitos -> "/" -> 4 dígitos -> (fim)
```

---

## Validações em Código

Os trilhos viram RegExp ancoradas, com alternativas e quantificadores explícitos:

```js
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;

console.log(datePattern.test("29/02/2024")); // true (formato)
console.log(timePattern.test("14:30")); // true
```

---

## Regex Longa e Manutenção

Validar data com ano bissexto em uma única RegExp funciona, mas fica difícil de revisar:

```js
const datePattern = new RegExp(
  String.raw`^(?:` +
    String.raw`(?:31\/(?:0[13578]|1[02])|(?:29|30)\/(?:0[13-9]|1[0-2]))\/(?:19|20)\d{2}|` +
    String.raw`29\/02\/(?:(?:19|20)(?:0[48]|[2468][048]|[13579][26])|2000)|` +
    String.raw`(?:0[1-9]|1\d|2[0-8])\/(?:0[1-9]|1[0-2])\/(?:19|20)\d{2}` +
  String.raw`)$`
);

console.log(datePattern.test("29/02/2024")); // true
console.log(datePattern.test("29/02/2023")); // false
```

**Cuidado:** quando a regra cresce, combine RegExp simples com validação em código.

---

## Alternativa: Formato com Regex + Validação com Date

Dividir responsabilidades torna o código legível e imune a erros de borda:

```js
function isValidDate(str) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(str);
  if (!match) return false;

  const [d, m, y] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(y, m - 1, d);

  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

console.log(isValidDate("29/02/2024")); // true (bissexto)
console.log(isValidDate("29/02/2100")); // false (múltiplo de 100, não de 400)
console.log(isValidDate("31/04/2026")); // false (abril tem 30 dias)
```

---

## Bibliotecas vs. Zero-Dependency (Era da IA)

Com auxílio de IA, é viável gerar utilitários puros sem dependências externas:

- **Zero-Dependency**: funções locais para CPF (Módulo 11), CEP e datas.
- **Bibliotecas** (`Zod`, `date-fns`): para esquemas de API e inferência TypeScript.
- **Vantagens**: *bundle* reduzido e proteção contra falhas em pacotes de terceiros.

---

## Defesa em Profundidade (Cliente vs. Servidor)

Nunca confie exclusivamente na validação do front-end:

- **Cliente (Navegador)**: foco em experiência do usuário (UX) e feedback imediato.
- **Servidor (API)**: barreira inegociável de segurança e integridade dos dados.
- **Atenção**: o cliente pode desabilitar JavaScript ou enviar requisições diretas via `curl`.

---

## HTML `pattern`

No HTML, `pattern` recebe o corpo da expressão, sem barras externas e sem flags:

```html
<form>
  <label for="cep">CEP:</label>
  <input
    id="cep"
    name="cep"
    pattern="\d{5}-\d{3}"
    placeholder="00000-000"
    required
  />
  <button type="submit">Enviar</button>
</form>
```

---

## RegExp em IDEs e Linha de Comando

A sintaxe de RegExp acelera tarefas diárias fora do código da aplicação:

- **VS Code** (`Alt+R`): busca de logs residuais (`console\.log\(.*?\);?`) e refatoração com `$1`.
- **`ripgrep` (`rg`) / `grep`**: busca ágil de padrões em milhares de arquivos de código.
- **`sed` / `fd`**: substituição em massa e localização de arquivos por padrão no terminal.

---

## Checklist de Produção

Antes de publicar uma RegExp, verifique:

| Prática | Motivo |
| --- | --- |
| Use `^` e `$` em campos | evita correspondência parcial |
| Teste válidos e inválidos | cobre casos de borda |
| Prefira literal para regex fixa | melhora leitura |
| Evite `/g` com `test()` | evita estado em `lastIndex` |
| Use `(?:...)` sem captura | reduz ruído no resultado |
| Evite padrões ambíguos | reduz risco de ReDoS |
| Revise padrões longos | evita regras difíceis de manter |

---

## Resumo Prático

Centralizar padrões ajuda a evitar duplicação e facilita testes:

```js
const formPatterns = {
  cep: /^\d{5}-\d{3}$/,
  courseCode: /^DW-\d{4}\.\d$/,
  institutionalEmail: /^[\w.%+-]+@ifpb\.edu\.br$/i,
};

function isValidField(fieldName, value) {
  const pattern = formPatterns[fieldName];
  return Boolean(pattern?.test(value));
}
```

---

## Executando

O exemplo abaixo pode ser testado diretamente com Node.js:

```js
const text = "Contatos: 83-98888-1111, 83999992222 e 83 97777 3333.";
const phonePattern = /\b(?:\(83\)|83)?\s?9\d{4}[- ]?\d{4}\b/g;

console.log("Texto original:", text);
console.log("Telefones encontrados:", text.match(phonePattern));
```

```txt
Texto original: Contatos: 83-98888-1111, 83999992222 e 83 97777 3333.
Telefones encontrados: [ '83-98888-1111', '83999992222', '83 97777 3333' ]
```

Depois, varie o padrão para aceitar telefones de outros estados, DDDs diferentes ou formatos internacionais.

---

## Exercício

Crie `validator.js` com funções pequenas e testes de entradas válidas e inválidas:

- `validateCPF(cpf)`: 11 dígitos ou `000.000.000-00`.
- `validateCEP(cep)`: 8 dígitos ou `00000-000`.
- `validateDate(date)`: formato `DD/MM/AAAA`.
- Imprima os resultados no console.

---

## Desafio

Crie `log-parser.js` para extrair partes de uma linha de log com grupos de captura:

```txt
192.168.1.50 - [22/Aug/2026:09:30:00] "GET /api/users HTTP/1.1" 200
```

Campos esperados:

- IP do cliente.
- Data e hora.
- Método HTTP.
- Rota solicitada.
- Código de status.

---

## Perguntas de Revisão

Use estas perguntas para verificar se o modelo mental ficou claro:

- Qual é a diferença entre `/padrão/` e `new RegExp()`?
- Para que servem as flags `i` e `g`?
- Por que `/g` pode ser perigosa com `test()`?
- Por que validações de formulário costumam usar `^` e `$`?
- Quando `exec()` é mais útil do que `test()`?
- Como reduzir o risco de ReDoS em uma RegExp?

---

## Síntese

Expressões Regulares ficam mais legíveis quando são lidas em camadas:

- Entrada.
- Padrão.
- Método.
- Resultado.
- Casos de teste.

RegExp é ótima para formato textual. Regras de negócio continuam pertencendo à aplicação.
