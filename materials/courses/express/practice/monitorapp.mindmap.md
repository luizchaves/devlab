---
title: 'MonitorApp: Trilha Prática'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# MonitorApp: Trilha Prática

## Épicos do Produto

### EP01 Monitoramento de Hosts
- FT01 Dashboard e Status de Hosts (Etapa 1 - Front static)
- FT02 Cadastro de Hosts (Etapa 2 - API em memória)
- FT03 Métricas e Latência (Etapa 7 - Ping Service)

### EP02 Alertas e Notificações
- FT04 Alertas por E-mail (Etapa 10 - Email alerts)
- FT05 Métricas em Tempo Real (Etapa 11 - WebSockets)

### EP03 Fundação Técnica
- FT06 Tipagem strict (Etapa 3 - TypeScript)
- FT07 Validação Zod (Etapa 4 - Validação)
- FT08 OpenAPI Docs (Etapa 5 - Swagger)
- FT09 Persistência SQLite (Etapa 6 - SQLite)

### EP04 Autenticação e Segurança
- FT10 Registro de Operadores (Etapa 8 - User)
- FT11 Autenticação JWT (Etapa 9 - Auth)

### EP05 Qualidade e Deploy
- FT12 Testes Automatizados (Etapa 12 - Testes)
- FT13 Containerização (Etapa 13 - Docker)

## Etapas de Construção

### Etapas 1 a 4 (Base & Contrato)
- 1. Front estático (HTML/Tailwind)
- 2. API de Hosts em memória
- 3. TypeScript (Camadas e Tipos)
- 4. Schemas Zod (Validação estrita)

### Etapas 5 a 8 (Docs, DB & Ping)
- 5. OpenAPI & Swagger UI
- 6. SQLite nativo (node:sqlite)
- 7. Serviço de Ping ICMP/HTTP
- 8. Gestão de Usuários (Argon2id)

### Etapas 9 a 13 (Auth, Realtime, Testes & Ops)
- 9. Autenticação JWT
- 10. Alertas por E-mail
- 11. WebSockets / Eventos em Tempo Real
- 12. Testes de Integração e E2E
- 13. Docker & Docker Compose
