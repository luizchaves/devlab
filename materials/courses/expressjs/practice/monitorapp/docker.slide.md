---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "MonitorApp: Docker"
description: "Décima terceira etapa do MonitorApp: duas imagens Docker — a API em Node e o front compilado servido por Nginx —, orquestração com Compose e volume nomeado para o banco."
---

<!-- _class: lead -->

# MonitorApp: Docker

Décima terceira etapa do MonitorApp: duas imagens Docker — a API em Node e o front compilado servido por Nginx —, orquestração com Compose e volume nomeado para o banco.

---

## Objetivo

- Entender o papel de **MonitorApp: Docker** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/express/projects/monitor-app-test`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US14 — Subir a aplicação em qualquer máquina · RNF05, RNF09, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK13.1 · Escrever `back/Dockerfile` (A imagem da API), TK13.2 · Escrever `front/Dockerfile` e `front/nginx.conf`, TK13.3 · Escrever os `.dockerignore`
- **Executando**
- **O trilho completo**
- **Conceitos abordados**
- **Fim do trilho**

---

## Contexto da Aula

- Etapa 13 de 13 · Nível Avançado · Docker · Docker Compose · Nginx
- A última etapa não escreve nenhuma linha de aplicação.
- Ela empacota o que as doze anteriores construíram, e resolve a pergunta que ficou pendente desde a etapa 2: em produção, quem faz o papel do proxy do Vite?
- O MonitorApp tem duas origens, então tem duas imagens.
- É a diferença mais visível em relação ao InvestApp, que empacota tudo em um contêiner só porque o Express serve o front.

---

## Requisitos, histórias e critérios

- Épico EP05 · Qualidade e Operação › Feature FT14 · Empacotamento e deploy

---

## Requisitos, histórias e critérios: Tabela

- RNF09 Portabilidade & Conteinerização: duas imagens e o Compose | atendido
- RNF05 Origens Separadas: o Nginx assumindo o proxy em produção | atendido

---

## US14 — Subir a aplicação em qualquer máquina · RNF05, RNF09

- Como pessoa responsável pela operação,
- quero subir a aplicação inteira com um comando,
- para não depender da versão de Node instalada na máquina.

---

## US14 — Subir a aplicação em qualquer máquina · RNF05, RNF09: Exemplo

```txt
Cenário: CA14.1 - Um comando sobe tudo
  Quando executo docker compose up --build
  Então a API e o front sobem juntos
  E a aplicação responde em http://localhost:8080
Cenário: CA14.2 - As migrations são aplicadas sozinhas
  Dado um volume de dados vazio
  Quando o contêiner da API inicia
  Então as migrations pendentes são aplicadas antes do servidor subir
Cenário: CA14.3 - A configuração vem do ambiente
  Dado o arquivo compose.yaml
  Então o segredo do JWT e o intervalo do monitor são variáveis
  E nenhum deles está escrito no código
