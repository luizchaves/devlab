# Planejamento de Sprints - InvestBaaS

O desenvolvimento do InvestBaaS segue o modelo cumulativo em 6 Sprints com foco em entregabilidade contínua.

| Sprint | Foco Principal | Story Points | Responsável | Status |
| :--- | :--- | :---: | :--- | :--- |
| **Sprint 1** | Setup estrutural, design system Tailwind e páginas estáticas (Landing, Dashboard, Analytics, Admin, Auth) | 13 | luiz.chaves | Concluído |
| **Sprint 2** | Integração com Supabase Auth, gestão de sessão JWT e proteção de rotas | 8 | luiz.chaves | Planejado |
| **Sprint 3** | Modelagem PostgreSQL, migrações, políticas RLS e CRUD de Ativos/Transações | 13 | luiz.chaves | Planejado |
| **Sprint 4** | Edge Functions para cotações automatizadas B3 e atualização diária de preços | 8 | luiz.chaves | Planejado |
| **Sprint 5** | Upload de comprovantes/notas em Supabase Storage com URLs assinadas | 5 | luiz.chaves | Planejado |
| **Sprint 6** | Matriz de Rentabilidade histórica, agregação AUM e Painel Admin | 13 | luiz.chaves | Planejado |

## Detalhamento das Tarefas da Sprint 1

| Task ID | Descrição | Estimativa | Atribuído |
| :--- | :--- | :---: | :--- |
| **TK01-1** | Setup do repositório, Tailwind CDN/config, Biome e design tokens | 2 | luiz.chaves |
| **TK01-2** | Implementação da Landing Page comercial com simulador de rendimentos | 3 | luiz.chaves |
| **TK01-3** | Telas de Autenticação (Sign In / Sign Up) com validação client-side | 2 | luiz.chaves |
| **TK01-4** | Dashboard principal com resumo patrimonial e tabela de ativos categorizados | 3 | luiz.chaves |
| **TK01-5** | Página de Analytics com Matriz/Heatmap de rendimentos mensais por ano | 2 | luiz.chaves |
| **TK01-6** | Painel Administrativo de monitoramento de contas e AUM global | 1 | luiz.chaves |
| **TK01-7** | Configuração de habilidades de automação, testes estáticos e PRD/SPRINTS | 1 | luiz.chaves |
