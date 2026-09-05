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
title: "JavaScript: Expressões Regulares (RegExp)"
description: "Slides completos do tópico Expressões Regulares em JavaScript (sintaxe, métodos, validações práticas, segurança contra ReDoS e desenvolvimento com IA)."
---

<!-- _class: lead -->

# JavaScript: Expressões Regulares (RegExp)

Padrões textuais para busca, validação, extração e substituição de strings.

---

## Objetivo

Dominar o uso de Expressões Regulares em JavaScript, do modelo mental à produção:

- Diferenciar **Notação Literal** de criação dinâmica com `new RegExp()`.
- Compreender o impacto de **flags**, classes, conjuntos, âncoras, quantificadores e grupos.
- Escolher o método adequado entre as APIs de `RegExp` e `String`.
- Construir validações de formato seguras com casos válidos e de borda.
- Identificar armadilhas de **ReDoS**, estado em `lastIndex` e dialetos de IA.
- Especificar, auditar e testar padrões no ecossistema ECMAScript moderno.

---

## Mapa do Tópico

A apresentação percorre seis eixos integrados de aprendizagem:

- **Modelo Mental, Criação e Flags**: funcionamento base e modificadores.
- **Sintaxe Fundamental**: metacaracteres, conjuntos, âncoras e quantificadores.
- **Métodos da Plataforma**: operações em `RegExp` e métodos de `String`.
- **Padrões Práticos de Validação**: CEP, CPF, horários, e-mails e datas.
- **Arquitetura e Segurança**: formato vs. domínio, ReDoS e defesa em camadas.
- **Ferramentas e Era da IA**: produtividade, testes nativos, auditoria e armadilhas.

---

## Por Que RegExp Importa?

A manipulação manual de strings com loops e substrings torna o código extenso e frágil:

- **Expressividade compacta**: descreve formatos complexos em uma notação declarativa.
- **Eficiência nativa**: executada por motores de busca altamente otimizados em C++.
- **Universalidade**: padrão disponível em navegadores, Node.js, editores e terminais.

*Regra de ouro: use RegExp para conferir formato textual; use código para regras de negócio.*

---

## Modelo Mental de Execução

Uma Expressão Regular não atua isolada: o resultado depende da combinação de três fatores.

```txt
String de entrada ("Contato: ana@ifpb.edu.br")
       |
       v
Padrão RegExp (/[\w.-]+@[\w.-]+/)
       |
       v
Método escolhido (test, exec, match, replace, split)
       |
       +---> Casa? ---> Sim: boolean, array de grupos ou nova string
       +---> Casa? ---> Não: false, null ou string inalterada
```

---

## Demonstração do Modelo Mental

O mesmo padrão produz retornos distintos conforme a intenção do método selecionado:

```js
const text = "Contato: ana@ifpb.edu.br";
const pattern = /[\w.-]+@[\w.-]+/;

console.log(pattern.test(text));              // true
console.log(text.match(pattern)[0]);           // "ana@ifpb.edu.br"
console.log(text.replace(pattern, "[email]")); // "Contato: [email]"
```

*Dica: escolha o método pelo tipo de dado que sua aplicação precisa processar a seguir.*

---

## Criação de RegExp

A plataforma JavaScript oferece duas formas complementares para instanciar expressões:

| Forma de Criação | Sintaxe | Uso Recomendado |
| :--- | :--- | :--- |
| **Notação Literal** | `/padrão/flags` | Padrões fixos conhecidos durante a escrita do código |
| **Construtor** | `new RegExp("padrão", "flags")` | Padrões dinâmicos construídos a partir de variáveis |

---

## Literal e Construtor no Código

Ambas as abordagens criam instâncias de `RegExp`, mas o construtor requer barras duplas:

```js
const literal = /\d{3}/;
const constructor = new RegExp("\\d{3}");

console.log(literal.test("123"));     // true
console.log(constructor.test("123")); // true

const dynamicWord = "DevLab";
const dynamicPattern = new RegExp(`^${dynamicWord}$`, "i");
console.log(dynamicPattern.test("devlab")); // true
```

---

## Flags (Modificadores de Busca)

Flags alteram o modo como a engine percorre e interpreta a string:

| Flag | Nome | Comportamento no Casamento |
| :--- | :--- | :--- |
| `i` | *Ignore case* | Trata letras maiúsculas e minúsculas como equivalentes |
| `g` | *Global* | Encontra todas as correspondências em vez de parar na primeira |
| `m` | *Multiline* | Faz as âncoras `^` e `$` operarem no início e fim de cada linha |
| `u` | *Unicode* | Ativa conformidade Unicode e rejeita escapes inválidos |
| `s` | *DotAll* | Permite que o metacaractere ponto case quebras de linha (`\n`) |
| `y` | *Sticky* | Casa estritamente a partir da posição gravada em `lastIndex` |

