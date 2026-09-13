# Planejamento de Sprints - InvestFlow

O desenvolvimento do InvestFlow segue um modelo cumulativo em 11 sprints. A Sprint 1 entrega o
protótipo estático. As sprints 2 a 7 conectam a aplicação aos serviços do Supabase e completam a
arquitetura BaaS planejada no PRD, cada uma em um projeto próprio (`investflow-static` a
`investflow-origins`). As sprints 8 a 11 evoluem o mesmo `investflow-origins`, o projeto final:
lançamentos e cotação manual, proventos e movimentações, dólar e cripto, perfil e experiência.

Os critérios de aceitação (CA) são numerados pela sprint e cada um tem pelo menos um teste com o
mesmo id no nome (`it('CA09.3: …')`); a rastreabilidade completa (US → CA → TK → teste) está no
backlog da trilha no DevLab.

## Visão geral

| Sprint | Foco principal | Story points | Status |
| :--- | :--- | :---: | :--- |
| Sprint 1 | Frontend estático, setup, governança e telas navegáveis | 13 | Concluído |
| Sprint 2 | Supabase Auth, sessão JWT, proteção de páginas e perfil | 8 | Concluído |
| Sprint 3 | PostgreSQL, migrations, RLS, ativos e transações | 13 | Concluído |
| Sprint 4 | Edge Functions para cotações e atualização diária de preços | 8 | Concluído |
| Sprint 5 | Supabase Storage, comprovantes privados e URLs assinadas | 5 | Concluído |
| Sprint 6 | Analytics, AUM, painel administrativo e status operacional | 13 | Concluído |
| Sprint 7 | Origem (treemap por corretora, categoria e emissor) e aportes vs. valor | 8 | Concluído |
| Sprint 8 | Lançamentos editáveis, renda fixa pelo saldo, cotação manual e carteira organizável | 8 | Concluído |
| Sprint 9 | Proventos pela data ex, retorno total e extrato de movimentações | 13 | Concluído |
| Sprint 10 | Moeda por ativo, câmbio, cripto e calendário de mercado | 13 | Concluído |
| Sprint 11 | Perfil com avatar, barra comum, tema, privacidade e deploy | 8 | Concluído |

## Sprint 1 - Frontend estático e governança

| Task ID | História | Descrição | Estimativa | Validação |
| :--- | :--- | :--- | :---: | :--- |
| TK01-1 | US02 | Criar projeto Vite, package.json, Biome, README e AGENTS.md. | 2 | `pnpm install`, `pnpm dev`, `pnpm lint`. |
| TK01-2 | US01 | Construir index.html com landing page e simulador visual. | 3 | Abrir landing e conferir inputs, CTAs e responsividade. |
| TK01-3 | US03 | Criar signin.html e signup.html com formulários de sessão. | 2 | Navegar entre cadastro, login e landing por links relativos. |
| TK01-4 | US05 | Criar dashboard.html com KPIs, tabela de ativos e ações principais. | 3 | Conferir categorias, valores, botões e leitura em mobile. |
| TK01-5 | US09 | Criar analytics.html com matriz de rentabilidade e distribuição. | 2 | Conferir anos, meses, valores positivos, negativos e células vazias. |
| TK01-6 | US10 | Criar admin.html com métricas agregadas e status operacional. | 1 | Verificar que não há posições individuais na tela admin. |
| TK01-7 | US02 | Criar specs arquivadas, skills locais, template de PR e documentação de sprint. | 1 | Conferir docs, specs arquivadas e template de PR. |

## Sprint 2 - Supabase Auth e sessão

| Task ID | História | Descrição | Estimativa | Validação |
| :--- | :--- | :--- | :---: | :--- |
| TK02-1 | US03 | Criar arquivo de configuração do cliente Supabase com URL e anon key. | 1 | Conferir que apenas valores públicos aparecem no front-end. |
| TK02-2 | US03 | Implementar cadastro com e-mail, senha e metadados de nome completo. | 2 | Criar usuário de teste no projeto Supabase. |
| TK02-3 | US03 | Implementar login e mensagens de erro para credenciais inválidas. | 2 | Testar login válido e inválido. |
| TK02-4 | US04 | Criar guarda de sessão para páginas privadas. | 1 | Abrir página privada sem sessão e verificar redirecionamento. |
| TK02-5 | US03, US04 | Implementar logout, recuperação de sessão e exibição do e-mail do usuário. | 1 | Recarregar página autenticada e confirmar permanência da sessão. |
| TK02-6 | US03 | Criar tabela ou trigger de profiles vinculada a auth.users. | 1 | Confirmar criação de perfil para novo usuário. |

