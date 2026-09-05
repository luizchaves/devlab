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
title: "InvestApp: Front estático"
description: "Primeira etapa do InvestApp: telas estáticas em HTML e Tailwind CSS, sem JavaScript, preparando a UX que será conectada à API nas próximas etapas."
---

<!-- _class: lead -->

# InvestApp: Front estático

Primeira etapa do InvestApp: telas estáticas em HTML e Tailwind CSS, sem JavaScript, preparando a UX que será conectada à API nas próximas etapas.

---

## Objetivo

- Entender o papel de **InvestApp: Front estático** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/invest-app-static`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US01 — Conhecer o sistema antes de usá-lo · RF01, RF02, RF03, RF06, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK01.1 · Criar `index.html` (Dashboard de Investimentos), TK01.2 · Carregar o Tailwind e criar `css/components.css`, TK01.3 · Criar `signup.html` (Tela de criação de conta)
- **Executando**
- **Conceitos abordados**
- **Próxima etapa**

---

## Contexto da Aula

- Etapa 1 de 13 · Nível Iniciante · HTML · Tailwind CSS · Sem JavaScript
- O InvestApp começa pela experiência visual completa.
- Nesta etapa existem telas, navegação, formulários e estados estáticos, mas nenhum `fetch`, nenhum manipulador de evento e nenhum arquivo JavaScript.
- A ideia é congelar a UX antes de ligar comportamento.
- Estrutura de Aplicações Web: veja Introdução ao Express.js e Rotas e Arquivos Estáticos

---

## Requisitos, histórias e critérios

- Épico EP01 · Experiência e Carteira › Feature FT01 · Telas do sistema
- Esta etapa não fecha nenhum requisito: ela desenha a superfície de quatro deles, que serão implementados mais adiante.

---

## Requisitos, histórias e critérios: Tabela

- RF01 Gestão de Investimentos: a tela da carteira e o formulário de novo ativo | preparado
- RF02 Cadastro de Usuários: o formulário de `signup.html` e seus quatro campos | preparado
- RF03 Autenticação & Sessão: o formulário de `signin.html` | preparado
- RF06 Gestão de Perfil & Avatar: o painel de perfil e a área de soltar arquivo | preparado

---

## US01 — Conhecer o sistema antes de usá-lo · RF01, RF02, RF03, RF06

- Como visitante,
- quero navegar pelas telas de carteira, cadastro, login e perfil,
- para entender o que a aplicação faz antes de confiar meus dados a ela.

---

## US01 — Conhecer o sistema antes de usá-lo · RF01, RF02, RF03, RF06: Exemplo

```txt
Cenário: CA01.1 - As telas abrem sem servidor
  Dado que o projeto foi apenas baixado, sem instalação
  Quando abro o arquivo index.html no navegador
  Então a página da carteira é exibida com os cartões de exemplo
Cenário: CA01.2 - A navegação liga as quatro telas
  Dado que estou na página index.html
  Quando clico nos links do cabeçalho
  Então chego a signin.html, signup.html e profile.html
  E nenhuma navegação depende de JavaScript
Cenário: CA01.3 - Os campos já declaram o contrato futuro
  Dado que abro o formulário de novo investimento
  Então os campos têm os atributos name "name", "value" e "interest"
```

---

## Tasks da etapa

- As tarefas abaixo implementam US01 e são a ordem sugerida de execução. Cada uma tem a sua seção detalhada logo em seguida.
- TK01.1 · Criar `index.html`: Dashboard principal com métricas, lista de investimentos e formulário.
- TK01.2 · Carregar o Tailwind e criar `css/components.css`: utilitários pelo Play CDN e o vocabulário visual do produto.
- TK01.3 · Criar `signup.html`: Formulário visual de criação de conta do investidor.
- TK01.4 · Criar `signin.html`: Tela visual de autenticação com e-mail e senha.

---

## Estrutura da aplicação

- O front nasce como um protótipo navegável em HTML.
- Os utilitários do Tailwind vêm do Play CDN, que os gera no navegador, e o arquivo `css/components.css` concentra o vocabulário visual do produto.
- A regra da etapa continua valendo: sem JavaScript de aplicação.

---

## O que muda nesta etapa?

- Esta é a primeira etapa, então não existe um diff contra a etapa anterior: tudo é novo.
- O que vale registrar é a fronteira que a etapa impõe: quatro páginas e uma folha de estilo entram, e todo o comportamento fica para a etapa 2.

---

## O que muda nesta etapa?: Tabela

- o Play CDN do Tailwind e o `css/components.css`: `fetch`, manipuladores de evento e estado de tela

---

## Descrição das tarefas

- Abaixo estão detalhadas as tarefas de implementação desta etapa, com orientações e trechos de código.

---

## TK01.1 · Criar `index.html` (Dashboard de Investimentos)

- O dashboard é montado com três blocos.
- O cabeçalho de navegação ocupa as linhas 11 a 27; o resumo da carteira aparece no cartão `` das linhas 39 a 43; e a grade de ativos repete a mesma...
- Os dois cartões seguintes (linhas 59 a 81) são cópias com outros textos e por isso aparecem recolhidos: a estrutura que importa é a do cartão visível.
- Repare como as classes se dividem nesses blocos.
- Essa divisão vale nas treze etapas.

---

## TK01.2 · Carregar o Tailwind e criar `css/components.css`

- Um protótipo não deveria precisar de build.
- É exatamente para isso que existe o Play CDN do Tailwind: um `` que compila as classes no próprio navegador, olhando o HTML da página e gerando só o...
- A divisão entre as duas linhas é o ponto da tarefa:
- O Tailwind não tem: nem deveria ter: uma classe para "cartão de investimento".
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

## TK01.3 · Criar `signup.html` (Tela de criação de conta)

- O cartão centralizado das linhas 12 a 25 repete a moldura que o `signin.html` também usa, e por isso está recolhido: é a mesma combinação de `card...
- O `` destacado nas linhas 26 a 73 é a novidade da tela.
- Ele declara os quatro campos do cadastro pelos atributos `name`: `name="name"` na linha 33, `name="email"` na linha 44, `name="password"` na linha 55 e...
- Esses nomes são exatamente o corpo que a etapa 8 vai enviar em `POST /api/users`.
- O botão da linha 72 também usa `type="button"`: a tela define a experiência de onboarding, mas o envio real: com o hash da senha no servidor: só entra...