---

## Flags na Prática

Observe a diferença entre buscas sensíveis a maiúsculas e extrações globais:

```js
const language = /javascript/i;
const emails = "a@ifpb.edu.br e b@ifpb.edu.br".match(/[\w.-]+@[\w.-]+/g);

console.log(language.test("JavaScript")); // true
console.log(emails); // [ 'a@ifpb.edu.br', 'b@ifpb.edu.br' ]
```

*Nota: a flag `i` facilita buscas flexíveis, enquanto a flag `g` retorna arrays de ocorrências.*

---

## Cuidado com a Flag /g em Validações

Expressões com a flag `g` guardam estado interno no atributo mutável `lastIndex`:

```js
const pattern = /\d/g;

console.log(pattern.test("1")); // true  (lastIndex avançou para 1)
console.log(pattern.test("1")); // false (busca iniciou na posição 1)
console.log(pattern.test("1")); // true  (lastIndex reiniciou em 0)
```

- **Causa**: invocar `test()` repetidamente com `/g` preserva o cursor de busca anterior.
- **Regra**: nunca utilize a flag `/g` quando o objetivo for validação booleana de campo.

---

## Sintaxe Fundamental

Padrões misturam caracteres literais com metacaracteres dotados de significado especial:

```txt
/^DW-\d{4}\.\d$/
 | |  |    | |
 | |  |    | +-- Fim da string ($)
 | |  |    +---- Ponto literal escapado (\.)
 | |  +--------- Exatamente quatro dígitos (\d{4})
 | +------------ Prefixo textual literal (DW-)
 +-------------- Início da string (^)
```

---

## Classes de Caracteres

Classes fornecem atalhos concisos para famílias comuns de caracteres:

| Símbolo | Significado | Exemplo Positivo |
| :--- | :--- | :--- |
| `.` | Qualquer caractere único (exceto `\n`) | `"a"`, `"9"`, `"#"` |
| `\d` | Dígito numérico equivalente a `[0-9]` | `"7"` |
| `\D` | Qualquer caractere que não seja dígito | `"A"`, `"-"` |
| `\w` | Alfanumérico e sublinhado `[a-zA-Z0-9_]` | `"x"`, `"5"`, `"_"` |
| `\W` | Qualquer caractere não alfanumérico | `" "`, `"@"`, `"."` |
| `\s` | Espaço em branco, tabulação ou quebra | `" "`, `"\t"`, `"\n"` |
| `\S` | Qualquer caractere que não seja espaço | `"k"`, `"!"` |

---

## Classes de Caracteres no Código

Classes tornam os padrões sucintos sem a necessidade de enumerar cada caractere:

```js
const hasDigits = /\d+/;
const hasWhitespace = /\s/;

console.log(hasDigits.test("Turma 2026")); // true
console.log(hasDigits.test("Turma Web"));  // false
console.log(hasWhitespace.test("SemEspaco")); // false
console.log(hasWhitespace.test("Com Espaco")); // true
```

---

## Conjuntos e Intervalos

Colchetes definem uma lista finita de caracteres válidos para uma única posição:

| Sintaxe | Leitura e Comportamento |
| :--- | :--- |
| `[abc]` | Casa o caractere `a`, `b` ou `c` |
| `[^abc]` | Negação: casa qualquer caractere exceto `a`, `b` ou `c` |
| `[a-z]` | Intervalo contínuo de letras minúsculas |
| `[0-9]` | Intervalo contínuo de dígitos numéricos |
| `[a-zA-Z0-9]` | Combinação de intervalos para alfanuméricos |

---

## Conjuntos no Código

O circunflexo `^` no início dos colchetes inverte a seleção para casar o complemento:

```js
const hexColor = /^#[0-9a-fA-F]{6}$/;
const noVowels = /^[^aeiou]+$/i;

console.log(hexColor.test("#ff0000")); // true
console.log(hexColor.test("#123456")); // true
console.log(hexColor.test("#zzzzzz")); // false

console.log(noVowels.test("rhythm"));  // true
console.log(noVowels.test("code"));    // false
```

---

## Âncoras e Fronteiras

Âncoras não consomem caracteres; elas afirmam a posição onde o casamento deve ocorrer:

| Símbolo | Papel na Avaliação |
| :--- | :--- |
| `^` | Início absoluto da string (ou início de linha com flag `m`) |
| `$` | Fim absoluto da string (ou fim de linha com flag `m`) |
| `\b` | Fronteira entre caractere alfanumérico (`\w`) e não alfanumérico (`\W`) |
| `\B` | Posição interna que não coincide com fronteira de palavra |

*Validações rigorosas de campos sempre exigem o uso combinado de `^` e `$`*.

---

