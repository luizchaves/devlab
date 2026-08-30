# PRD — DevLab

Documento de requisitos do **DevLab**: o portal de disciplinas e guias de programação
publicado em `https://<owner>.github.io/devlab/`. Ele descreve o produto — para quem
é, o que precisa fazer e sob quais restrições. As instruções de execução para agentes
estão em [`AGENTS.md`](../AGENTS.md); a documentação técnica de arquitetura e componentes
está no [`README.md`](../README.md).

| Campo         | Valor                                   |
| ------------- | --------------------------------------- |
| Produto       | DevLab                                  |
| Versão        | 0.0.1                                   |
| Responsável   | Luiz Carlos Chaves (IFPB)               |
| Status        | Em produção, evolução contínua          |
| Última revisão| 30 de agosto de 2026                    |

## 1. Problema

Material didático de programação envelhece por dois caminhos. O primeiro é o código:
o professor copia um trecho para o slide ou para a apostila, o projeto real evolui, e
a partir daí aluno e código divergem em silêncio — nada quebra, ninguém percebe, e o
aluno passa a hora da aula depurando uma diferença que não é dele. O segundo é a
dispersão: a aula vive no PDF, o exemplo em um `.zip`, o roteiro no e-mail e o
ambiente na máquina de cada um, de modo que boa parte do tempo de aula é gasta
alinhando setup em vez de conteúdo.

O DevLab ataca os dois: o código exibido **é** o código que roda, importado do
projeto executável em tempo de build; e aula, código, slides, mapa mental e ambiente
pronto ficam a um clique um do outro.

## 2. Objetivos

Cada objetivo abaixo é verificável no repositório ou no site publicado.

| #   | Objetivo                                                                 |
| --- | ------------------------------------------------------------------------ |
| O1  | Zero divergência entre o código mostrado na aula e o código que executa   |
| O2  | Todo projeto de aula rodável sem instalar nada na máquina do aluno        |
| O3  | Um tópico entregue em quatro formatos: página, slides, mapa mental, projeto |
| O4  | Publicar uma disciplina nova sem alterar a arquitetura do site            |
| O5  | Quebra de link ou de citação de linha detectada no CI, não pelo aluno     |
| O6  | Material reutilizável entre disciplinas diferentes sem duplicação         |

### Não-objetivos

O DevLab **não** é um LMS: não autentica alunos, não registra notas, não coleta
entregas, não hospeda fóruns e não tem backend. Também não pretende substituir a
documentação oficial das tecnologias — as aulas apontam para MDN e specs em vez de
recopiá-las. E não é um playground: o código roda no projeto do aluno (local ou
Codespaces), não dentro da página.

## 3. Público

São três leitores com necessidades distintas, e o produto atende os três com o mesmo
conteúdo.

| Público            | O que precisa                                                        |
| ------------------ | -------------------------------------------------------------------- |
| **Aluno**          | Ler a aula, rodar o código, exercitar e revisar antes da prova       |
| **Professor**      | Projetar slides, seguir o roteiro em ordem e reaproveitar entre turmas |
| **Agente de IA**   | Convenções explícitas para criar e revisar conteúdo sem quebrar o padrão |

O terceiro é deliberado: parte da manutenção do acervo é feita por agentes, e por
isso convenções que seriam "cultura oral" estão escritas em `AGENTS.md` e nas skills
de `.agents/skills/`.

## 4. Princípios

Três decisões sustentam a estrutura e explicam a maioria das regras do repositório.

1. **Single source of truth para código.** O que roda mora em `examples/` e é
   importado por `<SourceCode>`. Copiar código para o Markdown é o defeito que o
   produto existe para eliminar.
2. **Markdown first.** A apresentação é responsabilidade do Starlight; o conteúdo é
   texto. Componentes entram apenas quando o Markdown não dá conta.
3. **Conteúdo independente da apresentação.** Uma disciplina nova é um diretório novo
   mais uma entrada de sidebar — nenhum outro arquivo muda.

## 5. Escopo atual

O acervo publicado hoje cobre a stack web completa, do HTML à API com banco e
autenticação, em três disciplinas do IFPB e onze guias de tecnologia consultáveis
fora do calendário letivo.

| Área                    | Entregue                                                       |
| ----------------------- | -------------------------------------------------------------- |
| Disciplinas             | `dw-cstrc-jp`, `pw2-csbes-jp`, `lp2-ctii-jp`                    |
| Guias de tecnologia     | HTML, CSS, ECMAScript, Web APIs, Node.js, Express.js, TypeScript, Python, Banco de Dados, React, Pacotes |
| Páginas de aula         | 248 (`.mdx`)                                                    |
| Projetos executáveis    | ~116 diretórios em `examples/courses/`, 75 com `package.json`   |
| Slides / mapas mentais  | 66 / 66                                                         |
| Devcontainers           | 18                                                              |
| Projetos na homepage    | 6 (`src/lib/projects.ts`)                                       |

