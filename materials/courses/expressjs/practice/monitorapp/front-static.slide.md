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
title: "MonitorApp: Front estático"
description: "Primeira etapa do MonitorApp: quatro telas estáticas em HTML e Tailwind CSS dentro do projeto Vite, sem JavaScript, preparando a UX que será conectada à API nas próximas etapas."
---

<!-- _class: lead -->

# MonitorApp: Front estático

Primeira etapa do MonitorApp: quatro telas estáticas em HTML e Tailwind CSS dentro do projeto Vite, sem JavaScript, preparando a UX que será conectada à API nas próximas etapas.

---

## Objetivo

- Entender o papel de **MonitorApp: Front estático** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/monitor-app-static`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US01 — Conhecer o sistema antes de usá-lo · RF01, RF02, RF03, RF05, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK01.1 · Criar `index.html` (Painel de hosts), TK01.2 · Carregar o Tailwind e criar `css/components.css`, TK01.3 · Criar `host.html` (Histórico de um host)
- **Executando**
- **Conceitos abordados**
- **Próxima etapa**

---

## Contexto da Aula

- Etapa 1 de 13 · Nível Iniciante · HTML · Tailwind CSS · Vite · Sem JavaScript
- O MonitorApp começa pela experiência visual completa.
- Nesta etapa existem telas, navegação, formulários e estados estáticos, mas nenhum `fetch`, nenhum manipulador de evento e nenhum arquivo JavaScript de...
- A ideia é congelar a UX antes de ligar comportamento: e já nascer dentro do projeto Vite, que é a casa definitiva do front.
- Estrutura de Aplicações Web: veja Introdução ao Express.js e Rotas e Arquivos Estáticos

---

## Requisitos, histórias e critérios

- Épico EP01 · Inventário e Observação › Feature FT01 · Telas do sistema
- Esta etapa não fecha nenhum requisito: ela desenha a superfície de quatro deles, que serão implementados mais adiante.

---

## Requisitos, histórias e critérios: Tabela

- RF01 Gestão de Hosts: o painel de hosts e o formulário de cadastro | preparado
- RF02 Classificação por Tags: os badges de tag no cartão e o campo de tags no formulário | preparado
- RF03 Histórico de Medições: a tela de histórico, com gráfico e tabela | preparado
- RF05 Cadastro de Usuários: os formulários de `signup.html` e `signin.html` | preparado

---

## US01 — Conhecer o sistema antes de usá-lo · RF01, RF02, RF03, RF05

- Como visitante,
- quero navegar pelas telas de inventário, histórico, login e cadastro,
- para entender o que a aplicação faz antes de confiar meus dados a ela.

---

## US01 — Conhecer o sistema antes de usá-lo · RF01, RF02, RF03, RF05: Exemplo

```txt
Cenário: CA01.1 - As telas sobem só com o front
  Dado que o projeto foi apenas baixado
  Quando rodo npm install e npm run dev dentro de front/
  Então as páginas abrem sem que exista API nem banco de dados
Cenário: CA01.2 - A navegação liga as quatro telas
  Dado que estou na página index.html
  Quando clico nos links do cabeçalho
  Então chego a host.html, signin.html e signup.html
  E nenhuma navegação depende de JavaScript
Cenário: CA01.3 - Os campos já declaram o contrato futuro
  Dado que abro o formulário de novo host
  Então os campos têm os atributos name "name", "address" e "tags"