## Sem Âncoras vs. Com Âncoras

Veja como a omissão de âncoras permite que textos indesejados ao redor passem no teste:

```js
const looseCheck = /\d{3}/;
const exactCheck = /^\d{3}$/;

console.log(looseCheck.test("abc123xyz")); // true  (encontrou "123" no meio)
console.log(exactCheck.test("abc123xyz")); // false (o texto inteiro não é 3 dígitos)
console.log(exactCheck.test("123"));       // true  (correspondência exata)
```

- **Sem âncoras**: busca por substring em qualquer parte do texto.
- **Com âncoras**: validação da integridade total do campo de entrada.

---

## Quantificadores

Quantificadores determinam quantas vezes o elemento anterior deve se repetir:

| Quantificador | Quantidade Exigida |
| :--- | :--- |
| `*` | Zero ou mais ocorrências |
| `+` | Uma ou mais ocorrências |
| `?` | Zero ou uma ocorrência (torna o item opcional) |
| `{n}` | Exatamente `n` ocorrências |
| `{n,}` | No mínimo `n` ocorrências |
| `{n,m}` | Entre `n` e `m` ocorrências (intervalo inclusivo) |

---

## Quantificadores no Código

O quantificador afeta estritamente o item imediatamente anterior, a menos que agrupado:

```js
const urlProtocol = /^https?:\/\//;
const academicYear = /^\d{4}$/;

console.log(urlProtocol.test("http://ifpb.edu.br"));  // true
console.log(urlProtocol.test("https://ifpb.edu.br")); // true
console.log(urlProtocol.test("ftp://ifpb.edu.br"));   // false

console.log(academicYear.test("2026")); // true
console.log(academicYear.test("26"));   // false
```

---

## Quantificadores Gulosos vs. Preguiçosos

Por padrão, quantificadores são gulosos (*greedy*) e avançam até o limite máximo:

| Tipo de Quantificador | Exemplo | Estratégia de Casamento |
| :--- | :--- | :--- |
| **Guloso (*greedy*)** | `/<.*>/` | Consome o maior trecho possível até o último delimitador |
| **Preguiçoso (*lazy*)** | `/<.*?>/` | Para imediatamente na primeira ocorrência do fechamento |

*Acrescentar a interrogação `?` após o quantificador ativa o modo lazy.*

---

## Greedy vs. Lazy no Código

A diferença fica evidente quando múltiplos marcadores idênticos coexistem na string:

```js
const html = "<div>Primeiro</div><div>Segundo</div>";

const greedy = /<div>.*<\/div>/;
const lazy = /<div>.*?<\/div>/;

console.log(html.match(greedy)[0]); // "<div>Primeiro</div><div>Segundo</div>"
console.log(html.match(lazy)[0]);   // "<div>Primeiro</div>"
```

*Cuidado: padrões gulosos com `.*` frequentemente capturam mais dados do que o esperado.*

---

## Grupos e Alternância

Parênteses criam subexpressões para aplicação de quantificadores ou extração:

| Tipo de Grupo | Sintaxe | Papel |
| :--- | :--- | :--- |
| **Captura Indexada** | `(padrão)` | Isola o trecho e armazena em `match[1]`, `match[2]` |
| **Captura Nomeada** | `(?<name>padrão)` | Armazena o trecho nomeado no objeto `match.groups` |
| **Não Captura** | `(?:padrão)` | Agrupa para operadores sem gastar memória de captura |
| **Alternância** | `a|b` | Opera como disjunção lógica (`ou`) entre ramos |

---

## Grupos de Captura no Código

Grupos indexados permitem fatiar e extrair parcelas semânticas da string casada:

```js
const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const match = "22/08/2026".match(datePattern);

console.log(match[0]); // "22/08/2026" (casamento total)
console.log(match[1]); // "22"         (dia)
console.log(match[2]); // "08"         (mês)
console.log(match[3]); // "2026"       (ano)
```

*Dica: use grupos de não captura `(?:...)` quando precisar apenas de alternância.*

---

## Captura Nomeada no Código

Grupos nomeados aumentam a legibilidade ao evitar dependência de posições numéricas:

```js
const isoPattern = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = "2026-08-22".match(isoPattern);

const { year, month, day } = match.groups;
console.log(`Ano: ${year}, Mês: ${month}, Dia: ${day}`);
// Ano: 2026, Mês: 08, Dia: 22
```

*Vantagem: refatorações no padrão não quebram o código cliente que consome as propriedades.*

---

## Asserções de Inspeção (Lookaround)

Permitem verificar o contexto anterior ou posterior sem incluir o texto no resultado:

