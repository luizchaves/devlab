# Product Requirements Document (PRD) - InvestBaaS

## 1. Visão Geral do Produto
O **InvestBaaS** é uma plataforma de gestão e análise de carteira de investimentos baseada em arquitetura BaaS (*Backend as a Service*) com **Supabase**. O sistema oferece acompanhamento patrimonial em tempo real, atualização diária manual e automática de cotações de ativos negociados na B3, cálculo de matriz analítica de rendimentos mensais/anuais em R$ e %, isolamento rigoroso de dados por usuário via Row Level Security (RLS) e portal administrativo para monitoramento de métricas operacionais e AUM (*Assets Under Management*).

## 2. Personas e Casos de Uso
- **Investidor Individual**: Acessa sua conta segura, visualiza a evolução patrimonial consolidada, cadastra transações e notas de corretagem (comprovantes), acompanha cotações e audita o rendimento histórico mês a mês.
- **Administrador da Plataforma**: Audita volumetria global de contas, novos cadastros e total de recursos sob custódia agregada sem violar o sigilo de posições individuais.

## 3. Requisitos Funcionais (Épicos)
- **EP01 - Landing Page & Simulação**: Apresentação comercial, simulador de juros compostos em tempo real e pontos de conversão.
- **EP02 - Autenticação & Perfil**: Registro, login com JWT/Supabase Auth, recuperação de senha e gestão de perfil com avatar em Supabase Storage.
- **EP03 - Gestão de Ativos & Carteira**: Cadastro de posições (Renda Fixa, Ações B3, FIIs, Fundos, Cripto), inserção de transações (compra/venda) e upload de notas de corretagem (PDF/PNG).
- **EP04 - Cotações & Edge Functions**: Atualização manual de valor patrimonial diário e gatilho assíncrono para cotações automatizadas de tickers B3 via Deno Edge Functions.
- **EP05 - Analytics & Matriz de Rentabilidade**: Heatmap histórico mensal x anual de rendimento nominal (R$) e percentual (%), distribuição por classe e métricas de desempenho.
- **EP06 - Painel Administrativo**: Métricas globais de contabilidade de usuários ativos, AUM consolidado e status do sistema.
- **EP07 - Origem & Evolução**: Corretora de custódia e emissor/gestor por ativo, treemap por corretora, categoria e emissor, tela de cada investimento com todos os aportes e gráfico de aportes acumulados versus valor de mercado por ativo e por carteira.

## 4. Requisitos Não Funcionais & Arquitetura
- **Frontend**: Vanilla JavaScript (ES Modules), Tailwind CSS via utilitários sem framework pesado.
- **Backend / BaaS**: Supabase (PostgreSQL 15+, Supabase Auth, Storage Buckets, Edge Functions em Deno/TypeScript).
- **Segurança**: Row Level Security (RLS) habilitado em 100% das tabelas de domínio.
- **Responsividade**: Layout adaptável para desktop, tablets e smartphones.
