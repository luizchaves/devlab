# Product Requirements Document (PRD) - InvestFlow

## 1. Visão Geral do Produto
O **InvestFlow** é uma plataforma de gestão e análise de carteira de investimentos baseada em arquitetura BaaS (*Backend as a Service*) com **Supabase**. O sistema oferece acompanhamento patrimonial em tempo real, atualização diária manual e automática de cotações de ativos negociados na B3, cálculo de matriz analítica de rendimentos mensais/anuais em R$ e %, isolamento rigoroso de dados por usuário via Row Level Security (RLS) e portal administrativo para monitoramento de métricas operacionais e AUM (*Assets Under Management*).

## 2. Personas e Casos de Uso
- **Investidor Individual**: Acessa sua conta segura, visualiza a evolução patrimonial consolidada, cadastra transações e notas de corretagem (comprovantes), acompanha cotações e audita o rendimento histórico mês a mês.
- **Administrador da Plataforma**: Audita volumetria global de contas, novos cadastros e total de recursos sob custódia agregada sem violar o sigilo de posições individuais.

## 3. Requisitos Funcionais (Épicos)
- **EP01 - Landing Page & Simulação**: Apresentação comercial, simulador de juros compostos em tempo real e pontos de conversão.
- **EP02 - Autenticação & Perfil**: Registro, login com JWT/Supabase Auth, recuperação de senha e gestão de perfil com avatar em Supabase Storage.
- **EP03 - Gestão de Ativos & Carteira**: Cadastro, edição e exclusão de posições (Renda Fixa, Ações B3, FIIs, Fundos, Cripto), inserção de transações (compra/venda) e upload de notas de corretagem (PDF/PNG).
- **EP04 - Cotações & Edge Functions**: Atualização manual de valor patrimonial diário e gatilho assíncrono para cotações automatizadas de tickers B3 via Deno Edge Functions.
- **EP05 - Analytics & Matriz de Rentabilidade**: Heatmap histórico mensal x anual de rendimento nominal (R$) e percentual (%), distribuição por classe e métricas de desempenho.
- **EP06 - Painel Administrativo**: Métricas globais de contabilidade de usuários ativos, AUM consolidado e status do sistema.
- **EP07 - Origem & Evolução**: Corretora de custódia e emissor/gestor por ativo, treemap por corretora, categoria e emissor, tela de cada investimento com todos os aportes e gráfico de aportes acumulados versus valor de mercado por ativo e por carteira.
- **EP08 - Governança de Dados de Desenvolvimento**: Seeds versionados devem conter apenas dados públicos demonstrativos; bases, scripts ou cargas com dados reais/confidenciais devem permanecer fora do repositório.

### 3.1 Requisitos Funcionais Detalhados

- **RF03.1 - Criar ativo**: o investidor autenticado cadastra ticker, nome, categoria, corretora e emissor de um ativo próprio.
- **RF03.2 - Editar ativo**: o investidor autenticado altera ticker, nome, categoria, corretora e emissor de um ativo próprio sem alterar os lançamentos já registrados.
- **RF03.3 - Excluir ativo**: o investidor autenticado remove um ativo próprio e seus registros dependentes, mantendo o isolamento por RLS.
- **RF03.4 - Registrar lançamentos**: o investidor autenticado registra compra/aporte e venda/resgate em um ativo próprio.
- **RF04.1 - Atualizar cotação ao salvar ativo cotável**: ao criar ou editar um ativo de categoria Ações ou FIIs, o sistema deve tentar atualizar a cotação automaticamente pela Edge Function de cotações.
- **RF08.1 - Seed público mínimo**: o seed versionado deve criar um usuário administrador demonstrativo e uma única posição fictícia de renda fixa, sem carregar nomes, saldos ou histórico de investimentos reais.

### 3.2 Histórias de Usuário

- **US14 - Manter ativos da carteira**: como investidor autenticado, quero editar e excluir ativos próprios pela carteira para corrigir cadastros incorretos e remover posições que não desejo mais acompanhar.
- **US15 - Ver cotação após cadastrar ativo negociado**: como investidor autenticado, quero que ações e FIIs recém-criados ou editados já tentem buscar cotação para evitar uma carteira com valor atual vazio logo após o cadastro.

### 3.3 Critérios de Aceite

- **CA03.11 - Editar ativo próprio**: dado um ativo existente na carteira, quando o investidor alterar ticker, nome, corretora ou emissor e salvar, então a tabela deve exibir os novos dados sem perder lançamentos já registrados.
- **CA03.12 - Excluir ativo próprio**: dado um ativo existente na carteira, quando o investidor confirmar a exclusão, então o ativo deve sair da carteira e os registros dependentes devem ser removidos pelo cascade do banco, respeitando RLS.
- **CA04.3 - Cotação automática após salvar ativo cotável**: dado um ativo de categoria Ações ou FIIs, quando o investidor criar ou editar o ativo e o provedor reconhecer o ticker, então a carteira deve exibir a cotação atual sem exigir clique manual em "Atualizar Cotações".
- **CA04.4 - Falha de cotação não bloqueia cadastro**: dado um ativo de categoria Ações ou FIIs, quando o provedor não retornar cotação ou a função falhar, então o ativo deve permanecer salvo e a interface deve informar que a cotação não foi atualizada.
- **CA08.1 - Ausência de dados confidenciais no seed**: dado o repositório versionável, quando `supabase/seed.sql` ou `scripts/seed-investments.mjs` forem inspecionados, então eles devem conter apenas `admin@example.com`, `Tesouro Reserva 2036` e o valor demonstrativo de R$ 1.
- **CA08.2 - Seed demonstrativo funcional**: dado o banco local resetado, quando o seed público for aplicado, então deve existir um perfil administrador com uma posição de renda fixa cujo valor patrimonial seja R$ 1.

## 4. Requisitos Não Funcionais & Arquitetura
- **Frontend**: Vanilla JavaScript (ES Modules), Tailwind CSS via utilitários sem framework pesado.
- **Backend / BaaS**: Supabase (PostgreSQL 15+, Supabase Auth, Storage Buckets, Edge Functions em Deno/TypeScript).
- **Segurança**: Row Level Security (RLS) habilitado em 100% das tabelas de domínio.
- **Dados de desenvolvimento**: seeds versionados não podem conter dados pessoais, posições reais, histórico financeiro real, nomes próprios de investidores ou saldos confidenciais.
- **Responsividade**: Layout adaptável para desktop, tablets e smartphones.