## Sprint 3 - PostgreSQL, carteira e RLS

| Task ID | História | Descrição | Estimativa | Validação |
| :--- | :--- | :--- | :---: | :--- |
| TK03-1 | US05 | Criar migration SQL para assets com tipos, categorias, issuer, broker_id, constraints e user_id. | 2 | Inserir ativo válido e recusar categoria inválida. |
| TK03-2 | US05 | Criar migration SQL para transactions com compra, venda, preço, data e comprovante. | 2 | Inserir transação vinculada a ativo existente. |
| TK03-3 | US07, US09 | Criar quotes_history para histórico de preços por ativo e data. | 1 | Inserir cotação e consultar por ativo. |
| TK03-4 | US06 | Habilitar RLS em profiles, assets, transactions e quotes_history. | 1 | Consultar tabelas como usuário autenticado e anônimo. |
| TK03-5 | US06 | Criar policies de leitura, inserção, atualização e exclusão por auth.uid(). | 2 | Tentar acessar dados de outro usuário e confirmar bloqueio. |
| TK03-6 | US05 | Ligar dashboard.html ao Supabase para listar ativos reais. | 2 | Criar ativo no banco e visualizar na tabela. |
| TK03-7 | US05 | Implementar criação de ativo e transação pelo front-end. | 2 | Cadastrar compra e conferir atualização da carteira. |
| TK03-8 | US05, US09 | Calcular patrimônio, custo, lucro e rentabilidade a partir dos registros. | 1 | Comparar cálculo exibido com dados de teste conhecidos. |
| TK03-9 | US06 | Criar índices para user_id, asset_id, ticker e datas de consulta. | 1 | Executar consultas comuns e revisar plano ou tempo de resposta. |
| TK03-10 | US05 | Criar brokers por dono e a criação automática de corretora nova no cadastro do ativo; assets ganha broker_id e issuer. | 1 | Cadastrar dois ativos na mesma corretora e conferir uma única linha em brokers. |
| TK03-11 | US11 | Criar asset.html e src/pages/asset.js com a lista de aportes e o formulário de nova transação. | 2 | Abrir um ativo próprio e um alheio; registrar um aporte e ver a posição mudar. |
| TK03-12 | US14 | Implementar edição e exclusão de ativos próprios na carteira, reaproveitando RLS e cascades do banco. | 1 | CA03.11 e CA03.12: editar ticker, corretora e emissor; excluir o ativo e confirmar que ele sai da carteira. |
| TK03-13 | US16 | Sanitizar seeds versionados para conter apenas dados demonstrativos públicos e mover cargas reais para fora do repositório. | 1 | CA03.13 a CA03.15: inspecionar `supabase/seed.sql` e `scripts/seed-investments.mjs`; rodar `pnpm db:reset` e confirmar admin + ativo fictício de R$ 1. |

## Sprint 4 - Cotações com Edge Functions

| Task ID | História | Descrição | Estimativa | Validação |
| :--- | :--- | :--- | :---: | :--- |
| TK04-1 | US07 | Criar estrutura da Edge Function update-quotes. | 1 | Executar função localmente com Supabase CLI. |
| TK04-2 | US07 | Consultar tickers elegíveis em assets usando chave de serviço no ambiente da função. | 1 | Confirmar que o cliente não recebe a service role key. |
| TK04-3 | US07 | Integrar provedor de cotações ou adaptador simulado com contrato estável. | 2 | Testar resposta com lista de tickers conhecidos. |
| TK04-4 | US07 | Atualizar assets.current_price e inserir linhas em quotes_history. | 1 | Conferir antes e depois no SQL Editor. |
| TK04-5 | US07 | Registrar falhas por ticker sem abortar toda a atualização. | 1 | Simular ticker inválido e verificar resumo parcial. |
| TK04-6 | US07 | Adicionar botão Atualizar Cotações no dashboard chamando a função. | 1 | Clicar no botão e observar atualização dos valores. |
| TK04-7 | US07, US10 | Criar status operacional da última execução para o painel admin. | 1 | Conferir data, sucesso, falhas e total atualizado. |
| TK04-8 | US07 | Documentar agendamento diário da função no Supabase. | 1 | Conferir configuração de cron ou instrução operacional. |
| TK04-9 | US15 | Disparar atualização de cotações automaticamente após criar ou editar ativos de categoria Ações ou FIIs. | 1 | CA04.4 e CA04.5: salvar um FII com ticker conhecido preenche a cotação; ticker sem retorno mantém o ativo salvo e informa a falha. |

