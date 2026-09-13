# InvestFlow - Gestão e Inteligência de Investimentos

Aplicação web moderna para controle patrimonial, atualização de valores manuais e automáticos de ativos da B3, matriz de rentabilidade mensal e anual, e painel administrativo multi-inquilino.

## Tecnologias

- **Front-end**: HTML5 estático e Tailwind CSS compilado localmente. Nesta etapa não há JavaScript de aplicação: navbar, tabelas, KPIs e gráficos (SVG) estão escritos no HTML com valores de exemplo, no mesmo layout que as sprints seguintes vão preencher a partir do Supabase.
- **Back-end BaaS (etapas seguintes)**: Supabase (PostgreSQL 16, Supabase Auth, Row Level Security, Supabase Storage e Edge Functions em Deno).

## Como Executar

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Abra `http://localhost:5173` no navegador.

## Estrutura de Páginas

- `index.html`: Landing page pública com simulador e apresentação.
- `dashboard.html`: Visão geral da carteira e investimentos categorizados.
- `asset.html`: Protótipo do detalhe de um investimento, com aportes, saldo e cotação manual.
- `analytics.html`: Matriz de rentabilidade de meses por ano (R$ e %).
- `origins.html`: Protótipo de origem patrimonial por corretora, categoria e emissor.
- `dividends.html`: Protótipo de proventos por ativo, ano e mês.
- `movements.html`: Protótipo de extrato consolidado de entradas, saídas e comprovantes.
- `profile.html`: Protótipo de perfil com avatar, tema e privacidade.
- `admin.html`: Painel administrativo de clientes e métricas globais.
- `signin.html` / `signup.html`: Telas de autenticação.