| Sintaxe | Nome | Condição Verificada |
| :--- | :--- | :--- |
| `(?=padrão)` | *Positive Lookahead* | Exige que o texto seja seguido imediatamente por padrão |
| `(?!padrão)` | *Negative Lookahead* | Exige que o texto NÃO seja seguido por padrão |
| `(?<=padrão)` | *Positive Lookbehind* | Exige que o texto seja precedido imediatamente por padrão |
| `(?<!padrão)` | *Negative Lookbehind* | Exige que o texto NÃO seja precedido por padrão |

---

## Lookaround na Prática

Observe como capturamos apenas o valor numérico assegurando a presença da moeda:

```js
const priceText = "Preço final: R$150 à vista";
const priceMatch = priceText.match(/(?<=R\$)\d+/);

console.log(priceMatch[0]); // "150"

const noTax = "Valor: 200USD".match(/\d+(?!USD)/);
console.log(noTax); // null (rejeitado pelo lookahead negativo)
```

*O valor "150" foi extraído limpo, sem carregar o símbolo "R$" para o resultado final.*

---

## Métodos do Objeto RegExp

A API própria do objeto `RegExp` foca na validação booleana e extração detalhada:

| Método | Finalidade Principal | Retorno |
| :--- | :--- | :--- |
| `regexp.test(str)` | Valida se a string satisfaz o padrão | `boolean` (`true`/`false`) |
| `regexp.exec(str)` | Extração detalhada de dados e grupos | Array com índices ou `null` |

---

## Métodos test() e exec() no Código

Use `test()` para decisões de fluxo e `exec()` para coletar informações estruturadas:

```js
const pattern = /DW-(\d{4})/;
const text = "Turma DW-2026 confirmada";

console.log(pattern.test(text)); // true

const result = pattern.exec(text);
console.log(result[0]);          // "DW-2026"
console.log(result[1]);          // "2026"
console.log(result.index);       // 6
```

---

## Métodos de String com RegExp

O protótipo de `String` oferece suporte nativo a expressões regulares em várias operações:

| Método | Ação Executada com a Expressão | Retorno |
| :--- | :--- | :--- |
| `str.search(re)` | Localiza o índice do primeiro casamento | Índice inteiro ou `-1` |
| `str.match(re)` | Coleta a primeira ocorrência ou todas com `/g` | Array de resultados ou `null` |
| `str.matchAll(re)` | Produz iterador com grupos de cada ocorrência | Iterador de matches |
| `str.replace(re, sub)` | Substitui trechos literais ou via grupos `$1` | Nova string formatada |
| `str.split(re)` | Divide a string utilizando padrão como divisor | Array de substrings |

---

## Métodos de String na Prática

Demonstração de busca posicional, substituição e divisão com delimitadores variados:

```js
const sentence = "Ana, Bruno; Carla : Daniel";

console.log(sentence.search(/Bruno/));          // 5
console.log(sentence.replace(/[;,:]/g, "|"));    // "Ana| Bruno| Carla | Daniel"

const names = sentence.split(/\s*[,;:]\s*/);
console.log(names); // [ 'Ana', 'Bruno', 'Carla', 'Daniel' ]
```

*O método `split` com expressão regular simplifica o tratamento de múltiplos separadores.*

---

## Padrões Práticos de Validação

Expressões regulares ancoradas representam fluxos rígidos de conferência estrutural:

```txt
CEP:     (início) ---> 8 dígitos OU 5 dígitos + "-" + 3 dígitos ---> (fim)
CPF:     (início) ---> 11 dígitos OU 3.3.3-2 dígitos com máscara ---> (fim)
Hora:    (início) ---> (00-19 | 20-23) ---> ":" ---> (00-59) -------> (fim)
Data:    (início) ---> 2 dígitos dia ---> "/" ---> 2 dígitos mês ---> "/" ---> 4 dígitos ---> (fim)
```

*Validação estrutural garante o formato exterior, mas não atesta regras lógicas de negócio.*

---

## Validação de CEP e CPF no Código

Construção de expressões regulares ancoradas que aceitam tanto formatos crus quanto pontuados:

```js
const cepPattern = /^(\d{8}|\d{5}-\d{3})$/;
const cpfPattern = /^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/;

console.log(cepPattern.test("58015-430"));     // true
console.log(cepPattern.test("58015430"));      // true
console.log(cepPattern.test("5801-430"));       // false

console.log(cpfPattern.test("111.222.333-44")); // true
console.log(cpfPattern.test("11122233344"));    // true
console.log(cpfPattern.test("111.222.333-4"));  // false
```

---

## Validação de Horário e E-mail no Código

Combinação de classes e intervalos para restringir faixas numéricas de horas e minutos:

```js
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

console.log(timePattern.test("09:45")); // true
console.log(timePattern.test("23:59")); // true
console.log(timePattern.test("24:00")); // false

console.log(emailPattern.test("aluno@ifpb.edu.br")); // true
console.log(emailPattern.test("invalido@"));         // false
```