```

---

## Tasks da etapa

- TK13.1 · Escrever `back/Dockerfile`: imagem multi-estágio da API.
- TK13.2 · Escrever `front/Dockerfile` e `front/nginx.conf`: build do Vite e o servidor estático com proxy.
- TK13.3 · Escrever os `.dockerignore`: o que não entra nas imagens.
- TK13.4 · Escrever `compose.yaml`: os dois serviços, as variáveis e o volume.

---

## Estrutura da aplicação

- Esta etapa usa a mesma pasta da etapa 12: o código da aplicação não muda, só ganha os arquivos de empacotamento.
- O diagrama mostra o resultado desses cinco arquivos em execução.
- Vale comparar com o desenho das duas origens da etapa 2: a forma é a mesma, e só o intermediário mudou: o Nginx ocupa exatamente a posição que o...
- Duas coisas atravessam a fronteira do Compose, e as duas são propositais: a porta 8080, única publicada para fora, e o `ping` que a API dispara contra...
- O serviço `api` não expõe porta nenhuma: quem fala com ele é o Nginx, pela rede interna.

---

## O que muda nesta etapa

- O que muda nesta etapa aparece como ponto central da aula, não apenas como item de índice.
- Décima terceira etapa do MonitorApp: duas imagens Docker: a API em Node e o front compilado servido por Nginx —, orquestração com Compose e volume...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## O que muda nesta etapa: Tabela

- dois `npm run dev` em terminais separados: um `docker compose up --build`
- o proxy do Vite entrega `/api`: o Nginx entrega `/api`
- banco em `prisma/dev.db`, no disco do projeto: banco em `/app/data/dev.db`, em volume nomeado
- variáveis no `.env` local: variáveis declaradas no `compose.yaml`
- o `ping` do sistema operacional da máquina: o `ping` instalado na imagem

---

## Descrição das tarefas

- Descrição das tarefas aparece como ponto central da aula, não apenas como item de índice.
- Décima terceira etapa do MonitorApp: duas imagens Docker: a API em Node e o front compilado servido por Nginx —, orquestração com Compose e volume...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## TK13.1 · Escrever `back/Dockerfile` (A imagem da API)

- O arquivo tem dois estágios, e a razão está nas linhas 3 a 5.
- O manifesto é copiado antes do código: assim, uma alteração em `src/` não invalida a camada de `npm ci`, e a instalação de dependências é reaproveitada...
- Inverter essas duas linhas transformaria cada build em uma instalação completa.
- Três linhas do segundo estágio merecem leitura:
- Linha 12: `apk add iputils`. A imagem `node:24-alpine` não traz o binário `ping`. Sem esta

---

## TK13.2 · Escrever `front/Dockerfile` e `front/nginx.conf`

- O front também usa dois estágios, mas por outro motivo.
- O primeiro estágio (linhas 1 a 7) roda o build do Vite; o segundo (linhas 9 a 12) copia apenas o `dist/` para uma imagem `nginx:alpine`.
- O resultado é uma imagem sem Node, sem `node_modules` e sem código-fonte: HTML, CSS e JavaScript estáticos, servidos por um servidor web.
- É a consequência de o front do MonitorApp ter build próprio desde a etapa 1.
- O `nginx.conf` é o arquivo que fecha o ciclo aberto na etapa 2.

---

## TK13.3 · Escrever os `.dockerignore`

- Os dois arquivos existem para o mesmo par de motivos: tamanho e segurança.
- O `back/.dockerignore` mantém fora `node_modules` (que seria reinstalado no estágio de deps, para a plataforma certa), `.git`, `prisma/dev.db`: o banco...
- O do front é mais curto: `node_modules` e o `dist/` local, que seria sobrescrito pelo build do estágio anterior.

---

## TK13.3 · Escrever os `.dockerignore`: Exemplo

```txt
node_modules
npm-debug.log
.env
.git
prisma/dev.db
playwright-report
test-results
```

---

## TK13.4 · Escrever `compose.yaml` (Os dois serviços)

- O arquivo declara os dois serviços que a arquitetura sempre teve.
- O serviço `api` das linhas 4 a 13 não expõe porta.
- É uma escolha deliberada: em produção ninguém precisa falar com a API diretamente: quem faz isso é o Nginx, pela rede interna do Compose.
- Só o serviço `front` publica uma porta, a 8080 da linha 18.
- As variáveis das linhas 7 a 11 são a configuração inteira da aplicação, e reúnem o que foi introduzido ao longo do trilho: o `DATABASE_URL` da etapa 7...

---

## Executando

- Abra http://localhost:8080 e crie uma conta. Não há seed automático: a base do
- volume começa vazia.
- Confira que o processo não é root:
- Confira que o `ping` existe na imagem:
- Prove a persistência:

---

## Executando: Exemplo 1

```bash
   cd examples/courses/express/projects/monitor-app-test
   docker compose up --build
```

---

## Executando: Exemplo 2

```bash
   docker compose exec api whoami
```

---

## O trilho completo

- Treze etapas depois, vale olhar para trás. Nada do que entrou foi desfeito:
- E o que não foi feito está registrado: a feature `FT06 · Alertas de indisponibilidade`, no backlog, é o próximo incremento natural do produto: e um bom...

---

## O trilho completo: Tabela

- 1: telas em HTML e Tailwind, no Vite | sim: são as mesmas quatro páginas
- 2: Express, CORS, proxy e o front vanilla | sim
- 3: TypeScript, camadas e `HttpError` | sim
- 4: schemas Zod nas três fontes | sim
- 5: OpenAPI derivado dos schemas | sim
- 6: persistência relacional | substituída pelo Prisma na 7

---

## Conceitos abordados

- Build multi-estágio e ordem de camadas para aproveitar cache
- Dependências de sistema que a aplicação assume existir (`iputils`)
- Usuário não-root dentro do contêiner
- Nginx como proxy reverso no lugar do servidor de desenvolvimento
- Buffer e timeout de proxy em respostas de fluxo contínuo

---

## Fim do trilho

- Voltar à visão geral do MonitorApp · Backlog do produto · Especificação da API
- Para comparar as duas arquiteturas lado a lado, vale percorrer o InvestApp: a mesma trilha, com o front servido pelo próprio Express.

---

## Arquivos-Chave da Aula

- **back/Dockerfile**: `examples/courses/express/projects/monitor-app-test/back/Dockerfile` (linhas marcadas `3-5,12,17,19-20,24`)
- **front/Dockerfile**: `examples/courses/express/projects/monitor-app-test/front/Dockerfile` (linhas marcadas `6-7,9-11`)
- **front/nginx.conf**: `examples/courses/express/projects/monitor-app-test/front/nginx.conf` (linhas marcadas `8-16`)
- **compose.yaml**: `examples/courses/express/projects/monitor-app-test/compose.yaml` (linhas marcadas `4-13,22-23`)

---

## Resumo da Aula

- **MonitorApp: Docker** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
