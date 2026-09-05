---
marp: true
theme: default
paginate: true
style: |
  section {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-bottom: 70px;
    font-size: 1.5rem;
  }
  section.lead {
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
    position: absolute;
    bottom: 24px;
    right: 32px;
    padding: 0;
    font-size: 0.6em;
    color: #71717a;
  }
lang: pt-BR
title: "Express.js: Configuração e Ambiente"
description: "Variáveis de ambiente em uma API Express: --env-file nativo, .env versus .env.example, módulo de configuração validado na inicialização, segredos e as diferenças entre desenvolvimento e produção."
---

<!-- _class: lead -->

# Express.js: Configuração e Ambiente

Variáveis de ambiente em uma API Express: --env-file nativo, .env versus .env.example, módulo de configuração validado na inicialização, segredos e as diferenças entre desenvolvimento e produção.

---

## Objetivo

- Ao final você saberá carregar variáveis de ambiente sem dependências, separar `.env` de `.env.example`, validar a configuração na inicialização e...

---

## Mapa da Aula

- **Objetivo**
- **Por que não no código**
- **`process.env` e `--env-file`**
- **`.env` e `.env.example`**
- **Um módulo de configuração**
- **O que muda entre ambientes**
- **Exercício**
- **Desafio**

---

## Contexto da Aula

- Porta, URL do banco, segredo de token, endereço de SMTP: uma API precisa de valores que mudam entre a sua máquina, a do colega e o servidor de produção.
- Esta aula mostra onde eles devem morar: e por que nunca no código.

---

## Por que não no código

- Um valor escrito direto no arquivo cria três problemas de uma vez:
- Segredo versionado. Uma vez enviado ao Git, o valor está no histórico para sempre —
- apagar a linha depois não resolve.
- Mesmo código, ambientes diferentes. Desenvolvimento aponta para SQLite local;
- produção, para Postgres. Se o valor está no código, são duas versões do código.

---

## Por que não no código: Exemplo

```js
const app = express();
const JWT_SECRET = 'abc123'; // vai para o Git, e todo mundo vê
app.listen(3000, () => {
  //         ^ a porta de produção é outra, e não dá para mudar sem editar código
});
```

---

## `process.env` e `--env-file`

- O Node expõe as variáveis de ambiente em `process.env`.
- Elas podem vir do shell, do orquestrador de produção: ou de um arquivo `.env` carregado nativamente:
- Com `dotenv`, um módulo importado antes do `import 'dotenv/config'` já lê `process.env` vazio: bug clássico em arquivos que criam o client do banco no...
- A flag do Node não tem esse problema: as variáveis existem antes de o primeiro módulo carregar.

---

## `process.env` e `--env-file`: Tabela

- Dependência: nenhuma | uma dependência de produção
- Versão mínima do Node: 20.6 | qualquer
- Falha se o arquivo não existir: sim (`--env-file`) | não
- Variante tolerante: `--env-file-if-exists` | comportamento padrão
- Carrega antes de qualquer import: sim | depende da ordem dos imports

---

## `process.env` e `--env-file`: Exemplo 1

```bash
    node --env-file=.env src/server.ts
```

---

## `process.env` e `--env-file`: Exemplo 2

```json
    {
      "scripts": {
        "dev": "node --env-file-if-exists=.env --watch src/server.ts"
      }
    }
```

---

## `.env` e `.env.example`

- São dois arquivos com papéis opostos, e confundi-los é o erro mais comum:
- Quem clona o projeto roda `cp.env.example.env` e preenche os valores.
- O `.env.example` funciona como documentação executável: se uma variável nova não aparece nele, a próxima pessoa descobre a ausência por um erro em...
- Se um `.env` foi enviado ao Git, remover o arquivo não basta: o valor continua no histórico e em qualquer clone.
- O procedimento correto é rotacionar: gerar um segredo novo e invalidar o antigo.

---

## `.env` e `.env.example`: Exemplo 1

```txt
# Porta em que o servidor escuta.
PORT=3000
# Conexão com o banco de dados.
DATABASE_URL="file:./dev.db"
# Segredo de assinatura dos tokens. Gere o seu com:
#   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=""
```