As duas aplicações-fio-condutor são o **InvestApp** (controle de investimentos, usado
em DW e LP2) e o **MonitorApp** (monitoramento de hosts, usado em PW2), cada uma
construída em etapas cumulativas: estático → API → TypeScript → validação → banco →
MVC → autenticação → testes → documentação → tempo real.

## 6. Requisitos funcionais

### 6.1 Conteúdo

| ID    | Requisito                                                                    |
| ----- | ---------------------------------------------------------------------------- |
| RF-01 | Cada aula tem `title`, `description` e `course` no frontmatter               |
| RF-02 | Cada aula termina com **Exercício** e **Próxima aula**, encadeando a trilha  |
| RF-03 | Exercícios e perguntas de revisão trazem resposta em `<details>`             |
| RF-04 | Páginas de conceito e de projeto são separadas e linkam uma para a outra     |
| RF-05 | Taxonomias aparecem como tabela; fluxos e relações, como diagrama Mermaid    |
| RF-06 | Todo link interno é relativo e sobrevive a mudança de `base`                  |

### 6.2 Código executável

| ID    | Requisito                                                                    |
| ----- | ---------------------------------------------------------------------------- |
| RF-10 | Código de projeto entra na página por `<SourceCode>`, lido em build time      |
| RF-11 | Recortes por `lines`, `region` ou `startLine`/`endLine`, preservando a numeração original |
| RF-12 | HTML de aula tem pré-visualização renderizada (`<HtmlPreview>`, iframe `sandbox=""`) |
| RF-13 | Cada projeto roda sozinho, com dependências próprias e scripts `dev`/`start` |
| RF-14 | Página de projeto oferece dois acessos: código no GitHub e Codespaces pronto |
| RF-15 | Comandos de instalação aparecem em abas npm / pnpm / yarn, sincronizadas no site |

### 6.3 Navegação e busca

| ID    | Requisito                                                                    |
| ----- | ---------------------------------------------------------------------------- |
| RF-20 | Sidebar por disciplina/guia, com seções temáticas recolhíveis                |
| RF-21 | Busca full-text no site estático (Pagefind)                                  |
| RF-22 | Sumário da página, navegação anterior/próxima e link "Editar esta página"    |
| RF-23 | Homepage e página de projetos alimentadas por um catálogo único              |

### 6.4 Materiais de apoio

| ID    | Requisito                                                                    |
| ----- | ---------------------------------------------------------------------------- |
| RF-30 | Slides Marp gerados de `materials/**/*.slide.md` no build                     |
| RF-31 | Mapas mentais markmap gerados de `materials/**/*.mindmap.md`, com controle de nível |
| RF-32 | Caminho do material espelha o da aula, e a aula linka o que existe            |
| RF-33 | Exercícios e "brainchecks" versionados em `exercises/`                        |

### 6.5 Publicação

| ID    | Requisito                                                                    |
| ----- | ---------------------------------------------------------------------------- |
| RF-40 | Deploy automático no GitHub Pages a cada push na `main`                       |
| RF-41 | `SITE_URL`, `BASE_PATH` e `REPO_URL` derivados do repositório no CI           |
| RF-42 | O site funciona sob qualquer `base`, inclusive domínio próprio                |

## 7. Requisitos não funcionais

| ID     | Categoria         | Requisito                                                              |
| ------ | ----------------- | ---------------------------------------------------------------------- |
| RNF-01 | Desempenho        | Site 100% estático, sem runtime no cliente além de busca e Mermaid      |
| RNF-02 | Responsividade    | Layout legível de 320 px a desktop, sem rolagem horizontal              |
| RNF-03 | Tema              | Dark/light automático; componentes usam tokens do Starlight, não cores fixas |
| RNF-04 | Acessibilidade    | Semântica do Starlight preservada; regras `a11y` do Biome ativas fora de `examples/` |
| RNF-05 | Segurança do build| Leitura de arquivos restrita a `examples/` e `src/examples/`, fixada em build time, sem traversal |
| RNF-06 | Segurança do preview | HTML de aula renderizado em iframe `sandbox=""`: sem script, form ou navegação |
| RNF-07 | Qualidade         | `lint`, `check`, `build`, `check:links` e `check:doc-lines` no CI       |
| RNF-08 | Reprodutibilidade | Node 22+, pnpm 10+, `--frozen-lockfile`; devcontainer por projeto       |
| RNF-09 | Portabilidade     | Nenhum caminho absoluto de deploy escrito no conteúdo                   |
| RNF-10 | Manutenibilidade  | Convenções executáveis: skills em `.agents/`, validadores em `scripts/` |
| RNF-11 | Idioma            | Conteúdo em pt-BR; identificadores e slugs em inglês                    |
| RNF-12 | Custo             | Hospedagem gratuita; nenhum serviço pago obrigatório para ler ou rodar  |

