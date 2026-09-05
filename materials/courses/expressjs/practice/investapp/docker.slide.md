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
title: "InvestApp: Docker"
description: "Décima segunda etapa do InvestApp: empacotamento da aplicação em Docker com Dockerfile, .dockerignore, Compose, variáveis de ambiente e volumes para SQLite e uploads."
---

<!-- _class: lead -->

# InvestApp: Docker

Décima segunda etapa do InvestApp: empacotamento da aplicação em Docker com Dockerfile, .dockerignore, Compose, variáveis de ambiente e volumes para SQLite e uploads.

---

## Objetivo

- Entender o papel de **InvestApp: Docker** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/invest-app-test`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US14 — Subir a aplicação em qualquer máquina · RNF05, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK13.1 · Criar `Dockerfile` (Receita da imagem do aplicativo), TK13.2 · Criar `.dockerignore` (Exclusão de arquivos no contexto de build), TK13.3 · Criar `compose.yaml` (Orquestração do contêiner e volumes)
- **Executando**
- **Testando**
- **O diff que importa**
- **Conceitos abordados**

---

## Contexto da Aula

- Etapa 13 de 13 · Nível Avançado · Docker · Docker Compose · Node.js · Prisma
- A aplicação final passa a rodar em um ambiente reproduzível.
- O Docker fixa a versão do Node, instala dependências pelo lockfile, gera o client do Prisma e sobe o Express com as variáveis necessárias.
- Empacotamento e Infraestrutura: veja Deploy e Containerização com Docker

---

## Requisitos, histórias e critérios

- Épico EP05 · Qualidade e Operação › Feature FT14 · Empacotamento e deploy

---

## Requisitos, histórias e critérios: Tabela

- RNF05 Portabilidade & Conteinerização: imagem multi-estágio, Compose e volumes para dados | atendido

---

## US14 — Subir a aplicação em qualquer máquina · RNF05

- Como pessoa responsável pelo deploy,
- quero subir a aplicação inteira com um comando,
- para não depender do que está instalado na máquina de destino.

---

## US14 — Subir a aplicação em qualquer máquina · RNF05: Exemplo

```txt
Cenário: CA14.1 - Um comando sobe tudo
  Dado uma máquina com Docker e sem Node instalado
  Quando executo docker compose up --build
  Então a aplicação responde em http://localhost:3000
Cenário: CA14.2 - As migrations são aplicadas na subida
  Dado um volume de dados vazio
  Quando o contêiner inicia
  Então as migrations pendentes são aplicadas antes de o servidor atender
Cenário: CA14.3 - Segredo não entra na imagem
  Quando inspeciono o conteúdo da imagem
  Então o arquivo .env não está presente
  E os valores chegam pelo environment do Compose
