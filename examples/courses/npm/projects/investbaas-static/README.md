# InvestBaaS — Gestão e Inteligência de Investimentos

Aplicação web moderna para controle patrimonial, atualização de valores manuais e automáticos de ativos da B3, matriz de rentabilidade mensal e anual, e painel administrativo multi-inquilino.

## Tecnologias

- **Front-end**: HTML5, Tailwind CSS, JavaScript modular, Lucide Icons e Chart.js.
- **Back-end BaaS**: Supabase (PostgreSQL 16, Supabase Auth, Row Level Security, Supabase Storage e Edge Functions em Deno).

## Como Executar

1. Instale as dependências:
   ```bash
   pnpm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm dev
   ```
3. Abra `http://localhost:5173` no navegador.

## Estrutura de Páginas

- `index.html`: Landing page pública com simulador e apresentação.
- `dashboard.html`: Visão geral da carteira e investimentos categorizados.
- `analytics.html`: Matriz de rentabilidade de meses por ano (R$ e %).
- `admin.html`: Painel administrativo de clientes e métricas globais.
- `signin.html` / `signup.html`: Telas de autenticação.
