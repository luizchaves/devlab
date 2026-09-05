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
title: "Express.js: Deploy"
description: "Colocar uma API Express em produção: build e execução, variáveis de ambiente, migrations, Dockerfile, encerramento gracioso, proxy reverso, health check e checklist de produção."
---

<!-- _class: lead -->

# Express.js: Deploy

Colocar uma API Express em produção: build e execução, variáveis de ambiente, migrations, Dockerfile, encerramento gracioso, proxy reverso, health check e checklist de produção.

---

## Objetivo

- Ao final você saberá preparar a aplicação para produção: variáveis de ambiente, migrations, porta e host —, empacotá-la em uma imagem Docker,...

---

## Mapa da Aula

- **Objetivo**
- **O que muda em produção**
- **Porta e host**
- **Migrations em produção**
- **Encerramento gracioso**
- **Empacotando com Docker**
- **Proxy reverso**
- **Health check**

---

## Contexto da Aula

- Rodar na sua máquina é o caso mais fácil: uma instância, um banco local, você mesmo como único usuário.
- Esta aula trata do que muda quando a aplicação passa a rodar em outro lugar, o tempo todo, para outras pessoas.

---

## O que muda em produção?

- O host precisa ser `0.0.0.0`: que é o padrão quando você omite o segundo argumento.

---

## O que muda em produção?: Tabela

- Origem da configuração: arquivo `.env` | ambiente do orquestrador
- Porta: fixa (`3000`) | definida por `process.env.PORT`
- Host de escuta: `localhost` | `0.0.0.0` (para o contêiner receber tráfego)
- Banco: SQLite local | serviço gerenciado
- Migrations: `migrate dev` | `migrate deploy`
- Log: texto colorido | JSON estruturado

---

## Porta e host

- Plataformas de hospedagem injetam a porta por variável de ambiente.
- Ignorá-la é o motivo número um de um deploy "que subiu mas não responde":

---

## Porta e host: Exemplo

```ts
const port = Number(process.env.PORT ?? 3000);
const server = app.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}`);
});
```

---

## Migrations em produção

- Os comandos de desenvolvimento não servem para produção: um deles apaga os dados:
- Código pode ser revertido em segundos; uma coluna removida leva os dados junto.
- A prática segura é expandir antes e contrair depois: adicione a coluna nova, publique o código que usa as duas, migre os dados e só então remova a antiga.

---

## Migrations em produção: Exemplo

```json
{
  "scripts": {
    "start": "node src/server.ts",
    "predeploy": "prisma migrate deploy"
  }
}
```

---

## Encerramento gracioso

- Ao receber `SIGTERM`, o processo tem alguns segundos antes de ser morto. Sem tratamento, as requisições em andamento são cortadas no meio:
- Sem ele, o próprio `setTimeout` mantém o processo vivo pelos dez segundos, mesmo depois de tudo ter fechado: e o encerramento gracioso passa a demorar...

---

## Encerramento gracioso: Exemplo

```ts
const server = app.listen(port);
function shutdown(sinal: string) {
  console.log({ level: 'info', evento: 'shutdown', sinal });
  // Para de aceitar conexões; as em curso continuam até terminar.
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  // Rede de segurança: se algo travar, não fica pendurado para sempre.
  setTimeout(() => process.exit(1), 10_000).unref();
}
```

---

## Empacotando com Docker

- A imagem descreve exatamente o ambiente de execução: mesma versão de Node, mesmas dependências, em qualquer lugar:
- Sem ele, `COPY..` leva o `.env` para dentro da imagem: e quem tiver acesso à imagem tem os segredos.
- A configuração entra por variável de ambiente, no momento da execução.

---

## Empacotando com Docker: Tabela

- Estágio `deps` separado: a camada de dependências só é refeita quando o lockfile muda

---

## Empacotando com Docker: Exemplo 1

```txt
FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
# `npm ci` respeita o lockfile; `npm install` pode alterá-lo.
RUN npm ci --omit=dev
FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
# Não rodar como root: se a aplicação for comprometida, o dano é menor.
USER node
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=node:node . .
```

---

## Empacotando com Docker: Exemplo 2

```txt
node_modules
.env
*.db
.git
```

---

## Proxy reverso

- Em produção, a aplicação raramente recebe tráfego direto. Um proxy: Nginx, Caddy, o balanceador da plataforma: fica na frente:
- Para o Express enxergar o IP e o protocolo originais, é preciso declarar a confiança no proxy:
- Sem ele, todos os usuários compartilham o IP do proxy e um único limite.
- Com `true` (confiar em qualquer salto), o cliente pode forjar `X-Forwarded-For` e escapar do limite.
- Configure o número exato de proxies à frente.

---

## Proxy reverso: Exemplo

```ts
// 1 = confia em um salto. Sem isso, req.ip é o IP do proxy e req.protocol é 'http'.
app.set('trust proxy', 1);
```

---

## Health check

- O orquestrador consulta um endpoint para decidir se a instância recebe tráfego e se precisa ser reiniciada:

---

## Health check: Exemplo

```ts
// Liveness: barato, sem I/O. Responde enquanto o processo estiver vivo.
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});
// Readiness: verifica as dependências. Chamado com menos frequência.
router.get('/ready', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ready' });
  } catch {
    res.status(503).json({ status: 'unavailable' });
  }