## Sprint 5 - Supabase Storage e comprovantes

| Task ID | História | Descrição | Estimativa | Validação |
| :--- | :--- | :--- | :---: | :--- |
| TK05-1 | US08 | Criar bucket privado receipts. | 1 | Confirmar que o bucket não é público. |
| TK05-2 | US08 | Criar policies em storage.objects para pasta auth.uid(). | 1 | Tentar ler arquivo de outro usuário e confirmar bloqueio. |
| TK05-3 | US08 | Implementar upload de PDF, PNG e JPG com limite de tamanho. | 1 | Enviar arquivo válido, arquivo grande e extensão inválida. |
| TK05-4 | US08 | Salvar caminho do comprovante em transactions.receipt_url ou campo equivalente. | 1 | Conferir vínculo entre transação e arquivo. |
| TK05-5 | US08 | Implementar geração de URL assinada com expiração curta. | 1 | Abrir URL válida e verificar expiração depois do prazo. |
| TK05-6 | US08 | Exibir comprovante na tela de detalhes ou histórico da transação. | 1 | Abrir comprovante de uma transação própria. |
| TK05-7 | US08, US10 | Expor contagem agregada de uploads e falhas no painel admin. | 1 | Confirmar métrica agregada sem listar arquivos individuais. |

## Sprint 6 - Analytics, admin e operação

| Task ID | História | Descrição | Estimativa | Validação |
| :--- | :--- | :--- | :---: | :--- |
| TK06-1 | US09 | Criar consulta ou view para rentabilidade mensal por usuário. | 2 | Conferir meses com dados positivos, negativos e ausentes. |
| TK06-2 | US09 | Calcular acumulado anual com composição dos resultados mensais. | 1 | Comparar resultado com planilha de referência. |
| TK06-3 | US09 | Ligar analytics.html aos dados reais da carteira autenticada. | 2 | Alterar transações e confirmar mudança na matriz. |
| TK06-4 | US09 | Criar distribuição por classe de ativo e evolução patrimonial. | 1 | Conferir soma por categoria contra tabela de ativos. |
| TK06-5 | US10 | Criar função ou view administrativa para contas ativas e AUM agregado. | 2 | Confirmar que a consulta não retorna posições individuais. |
| TK06-6 | US10 | Proteger painel admin por role admin. | 1 | Testar acesso com usuário comum e administrador. |
| TK06-7 | US10 | Exibir status de Auth, banco, cotações, Storage e jobs no admin. | 1 | Simular falha operacional e conferir indicador visual. |
| TK06-8 | US09, US10 | Revisar responsividade de analytics e admin com dados reais. | 1 | Testar mobile e desktop com tabelas largas. |
| TK06-9 | US09, US10 | Documentar limites conhecidos, riscos e próximos passos técnicos. | 1 | Atualizar página de próximos passos e checklist de publicação. |

## Sprint 7 - Origem e evolução

| Task ID | História | Descrição | Estimativa | Validação |
| :--- | :--- | :--- | :---: | :--- |
| TK07-1 | US12 | Criar a view allocation_by_origin (dono, corretora, categoria, emissor, valor atual) com security_invoker. | 1 | Consultar como dois usuários e conferir a soma contra assets. |
| TK07-2 | US12 | Criar src/lib/treemap.js: algoritmo squarified como função pura e renderização em SVG, sem biblioteca. | 2 | Testes de unidade com áreas conhecidas; soma das áreas igual ao total. |
| TK07-3 | US12 | Criar origins.html e src/pages/origins.js com seletor de recorte (corretora, categoria, emissor) e legenda. | 1 | Trocar o recorte e conferir os blocos. |
| TK07-4 | US13 | Criar a view portfolio_evolution (dono, ativo, mês, aportado acumulado, valor de mercado) com security_invoker. | 1 | Comparar com a planilha de referência da Sprint 6. |
| TK07-5 | US13 | Criar src/lib/line-chart.js (SVG, duas séries, eixo de tempo) e ligar em analytics.html e asset.html. | 2 | Ver as duas linhas e a lacuna em mês sem cotação. |
| TK07-6 | US12, US13 | Testes de unidade, integração e E2E da sprint. | 1 | pnpm test e pnpm test:e2e verdes. |
| TK07-7 | US13 | Modos contínuo e eventos e janela de tempo (Tudo, 2 anos, Ano) nos dois gráficos. | 1 | CA07.7 e CA07.8: trocar o modo sem recarregar; `?range=2y` na URL. |

