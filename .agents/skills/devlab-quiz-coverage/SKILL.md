---
name: devlab-quiz-coverage
description: >-
  Cruza as questões do BrainCheck (`brain-check-questions/questions/*.yml`) com o conteúdo
  do DevLab para encontrar assuntos cobrados em quiz que o portal não ensina. Use quando o
  usuário pedir para varrer, auditar ou comparar as questões com o conteúdo, para saber se
  falta conteúdo antes de aplicar um quiz, ou ao preparar uma turma nova.
---

# DevLab — Cobertura das Questões dos Quizzes

Esta skill responde a uma pergunta específica: **existe algum assunto cobrado nas questões que
o estudante não tem onde estudar no DevLab?** O objetivo não é medir o portal, e sim garantir
que ninguém possa dizer, com razão, que foi avaliado em algo que nunca viu.

Ela **não escreve conteúdo por conta própria.** O resultado é um relatório de lacunas
candidatas; a criação ou expansão de páginas só acontece depois que o usuário escolhe o que
deve ser coberto e autoriza.

---

## 🗺️ Os dois repositórios

| Repositório | Papel | Caminho padrão |
| ----------- | ----- | -------------- |
| **DevLab** | Onde o conteúdo é ensinado. | O repositório em que a skill roda. |
| **BrainCheck** | Onde as questões e os quizzes vivem. | `../../apps/brain-check-questions` (ou `$BRAINCHECK_DIR`) |

No BrainCheck, o que interessa está em dois lugares:

- `questions/*.yml`: uma questão por arquivo, com `title`, `level`, `type`, `description`,
  `options`, `explanation` e, principalmente, **`tags`**;
- `quizzes/<turma>/*.yml`: os quizzes aplicados, cada um listando as questões que usa. É o que
  permite limitar a varredura a uma turma.

As **tags** são a espinha dorsal da análise. Elas são hierárquicas e em inglês:

```txt title="Exemplos de tag"
language/javascript/ecma/array/sort
language/javascript/dom/event/api/preventdefault
package/npm/expressjs/middleware
package-manager/npm/semver
database/mysql/join
api/rest/status-code
security/jwt
```

O conteúdo do DevLab, por outro lado, é escrito **em português**. Boa parte do trabalho da
skill é justamente atravessar essa fronteira: `mutator-accessor` precisa encontrar "métodos
mutadores e acessores", `immutability` precisa encontrar "imutabilidade".

---

## 1️⃣ Varredura automática

O script faz a primeira passagem, cruzando cada tag com o conteúdo de
`src/content/docs/courses/`:

```bash
node .agents/skills/devlab-quiz-coverage/scripts/scan-quiz-coverage.mjs
```

```bash
node .agents/skills/devlab-quiz-coverage/scripts/scan-quiz-coverage.mjs --quiz dw-cstrc-jp-2026.2
```

Opções disponíveis:

| Opção | Efeito |
| ----- | ------ |
| `--questions <caminho>` | Aponta outro caminho para o repositório de questões. |
| `--quiz <slug-da-turma>` | Limita às questões usadas nos quizzes daquela turma. |
| `--min <n>` | Só reporta tags com pelo menos `n` questões. |
| `--json <arquivo>` | Grava o relatório completo para análise posterior. |

O relatório sai em dois blocos:

- **Sem evidência**: nenhuma página do DevLab satisfaz os termos da tag. São os candidatos
  fortes a lacuna.
- **Evidência fraca**: uma ou duas páginas mencionam o termo. Costuma ser assunto citado de
  passagem, sem ser ensinado.

**A varredura é triagem, não veredito.** Ela busca por palavra-chave e erra nos dois sentidos:
aponta lacuna onde o assunto é ensinado com outro nome, e dá por coberto o que a página apenas
menciona. Nunca leve um item do relatório direto para o usuário sem a etapa seguinte.

---

## 2️⃣ Confirmação manual, item a item

Para cada candidato do relatório, faça as três verificações abaixo antes de chamá-lo de lacuna:

1. **Leia a questão inteira**, não só a tag. O arquivo em `questions/` traz o enunciado, as
   alternativas e a explicação, que dizem qual é o conceito realmente cobrado. Uma tag
   `array/sort` pode estar cobrando comparador numérico, estabilidade da ordenação ou mutação.
2. **Procure o conceito em português**, não a tag. Use os termos que o DevLab usaria:
   `mouseover` vira "eventos de mouse", `sparse-array` vira "arrays esparsos", `asi` vira
   "ponto e vírgula automático".
3. **Abra a página candidata e julgue.** Existem três respostas possíveis, e a diferença entre
   elas muda o que será proposto:

| Veredito | Significa | O que propor |
| -------- | --------- | ------------ |
| **Coberto** | A página ensina o conceito, com exemplo. | Nada. Anote a página, para o relatório final. |
| **Citado** | O termo aparece, mas sem explicação nem exemplo. | Expandir a seção existente. |
| **Ausente** | Nenhuma página trata do assunto. | Criar seção, ou página, no tópico adequado. |

---

## 3️⃣ Onde o assunto deveria morar

Ao propor a correção, aponte o lugar exato. A tabela liga as famílias de tag às áreas do portal:

| Família de tag | Curso do DevLab |
| -------------- | --------------- |
| `language/javascript/ecma/**` | `courses/ecmascript/` |
| `language/javascript/dom/**`, `browser/**`, `storage/**`, `fetch/**` | `courses/web-api/` |
| `language/javascript/tag-script/**` | `courses/html/` (a *tag* em si) e `courses/ecmascript/basics/introduction/` |
| `language/html/**`, `language/markup/**` | `courses/html/` |
| `language/css/**` | `courses/css/` |
| `language/sql/**`, `database/**` | `courses/database/` |
| `language/typescript/**` | `courses/typescript/` |
| `runtime/nodejs/**` | `courses/ecmascript/` e `courses/expressjs/` |
| `package/npm/expressjs/**` | `courses/expressjs/` |
| `package/npm/**` (demais pacotes) | `courses/npm/` |
| `package-manager/npm/**` | `courses/npm/basics/` |
| `api/**`, `protocol/http/**` | `courses/expressjs/api/` e `courses/web-api/http/` |
| `security/**` | `courses/expressjs/auth/` e `courses/expressjs/security/` |

Quando a tag não se encaixar em nenhuma linha, diga isso no relatório em vez de forçar: pode
ser sinal de que o portal precisa de um tópico novo, e essa é uma decisão do usuário.

---

## 4️⃣ Relatório e autorização

Entregue o resultado nesta forma, **sem escrever conteúdo ainda**:

```md
## Cobertura das questões — <turma ou acervo completo>

Questões analisadas: 763 · tags distintas: 489 · confirmadas como lacuna: 12

### Lacunas confirmadas (o quiz cobra, o DevLab não ensina)

| Assunto | Questões | Onde deveria morar | Tamanho |
| ------- | -------- | ------------------ | ------- |
| Arrays esparsos e buracos | 1 | `ecmascript/data/arrays.mdx`, nova seção | Seção curta |
| `parentNode` e `childNodes` | 2 | `web-api/browser/dom.mdx`, expandir | Parágrafo + exemplo |

### Citados, mas não ensinados
…

### Falsos positivos da varredura (já cobertos)
…

**Nada foi alterado.** Escolha o que devo cobrir e em que ordem.
```

Três regras para esse relatório:

1. **Ordene por risco**, e não por quantidade: uma lacuna de um quiz já aplicado nesta turma
   vale mais do que cinco de um assunto que ninguém cobrou ainda.
2. **Estime o tamanho** de cada correção (parágrafo, seção, página nova), porque é isso que o
   usuário considera ao escolher.
3. **Registre os falsos positivos.** Eles mostram o que a varredura não enxergou e melhoram a
   confiança no relatório, além de alimentarem o dicionário de aliases do script.

Só depois da escolha explícita do usuário, aplique a
`devlab-topic-docs-generator` para escrever o conteúdo, e a `devlab-content-reviewer` para
revisar o que foi escrito. Se a página nova exigir slides ou mapa mental, gere-os também.

---

## 🔁 Manutenção do script

Duas coisas envelhecem e devem ser atualizadas na revisão:

- **O dicionário `ALIASES`** em `scripts/scan-quiz-coverage.mjs`, com as traduções inglês →
  português que aparecerem como falso positivo;
- **A tabela de famílias de tag** desta skill, quando o portal ganhar cursos novos.

---

## ⚠️ Armadilhas

1. **Tratar a saída do script como verdade**: ela é triagem por palavra-chave; sem a leitura da
   questão e da página, o relatório vira ruído.
2. **Comparar tag com tag**: o DevLab não usa as tags do BrainCheck. A comparação é entre
   **conceito cobrado** e **conceito ensinado**.
3. **Escrever conteúdo antes da autorização**: a skill termina no relatório.
4. **Ignorar o recorte da turma**: uma lacuna só é urgente se a turma foi ou será avaliada nela.
5. **Cobrir a lacuna com uma frase**: se a questão cobra a diferença entre `mouseenter` e
   `mouseover`, uma menção não resolve; o estudante precisa do exemplo executável.
6. **Esquecer o caminho inverso**: quando o portal ensina algo relevante que nenhuma questão
   cobra, vale registrar como sugestão de questão nova, no fim do relatório.
