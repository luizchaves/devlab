# Product Requirements Document (PRD) - InvestFlow

## 1. Visão Geral do Produto
O **InvestFlow** é uma plataforma de gestão e análise de carteira de investimentos baseada em arquitetura BaaS (*Backend as a Service*) com **Supabase**. O sistema oferece acompanhamento patrimonial em tempo real, atualização manual e automática de cotações (B3, EUA e cripto, com câmbio), lançamentos editáveis e renda fixa pelo saldo, proventos creditados pela data ex, cálculo de matriz analítica de rendimentos mensais/anuais em R$ e %, isolamento rigoroso de dados por usuário via Row Level Security (RLS), perfil com avatar, tema e ocultação de valores, e portal administrativo para monitoramento de métricas operacionais e AUM (*Assets Under Management*).

## 2. Personas e Casos de Uso
- **Investidor Individual**: Acessa sua conta segura, visualiza a evolução patrimonial consolidada, cadastra transações e notas de corretagem (comprovantes), acompanha cotações e audita o rendimento histórico mês a mês.
- **Administrador da Plataforma**: Audita volumetria global de contas, novos cadastros e total de recursos sob custódia agregada sem violar o sigilo de posições individuais.

## 3. Requisitos Funcionais (Épicos)
- **EP01 - Landing Page & Simulação**: Apresentação comercial, simulador de juros compostos em tempo real e pontos de conversão.
- **EP02 - Autenticação & Perfil**: Registro, login com JWT/Supabase Auth, recuperação de senha e gestão de perfil com avatar em Supabase Storage.
- **EP03 - Gestão de Ativos & Carteira**: Cadastro, edição e exclusão de posições (Renda Fixa, Ações, FIIs, ETFs, FI-Infra, Fundos, Cripto), lançamentos de compra, venda e atualização de saldo (editáveis e excluíveis), upload de notas de corretagem (PDF/PNG) e a carteira com filtro, ordenação e estado na URL.
- **EP04 - Cotações & Edge Functions**: Atualização manual e automática de cotações via Deno Edge Functions, por carteira ou por ativo, com cotação informada à mão quando o provedor não responde.
- **EP05 - Analytics & Matriz de Rentabilidade**: Heatmap histórico mensal x anual de rendimento nominal (R$) e percentual (%), distribuição por classe e métricas de desempenho.
- **EP06 - Painel Administrativo**: Métricas globais de contabilidade de usuários ativos, AUM consolidado e status do sistema.
- **EP07 - Origem & Evolução**: Corretora de custódia e emissor/gestor por ativo, treemap por corretora, categoria e emissor, tela de cada investimento com todos os aportes e gráfico de aportes acumulados versus valor de mercado por ativo e por carteira.
- **EP08 - Governança de Dados de Desenvolvimento**: Seeds versionados devem conter apenas dados públicos demonstrativos; bases, scripts ou cargas com dados reais/confidenciais devem permanecer fora do repositório.
- **EP09 - Proventos & Movimentações**: Histórico de proventos por ativo, direito pela data ex, yield on cost, retorno total, proventos dentro da rentabilidade por escolha, e o extrato de aportes e resgates.
- **EP10 - Internacional & Cripto**: Moeda por ativo (BRL/USD), tabela de câmbio gravada pela Edge Function, custo pelo câmbio de cada compra, cripto cotada em dólar e convertida, e calendário de mercado (B3, EUA, cripto).
- **EP11 - Perfil & Experiência**: Perfil com avatar em bucket público, barra de navegação comum com menu do usuário, landing que reconhece a sessão, tema claro/escuro/automático, ocultação de valores e publicação do front na Vercel.

### 3.1 Requisitos Funcionais Detalhados