## Sprint 8 - Lançamentos, saldo e cotação manual

| Task ID | História | Descrição | Estimativa | Validação |
| :--- | :--- | :--- | :---: | :--- |
| TK08-1 | US17 | Editar e excluir lançamentos e o resgate total no diálogo do ativo. | 1 | CA08.1 a CA08.4: editar recalcula; excluir com confirmação; resgate total zera; venda baixa pelo preço médio. |
| TK08-2 | US18 | Categorias ETF e FI-Infra e o ticker automático da renda fixa. | 1 | CA08.5 e CA08.6: sete categorias aceitas, outra recusada; RF-… gerado. |
| TK08-3 | US18 | Lançamento `update` em summarize() e no formulário. | 1 | CA08.7 e CA08.8: posição e custo iguais ao saldo; ativo vale o saldo sem cotação. |
| TK08-4 | US19 | `asset_id` no corpo da update-quotes e botão na tela do ativo. | 1 | CA08.9: chamar com asset_id atualiza um ativo só. |
| TK08-5 | US19 | Diálogo de cotação e saldo manual, recordQuote() e policy de escrita do dono em quotes_history. | 1 | CA08.10 a CA08.12: fallback manual; cotação no histórico; outra conta recebe 42501. |
| TK08-6 | US20 | Filtros ativas × todas, ordenação por coluna e rodapé ponderado. | 1 | CA08.13 a CA08.15: zerado some no filtro padrão; ordenar duas vezes inverte; rodapé soma. |
| TK08-7 | US20 | Duração da posição (investmentDuration()). | 0.5 | CA08.16: aberta até hoje; encerrada até a última venda. |
| TK08-8 | US20 | Estado na URL (query-params.js) e asset.html?ticker=. | 0.5 | CA08.17 e CA08.18: recarregar mantém; padrão fora da URL; ticker inexistente mostra não encontrado. |
| TK08-9 | US17–US20 | Testes de unidade, integração e E2E da sprint. | 1 | pnpm test e pnpm test:e2e verdes. |

## Sprint 9 - Proventos e movimentações

| Task ID | História | Descrição | Estimativa | Validação |
| :--- | :--- | :--- | :---: | :--- |
| TK09-1 | US21 | Migration dividends_history com RLS pelo dono do ativo. | 2 | CA09.1: outra conta não lê nem escreve; (ativo, data ex) único. |
| TK09-2 | US21 | Crawler de proventos com upsert idempotente. | 2 | CA09.2 a CA09.4: só categorias elegíveis; repetir não duplica; falha não apaga. |
| TK09-3 | US22 | calculateDividends(), YoC, retorno total e matriz ano × mês. | 2 | CA09.5, CA09.7, CA09.8: compra na data ex não recebe; matriz soma o extrato; retorno total. |
| TK09-4 | US22 | dividends.html com KPIs, gráfico, matriz, maiores pagadores e extrato. | 2 | CA09.6 e CA09.7: filtro por ativo muda KPIs e extrato juntos. |
| TK09-5 | US22 | Aba Proventos e card de retorno total em asset.html. | 1 | CA09.8: aba oculta em renda fixa. |
| TK09-6 | US23 | Toggle "Com proventos", withDividends() e a série "Valor + Proventos". | 1 | CA09.9 a CA09.11: `?dividends=true` muda lucro; provento no mês; terceira série. |
| TK09-7 | US24 | lib/bar-chart.js. | 1 | CA09.13: barras proporcionais ao máximo; lista vazia não quebra. |
| TK09-8 | US24 | movements.html com KPIs, gráfico e extrato. | 1 | CA09.12, CA09.14, CA09.15: aportado líquido = compras − vendas; comprovante; registro pela página. |
| TK09-9 | US21–US24 | Testes de unidade, integração e E2E da sprint. | 1 | pnpm test e pnpm test:e2e verdes. |

