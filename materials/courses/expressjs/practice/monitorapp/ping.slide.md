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
title: "MonitorApp: Ping real"
description: "Oitava etapa do MonitorApp: execução do comando ping do sistema com node:child_process, parser da latência, agendador periódico e medição sob demanda pela interface."
---

<!-- _class: lead -->

# MonitorApp: Ping real

Oitava etapa do MonitorApp: execução do comando ping do sistema com node:child_process, parser da latência, agendador periódico e medição sob demanda pela interface.

---

## Objetivo

- Entender o papel de **MonitorApp: Ping real** dentro de uma aplicação Express.js real.
- Relacionar rota, middleware, controller, serviço/model e resposta HTTP.
- Ler o código de exemplo como fonte principal, sem depender de pseudocódigo.
- Executar requisições e validar status, payloads e efeitos persistidos.

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/monitor-app-ping`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Requisitos, histórias e critérios**: US08 — Saber se o host está no ar sem abrir o terminal · RF04, RNF04, Tasks da etapa
- **Estrutura da aplicação**
- **O que muda nesta etapa**
- **Descrição das tarefas**: TK08.1 · Criar `src/lib/ping.ts` (A chamada de sistema), TK08.2 · Acrescentar `Ping.check` ao model, TK08.3 · Criar `src/services/monitor.ts` (O agendador)
- **Testando**
- **Executando**
- **Conceitos abordados**
- **Próxima etapa**

---

## Contexto da Aula

- Etapa 8 de 13 · Nível Avançado · `node:child_process` · Agendador
- Até a etapa 7 o histórico de medições existia, mas era ficção: as quatro medições de cada host vinham do seeder.
- Esta etapa faz o servidor produzir os próprios dados, executando o comando `ping` do sistema operacional.
- É a etapa mais delicada do projeto em termos de segurança.
- Executar um comando do sistema com um valor que veio de uma requisição HTTP é a receita clássica de injeção de comando: e é justamente por isso que...

---

## Requisitos, histórias e critérios

- Épico EP02 · Coleta e Tempo Real › Feature FT04 · Coleta automática e sob demanda

---

## Requisitos, histórias e critérios: Tabela

- RF03 Histórico de Medições: medições reais, não mais semeadas | atendido
- RF04 Coleta Automática e Sob Demanda: agendador e `POST /hosts/:id/pings` | atendido
- RNF04 Segurança na Chamada de Sistema: `execFile` sem shell | atendido

---

## US08 — Saber se o host está no ar sem abrir o terminal · RF04, RNF04

- Como responsável pela rede,
- quero que o sistema meça os hosts sozinho e me deixe antecipar uma medição,
- para descobrir uma queda sem precisar rodar `ping` à mão.

---

## US08 — Saber se o host está no ar sem abrir o terminal · RF04, RNF04: Exemplo

```txt
Cenário: CA08.1 - Medição sob demanda
  Quando envio POST /api/hosts/{id}/pings
  Então recebo o status 201
  E o corpo traz a medição recém-gravada
Cenário: CA08.2 - Host que responde
  Dado um host acessível
  Quando a medição é executada
  Então success é true
  E latency traz o tempo de resposta em milissegundos
Cenário: CA08.3 - Host fora do ar
  Dado um endereço que não responde
  Quando a medição é executada
