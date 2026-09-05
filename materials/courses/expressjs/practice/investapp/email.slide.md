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
title: "InvestApp: E-mail"
description: "Nona etapa do InvestApp: configuração de SMTP com nodemailer e envio de e-mail para confirmar que a conta foi criada."
---

<!-- _class: lead -->

# InvestApp: E-mail

Nona etapa do InvestApp: configuração de SMTP com nodemailer e envio de e-mail para confirmar que a conta foi criada.

---

## Objetivo

- Entender o papel de **InvestApp: E-mail** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/invest-app-email`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US11 — Confirmar que a conta foi criada · RF05, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK10.1 · Instalar Nodemailer e criar `src/services/SendMail.ts` (Serviço de e-mail), TK10.2 · Criar `src/config/mail.ts` (Configuração SMTP), TK10.3 · Modificar `src/controllers/users.controller.ts` (Disparo depois do cadastro)
- **O fluxo**
- **Executando**
- **Testando**
- **O diff que importa**

---

## Contexto da Aula

- Etapa 10 de 13 · Nível Avançado · TypeScript · Express.js · Nodemailer · SMTP
- Com cadastro e autenticação funcionando, o InvestApp passa a avisar o usuário quando uma conta é criada.
- Em desenvolvimento, o envio usa conta temporária do Ethereal e imprime uma URL de prévia no terminal.
- Serviços Transacionais: veja Envio de E-mail com Nodemailer

---

## Requisitos, histórias e critérios

- Épico EP03 · Perfil e Notificações › Feature FT07 · E-mail de boas-vindas

---

## Requisitos, histórias e critérios: Tabela

- RF05 Notificação de Boas-Vindas: envio transacional após o cadastro, isolado em um serviço | atendido

---

## US11 — Confirmar que a conta foi criada · RF05

- Como novo usuário,
- quero receber um e-mail logo após me cadastrar,
- para ter certeza de que a conta existe e de que o endereço está correto.

---

## US11 — Confirmar que a conta foi criada · RF05: Exemplo

```txt
Cenário: CA11.1 - Cadastro dispara a mensagem
  Quando um usuário é criado com sucesso
  Então uma mensagem de boas-vindas é enviada para o e-mail informado
Cenário: CA11.2 - Cadastro que falha não avisa ninguém
  Quando o cadastro é recusado por e-mail duplicado
  Então nenhuma mensagem é enviada
Cenário: CA11.3 - Prévia em desenvolvimento
  Dado NODE_ENV igual a "development"
  Quando uma mensagem é enviada
  Então o terminal imprime uma URL de prévia
  E nada é entregue a um destinatário real
```

---

## Tasks da etapa

- As tarefas abaixo implementam US11 e são a ordem sugerida de execução. Cada uma tem a sua seção detalhada logo em seguida.
- TK10.1 · Instalar Nodemailer e criar `src/services/SendMail.ts`: Serviço que monta e envia a mensagem.
- TK10.2 · Criar `src/config/mail.ts`: Configuração do SMTP por variável de ambiente.
- TK10.3 · Modificar `src/controllers/users.controller.ts`: Disparo do e-mail depois do cadastro.
- TK10.4 · Dar retorno ao usuário no front: Validação no cliente, mensagem no campo do e-mail duplicado e um toast para o resto.

---

## Estrutura da aplicação

- É a etapa com o menor delta do trilho: duas pastas novas, `config/` e `services/`, e uma única linha acrescentada ao controller de usuário.
- O desenho isola o transporte: nenhum arquivo além de `services/SendMail.ts` sabe que existe SMTP, e quem chama pede apenas “avise que a conta foi criada”.

---

## O que muda nesta etapa

- Comparando com a etapa de autenticação, entram dois arquivos novos: `src/config/mail.ts` e `src/services/SendMail.ts`: e um bloco no controller de...

---

## Descrição das tarefas

- Abaixo estão detalhadas as tarefas de implementação desta etapa, com orientações e trechos de código.

---

## TK10.1 · Instalar Nodemailer e criar `src/services/SendMail.ts`...

- O serviço concentra tudo que sabe sobre SMTP em um arquivo só, e expõe uma função com nome de intenção: `createNewUser`: em vez de uma genérica `send`.
- Quem chama não decide assunto, remetente nem formato.
- As linhas 13 a 16 são a saída de emergência: sem `EMAIL_HOST` configurado, o envio é apenas registrado no log e a função retorna.
- É o que permite rodar os testes da etapa 12 sem servidor de e-mail.
- O `sendMail` das linhas 20 a 27 monta a mensagem. Repare que ela vai em dois formatos: `text` na linha 25 e `html` na linha 26.

---

## TK10.1 · Instalar Nodemailer e criar `src/services/SendMail.ts`...: Exemplo

```bash
npm install nodemailer
npm install -D @types/nodemailer
```

---

## TK10.2 · Criar `src/config/mail.ts` (Configuração SMTP)

- A configuração é uma função assíncrona, e não um objeto: a razão está nas linhas 18 a 22.
- O bloco das linhas 8 a 16 monta o transporte a partir de quatro variáveis de ambiente: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE` e as credenciais.
- Nenhuma senha no código, e trocar de provedor é editar o `.env`.
- Já as linhas 18 a 22 são o atalho de desenvolvimento: quando `NODE_ENV` é `development`, o `createTestAccount()` cria uma caixa de correio descartável...
- Como essa criação é uma chamada de rede, a configuração precisa ser `async`: daí o `await mailConfig()` no serviço.

