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
title: "Express.js: Paginação, Filtros e Ordenação"
description: "Parâmetros de consulta em coleções que crescem: paginação por offset e por cursor, envelope de resposta, filtros combináveis, ordenação com lista de campos permitidos e limites de segurança."
---

<!-- _class: lead -->

# Express.js: Paginação, Filtros e Ordenação

Parâmetros de consulta em coleções que crescem: paginação por offset e por cursor, envelope de resposta, filtros combináveis, ordenação com lista de campos permitidos e limites de segurança.

---

## Objetivo

- Ao final você saberá paginar por offset e por cursor, escolher entre os dois, combinar filtros opcionais sem uma cascata de `if`, e permitir ordenação...

---

## Mapa da Aula

- **Objetivo**
- **Por que não devolver tudo**
- **Paginação por offset**
- **Paginação por cursor**
- **Filtros combináveis**
- **Ordenação com lista de permitidos**
- **O contrato completo**
- **Exercício**

---

## Contexto da Aula

- Esta aula trata dos parâmetros que fazem uma coleção crescer sem quebrar.

---

## Por que não devolver tudo?

- Uma listagem sem limite tem três custos simultâneos, e todos crescem junto com a tabela:
- Uma rota de listagem sem limite padrão é uma negação de serviço esperando acontecer: basta a tabela crescer.
- Defina um padrão (20 ou 50) e um teto (100), independentemente do que o cliente peça.

---

## Por que não devolver tudo?: Tabela

- Banco: varredura completa da tabela a cada chamada
- Memória: o processo carrega o resultado inteiro antes de serializar
- Rede: megabytes trafegados para exibir dez linhas na tela

---

## Paginação por offset