---

## `.env` e `.env.example`: Exemplo 2

```txt
node_modules
.env
```

---

## Um módulo de configuração

- Espalhar `process.env.X` pelo código traz dois problemas: o valor é sempre `string | undefined`, e a falta de uma variável só aparece na primeira...
- Concentrar tudo em um módulo resolve os dois:
- O ganho é o momento da falha: a aplicação não sobe com a configuração incompleta, em vez de subir e falhar no primeiro login.
- O resto da aplicação passa a importar `config`, e nunca `process.env`:

---

## Um módulo de configuração: Exemplo 1

```ts
const isProduction = process.env.NODE_ENV === 'production';
function required(nome: string): string {
  const valor = process.env[nome];
  if (!valor) {
    throw new Error(`Variável de ambiente obrigatória ausente: ${nome}`);
  }
  return valor;
}
export const config = {
  port: Number(process.env.PORT ?? 3000),
```

---

## Um módulo de configuração: Exemplo 2

```ts
app.listen(config.port, () => {
  console.log(`Servidor rodando em http://localhost:${config.port}`);
});
```

---

## O que muda entre ambientes

- Bibliotecas mudam de comportamento com base nela.
- Rodar produção sem definir `NODE_ENV` mantém verificações caras de desenvolvimento ligadas e pode expor stack traces.

---

## O que muda entre ambientes: Tabela

- Origem das variáveis: arquivo `.env` | ambiente do orquestrador/PaaS
- Banco: SQLite local | Postgres gerenciado
- Mensagem de erro `5xx`: pode detalhar | genérica, detalhe só no log
- Segredo de token: padrão de conveniência | obrigatório, aleatório e rotacionável
- Log: legível por humano | JSON estruturado

---

## Exercício

- Partindo do projeto `express-typescript`:
- Crie `.env.example` com `PORT` e `NODE_ENV` e acrescente `.env` ao `.gitignore`.
- Escreva `src/config.ts` com a função `required` e exporte `port` e `isProduction`.
- Faça `server.ts` usar `config.port`.
- Acrescente `DATABASE_URL` como obrigatória e confirme que a aplicação recusa subir sem

---

## Exercício: Exemplo

```ts
  function required(nome: string): string {
    const valor = process.env[nome];
    if (!valor) {
      throw new Error(`Variável de ambiente obrigatória ausente: ${nome}`);
    }
    return valor;
  }
  export const config = {
    port: Number(process.env.PORT ?? 3000),
    databaseUrl: required('DATABASE_URL'),
    isProduction: process.env.NODE_ENV === 'production',
```

---

## Desafio

- Faça `config.ts` validar também o formato: `PORT` precisa ser um inteiro entre 1 e 65535 e `JWT_SECRET`, em produção, precisa ter ao menos 32 caracteres.
- Compare a sua validação manual com o que a aula de Validação faz com um schema.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Variáveis de ambiente em uma API Express: --env-file nativo,.env versus.env.example, módulo de configuração validado na inicialização, segredos e as...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Ambiente

- Por que remover o `.env` do repositório não resolve um vazamento?
- Porque o valor continua no histórico do Git e em todos os clones já feitos.
- A única resposta eficaz é rotacionar o segredo, invalidando o antigo.
- Qual a diferença entre `--env-file` e `--env-file-if-exists`?
- O primeiro falha se o arquivo não existir; o segundo segue adiante.

---

## Configuração

- Qual a vantagem de um módulo `config` sobre `process.env` espalhado?
- Os valores ficam tipados e convertidos em um lugar só, e a ausência de uma variável obrigatória derruba a aplicação na inicialização, não na primeira...
- Por que `JWT_SECRET` pode ter valor padrão em desenvolvimento, mas não em produção?
- Porque em desenvolvimento o padrão evita atrito e o dado não é real.
- Em produção, um segredo padrão é público: qualquer pessoa que conheça o projeto consegue forjar tokens válidos.

---

## Próxima aula

- Log: enxergar o que a aplicação faz depois que ela sai da sua máquina.

---

## Resumo da Aula

- **Express.js: Configuração e Ambiente** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