---

## TK10.3 · Modificar `src/controllers/users.controller.ts` (Disparo...

- Toda a mudança na criação de usuário cabe no bloco das linhas 19 a 23.
- A posição importa. O envio vem depois do `User.create` da linha 14, porque não faz sentido avisar sobre uma conta que falhou ao ser criada.
- E o `try`/`catch` em volta dele importa ainda mais: o e-mail é efeito colateral, não regra de negócio.
- Um SMTP fora do ar não pode impedir alguém de criar conta, então a falha é registrada e o cadastro segue para o `201` da linha 25.

---

## TK10.4 · Dar retorno ao usuário no front (validação, campo...

- O servidor desta etapa passou a ter duas respostas que o usuário precisa entender: o cadastro deu certo e um e-mail saiu, ou o e-mail já estava...
- Até aqui o `signup.js` escrevia `console.log('Error no cadastro')`: o que é o mesmo que não dizer nada.
- O envio ganha três caminhos, e cada um corresponde a uma resposta da API.
- A linha 10 só chama a API se o formulário for válido pelo próprio HTML; a linha 16 redireciona quando o cadastro passa; e as linhas 17 a 26 tratam o...
- Só o que não se encaixa em nenhum campo cai no toast da linha 28.

---

## O fluxo

- O cadastro continua retornando o usuário sem senha.
- A diferença é que, depois da criação no banco, o servidor dispara uma mensagem para confirmar a criação da conta:
- Esse é o desenho que se espera de uma integração externa: o serviço fica isolado, quem o chama o faz por um nome que descreve a intenção, e nenhuma...
- O Nodemailer é a biblioteca padrão para falar SMTP em Node, e é a escolha certa para aprender o mecanismo: conexão, autenticação, remetente, corpo em...
- Em produção, porém, o gargalo do e-mail transacional raramente é a biblioteca: é a entregabilidade.

---

## Executando

- Entre no exemplo desta etapa:
- Defina `NODE_ENV=development` para usar Ethereal automaticamente:
- Suba a API e cadastre uma conta:
- Depois do cadastro, o terminal mostra uma URL de prévia da mensagem enviada.

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/invest-app-email
   npm install
```

---

## Executando: Exemplo 2

```bash
   cp .env.example .env
```

---

## Testando

- Nesta seção, testamos o envio automático de e-mail de boas-vindas acionado após o cadastro.
- Ao enviar o cadastro via `POST /api/users`, a aplicação persiste o usuário no banco, envia o e-mail via Nodemailer/Ethereal e retorna o usuário...
- { "name": "Maria", "email": "maria@email.com", "password": "senha12345", "confirmationPassword": "senha12345" }
- { "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d", "name": "Maria", "email": "maria@email.com" }
- O teste manual desta etapa inclui conferir a linha `Send email: https://ethereal.email/...` no terminal e abrir a prévia da mensagem.

---

## Testando: Exemplo

```txt
  ### Testar cadastro com envio automático de e-mail de boas-vindas
  POST http://localhost:3000/api/users
  Content-Type: application/json
  {
    "name": "Maria",
    "email": "maria@email.com",
    "password": "senha12345",
    "confirmationPassword": "senha12345"
  }
```

---

## O diff que importa

- Compare a etapa anterior com esta focando em `routes`, `config` e `services`:
- O que precisa aparecer é pequeno e localizado: os dois arquivos novos (`config/mail.ts` e `services/SendMail.ts`) e o bloco no `users.controller.ts`.
- Se o diff mostrar `nodemailer` em qualquer outro arquivo, o isolamento do serviço se perdeu.

---

## O diff que importa: Exemplo

```bash
git diff --no-index -- \
  examples/courses/expressjs/projects/invest-app-auth/src \
  examples/courses/expressjs/projects/invest-app-email/src || true
```

---

## Conceitos abordados

- Configuração SMTP por variável de ambiente
- Serviço `SendMail` isolado da rota
- E-mail de confirmação de criação de conta
- Tratamento de falha de envio
- A aula correspondente é Envio de E-mail.

---

## Próxima etapa

- InvestApp: Upload de avatar: receber um arquivo do usuário e ligar a imagem ao perfil.

---

## Arquivos-Chave da Aula

- **src/services/SendMail.ts**: `examples/courses/expressjs/projects/invest-app-email/src/services/SendMail.ts` (linhas marcadas `13-16,20-27,29-31`)
- **src/config/mail.ts**: `examples/courses/expressjs/projects/invest-app-email/src/config/mail.ts` (linhas marcadas `8-16,18-22`)
- **src/controllers/users.controller.ts**: `examples/courses/expressjs/projects/invest-app-email/src/controllers/users.controller.ts` (linhas marcadas `5,19-23`)
- **public/js/signup.js**: `examples/courses/expressjs/projects/invest-app-email/public/js/signup.js` (linhas marcadas `10,16,17-26,28,31`)
- **public/js/signup.js: os manipuladores**: `examples/courses/expressjs/projects/invest-app-email/public/js/signup.js` (linhas marcadas `35,43,64`)
- **public/js/signin.js**: `examples/courses/expressjs/projects/invest-app-email/public/js/signin.js` (linhas marcadas `11,17,19,22,26-33`)

---

## Resumo da Aula

- **InvestApp: E-mail** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