## 8. Métricas de sucesso

As três primeiras são verificáveis por script; as duas últimas dependem de observação
em sala.

| Métrica                                                        | Alvo         |
| -------------------------------------------------------------- | ------------ |
| Links internos quebrados no `dist/`                             | 0            |
| Citações de linha fora de faixa (`check:doc-lines`)             | 0            |
| Blocos de código de projeto copiados à mão na documentação      | 0            |
| Tempo do aluno até rodar o projeto da aula                      | < 5 min      |
| Tópicos com os quatro formatos (página, slides, mapa, projeto)  | crescente    |

## 9. Roadmap

Derivado de [`docs/TODO.md`](TODO.md), que continua sendo a lista operacional.

### Curto prazo

- `PRD.md` e `AGENTS.md` por projeto prático (InvestApp, MonitorApp), com spec e
  plano graduais por etapa.
- Auditoria de cobertura das etapas: verificar se o passo a passo permite chegar ao
  projeto final sem conhecimento prévio e se cobre todas as linhas do código.
- Padronizar todo comando de instalação em três abas (npm, pnpm, yarn).
- Slides e mapas mentais para os guias que ainda não os têm.

### Médio prazo

- Página final de InvestApp e MonitorApp com débitos técnicos, melhorias e desafios.
- Requisitos não funcionais dos projetos práticos: responsividade mobile-first e
  auditoria de segurança (CSRF, XSS, CORS, injeção de SQL).
- Guias de fundamentos: Git e GitHub com PRs e code review, CI/CD, Docker, testes,
  qualidade de código.
- Skill de Pull Request (especificação já redigida em `docs/TODO.md`).

### Longo prazo

- Guias de tecnologias fora do eixo Node: Flask, Django, Spring Boot, Go.
- Tópicos avançados: OAuth2/OIDC, 2FA, passkeys, GraphQL, WebSockets, OWASP Top 10.
- Comparativo de opções de deploy e guia de uso de IA para desenvolvimento.
- Exportação de `book.pdf` por guia e OpenGraph dedicado aos projetos finais.

## 10. Decisões registradas

Cada decisão abaixo tem uma alternativa óbvia que foi descartada por um motivo
concreto — vale registrar para não serem refeitas por engano.

| Decisão                                    | Motivo                                                                 |
| ------------------------------------------ | ---------------------------------------------------------------------- |
| Astro + Starlight                          | Sidebar, busca, TOC, dark/light e a11y prontos; build estático          |
| Código importado, nunca copiado            | Elimina a divergência silenciosa entre aula e projeto                   |
| Links relativos em vez do `base` escrito   | Sobrevivem a renomear repositório e a domínio próprio                   |
| `starlight-links-validator` descartado     | Ignora ou rejeita links relativos; `scripts/check-links.mjs` resolve URL real |
| `examples/` fora do workspace              | O build da documentação e o CI não instalam Express, Prisma e afins     |
| Sidebar explícita em `astro.config.mjs`    | Ordem didática não é ordem alfabética nem de arquivo                    |
| `materials/` fora de `public/`             | Fonte editável versionada; `public/slides` e `public/mindmaps` são artefatos |
| Autenticação com `node:crypto` nos exemplos| Ensina o mecanismo do JWT e do hash sem terceirizar para dependência    |

## 11. Riscos

O acervo é grande e mantido por poucas mãos, então os riscos reais são de erosão, não
de arquitetura.

| Risco                                                     | Mitigação                                                    |
| --------------------------------------------------------- | ------------------------------------------------------------ |
| Citação de linha em prosa apontando para o lugar errado    | `check:doc-lines --prosa` em revisão periódica (heurístico, fora do CI) |
| Versões divergentes entre projetos (Express 4/5, Prisma 5/6/7) | Trilhas atuais padronizadas; legado explicitamente marcado como legado |
| Skills desatualizadas em relação ao repositório            | README como fonte da verdade; skill corrigida quando divergir |
| Dependência do Marp/markmap instalados localmente          | `pnpm build:fast` pula a etapa; artefatos versionados em `public/` |
| Crescimento do tempo de build com o acervo                 | Build incremental de materiais e previews separadas do `astro build` |

## 12. Fora de escopo

Autenticação de alunos, notas, entregas, fóruns, backend próprio, execução de código
no navegador, tradução do conteúdo para outros idiomas e qualquer serviço pago como
requisito para ler ou rodar o material.