---

## Validação de Data: O Limite da RegExp

Validar anos bissextos e quantidade de dias exclusivamente por RegExp gera código ilegível:

```js
// Padrão que tenta resolver ano bissexto puramente em RegExp:
const complexDate = /^(?:(?:31\/(?:0[13578]|1[02])|(?:29|30)\/(?:0[13-9]|1[0-2]))\/\d{4}|29\/02\/(?:(?:\d{2}(?:0[48]|[2468][048]|[13579][26]))|(?:[02468][048]00|[13579][26]00))|(?:0[1-9]|1\d|2[0-8])\/(?:0[1-9]|1[0-2])\/\d{4})$/;

console.log(complexDate.test("29/02/2024")); // true
console.log(complexDate.test("29/02/2023")); // false
```

- **Problema**: manutenção inviável, alto custo de revisão e risco de falhas sutis.
- **Solução recomendada**: validar o formato com RegExp e as regras de calendário em código.

---

## Formato com Regex + Domínio com Date

A separação de responsabilidades produz código limpo, testável e robusto:

```js
function isValidDate(dateStr) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dateStr);
  if (!match) return false;

  const [d, m, y] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(y, m - 1, d);

  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

console.log(isValidDate("29/02/2024")); // true  (ano bissexto)
console.log(isValidDate("29/02/2023")); // false (fevereiro em ano comum)
console.log(isValidDate("31/04/2026")); // false (abril possui 30 dias)
```

---

## Segurança: ReDoS e Backtracking

Padrões com quantificadores aninhados ambíguos provocam explosão combinatória:

- Em `^(\d+)+$`, a string `"123"` pode ser particionada em 2ⁿ⁻¹ combinações.
- Quando uma entrada longa falha no último caractere, a engine testa todos os caminhos.
- O loop de backtracking bloqueia a thread síncrona do Node.js, gerando negação de serviço.

```txt
Entrada: "111111111111111111X"
Tentativa 1: [111111111111111111] falha no 'X' -> recua
Tentativa 2: [11111111111111111][1] falha no 'X' -> recua
Tentativa 3: [1111111111111111][2]... Milhões de operações inúteis!
```

---

## Demonstração de ReDoS no Código

Veja a comparação gritante de tempo de resposta entre padrão vulnerável e padrão linear:

```js
const unsafePattern = /^(\d+)+$/; // Crescimento exponencial O(2^n)
const safePattern = /^\d+$/;       // Crescimento linear O(n)
const attackString = "111111111111111111X";

console.log(safePattern.test(attackString)); // false (executado em microssegundos)
// unsafePattern.test(attackString) -> congelaria a thread por segundos!
```

- **Causa**: quantificadores aninhados e sobreposição de classes de caracteres.
- **Mitigação**: simplificar para expressões lineares e limitar tamanho do payload.

---

## Bibliotecas vs. Zero-Dependency na Era da IA

Com assistentes de IA, é viável manter utilitários puros sem dependências desnecessárias:

| Abordagem | Casos de Uso Indicados | Benefícios Principais |
| :--- | :--- | :--- |
| **Utilitários Nativos (*Zero-Dependency*)** | CPF com dígito verificador, datas, CEP e máscaras pontuais | Bundle mínimo, sem risco de cadeia de suprimentos (*supply chain*) |
| **Bibliotecas Externas (`Zod`, `date-fns`)** | Validação de contratos de APIs completas e fusos horários | Inferência de tipos estáticos em TypeScript e tratamento global |

*Adote dependências por ganhos arquiteturais comprovados, não por preguiça de sintaxe.*

---

## Defesa em Profundidade: Cliente vs. Servidor

A validação de dados deve ocorrer em camadas distintas com objetivos complementares:

| Camada | Objetivo Central | Premissa de Segurança |
| :--- | :--- | :--- |
| **Cliente (Navegador)** | Feedback instantâneo e boa experiência de usuário (UX) | Nunca confiável (pode ser contornada no DevTools ou desabilitando JS) |
| **Servidor (API / Backend)** | Garantia inegociável de segurança e integridade de dados | Barreira mandatória antes de qualquer persistência no banco |

*Dica: requisições HTTP forjadas via curl ignoram completamente qualquer validação client-side.*

---

## Validação Nativa em Formulários HTML

O atributo `pattern` aplica a validação diretamente no navegador antes da submissão:

```html
<form>
  <label for="cep">CEP:</label>
  <input
    id="cep"
    name="cep"
    pattern="\d{5}-\d{3}"
    placeholder="58000-000"
    required
  />
  <button type="submit">Cadastrar</button>
</form>
```

- No HTML, passe apenas o corpo da expressão, sem as barras `/.../` e sem flags.
- O navegador aplica implicitamente as âncoras `^` e `$` em todo o campo.