```

---

## Onde publicar?

- A maioria das plataformas usa disco efêmero: o arquivo do banco desaparece a cada deploy.
- Ou se usa um volume persistente, ou se troca por um Postgres gerenciado: mudança de uma linha no `provider` do schema, se as consultas forem do Prisma.

---

## Onde publicar?: Tabela

- PaaS (Render, Railway, Fly.io): baixo | projeto de disciplina, protótipo, MVP
- Contêiner gerenciado (Cloud Run, ECS): médio | tráfego variável, escala automática
- VPS com Docker Compose: médio | controle total, custo previsível
- Kubernetes: alto | vários serviços e times

---

## Checklist antes de publicar

- Configuração: todas as variáveis obrigatórias definidas no ambiente; nenhum `.env`
- versionado; `JWT_SECRET` aleatório e diferente do de desenvolvimento.
- Banco: `migrate deploy` no processo de publicação; backup configurado; nenhum
- comando destrutivo no caminho.
- Segurança: `x-powered-by` desabilitado, cabeçalhos de segurança, CORS restrito por

---

## Exercício

- No projeto `express-auth`:
- Escreva o `Dockerfile` e o `.dockerignore` conforme a aula.
- Construa a imagem e rode passando as variáveis por `-e`:
- Implemente o encerramento gracioso e observe o log ao parar o contêiner.
- Acrescente `/health` e confirme que ele responde sem autenticação.

---

## Exercício: Exemplo 1

```bash
   docker build -t express-auth .
   docker run -p 3000:3000 -e JWT_SECRET=$(openssl rand -hex 32) express-auth
```

---

## Desafio

- Configure um workflow do GitHub Actions que rode `npm ci`, `npm run typecheck` e `npm test` em cada push e, na branch principal, construa e publique a...
- Faça o deploy depender do sucesso dos testes.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Colocar uma API Express em produção: build e execução, variáveis de ambiente, migrations, Dockerfile, encerramento gracioso, proxy reverso, health...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Ambiente

- Por que ler a porta de `process.env.PORT`?
- Porque a plataforma de hospedagem escolhe a porta e a injeta por variável de ambiente.
- Uma porta fixa faz o serviço subir e nunca receber tráfego.
- Por que `migrate deploy` e não `migrate dev` em produção?

---

## Operação

- O que o encerramento gracioso evita?
- Que requisições em andamento sejam cortadas no meio e que conexões de banco fiquem penduradas.
- Por que `USER node` no Dockerfile?
- Para a aplicação não rodar como root.
- Se ela for comprometida, o atacante fica limitado às permissões de um usuário comum dentro do contêiner.

---

## Na prática

- Todos os projetos do guia abrem com os botões Ver no GitHub e Abrir no Codespaces: o Codespaces é, na prática, o mesmo contêiner desta aula rodando na...

---

## Resumo da Aula

- **Express.js: Deploy** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