```

---

## Tasks da etapa

- TK08.1 · Criar `src/lib/ping.ts`: `execFile`, argumentos por sistema operacional e parser da latência.
- TK08.2 · Acrescentar `Ping.check` ao model: mede e grava, inclusive a falha.
- TK08.3 · Criar `src/services/monitor.ts`: a rodada periódica.
- TK08.4 · Acrescentar o botão "Medir agora": a medição sob demanda na tela de histórico.

---

## Estrutura da aplicação

- Duas pastas novas, e a distinção entre elas é o ponto da etapa.
- O `lib/` guarda código que não conhece o domínio: `ping.ts` recebe um endereço e devolve um resultado, e serviria a qualquer aplicação.
- O `services/` guarda o que orquestra o domínio ao longo do tempo: o `monitor.ts` sabe o que é um host e quando medi-lo.
- Uma medição pode ser disparada de dois lugares: pelo botão da tela ou pelo agendador —, e o diagrama mostra que os dois convergem para a mesma função.
- A seta pontilhada de volta do host é a única parte que a aplicação não controla: é a resposta do `ping`, que pode não vir.

---

## O que muda nesta etapa

- O que muda nesta etapa aparece como ponto central da aula, não apenas como item de índice.
- Oitava etapa do MonitorApp: execução do comando ping do sistema com node:child_process, parser da latência, agendador periódico e medição sob demanda...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## O que muda nesta etapa: Tabela

- medições vêm do seeder: medições vêm do comando `ping`
- uma rota de histórico: duas: `GET` lê, `POST` mede
- o servidor só reage a requisições: o servidor tem trabalho próprio, periódico

---

## Descrição das tarefas

- Descrição das tarefas aparece como ponto central da aula, não apenas como item de índice.
- Oitava etapa do MonitorApp: execução do comando ping do sistema com node:child_process, parser da latência, agendador periódico e medição sob demanda...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## TK08.1 · Criar `src/lib/ping.ts` (A chamada de sistema)

- Nenhuma dependência nova: `node:child_process`, `node:os` e `node:util` são todos nativos.
- O arquivo tem três funções e cada uma resolve um problema distinto.
- Os argumentos mudam por sistema.
- O `buildArgs` das linhas 17 a 21 trata disso: `-c 1` no Linux e no macOS, `-n 1` no Windows, para enviar um pacote só; e `-W` em segundos contra `-w`...
- Sem isso, o projeto rodaria em uma máquina e falharia em outra sem explicação aparente.

---

## TK08.2 · Acrescentar `Ping.check` ao model

- A função das linhas 18 a 28 é curta e faz exatamente três coisas: busca o host para descobrir o endereço (linha 19), mede (linha 25) e grava (linha 27).
- O ponto didático está no que ela não faz: não decide se vale a pena gravar.
- A medição com falha é gravada igual à bem-sucedida, com `success: false` e `latency: null`.
- É essa persistência da ausência que permite calcular disponibilidade: sem os registros de falha, a tela de histórico mostraria 100% de uptime para um...

---

## TK08.3 · Criar `src/services/monitor.ts` (O agendador)

- Este arquivo dá ao servidor algo que ele nunca teve: trabalho próprio, que acontece sem que ninguém peça.
- O `runRound` das linhas 11 a 15 mede todos os hosts.
- A linha 14 usa `Promise.allSettled`, e não `Promise.all`: a diferença aparece na primeira queda.
- Com `all`, a primeira rejeição abortaria a rodada e os hosts restantes ficariam sem medição justamente quando a rede está com problema.
- Com `allSettled`, cada host é medido independentemente. (Como `ping.ts` já converte falha em resultado, a rejeição aqui seria por outro motivo: um host...

---

## TK08.4 · Acrescentar o botão "Medir agora"

- A rota `POST /api/hosts/:id/pings` reaproveita o `readPingsSchema`: os dois métodos validam a mesma coisa, um `:id` em formato UUID, porque nenhum dos...
- No front, essa rota sem corpo revelou uma limitação da camada de API: o `create` sempre enviava `Content-Type: application/json`, mesmo quando não...
- O ajuste é o espalhamento condicional das linhas 7 a 14: sem corpo, sem cabeçalho.
- O manipulador do botão desabilita o controle enquanto a medição roda: um `ping` leva até dois segundos, e um clique duplo gravaria duas medições.
- Do lado do servidor, o controller ganha o `check` das linhas 19 a 30.

---

## Testando

- Nesta seção, testamos a medição sob demanda e a gravação de pings no histórico do host.
- A requisição `POST /api/hosts/:id/pings` dispara a medição do ICMP/HTTP no sistema operacional para o endereço do host informado na URL.
- O ping é persistido e a resposta traz a latência aferida em ms com status `201 Created`:
- { "id": "…", "latency": 12, "success": true, "createdAt": "2026-03-01T12:05:00.000Z", "hostId": "e4cfb6bb-4431-42a9-b660-d5701b2f49cd" }
- Cadastre um host apontando para um endereço inexistente: `10.255.255.1`, por exemplo: e repita a chamada:

---

## Testando: Exemplo

```txt
  ### Disparar medição de ping sob demanda para um host
  POST http://localhost:3000/api/hosts/e4cfb6bb-4431-42a9-b660-d5701b2f49cd/pings
```

---

## Executando

- Prepare o banco e suba a API:
- O log mostra `Monitor rodando a cada 60s` logo após a mensagem de porta.
- Suba o front e abra o histórico de um host:
- Clique em Medir agora e observe a linha nova no topo da tabela.
- Para acompanhar o agendador sem esperar um minuto, baixe o intervalo no `.env`:

---

## Executando: Exemplo 1

```bash
   cd examples/courses/expressjs/projects/monitor-app-ping/back
   npm install
   cp .env.example .env
   npm run db:migrate
   npm run db:seed
   npm run dev
```

---

## Executando: Exemplo 2

```bash
   cd examples/courses/expressjs/projects/monitor-app-ping/front
   npm install
   npm run dev
```

---

## Conceitos abordados

- Diferenças de argumentos do `ping` entre sistemas operacionais
- Parser tolerante à saída traduzida do comando
- Falha como resultado gravável, não como exceção

---

## Próxima etapa

- MonitorApp: Cadastro de usuário: a entidade `User`, hash Argon2id e a tela de cadastro ligada à API.

---

## Arquivos-Chave da Aula

- **back/src/lib/ping.ts**: `examples/courses/expressjs/projects/monitor-app-ping/back/src/lib/ping.ts` (linhas marcadas `41-54`)
- **back/src/models/Ping.ts**: `examples/courses/expressjs/projects/monitor-app-ping/back/src/models/Ping.ts` (linhas marcadas `18-28`)
- **back/src/services/monitor.ts**: `examples/courses/expressjs/projects/monitor-app-ping/back/src/services/monitor.ts` (linhas marcadas `11-15,23-35`)
- **back/src/index.ts**: `examples/courses/expressjs/projects/monitor-app-ping/back/src/index.ts` (linhas marcadas `29-34`)
- **back/src/routes/pings.routes.ts**: `examples/courses/expressjs/projects/monitor-app-ping/back/src/routes/pings.routes.ts` (linhas marcadas `9-10`)
- **front/js/services/api.js**: `examples/courses/expressjs/projects/monitor-app-ping/front/js/services/api.js` (linhas marcadas `8-14`)

---

## Resumo da Aula

- **MonitorApp: Ping real** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
