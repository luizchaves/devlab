# monitor-app-static

Etapa 1 do **MonitorApp**: protótipo navegável em HTML e Tailwind CSS das quatro telas principais do painel de monitoramento.

## Execução

```bash
cd front
pnpm install
pnpm dev
```

Abra `http://localhost:5173` no navegador.

## Scripts (front/)

- `pnpm dev`: Inicia o servidor Vite para desenvolvimento local.
- `pnpm build`: Compila a interface estática para distribuição.
- `pnpm preview`: Visualiza o resultado do build.
- `pnpm lint`: Executa a verificação estática com o Biome.
- `pnpm format`: Aplica formatação automática de código.
- `pnpm check`: Valida integridade e regras do projeto.

## Estrutura de Telas (front/)

- `index.html`: Painel principal de hosts e formulário de cadastro.
- `host.html`: Histórico de medições e latência de um host.
- `signin.html`: Formulário de autenticação.
- `signup.html`: Formulário de criação de conta.
