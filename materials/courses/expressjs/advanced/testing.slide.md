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
title: "Express.js: Testes"
description: "Testes de uma API Express: node:test nativo, testes de unidade e de integração com supertest, banco de testes isolado, cobertura e testes de ponta a ponta com Playwright."
---

<!-- _class: lead -->

# Express.js: Testes

Testes de uma API Express: node:test nativo, testes de unidade e de integração com supertest, banco de testes isolado, cobertura e testes de ponta a ponta com Playwright.

---

## Objetivo

- Ao final você saberá escrever testes de unidade e de integração com o executor nativo do Node, fazer requisições ao `app` sem subir servidor, isolar o...

---

## Projeto de Referência

- Projeto executável: `examples/courses/expressjs/projects/auth`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Objetivo**
- **Os três níveis**
- **O executor nativo**
- **Teste de unidade**
- **Teste de integração com `supertest`**
- **Testando rotas protegidas**
- **Isolando o banco**
- **Cobertura**

---

## Contexto da Aula

- Testar manualmente com o `requests.http` funciona até a décima rota.
- Depois disso, cada alteração exige repetir o mesmo roteiro: e é aí que as regressões passam. Esta aula automatiza essa verificação.

---

## Os três níveis

- Cada nível responde a uma pergunta diferente e tem um custo diferente:
- Ele cobre o caminho completo: validação, autorização, status, formato da resposta: com custo baixo.
- Testes de unidade valem para lógica pura (hash, JWT, cálculo); os de ponta a ponta, para os dois ou três fluxos críticos.

---

## Os três níveis: Tabela

- Unidade: uma função isolada | ms | `node:test`
- Integração: rota + middlewares + model + banco | dezenas de ms | `node:test` + `supertest`
- Ponta a ponta: navegador operando a interface | segundos | Playwright

---

## O executor nativo

- Desde o Node 20, `node --test` é estável: não há Jest, Vitest nem configuração para instalar.
- O vocabulário é o mesmo de qualquer framework de testes:
- A API é menor que a de um framework: e não precisa ser instalada.

---

## O executor nativo: Exemplo 1

```json
{
  "scripts": {
    "test": "node --test",
    "test:watch": "node --test --watch",
    "test:coverage": "node --test --experimental-test-coverage"
  }
}
```

---

## O executor nativo: Exemplo 2

```bash
npm test
```

---

## Teste de unidade

- O melhor candidato é a função pura, sem I/O. As funções de senha e de token da aula de Senhas e Hash são exemplos exatos:
- Repare que o teste verifica propriedades, não valores fixos: o hash muda a cada execução, então comparar com uma constante seria impossível.

---

## Teste de integração com `supertest`

