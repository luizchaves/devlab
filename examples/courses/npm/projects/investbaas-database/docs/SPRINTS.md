# Planejamento de Sprints - InvestBaaS

O desenvolvimento do InvestBaaS segue um modelo cumulativo em 7 sprints. A Sprint 1 entrega o
protótipo estático já versionado neste projeto. As sprints 2 a 7 conectam a aplicação aos serviços
do Supabase e completam a arquitetura BaaS planejada no PRD.

## Visão geral

| Sprint | Foco principal | Story points | Status |
| :--- | :--- | :---: | :--- |
| Sprint 1 | Frontend estático, setup, governança e telas navegáveis | 13 | Concluído |
| Sprint 2 | Supabase Auth, sessão JWT, proteção de páginas e perfil | 8 | Concluído |
| Sprint 3 | PostgreSQL, migrations, RLS, ativos e transações | 13 | Concluído |
| Sprint 4 | Edge Functions para cotações e atualização diária de preços | 8 | Planejado |
| Sprint 5 | Supabase Storage, comprovantes privados e URLs assinadas | 5 | Planejado |
| Sprint 6 | Analytics, AUM, painel administrativo e status operacional | 13 | Planejado |
| Sprint 7 | Origem (treemap por corretora, categoria e emissor) e aportes vs. valor | 8 | Planejado |

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

## Critério de pronto para qualquer task

Toda task precisa terminar com uma evidência verificável:

- código ou documentação versionada no arquivo esperado;
- validação manual registrada na descrição da task ou no pull request;
- ausência de segredo sensível no front-end;
- impacto em RLS, Storage ou Edge Functions revisado quando a task tocar dados financeiros;
- atualização da documentação quando a task mudar estrutura, fluxo ou convenção.