```

---

## Tasks da etapa

- As tarefas abaixo implementam US01 e são a ordem sugerida de execução. Cada uma tem a sua seção detalhada logo em seguida.
- TK01.1 · Criar `index.html`: painel principal com métricas, cartões de host e formulário.
- TK01.2 · Carregar o Tailwind e criar `css/components.css`: utilitários pelo Play CDN e o vocabulário visual do produto.
- TK01.3 · Criar `host.html`: histórico de um host, com gráfico da série e tabela de medições.
- TK01.4 · Criar `signin.html` e `signup.html`: as telas de sessão e de cadastro.

---

## Estrutura da aplicação

- O front nasce como um protótipo navegável em HTML dentro de `front/`.
- Os utilitários do Tailwind vêm do Play CDN, que os gera no navegador, e o arquivo `css/components.css` concentra o vocabulário visual do produto.
- A regra da etapa continua valendo: sem JavaScript de aplicação.
- Repare que não existe pasta `back/` ainda.
- Ela nasce na etapa 2: e o fato de o front rodar sozinho, sem servidor de aplicação, é justamente o que caracteriza a arquitetura de duas origens do...

---

## O que muda nesta etapa

- Esta é a primeira etapa, então não existe um diff contra a etapa anterior: tudo é novo.
- O que vale registrar é a fronteira que a etapa impõe: quatro páginas e uma folha de estilo entram, e todo o comportamento fica para a etapa 2.

---

## O que muda nesta etapa: Tabela

- o Play CDN do Tailwind e o `css/components.css`: `fetch`, manipuladores de evento e estado de tela
- dados de exemplo escritos à mão no HTML: a pasta `back/`, o servidor Express e o banco

---

## Descrição das tarefas

- Abaixo estão detalhadas as tarefas de implementação desta etapa, com orientações e trechos de código.

---

## TK01.1 · Criar `index.html` (Painel de hosts)

- O painel é montado com três blocos.
- O cabeçalho de navegação ocupa as linhas 10 a 23; a faixa de métricas da rede aparece na `` das linhas 36 a 49, com três cartões `.card.metric`; e a...
- Os dois cartões seguintes (linhas 73 a 111) são cópias com outros textos e por isso aparecem recolhidos: a estrutura que importa é a do cartão visível.
- Dentro do cartão moram os três elementos que resumem um host: o `` da linha 61, que é a pastilha de estado; a `` da linha 65, uma barra proporcional...
- Comparar o primeiro cartão com o terceiro (linha 93 em diante) mostra o contraste: `status-offline`, `--latency: 0` e o texto "sem resposta" no lugar...

---

## TK01.2 · Carregar o Tailwind e criar `css/components.css`

- Um protótipo não deveria precisar de build.
- É exatamente para isso que existe o Play CDN do Tailwind: um `` que compila as classes no próprio navegador, olhando o HTML da página e gerando só o...
- A divisão entre as duas linhas é o ponto da tarefa:
- O Tailwind não tem: nem deveria ter: uma classe para "pastilha de estado de host".
- Utilitário é o que serve a qualquer projeto; componente é o que serve a este.

---

## TK01.2 · Carregar o Tailwind e criar `css/components.css`: Tabela

- Play CDN: os utilitários do Tailwind, gerados em tempo de execução | `flex`, `gap-4`, `text-slate-500`, `md:grid-cols-3`

---

## TK01.2 · Carregar o Tailwind e criar `css/components.css`: Exemplo

```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
<link rel="stylesheet" href="css/components.css" />
```

---

## TK01.3 · Criar `host.html` (Histórico de um host)

- Esta é a tela que justifica o produto: um host não tem "um estado", tem uma série de medições. A página divide isso em três seções.
- A faixa de métricas das linhas 39 a 52 resume a série em três números: última latência, média das 24 horas e disponibilidade em porcentagem.
- O trecho destacado nas linhas 54 a 60 é o gráfico: um `` com `viewBox="0 0 300 80"` e um único `` na linha 58, cujo atributo `d` desenha a série...
- Não há biblioteca de gráficos envolvida: e na etapa 7, quando os dados vierem do banco, o JavaScript vai apenas recalcular esse mesmo `d`.
- A tabela das linhas 62 a 95 é o histórico por extenso.

---

## TK01.4 · Criar `signin.html` e `signup.html` (Telas de sessão)

- As duas telas compartilham a mesma moldura: um `.card p-6` centralizado em `.max-w-md` —, e por isso o cabeçalho aparece recolhido nas duas.
- No `signup.html`, o `` destacado nas linhas 21 a 39 declara os quatro campos do cadastro pelos atributos `name`: `name="name"` na linha 24,...
- Esses nomes são exatamente o corpo que a etapa 9 vai enviar em `POST /api/users`.
- O `signin.html` reduz a entrada a dois campos: `name="email"` na linha 24 e `name="password"` na linha 28.
- O botão da linha 30 usa a variante `.btn-dark`, diferente do `.btn-primary` do cadastro, para diferenciar visualmente a ação de entrar da ação de criar...

---

## TK01.5 · Criar `vite.config.js` e `package.json` (O projeto do front)

- O Vite trata cada HTML como um ponto de entrada.
- Como o MonitorApp tem quatro páginas e não uma SPA, as quatro precisam ser declaradas em `build.rollupOptions.input`: o bloco das linhas 11 a
- Sem isso, `npm run build` geraria apenas o `index.html` e as outras três ficariam de fora do
- Este arquivo vai crescer exatamente uma vez em todo o projeto: na etapa 2, quando ganhar a seção `server.proxy` que liga o front à API.

---

## Executando

- Entre no front desta etapa:
- Instale e suba o servidor de desenvolvimento:
- Abra http://localhost:5173 e navegue entre `index.html`, `host.html`,
- Separar primeiro a experiência visual evita misturar três problemas ao mesmo tempo: layout, contrato HTTP e estado de tela.
- A próxima etapa mantém exatamente estas páginas, troca o Play CDN pelo Tailwind compilado no Vite e conecta o formulário à API usando JavaScript vanilla.

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/monitor-app-static/front
```

---

## Executando: Exemplo 2

```bash
   npm install
   npm run dev
```

---

## Conceitos abordados

- Estrutura de páginas HTML sem framework de front-end
- Play CDN do Tailwind para prototipar sem build
- A fronteira entre utilitário genérico e componente do produto
- Variáveis CSS (`--latency`, `--tag-color`) como ponte entre dado e estilo
- Gráfico em SVG puro, sem biblioteca

---

## Próxima etapa

- MonitorApp: API em memória: o Express entra em `back/`, as rotas de host aparecem em `/api` e o proxy do Vite liga as duas origens.

---

## Arquivos-Chave da Aula

- **front/index.html**: `examples/courses/expressjs/projects/monitor-app-static/front/index.html` (linhas marcadas `114-133`)
- **front/css/components.css**: `examples/courses/expressjs/projects/monitor-app-static/front/css/components.css` (linhas marcadas `108-158`)
- **front/host.html**: `examples/courses/expressjs/projects/monitor-app-static/front/host.html` (linhas marcadas `54-60`)
- **front/signup.html**: `examples/courses/expressjs/projects/monitor-app-static/front/signup.html` (linhas marcadas `21-39`)
- **front/signin.html**: `examples/courses/expressjs/projects/monitor-app-static/front/signin.html` (linhas marcadas `21-31`)
- **front/vite.config.js**: `examples/courses/expressjs/projects/monitor-app-static/front/vite.config.js` (linhas marcadas `9-18`)

---

## Resumo da Aula

- **MonitorApp: Front estático** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