- O `supertest` faz requisições diretamente ao `app`, sem abrir porta: é por isso que `app.ts` e `server.ts` são arquivos separados desde a aula de Rotas.
- O código de teste a seguir define duas suítes principais: a listagem de usuários com `GET /users` (verificando o status HTTP 200 e se o retorno é uma...
- Um teste que só cobre o caminho feliz não percebe quando a validação some.
- A regra prática: para cada rota, um teste de sucesso e um por status de erro previsto no contrato.

---

## Teste de integração com `supertest`: Exemplo 1

```txt
  ### Listar usuários
  GET http://localhost:3000/users
  ### Criar usuário
  POST http://localhost:3000/users
  Content-Type: application/json
  {
    "name": "Carla",
    "email": "carla@example.com"
  }
```

---

## Teste de integração com `supertest`: Exemplo 2

```ts
describe('GET /users', () => {
  it('responde 200 com a lista', async () => {
    const response = await request(app).get('/users');
    assert.equal(response.status, 200);
    assert.ok(Array.isArray(response.body));
  });
});
describe('POST /users', () => {
  it('cria e devolve 201 com o recurso', async () => {
    const response = await request(app)
```

---

## Testando rotas protegidas

- O token é obtido no próprio teste, com o mesmo fluxo que o cliente usa:
- E o teste que realmente importa em uma API multiusuário: o de autorização:

---

## Testando rotas protegidas: Exemplo 1

```ts
async function login(email = 'ana@example.com', password = 'senha-secreta') {
  const { body } = await request(app).post('/auth/signin').send({ email, password });
  return body.token as string;
}
describe('GET /investments', () => {
  it('responde 401 sem token', async () => {
    const response = await request(app).get('/investments');
    assert.equal(response.status, 401);
  });
  it('responde 200 com token válido', async () => {
```

---

## Testando rotas protegidas: Exemplo 2

```ts
it('não devolve investimentos de outro usuário', async () => {
  const tokenDaAna = await login('ana@example.com', 'senha-secreta');
  const tokenDoBruno = await login('bruno@example.com', 'outra-senha');
  const { body: criado } = await request(app)
    .post('/investments')
    .set('Authorization', `Bearer ${tokenDaAna}`)
    .send({ name: 'CDB', amount: 15000 });
  const response = await request(app)
    .delete(`/investments/${criado.id}`)
    .set('Authorization', `Bearer ${tokenDoBruno}`);
  assert.equal(response.status, 404);
```

---

## Isolando o banco

- Um teste que grava no banco de desenvolvimento apaga os dados de quem está desenvolvendo: e falha na segunda execução. Três estratégias:
- Estrutura real, dados descartáveis. É o padrão para projetos com Prisma.
- Rápido e sem resíduo em disco; some ao final do processo.
- Garante que a ordem dos testes não importe.
- Se o segundo teste só passa porque o primeiro criou um registro, o conjunto falha ao rodar em paralelo ou isolado.

---

## Isolando o banco: Exemplo 1

```txt
    DATABASE_URL="file:./test.db"
```

---

## Isolando o banco: Exemplo 2

```json
    { "scripts": { "test": "node --env-file=.env.test --test" } }
```

---

## Cobertura

- O Node mede cobertura sem ferramenta adicional:
- Ela mede quais linhas executaram, não se o comportamento está correto.
- Um teste sem nenhum `assert` produz cobertura idêntica a um teste rigoroso. Use o número para achar o que não foi testado: nunca como meta.
- Duas ferramentas de foco ajudam durante o desenvolvimento:

---

## Cobertura: Exemplo 1

```bash
npm run test:coverage
```

---

## Cobertura: Exemplo 2

```txt
# start of coverage report
# file                          | line % | branch % | funcs %
# src/controllers/…controller.ts |  92.31 |    83.33 |  100.00
# src/middlewares/authorize.ts   |  76.47 |    62.50 |  100.00
# src/utils/password.ts          | 100.00 |   100.00 |  100.00
# all files                      |  88.14 |    79.17 |   97.06
# end of coverage report
```

---

## Ponta a ponta com Playwright

- O teste de ponta a ponta abre um navegador real e opera a interface: front-end, API e banco juntos:
- Testes de ponta a ponta são lentos e mais frágeis: uma mudança de layout os quebra.
- Dois ou três: login, o fluxo principal, o pagamento: dão a maior parte da confiança.

---

## Ponta a ponta com Playwright: Exemplo 1

```bash
npm init playwright@latest
```

---

## Ponta a ponta com Playwright: Exemplo 2

```ts
test('cadastra um investimento pela interface', async ({ page }) => {
  await page.goto('/signin.html');
  await page.fill('#email', 'ana@example.com');
  await page.fill('#password', 'senha-secreta');
  await page.click('button[type="submit"]');
  await page.goto('/home.html');
  await page.fill('#name', 'Tesouro Selic 2029');
  await page.fill('#amount', '20000');
  await page.click('#salvar');
  await expect(page.locator('.investment-list')).toContainText('Tesouro Selic 2029');
});
```

---

## Executando

- Rode a suíte completa:
- Deixe rodando enquanto desenvolve:
- Veja o que ficou sem cobertura:

---

## Executando: Exemplo 1

```bash
   npm test
```

---

## Executando: Exemplo 2

```bash
   npm run test:watch
```

---

## Exercício

- No projeto `express-auth`:
- Instale o `supertest` e escreva `src/routes/auth-router.test.ts`.
- Cubra: cadastro com sucesso (`201`), senha curta (`422`), e-mail duplicado (`409`), login
- correto (`200` com token) e senha errada (`401`).
- Escreva um teste que confirme que nenhuma resposta contém a chave `password`.

---

## Exercício: Exemplo

```ts
  describe('POST /auth/signup', () => {
    it('não devolve a senha em nenhuma forma', async () => {
      const response = await request(app).post('/auth/signup').send({
        name: 'Teste',
        email: `teste-${Date.now()}@example.com`,
        password: 'senha-secreta',
      });
      assert.equal(response.status, 201);
      assert.equal(response.body.password, undefined);
      assert.ok(!JSON.stringify(response.body).includes('argon2'));
    });
  });
```

---

## Desafio

- Configure a suíte para rodar em uma GitHub Action a cada push: `npm ci`, `npm run typecheck` e `npm test`, com `DATABASE_URL` apontando para um banco...
- Faça a ação falhar propositalmente removendo uma validação e confirme que o teste correspondente acusa.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Testes de uma API Express: node:test nativo, testes de unidade e de integração com supertest, banco de testes isolado, cobertura e testes de ponta a...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Níveis

- Por que o teste de integração é o mais valioso em uma API?
- Porque exercita o caminho completo: validação, autorização, status, formato da resposta: com custo baixo.
- É onde moram as regressões que mais afetam quem consome a API.
- Por que `app.ts` precisa ser separado de `server.ts` para testar?
- Porque o `supertest` importa o `app` e faz requisições sem abrir porta.

---

## Prática

- Por que testar os status de erro, e não só o sucesso?
- Porque a validação e a autorização são exatamente o que some sem ninguém perceber.
- Um teste que só cobre o caminho feliz continua passando com a API aberta.
- O que 100% de cobertura garante?
- Que todas as linhas executaram durante os testes: nada além disso. Um teste sem `assert` produz a mesma cobertura que um rigoroso.

---

## Próxima aula

- Deploy: colocar tudo isso no ar.

---

## Arquivos-Chave da Aula

- **src/utils/jwt.test.ts**: `examples/courses/expressjs/projects/auth/src/utils/jwt.test.ts` (linhas marcadas `1-2,12-18`)
- **src/utils/password.test.ts**: `examples/courses/expressjs/projects/auth/src/utils/password.test.ts`

---

## Resumo da Aula

- **Express.js: Testes** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