```

---

## Tasks da etapa

- As tarefas abaixo implementam US14 e são a ordem sugerida de execução. Cada uma tem a sua seção detalhada logo em seguida.
- TK13.1 · Criar `Dockerfile`: Receita multi-estágio para build e empacotamento da aplicação Express.
- TK13.2 · Criar `.dockerignore`: Exclusão de arquivos temporários e dependências locais no contexto do build.
- TK13.3 · Criar `compose.yaml`: Orquestração de serviços, portas e variáveis de ambiente com Docker Compose.
- TK13.4 · Criar volumes persistentes: Mapeamento de volumes para preservar o banco SQLite e arquivos de upload.

---

## Estrutura da aplicação

- A imagem contém código, dependências e migrations.
- Os dados que mudam em runtime ficam fora da imagem, em volumes gerenciados pelo Docker Compose:

---

## O que muda nesta etapa?

- Comparando com a etapa de testes, a aplicação não ganha uma linha de regra de negócio. Entram três arquivos de empacotamento, e nada mais:
- Essa é a marca de um empacotamento bem-feito: o `src/`, o `public/` e o `prisma/` chegam intactos da etapa 12.
- Se conteinerizar tivesse exigido mudar a aplicação, alguma dependência do ambiente local teria vazado para o código.

---

## Descrição das tarefas

- Abaixo estão detalhadas as tarefas de implementação desta etapa, com orientações e trechos de código.

---

## TK13.1 · Criar `Dockerfile` (Receita da imagem do aplicativo)

- O arquivo tem trinta e uma linhas e três estágios, separados pelos `FROM` das linhas 7 e 15.
- O primeiro estágio (linhas 1 a 5), apelidado de `deps`, existe só para instalar dependências.
- Ele copia apenas o `package*.json` (linha 4) antes de rodar o `npm ci` (linha 5), e essa ordem é deliberada: o Docker guarda o resultado de cada linha...
- O `--omit=dev` deixa `vitest`, `supertest` e Playwright de fora da imagem final.
- O segundo estágio (linhas 7 a 13) compila o front.

---

## TK13.2 · Criar `.dockerignore` (Exclusão de arquivos no contexto...

- O `COPY..` da linha 11 do `Dockerfile` copia tudo que não estiver listado aqui: por isso este arquivo é de segurança, e não só de desempenho.
- As linhas 1 e 2 evitam mandar dependências e logs da máquina local; a linha 3 mantém o `.env` fora da imagem, e a linha 5 deixa de fora o banco de...
- As linhas 8 e 9 descartam relatórios do Playwright.
- O par de linhas 6 e 7 merece atenção: a primeira ignora todos os uploads já feitos localmente, e a segunda, com `!`, faz uma exceção para o...
- Um `.env` copiado para dentro da imagem viaja com ela para qualquer registry onde ela for publicada: e continua lá mesmo depois de "removido" em uma...

---

## TK13.2 · Criar `.dockerignore` (Exclusão de arquivos no contexto...: Exemplo

```txt
node_modules
npm-debug.log
.env
.git
prisma/dev.db
public/imgs/profile/*
!public/imgs/profile/avatar.png
playwright-report
test-results
```

---

## TK13.3 · Criar `compose.yaml` (Orquestração do contêiner e volumes)

- O Compose documenta, em dezessete linhas, o comando de execução completo que ninguém precisa mais lembrar.
- O serviço `investapp` da linha 2 é construído a partir do próprio diretório (`build:.`, linha 3) e publica a porta 3000 na linha 5.
- O bloco `environment` das linhas 6 a 10 é onde entram os valores que ficaram fora da imagem: o `DATABASE_URL` da linha 8 aponta para...

---

## TK13.3 · Criar `compose.yaml` (Orquestração do contêiner e volumes): Exemplo

```bash
docker compose up -d --build
```

---

## TK13.4 · Declarar os volumes persistentes (`investapp-db` e...

- Contêiner é descartável; dado, não. Os dois volumes das linhas 11 a 13 são o que sobrevive a um `docker compose down` seguido de `up`.
- O `investapp-db` guarda o arquivo SQLite em `/app/data`, e o `investapp-profile-images` guarda os avatares em `/app/public/imgs/profile`: os mesmos...
- A declaração das linhas 15 a 17 é o que registra esses volumes como nomeados e gerenciados pelo Docker.
- Repare que o banco fica em `/app/data`, e não em `/app/prisma`.
- Montar um volume sobre `/app/prisma` esconderia o `schema.prisma` e a pasta `migrations/`, que são justamente o que o `prisma migrate deploy` do `CMD`...

---

## Executando

- Entre na pasta da etapa final:
- Construa e suba com Compose:
- Abra o front:
- Derrube sem apagar os volumes:
- Para recomeçar o banco do zero, remova também os volumes:

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/invest-app-test
```

---

## Executando: Exemplo 2

```bash
   docker compose up --build
```

---

## Testando

- Nesta seção, testamos a execução do InvestApp totalmente containerizado com Docker Compose.
- Com o contêiner em execução, a requisição para a rota raiz (`GET /`) redireciona o navegador para a página de cadastro com status `302 Found`:
- Também vale validar o fluxo completo abrindo o navegador, criando conta, subindo um avatar e confirmando que o arquivo continua disponível depois de...

---

## Testando: Exemplo

```txt
  ### Testar rota raiz da aplicação no Docker
  GET http://localhost:3000/
```

---

## O diff que importa

- Compare a etapa de testes com a etapa de Docker procurando arquivos de runtime, não mudanças em regra de negócio:
- Como as etapas 12 e 12 compartilham a mesma pasta, esse comando mostra as duas de uma vez.
- Na revisão, o que deve aparecer de novo são os três arquivos da tabela acima, mais os arquivos de teste da etapa anterior.
- Qualquer alteração dentro de `src/` ou `public/` merece uma segunda olhada.
- Vale conferir, em particular, quatro linhas do `Dockerfile` e do `compose.yaml`: são elas que separam uma imagem que funciona de uma que só funciona na...

---

## O diff que importa: Exemplo

```bash
git diff --no-index -- \
  examples/courses/expressjs/projects/invest-app-upload \
  examples/courses/expressjs/projects/invest-app-test || true
```

---

## Conceitos abordados

- Imagem Docker multi-estágio para aplicação Node.js
- Ordem das camadas e o cache do `npm ci`
- Execução como usuário sem privilégios com `USER node`
- Prisma Client gerado no build e `migrate deploy` na inicialização
- Compose com variáveis de ambiente e volumes nomeados

---

## Onde continuar?

- Com a imagem pronta, o próximo passo é publicar em um registry e executar a mesma imagem em produção com `JWT_SECRET`, SMTP e volumes definidos pela...

---

## Arquivos-Chave da Aula

- **Dockerfile**: `examples/courses/expressjs/projects/invest-app-test/Dockerfile` (linhas marcadas `3-5,9-13,19-22,26-27,31`)
- **compose.yaml**: `examples/courses/expressjs/projects/invest-app-test/compose.yaml` (linhas marcadas `5,8,11-13,15-17`)

---

## Resumo da Aula

- **InvestApp: Docker** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