## Sprint 10 - Dólar e cripto

| Task ID | História | Descrição | Estimativa | Validação |
| :--- | :--- | :--- | :---: | :--- |
| TK10-1 | US25 | assets.currency e a autodetecção pelo ticker. | 1 | CA10.1 e CA10.2: VT sugere USD, PETR4 BRL; moeda inválida recusada. |
| TK10-2 | US25 | Migration exchange_rates e get_usd_rate(). | 2 | CA10.3: leitura pública, escrita só do serviço; taxa do dia ou anterior. |
| TK10-3 | US25 | summarize() com usdRate, totals() em BRL e services/exchange.js. | 2 | CA10.4 e CA10.5: totais em R$, preço em US$; sem taxa, fallback. |
| TK10-4 | US26 | Conversão nas views de origem e evolução. | 1 | CA10.8: valor do ETF em USD = posição × preço × taxa do mês. |
| TK10-5 | US26 | summarizeInBRL(), monthlyFlows(), botão US$/R$ e matriz do ativo. | 2 | CA10.6, CA10.7, CA10.9, CA10.10: custo pelo câmbio da compra; `?currency=USD`. |
| TK10-6 | US27 | quoteSymbol() e priceInAssetCurrency(). | 1 | CA10.11 e CA10.12: BTC vira BTC-USD; sem câmbio, sem cotação. |
| TK10-7 | US27 | Persistir a taxa USD/BRL da rodada em exchange_rates. | 1 | CA10.13: depois de uma rodada com cripto, exchange_rates tem a taxa de hoje. |
| TK10-8 | US28 | Calendário de mercado e shouldFetchFromProvider(). | 2 | CA10.14 a CA10.16: horários e feriados; sábado com fechamento salvo não consulta. |
| TK10-9 | US25–US28 | Testes de unidade, integração e E2E da sprint. | 1 | pnpm test e pnpm test:e2e verdes. |

## Sprint 11 - Perfil e experiência

| Task ID | História | Descrição | Estimativa | Validação |
| :--- | :--- | :--- | :---: | :--- |
| TK11-1 | US29 | profile.html, pages/profile.js e services/profile.js. | 2 | CA11.1 e CA11.3: nome em branco recusado; remover avatar devolve a inicial. |
| TK11-2 | US29 | Bucket público avatars, profiles.avatar_url e grant update restrito. | 1 | CA11.2 e CA11.4: outra conta não escreve na pasta; role não muda pelo cliente. |
| TK11-3 | US30 | lib/navbar.js com menu do usuário e contexto admin. | 1 | CA11.5 e CA11.6: link do admin só para admin; Esc fecha o menu. |
| TK11-4 | US30 | Landing com sessão. | 0.5 | CA11.7: logado, a landing mostra "Acessar Carteira". |
| TK11-5 | US31 | lib/theme.js. | 0.5 | CA11.9: ciclo claro → escuro → automático persiste. |
| TK11-6 | US31 | lib/privacy.js. | 1 | CA11.10: valores viram •••••• e continuam ocultos em outra página. |
| TK11-7 | US30, US31 | Mostrar/ocultar senha e fechar diálogo pelo fundo. | 0.5 | CA11.8 e CA11.11: clique no olho troca o tipo do input; clique fora fecha o diálogo. |
| TK11-8 | US32 | vercel.json, .vercelignore e o build multipágina. | 0.5 | CA11.12 e CA11.13: dist/ com onze páginas e sem a chave de serviço. |
| TK11-9 | US29–US32 | Testes de unidade, integração, build e E2E da sprint. | 1 | pnpm test e pnpm test:e2e verdes. |

## Critério de pronto para qualquer task

Toda task precisa terminar com uma evidência verificável:

- código ou documentação versionada no arquivo esperado;
- pelo menos um teste automatizado com o id do critério de aceitação no nome;
- validação manual registrada na descrição da task ou no pull request;
- ausência de segredo sensível no front-end;
- ausência de dados pessoais, posições reais ou saldos confidenciais em seeds versionados;
- impacto em RLS, Storage ou Edge Functions revisado quando a task tocar dados financeiros;
- atualização da documentação quando a task mudar estrutura, fluxo ou convenção.