---

## Produtividade em IDEs: Busca e Substituição

Expressões Regulares aceleram a refatoração diária de código no VS Code (`Alt+R`):

- **Localizar chamadas de log**: `console\.log\(.*?\);?` encontra logs residuais.
- **Substituição com retrovisores**: `$1`, `$2` reorganizam trechos casados.

```txt
Localizar:    import \{ (\w+) \} from 'utils';
Substituir:   import { $1 } from '@/core/utils';
Resultado:    import { formatDate } from '@/core/utils';
```

*A manipulação com regex no editor economiza horas de edição manual repetitiva.*

---

## Produtividade no Terminal com Utilitários CLI

Utilitários de linha de comando utilizam regex para pesquisar e transformar projetos:

```bash
# Busca ágil de ocorrências no repositório inteiro com ripgrep:
$ rg 'validateCPF\(' src/

# Localização de arquivos de teste por padrão com fd:
$ fd -e test.js

# Filtro de linhas com grep clássico:
$ grep -E '^[0-9]{4}-[0-9]{2}' access.log
```

*Dica: ripgrep (`rg`) é a ferramenta padrão recomendada para buscas em larga escala.*

---

## RegExp na Era da IA: Do Decorar ao Verificar

Assistentes de IA transformaram a criação de expressões regulares em um ciclo de engenharia:

```txt
1. Especificar
   -> Formato, dialeto ECMAScript, exemplos válidos e casos negativos
2. Gerar com IA
   -> Obter o padrão acompanhado da justificativa de cada símbolo
3. Verificar com Testes
   -> Executar tabela automatizada de casos de teste no Node.js
4. Revisar Segurança
   -> Auditar âncoras (^ $), classes estritas e ausência de ReDoS
5. Documentar
   -> Comentário explicativo com a intenção do padrão no código
```

---

## O Que a IA Mudou e o Que Permanece?

A inteligência artificial automatizou a sintaxe, mas a responsabilidade do código é humana:

| O Que a IA Absorveu | O Que Permanece com a Pessoa Desenvolvedora |
| :--- | :--- |
| Lembrar a grafia de metacaracteres e classes | Definir exatamente quais entradas são válidas |
| Traduzir expressões crípticas em prosa legível | Julgar se a lógica casa com o motor ECMAScript |
| Sugerir contraexemplos e casos de borda | Executar testes reais e tratar falhas de borda |
| Propor padrões a partir de requisitos textuais | Auditar riscos de ReDoS e custo de manutenção |

*Você é responsável pelo padrão aceito no pull request, não o assistente que o gerou.*

---

## Especificação por Exemplos: Prompt Confiável

Prompts detalhados com dialeto explícito e casos negativos evitam padrões frágeis:

```txt
Escreva uma RegExp em JavaScript (sintaxe ECMAScript nativa) para validar
matrícula no formato AAAANNNNNNN, onde:
- Os 4 primeiros dígitos iniciam com 19 ou 20 (ano de ingresso);
- Os 7 dígitos seguintes são o sequencial numérico;
- Validação integral do campo (exige âncoras ^ e $);
- Nenhuma letra ou caractere especial é permitido.

Devem casar: "20261234567", "19993456789"
Não devem casar: "2026123456", "202612345678", " 20261234567", "2026-123456"
Responda com o padrão, explicação de cada grupo e análise de backtracking.
```

---

## Padrão Especificado e Conferido no Código

O resultado da especificação reflete diretamente as restrições solicitadas:

```js
// Matrícula: ano de ingresso (19xx ou 20xx) seguido de 7 dígitos sequenciais
const enrollmentPattern = /^(?:19|20)\d{2}\d{7}$/;

console.log(enrollmentPattern.test("20261234567"));  // true
console.log(enrollmentPattern.test("19993456789"));  // true
console.log(enrollmentPattern.test("2026123456"));   // false (tamanho menor)
console.log(enrollmentPattern.test("202612345678")); // false (tamanho maior)
console.log(enrollmentPattern.test(" 20261234567")); // false (espaço indevido)
```

*O grupo `(?:19|20)` restringe o século de forma controlada e sem alocar memória extra.*

---

## Verificação Automatizada com Node.js

A tabela de casos deve ser versionada e validada com o executor de testes nativo:

```js
// cep.test.js
import { test } from "node:test";
import assert from "node:assert/strict";

const cepPattern = /^\d{5}-\d{3}$/;
const cases = [
  { input: "58015-430", expected: true },
  { input: " 58015-430", expected: false },
  { input: "58015430", expected: false },
];

test("validação rigorosa de CEP", () => {
  for (const { input, expected } of cases) {
    assert.equal(cepPattern.test(input), expected);
  }
});
```