---

## TK01.4 · Criar `signin.html` (Tela de autenticação)

- O login é a tela mais enxuta do projeto e reaproveita a mesma moldura do cadastro nas linhas 12 a 25, recolhidas por serem idênticas às do `signup.html`.
- O formulário destacado nas linhas 26 a 51 reduz a entrada a dois campos: `name="email"` na linha 33 e `name="password"` na linha 44.
- O botão da linha 50 fecha o formulário, e o link do rodapé leva ao cadastro.
- Esses dois campos são a interface que, na etapa 9, vai receber o token JWT devolvido por `POST /api/signin` e guardá-lo no `localStorage`.

---

## TK01.5 · Criar `profile.html` e `public/imgs/profile/avatar.png`...

- A tela de perfil divide a área principal em dois cartões lado a lado, e é a grade da linha 30 que os posiciona:...
- O primeiro trecho destacado, nas linhas 36 a 49, mostra a identidade do usuário: a tag `` da linha 37 carrega o `avatar.png` que acompanha o projeto, e...
- São texto, e não campos de formulário, porque nesta etapa não há de onde carregá-los: a partir da etapa 11 o `profile.js` preenche esses mesmos...
- O segundo trecho destacado, nas linhas 52 a 63, é o formulário de upload: o `` da linha 58 embrulha o `` da linha 60, de modo que a área inteira vira...
- Ele deixa o painel pronto para a etapa 11, quando esse mesmo bloco passa a disparar um `FormData` para o endpoint de upload com Multer.

---

## Executando

- Entre no exemplo estático:
- Abra o HTML diretamente no navegador ou gere a versão otimizada:
- Navegue entre `index.html`, `signup.html`, `signin.html` e `profile.html`.
- O `vite.config.js` que faz isso é curto e tem uma decisão em cada bloco.
- O `base: './'` da linha 14 gera caminhos relativos, o que permite abrir o `dist/` direto do disco; o `publicDir` da linha 16 marca `public/` como pasta...

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/invest-app-static
```

---

## Executando: Exemplo 2

```bash
   npm install
   npm run build
   npm run preview
```

---

## Conceitos abordados

- Estrutura de páginas HTML sem build
- Play CDN do Tailwind para prototipar sem build
- A fronteira entre utilitário genérico e componente do produto
- Formulários preparados para etapas futuras
- Avatar e navegação de perfil já previstos

---

## Próxima etapa

- InvestApp: API em memória: o Express passa a servir o front e as rotas de investimento entram em `/api`.

---

## Arquivos-Chave da Aula

- **index.html**: `examples/courses/expressjs/projects/invest-app-static/index.html` (linhas marcadas `84-111`)
- **css/components.css**: `examples/courses/expressjs/projects/invest-app-static/css/components.css` (linhas marcadas `148-208`)
- **signup.html**: `examples/courses/expressjs/projects/invest-app-static/signup.html` (linhas marcadas `26-73`)
- **signin.html**: `examples/courses/expressjs/projects/invest-app-static/signin.html` (linhas marcadas `26-51`)
- **profile.html**: `examples/courses/expressjs/projects/invest-app-static/profile.html` (linhas marcadas `36-49,52-63`)
- **vite.config.js**: `examples/courses/expressjs/projects/invest-app-static/vite.config.js` (linhas marcadas `14,16,22-27`)

---

## Resumo da Aula

- **InvestApp: Front estático** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