- É a forma mais direta: pular `N` registros e pegar os próximos `M`.
- O envelope separa os dados dos metadados, e é o que permite ao front-end desenhar a paginação:
- { "data": [ { "id": "c3f1", "name": "CDB Inter", "amount": 15000 }, { "id": "a9d2", "name": "LCI Banco X", "amount": 8000 } ], "meta": { "page": 2,...
- Trocar um array puro por `{ data, meta }` quebra todo cliente que fazia `response.json().map(...)`.
- Se a API já está em uso, ou se versiona (REST API), ou se colocam os metadados em cabeçalhos: `X-Total-Count` e `Link`: mantendo o corpo como array.

---

## Paginação por offset: Exemplo

```ts
export async function index(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page ?? 1));
  const perPage = Math.min(100, Math.max(1, Number(req.query.perPage ?? 20)));
  const [items, total] = await Investment.paginate({ skip: (page - 1) * perPage, take: perPage });
  res.json({
    data: items,
    meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
  });
}
```

---

## Paginação por cursor

- O offset tem dois problemas que só aparecem em escala: `OFFSET 100000` ainda faz o banco contar cem mil linhas, e um registro inserido entre duas...
- Offset é mais simples, permite "ir para a página N" e resolve a maioria dos casos de sala de aula e de painéis administrativos.
- Migre para cursor quando a listagem for um feed ou quando a tabela passar de algumas centenas de milhares de linhas.

---

## Paginação por cursor: Tabela

- "Ir para a página 7": sim | não
- Total de páginas: sim | não (exigiria contar tudo)
- Desempenho em página distante: degrada | constante
- Estável com inserções: não | sim
- Uso típico: tabela administrativa | *feed*, rolagem infinita

---

## Paginação por cursor: Exemplo

```ts
export async function index(req: Request, res: Response) {
  const { cursor, limit = '20' } = req.query as { cursor?: string; limit?: string };
  const take = Math.min(100, Number(limit));
  const items = await prisma.investment.findMany({
    take: take + 1, // um a mais: revela se existe próxima página
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { id: 'asc' },
  });
  const hasNext = items.length > take;
  const data = hasNext ? items.slice(0, take) : items;
  res.json({ data, meta: { nextCursor: hasNext ? data.at(-1)?.id : null } });
```

---

## Filtros combináveis

- Filtros são opcionais por natureza, e uma cascata de `if` cresce mal. Montar o objeto de condições incrementalmente resolve:
- O mapa também define o que é aceito: um parâmetro fora dele é simplesmente ignorado, e não há como o cliente inventar uma condição.

---

## Filtros combináveis: Exemplo 1

```ts
    let where = {};
    if (req.query.name) {
      where = { ...where, name: { contains: req.query.name } };
    }
    if (req.query.categoryId) {
      where = { ...where, categoryId: req.query.categoryId };
    }
    if (req.query.minAmount) {
      where = { ...where, amount: { gte: Number(req.query.minAmount) } };
    }
```

---

## Filtros combináveis: Exemplo 2

```ts
    const FILTROS = {
      name: (valor: string) => ({ name: { contains: valor } }),
      categoryId: (valor: string) => ({ categoryId: valor }),
      minAmount: (valor: string) => ({ amount: { gte: Number(valor) } }),
    } as const;
    export function buildWhere(query: Record<string, unknown>) {
      return Object.entries(FILTROS).reduce((where, [chave, montar]) => {
        const valor = query[chave];
        return valor ? { ...where, ...montar(String(valor)) } : where;
      }, {});
    }
```

---

## Ordenação com lista de permitidos

- Ordenação é o parâmetro mais perigoso da consulta, porque o valor vira nome de coluna.
- Repassá-lo direto permite ordenar por qualquer campo: inclusive `password`: e, em SQL montado por concatenação, injetar comandos:
- Bloquear `password` e liberar o resto falha no primeiro campo sensível que alguém acrescentar ao schema.
- A lista de permitidos é segura por construção: campo novo só entra quando alguém decide colocá-lo lá.
- O mesmo vale para a ordenação estável: dois registros com o mesmo `createdAt` podem trocar de posição entre páginas.

---

## Ordenação com lista de permitidos: Exemplo 1

```ts
const CAMPOS_ORDENAVEIS = ['name', 'amount', 'createdAt', 'dueDate'] as const;
type CampoOrdenavel = (typeof CAMPOS_ORDENAVEIS)[number];
export function buildOrderBy(sort?: string) {
  // ?sort=-amount  ->  amount desc
  const desc = sort?.startsWith('-') ?? false;
  const campo = sort?.replace(/^-/, '') as CampoOrdenavel;
  if (!CAMPOS_ORDENAVEIS.includes(campo)) {
    return { createdAt: 'desc' as const }; // padrão previsível
  }
  return { [campo]: desc ? ('desc' as const) : ('asc' as const) };
```

---

## Ordenação com lista de permitidos: Exemplo 2

```ts
orderBy: [{ createdAt: 'desc' }, { id: 'asc' }]
```

---

## O contrato completo

- Reunindo tudo, a rota de listagem aceita quatro grupos de parâmetros:
- { "data": [ { "id": "b1c2", "name": "Tesouro Selic 2029", "amount": 20000 }, { "id": "c3f1", "name": "CDB Inter", "amount": 15000 } ], "meta": {...
- Devolver `total` exige um `COUNT(*)` com os mesmos filtros: uma segunda consulta a cada listagem.
- Em tabelas grandes, é comum omiti-lo e devolver apenas `hasNext`, ou calculá-lo de forma aproximada.

---

## O contrato completo: Tabela

- filtros: `?name=CDB&minAmount=1000` | condições combináveis por `AND`

---

## Exercício

- Na rota `GET /users` do projeto `express-typescript`:
- Aceite `page` e `perPage`, com padrão 20 e teto 100.
- Responda no envelope `{ data, meta }`.
- Aceite `?name=` filtrando por trecho do nome, sem diferenciar maiúsculas.
- Aceite `?sort=` restrito a `name` e `email`, com `-` invertendo a ordem.

---

## Exercício: Exemplo

```ts
  const CAMPOS_ORDENAVEIS = ['name', 'email'] as const;
  export function index(req: Request, res: Response) {
    const page = Math.max(1, Number(req.query.page ?? 1) || 1);
    const perPage = Math.min(100, Math.max(1, Number(req.query.perPage ?? 20) || 20));
    const name = String(req.query.name ?? '').toLowerCase();
    const sort = String(req.query.sort ?? '');
    const desc = sort.startsWith('-');
    const campo = sort.replace(/^-/, '');
    const ordenarPor = CAMPOS_ORDENAVEIS.includes(campo) ? campo : 'name';
    const filtrados = User.findAll()
      .filter((user) => user.name.toLowerCase().includes(name))
```

---

## Desafio

- Implemente a paginação por cursor na mesma rota, devolvendo `meta.nextCursor`, e escreva um teste que comprove a diferença: inserir um usuário no topo...

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Parâmetros de consulta em coleções que crescem: paginação por offset e por cursor, envelope de resposta, filtros combináveis, ordenação com lista de...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Paginação

- Por que uma listagem sem limite é um risco, e não apenas uma lentidão?
- Porque o custo cresce com a tabela, sem que ninguém precise atacar: uma única chamada pode esgotar a memória do processo.
- É uma negação de serviço que a própria aplicação habilita.
- Quando o cursor é melhor que o offset?
- Em feeds e listas muito grandes: o desempenho não degrada em páginas distantes e a paginação permanece estável quando registros são inseridos.

---

## Filtros e ordenação

- Por que a ordenação precisa de lista de campos permitidos?
- Porque o valor vira nome de coluna.
- Sem a lista, o cliente ordena por qualquer campo: inclusive `password`, o que permite inferir dados: e, em SQL concatenado, injetar comandos.
- Por que acrescentar `id` como critério de desempate na ordenação?
- Porque registros com o mesmo valor no campo ordenado não têm ordem garantida entre consultas: eles podem trocar de posição e aparecer duas vezes ou...

---

## Próxima aula

- Documentação de API: descrever o contrato de forma que outra pessoa consiga usar a API sem perguntar nada.

---

## Resumo da Aula

- **Express.js: Paginação, Filtros e Ordenação** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