- **RF03.1 - Criar ativo**: o investidor autenticado cadastra ticker, nome, categoria, corretora e emissor de um ativo próprio.
- **RF03.2 - Editar ativo**: o investidor autenticado altera ticker, nome, categoria, corretora e emissor de um ativo próprio sem alterar os lançamentos já registrados.
- **RF03.3 - Excluir ativo**: o investidor autenticado remove um ativo próprio e seus registros dependentes, mantendo o isolamento por RLS.
- **RF03.4 - Registrar, editar e excluir lançamentos**: o investidor autenticado registra, corrige e desfaz compra/aporte e venda/resgate em um ativo próprio, inclusive o resgate total.
- **RF03.5 - Renda fixa e fundos pelo saldo**: um lançamento `update` redefine posição e custo pelo saldo informado; o ativo sem cotação vale o saldo.
- **RF03.6 - Organizar a carteira**: filtro de posições ativas ou todas, ordenação por coluna, rodapé ponderado, duração da posição e estado na URL.
- **RF04.1 - Atualizar cotação ao salvar ativo cotável**: ao criar ou editar um ativo de categoria cotável, o sistema deve tentar atualizar a cotação automaticamente pela Edge Function de cotações.
- **RF05.1 - Cotação por ativo e manual**: atualizar um único ativo (`asset_id`) e, quando o provedor não responde, informar a cotação ou o saldo à mão, gravados no histórico pelo dono.
- **RF08.1 - Seed público mínimo**: o seed versionado deve criar um usuário administrador demonstrativo e uma única posição fictícia de renda fixa, sem carregar nomes, saldos ou histórico de investimentos reais.
- **RF11 - Proventos por ativo**: buscar e guardar o histórico de eventos de proventos (valor por cota, data ex, data de pagamento), de forma idempotente e só para categorias com proventos por cota.
- **RF12 - Proventos recebidos**: total, últimos 12 meses, média mensal, yield on cost, matriz ano × mês, maiores pagadores e extrato, com o direito pela data ex.
- **RF13 - Proventos na rentabilidade**: o investidor escolhe se lucro, matriz e evolução consideram os proventos.
- **RF14 - Movimentações**: extrato de aportes e resgates com aportado líquido, compras, vendas, contagem, barras por mês e registro pela página.
- **RF15 - Ativos em dólar**: moeda por ativo, tabela `exchange_rates` com leitura pública e escrita pelo serviço, e carteira consolidada em reais.
- **RF16 - Valorização versus câmbio**: custo e fluxo pelo câmbio do mês de cada compra; views e gráfico do ativo convertidos.
- **RF17 - Cripto**: consulta em dólar (`TICKER-USD`) convertida pelo par `BRL=X` da mesma rodada; sem câmbio, sem cotação; a taxa da rodada fica gravada.
- **RF18 - Calendário de mercado**: B3, NYSE/Nasdaq e cripto com horários e feriados; o provedor só é consultado quando pode haver preço novo.
- **RF19 - Perfil**: nome, e-mail, papel, data de cadastro e avatar (PNG/JPG/WEBP/GIF até 2 MB) editáveis pelo dono; `role` fora do alcance do cliente.
- **RF20 - Navegação com contexto**: barra comum em toda página privada, menu do usuário, link do admin por papel e landing que reconhece a sessão.
- **RF21 - Tema e privacidade**: tema claro, escuro e automático persistido; ocultação de valores em toda página; mostrar/ocultar senha.
- **RF22 - Publicação**: build multipágina com URLs limpas, cabeçalhos de segurança e só variáveis públicas no bundle.

### 3.2 Histórias de Usuário

As histórias US01 a US16 cobrem as Sprints 1 a 7; as histórias abaixo, as Sprints 8 a 11. A versão completa, com critérios em Gherkin, está no backlog da trilha.

- **US14 - Manter ativos da carteira**: como investidor autenticado, quero editar e excluir ativos próprios pela carteira para corrigir cadastros incorretos e remover posições que não desejo mais acompanhar.
- **US15 - Ver cotação após cadastrar ativo negociado**: como investidor autenticado, quero que ações e FIIs recém-criados ou editados já tentem buscar cotação para evitar uma carteira com valor atual vazio logo após o cadastro.
- **US17 - Corrigir e desfazer lançamentos**: como investidor, quero editar e excluir um lançamento que registrei errado, para corrigir a posição sem apagar o ativo.
- **US18 - Acompanhar renda fixa e fundos pelo saldo**: como investidor, quero registrar o saldo atual de um CDB ou fundo em vez de quantidade e preço.
- **US19 - Informar a cotação à mão quando o provedor não responde**: como investidor, quero atualizar um único ativo e, se o provedor não o conhecer, digitar o valor.
- **US20 - Organizar a carteira**: como investidor, quero filtrar, ordenar e compartilhar o estado da carteira pela URL.
- **US21 - Registrar os proventos de cada ativo**: como investidor, quero que o histórico de proventos seja buscado e guardado.
- **US22 - Ver o que recebi de proventos**: como investidor, quero ver quanto recebi no total, por mês e por ativo, e o retorno total de cada posição.
- **US23 - Incluir os proventos na rentabilidade**: como investidor, quero escolher se lucro, rentabilidade e evolução consideram os proventos.
- **US24 - Acompanhar aportes e resgates**: como investidor, quero um extrato de tudo que entrou e saiu da carteira.
- **US25 - Ter ativos em dólar na carteira**: como investidor, quero cadastrar ETFs e ações americanas em dólar e ver a carteira em reais.
- **US26 - Separar a valorização do ativo do efeito do dólar**: como investidor, quero saber quanto foi o ativo e quanto foi o câmbio.
- **US27 - Cotar cripto**: como investidor, quero que bitcoin e ether tenham cotação como as ações.
- **US28 - Respeitar o calendário do mercado**: como operador, quero que a função só consulte o provedor quando pode haver preço novo.
- **US29 - Manter meu perfil**: como investidor, quero ver e editar meu nome e minha foto.
- **US30 - Navegar com contexto**: como investidor, quero a mesma barra em todas as telas, com meu nome e as ações da conta.
- **US31 - Escolher o tema e ocultar valores**: como investidor, quero o tema escuro e esconder os valores em público.
- **US32 - Publicar o front**: como mantenedor, quero publicar o front estático com URLs limpas e cabeçalhos de segurança.

