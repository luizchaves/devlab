---
title: 'InvestApp: Trilha Prática'
markmap:
  colorFreezeLevel: 2
  initialExpandLevel: 2
---

# InvestApp: Trilha Prática

## Épicos do Produto

### EP01 Experiência e Carteira
- FT01 Telas do sistema (Etapa 1 - Front static)
- FT02 CRUD em memória (Etapa 2 - API em memória)
- FT03 Classificação da carteira (Etapa 7 - Prisma ORM)

### EP02 Identidade e Acesso
- FT04 Cadastro de investidor (Etapa 8 - User)
- FT05 Login, sessão e JWT (Etapa 9 - Autenticação)
- FT06 Recuperação de senha (Backlog)

### EP03 Perfil e Notificações
- FT07 E-mail de boas-vindas (Etapa 10 - E-mail)
- FT08 Avatar do perfil (Etapa 11 - Upload)

### EP04 Fundação Técnica
- FT09 Tipagem strict (Etapa 3 - TypeScript)
- FT10 Schemas Zod (Etapa 4 - Validação)
- FT11 Swagger UI (Etapa 5 - Documentação)
- FT12 Driver SQLite (Etapa 6 - Persistência)

### EP05 Qualidade e Operação
- FT13 Vitest e Playwright (Etapa 12 - Testes)
- FT14 Docker e Compose (Etapa 13 - Docker)

## Etapas de Construção

### Etapas 1 a 4 (Front & Validação)
- 1. Front estático (HTML/Tailwind)
- 2. API em memória (Express)
- 3. TypeScript (Camadas e tipos)
- 4. Validação Zod (Query/Body/Params)

### Etapas 5 a 8 (Docs & Persistência)
- 5. OpenAPI / Swagger
- 6. SQLite nativo (node:sqlite)
- 7. Prisma ORM (Category & Broker)
- 8. Cadastro de Usuário (Argon2id)

### Etapas 9 a 13 (Auth, Mídia, Testes & Docker)
- 9. JWT & Escopo de Carteira
- 10. E-mail Nodemailer (Boas-vindas)
- 11. Upload Multer (Avatar)
- 12. Suíte de Testes (Vitest & Playwright)
- 13. Containerização Docker Compose