---

## Execução do Teste no Terminal

A execução no terminal comprova a conformidade de todos os cenários previstos:

```bash
$ node --test cep.test.js
✔ validação rigorosa de CEP (0.35ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
```

- A tabela de casos documenta o comportamento esperado e previne regressões futuras.
- Se uma alteração quebrar um caso de borda, o teste aponta imediatamente a falha.

---

## Auditoria de Padrões Legados

Em vez de decifrar expressões herméticas à mão, peça a decomposição em regras atômicas:

```js
// Padrão legado difícil de revisar:
// /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/

const passwordRules = [
  { message: "mínimo de 8 caracteres", test: (v) => /^.{8,64}$/.test(v) },
  { message: "letra minúscula", test: (v) => /[a-z]/.test(v) },
  { message: "letra maiúscula", test: (v) => /[A-Z]/.test(v) },
  { message: "número", test: (v) => /\d/.test(v) },
  { message: "símbolo", test: (v) => /[^\p{L}\p{N}]/u.test(v) },
];

function validatePassword(pass) {
  const errors = passwordRules.filter((r) => !r.test(pass)).map((r) => r.message);
  return { valid: errors.length === 0, errors };
}
```

---

## Feedback Granular de Validação

A separação em regras melhora significativamente a experiência do usuário:

```js
console.log(validatePassword("Ifpb@2026"));
// { valid: true, errors: [] }

console.log(validatePassword("ifpb2026"));
// { valid: false, errors: [ 'letra maiúscula', 'símbolo' ] }
```

- **Expressão única**: retorna apenas um `false` mudo, sem orientar o usuário.
- **Regras isoladas**: informa exatamente quais requisitos ainda precisam ser atendidos.

---

## Armadilhas em Padrões Gerados por IA

Modelos de linguagem costumam confundir sintaxes de Python, PCRE e ECMAScript:

| Armadilha | Manifestação no Código | Como Prevenir |
| :--- | :--- | :--- |
| **Sintaxe de outros dialetos** | Uso de `\A`, `\z` ou quantificadores possessivos | Testar com Node.js ou Regex101 em modo ECMAScript |
| **Falso casamento com acentos** | `\w` e `\b` rejeitam caracteres como `ç` e `á` | Usar flag `u` com propriedades Unicode `\p{L}` |
| **Vulnerabilidade a ReDoS** | Quantificadores aninhados em regex "completas" | Analisar backtracking e impor limite no tamanho do texto |
| **Ausência de casos negativos** | Regex permissiva demais que aceita lixo lateral | Sempre testar espaços, símbolos e tamanhos inválidos |

---

## A Armadilha do Escape \z no JavaScript

Em ECMAScript sem flag `u`, o escape `\z` falha em silêncio virando a letra `"z"` literal:

```js
// Alucinação comum de modelos treinados em Python: \z como fim absoluto
const wrongPattern = /^\d+\z$/;
console.log(wrongPattern.test("123"));  // false (a string não termina em "z")
console.log(wrongPattern.test("123z")); // true  (\z virou o literal "z"!)

// Em JavaScript, utilize a âncora padrão $
const rightPattern = /^\d+$/;
console.log(rightPattern.test("123"));  // true
console.log(rightPattern.test("123z")); // false

// A flag u converte escapes inválidos em erro explícito
new RegExp("^\\d+\\z$", "u"); // SyntaxError: Invalid escape
```

---

## Checklist de Revisão Pré-Merge

Antes de aprovar um pull request contendo expressões regulares, verifique:

| Verificação | Ação de Auditoria |
| :--- | :--- |
| **Ancoragem** | O padrão possui `^` e `$` quando valida o campo integralmente? |
| **Casos Negativos** | Há testes com espaços, caracteres estranhos e tamanhos limites? |
| **ReDoS** | Não existem quantificadores aninhados do tipo `(a+)+` ou `(x|y)+`? |
| **Dialeto** | O padrão roda em ECMAScript sem escapes desconhecidos (ex: `\z`)? |
| **Semântica** | Regras de calendário, negócios e somas estão delegadas ao JavaScript? |

---

## Passo a Passo de Execução: Script de Telefones

Demonstração prática de busca de padrões textuais em arquivo executável Node.js:

1. Crie o arquivo de teste `phone-extractor.js`:
```js
// phone-extractor.js
const text = "Contatos: 83-98888-1111, 83999992222 e 83 97777 3333.";
const pattern = /\b(?:\(83\)|83)?\s?9\d{4}[- ]?\d{4}\b/g;

console.log("Telefones encontrados:", text.match(pattern));
```

2. Execute o arquivo no terminal com Node.js:
```bash
$ node phone-extractor.js
Telefones encontrados: [ '83-98888-1111', '83999992222', '83 97777 3333' ]
```

