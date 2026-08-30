# MonitorApp — etapas 12 e 13

Esta pasta é o estado final do projeto: a aplicação das etapas 1 a 11 mais a
suíte de testes (etapa 12) e o empacotamento em Docker (etapa 13).

## Testes

```bash
# API: node:test + supertest
cd back && npm test

# Front: Vitest com jsdom
cd front && npm test

# Fluxo completo no navegador (com back e front rodando)
npx playwright test
```

## Docker

```bash
docker compose up --build
```

O front fica em `http://localhost:8080` e o Nginx repassa `/api` para o
serviço da API. O banco vive no volume `monitor-db`.
