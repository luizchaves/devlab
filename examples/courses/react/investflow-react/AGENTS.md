# AGENTS.md

Instruções para agentes de IA que trabalham no projeto **InvestFlow React**.

O projeto adapta o InvestFlow vanilla para React e Next.js. A documentação humana principal é o `README.md`; este arquivo registra as decisões de arquitetura que devem ser preservadas.

## Arquitetura

1. **React funcional por padrão**: use componentes funcionais, hooks e composição. Não crie componentes de classe.
2. **Next.js App Router**: rotas de página ficam em `app/`; rotas HTTP ficam em `app/api/`.
3. **Server state pertence ao TanStack React Query**: dados que vêm do banco, de APIs externas ou de rotas HTTP usam `useQuery`/`useMutation`, cache keys estáveis e tratamento explícito de erro.
4. **Estado global mínimo no Zustand**: use Zustand apenas para preferências locais e estado efêmero de UI, como ocultar valores ou abrir a command palette. Não replique dados remotos no store.
5. **Persistência com Prisma**: o banco relacional é acessado pelo Prisma em módulos de servidor. O cliente React nunca acessa o banco diretamente.
6. **Autenticação com NextAuth**: toda rota privada valida sessão no servidor. Autorização administrativa deve verificar papel do usuário antes de expor dados agregados.
7. **UI acessível**: use Base UI como primitivo de interação, Lucide React para ícones comuns e textos/atributos acessíveis em botões sem rótulo visual.
8. **Variantes com CVA**: estilos condicionais de componentes reutilizáveis usam `class-variance-authority` e `tailwind-merge`.
9. **Performance antes de abstração**: evite waterfalls, busque dados independentes em paralelo e mantenha componentes cliente pequenos.

## Estratégia de Testes

| Camada | Arquivos | Prova |
| ------ | -------- | ----- |
| `unit` | `*.test.ts(x)` | `core`, hooks e utilitários puros |
| `browser` | `*.browser.test.ts(x)` | primitivas de `ui` em navegador real |
| `integration` | `*.integration.test.ts(x)` | fluxos de rota, autorização e handlers HTTP |
| `e2e` | `tests/e2e/*.spec.ts` | jornada completa do usuário |

Rode `pnpm lint`, `pnpm typecheck`, `pnpm test` e `pnpm test:e2e` antes de finalizar mudanças relevantes.
