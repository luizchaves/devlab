# AGENTS.md

Instruções para agentes de IA que trabalham no projeto **InvestBaaS**.

O `README.md` é a documentação humana do projeto. O `docs/PRD.md` descreve os requisitos funcionais, não-funcionais e o modelo de dados. Este arquivo define as diretrizes operacionais e regras invioláveis de arquitetura.

## O que é o InvestBaaS

Plataforma moderna de gestão e inteligência de investimentos construída com **HTML5 semântico + Tailwind CSS + Vanilla JS modular** no front-end e **Supabase (PostgreSQL, Row Level Security, Supabase Auth, Storage e Edge Functions)** no back-end.

## Regras Invioláveis de Arquitetura

1. **Back-end as a Service (BaaS) e Serverless**: O banco de dados e autenticação residem no Supabase. Não crie servidores Express ou APIs intermediárias desnecessárias.
2. **Isolamento de Dados com Row Level Security (RLS)**: Toda tabela pública deve possuir RLS ativado (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`). Clientes só acessam seus próprios registros (`auth.uid() = user_id`).
3. **Visão Administrativa Segura**: O acesso administrativo a métricas agregadas (total de contas, patrimônio sob custódia) é protegido por policies RLS baseadas em `role = 'admin'` em `profiles` ou claims seguras no token.
4. **Cotações Automáticas via Edge Functions**: A consulta a APIs externas de mercado financeiro (bolsa B3) é realizada exclusivamente por Edge Functions Serverless (Deno/TypeScript), garantindo sigilo de chaves e execução desacoplada.
5. **Idioma dos Identificadores**: Identificadores de código (funções, variáveis, colunas SQL, tipos) em inglês; interface do usuário, comentários didáticos e documentação em português do Brasil.

## Comandos

| Comando | O que faz |
| :--- | :--- |
| `pnpm dev` | Inicia o servidor local de desenvolvimento (Vite) |
| `pnpm build` | Compila a aplicação para produção em `dist/` |
| `pnpm preview` | Visualiza o build de produção localmente |
| `pnpm lint` | Executa análise estática de código com Biome |
| `pnpm format` | Aplica formatação automática com Biome |
| `pnpm lint:fix` | Aplica correções automáticas de lint e formatação |

## Fluxo Spec-Driven Development

1. Consulte a tarefa no `docs/PRD.md`.
2. Crie a branch Git isolada (`feat/tkXX-Y-...`).
3. Gere a especificação técnica em `specs/active/` via skill `task-spec-generator`.
4. Implemente e valide com `pnpm lint` e testes.
5. Finalize via skill `task-pr-finalizer`, arquivando a spec em `specs/archived/`.