### 3.3 Critérios de Aceite

Os critérios são numerados pela sprint (`CA09.3` é o terceiro critério da Sprint 9) e cada um tem pelo menos um teste automatizado com o id no nome. A lista completa, em Gherkin, está no backlog da trilha; a tabela abaixo resume a faixa de cada sprint e onde ela é provada.

| Sprint | Critérios | Onde são provados |
| :--- | :--- | :--- |
| 1 | CA01.1 a CA01.6 | inspeção do protótipo estático |
| 2 | CA02.1 a CA02.5 | `tests/integration/auth.test.js`, `tests/e2e/auth.spec.js` |
| 3 | CA03.1 a CA03.15 (CA03.13 a CA03.15 são o seed público) | `tests/integration/portfolio.test.js`, `tests/e2e/portfolio.spec.js`, `pnpm db:reset` |
| 4 | CA04.1 a CA04.5 | `tests/integration/quotes.test.js`, `tests/e2e/quotes.spec.js` |
| 5 | CA05.1 a CA05.5 | `tests/integration/receipts.test.js`, `tests/e2e/receipts.spec.js` |
| 6 | CA06.1 a CA06.5 | `tests/integration/analytics.test.js`, `tests/e2e/analytics.spec.js` |
| 7 | CA07.1 a CA07.8 | `tests/integration/origins.test.js`, `tests/e2e/origins.spec.js` |
| 8 | CA08.1 a CA08.18 | `tests/integration/ledger.test.js`, `tests/e2e/ledger.spec.js`, unidade de `portfolio`, `assets`, `query-params` |
| 9 | CA09.1 a CA09.15 | `tests/integration/dividends.test.js`, `tests/e2e/dividends.spec.js`, unidade de `lib/dividends`, `services/dividends`, `bar-chart` |
| 10 | CA10.1 a CA10.16 | `tests/integration/exchange.test.js`, `tests/integration/quotes.test.js`, `tests/e2e/international.spec.js`, unidade de `portfolio`, `exchange`, `update-quotes/logic` |
| 11 | CA11.1 a CA11.13 | `tests/integration/avatars.test.js`, `tests/deploy/deploy.test.js`, `tests/e2e/experience.spec.js`, unidade de `profile`, `navbar`, `theme`, `privacy`, `form` |

Exemplos de critérios, na forma dado/quando/então:

- **CA03.11 - Editar ativo próprio**: dado um ativo existente na carteira, quando o investidor alterar ticker, nome, corretora ou emissor e salvar, então a tabela deve exibir os novos dados sem perder lançamentos já registrados.
- **CA04.4 - Cotação automática após salvar ativo cotável**: dado um ativo de categoria cotável, quando o investidor criar ou editar o ativo e o provedor reconhecer o ticker, então a carteira deve exibir a cotação atual sem exigir clique manual.
- **CA03.13 - Seed demonstrativo funcional**: dado o banco local resetado, quando o seed público for aplicado, então deve existir um perfil administrador com uma posição de renda fixa cujo valor patrimonial seja R$ 1.
- **CA08.11 - Cotação manual no histórico**: dado um ativo próprio, quando o investidor informa a cotação à mão, então `current_price` muda e `quotes_history` ganha uma linha na data; outra conta recebe `42501`.
- **CA09.5 - Direito pela data ex**: dada uma compra antes da data ex, quando o evento é creditado, então a posição com direito é a comprada antes da data ex; compra na data ex não recebe.
- **CA10.13 - Taxa gravada na rodada**: dada uma rodada que buscou o câmbio, então `exchange_rates` ganha a taxa do dia, e rodar de novo não duplica.
- **CA11.4 - Metadados e role**: dado o perfil do próprio usuário, quando ele altera nome e avatar, então os metadados do Auth sincronizam; um `update` em `role` recebe `42501`.

## 4. Requisitos Não Funcionais & Arquitetura
- **Frontend**: Vanilla JavaScript (ES Modules), Tailwind CSS via utilitários sem framework pesado.
- **Backend / BaaS**: Supabase (PostgreSQL 15+, Supabase Auth, Storage Buckets públicos e privados, Edge Functions em Deno/TypeScript).
- **Segurança**: Row Level Security (RLS) habilitado em 100% das tabelas de domínio.
- **Dados de desenvolvimento**: seeds versionados não podem conter dados pessoais, posições reais, histórico financeiro real, nomes próprios de investidores ou saldos confidenciais.
- **Responsividade**: Layout adaptável para desktop, tablets e smartphones.
- **Publicação**: o bundle publicado contém apenas variáveis `VITE_*`; a chave de serviço existe só nas Edge Functions e nos testes.
- **Testes**: todo critério de aceitação tem um teste com o id no nome; `pnpm test` (unidade, integração e build) e `pnpm test:e2e` (Playwright) verdes antes de qualquer entrega.