3. Varie para outros DDDs, estados ou países.
4. Se falhar ou ficar lento, leia o erro e use `console.log()`, `console.table()` ou `console.time()`.

---

## Exercício Prático: Validador de Formulários

Crie um arquivo chamado `validator.js` implementando três funções de validação:

1. `validateCPF(cpf)`: deve retornar `true` para 11 dígitos contínuos ou formato `000.000.000-00`.
2. `validateCEP(cep)`: deve retornar `true` para 8 dígitos contínuos ou formato `00000-000`.
3. `validateDate(date)`: deve retornar `true` para datas estruturadas no padrão `DD/MM/AAAA`.
4. Teste cada função com entradas válidas e inválidas, imprimindo os resultados no console.

*Exigência: use âncoras em todas as expressões para rejeitar textos parciais.*

---

## Solução do Exercício: Validador de Formulários

Implementação compacta utilizando expressões regulares ancoradas e testes de validação:

```js
// validator.js
function validateCPF(cpf) {
  return /^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/.test(cpf);
}

function validateCEP(cep) {
  return /^(\d{8}|\d{5}-\d{3})$/.test(cep);
}

function validateDate(dateStr) {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(dateStr);
}

console.log(validateCPF("111.222.333-44")); // true
console.log(validateCPF("11122233344"));    // true
console.log(validateCEP("58000-000"));      // true
console.log(validateDate("22/08/2026"));    // true
console.log(validateDate("2026-08-22"));    // false
```

---

## Desafio: Parser de Log de Servidor

Crie `log-parser.js` para processar linhas de log Nginx/Apache com grupos de captura:

Linha de log recebida:
```txt
192.168.1.50 - [22/Aug/2026:09:30:00] "GET /api/users HTTP/1.1" 200
```

Requisitos da função `parseLogLine(logLine)`:
- Extrair o endereço IP do cliente.
- Extrair o timestamp de acesso entre colchetes.
- Extrair o método HTTP e a rota solicitada.
- Extrair o código de status HTTP convertido em número.
- Retornar um objeto formatado contendo essas propriedades.

---

## Solução do Desafio: Parser de Log de Servidor

A expressão ancora o formato geral do log e captura campos estruturados:

```js
// log-parser.js
function parseLogLine(logLine) {
  const pattern = /^(\S+)\s+-\s+\[([^\]]+)\]\s+"([A-Z]+)\s+(\S+)\s+[^"]+"\s+(\d{3})$/;
  const match = logLine.match(pattern);
  if (!match) return null;

  const [, ip, timestamp, method, path, status] = match;
  return { ip, timestamp, method, path, status: Number(status) };
}

const sample = '192.168.1.50 - [22/Aug/2026:09:30:00] "GET /api/users HTTP/1.1" 200';
console.log(parseLogLine(sample));
// { ip: '192.168.1.50', timestamp: '22/Aug/2026:09:30:00', method: 'GET', path: '/api/users', status: 200 }
```

---

## Perguntas de Revisão (Parte 1)

Avalie a fixação dos conceitos fundamentais de sintaxe e criação:

- Qual é a diferença entre criar uma expressão com `/padrão/` e com `new RegExp()`?
- Para que servem as flags `i`, `g` e `u` em uma Expressão Regular?
- Por que o método `regexp.test()` pode alternar retornos ao utilizar a flag `g`?
- Qual é a diferença semântica entre o metacaractere `^` dentro e fora de colchetes?
- Como quantificadores gulosos (*greedy*) e preguiçosos (*lazy*) se comportam na busca?

---

## Perguntas de Revisão (Parte 2)

Avalie a compreensão dos conceitos de arquitetura, segurança e desenvolvimento com IA:

- Por que validações de formulário sempre devem ser ancoradas com `^` e `$`?
- O que caracteriza uma vulnerabilidade de ReDoS e como mitigá-la?
- Qual é o critério para escolher entre utilitário *zero-dependency* e biblioteca externa?
- Por que a validação no cliente (HTML/JS) nunca substitui a validação no servidor?
- Por que sugestões geradas por IA com o escape `\z` falham silenciosamente em JavaScript?

---

## Resumo do Tópico

Recapitulação dos pontos essenciais para o uso profissional de Expressões Regulares:

- **Modelo Mental**: compreenda a tríade entre string de entrada, padrão e método de execução.
- **Sintaxe e Âncoras**: use classes e âncoras `^` e `$` para validação estrita de campos.
- **Divisão de Responsabilidades**: use RegExp para formato textual e JavaScript para regras de negócio.
- **Segurança e Desempenho**: elimine quantificadores aninhados para prevenir ataques de ReDoS.
- **Engenharia com IA**: especifique dialeto e casos negativos, testando rigorosamente antes do merge.
