# InvestFlow React PRD

## Objetivo

Adaptar o InvestFlow vanilla para uma aplicação React moderna, mantendo o domínio de carteira de investimentos e usando a stack pedida para ensinar escolhas reais de arquitetura.

## Requisitos

| ID | Requisito | Critério |
| -- | --------- | -------- |
| RF01 | Dashboard React | A página inicial mostra KPIs e tabela de ativos. |
| RF02 | API protegida | `/api/portfolio` exige sessão antes de ler dados. |
| RF03 | Integração externa | `/api/quotes/[symbol]` chama provedor externo com timeout e erro 502 controlado. |
| RF04 | Estado global mínimo | Preferência de ocultar valores fica no Zustand. |
| RF05 | Server state | Carteira usa TanStack React Query, não store global. |
| RF06 | Rotas | Dashboard, ativos e preferências usam App Router. |
| RNF01 | UI acessível | Primitivos interativos usam Base UI quando aplicável. |
| RNF02 | Testes | Unit, browser, integration e E2E têm exemplos separados. |
