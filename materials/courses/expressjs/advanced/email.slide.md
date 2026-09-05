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
title: "Express.js: Envio de E-mail"
description: "Envio de e-mail a partir de uma API Express: SMTP, nodemailer, serviços transacionais, confirmação de cadastro e redefinição de senha com token de uso único, e envio fora do ciclo da requisição."
---

<!-- _class: lead -->

# Express.js: Envio de E-mail

Envio de e-mail a partir de uma API Express: SMTP, nodemailer, serviços transacionais, confirmação de cadastro e redefinição de senha com token de uso único, e envio fora do ciclo da requisição.

---

## Objetivo

- Ao final você saberá enviar e-mail a partir do Express, testar sem entregar mensagem a ninguém, implementar confirmação de cadastro e redefinição de...

---

## Mapa da Aula

- **Objetivo**
- **SMTP e serviços transacionais**
- **Enviando com `nodemailer`**
- **Testando sem enviar**
- **Confirmação de cadastro**
- **Redefinição de senha**
- **Envio fora do caminho da requisição**
- **Exercício**

---

## Contexto da Aula

- Confirmar um cadastro, redefinir uma senha, avisar sobre um vencimento: três funcionalidades comuns que dependem de a API conseguir enviar e-mail.
- Esta aula trata do como: e dos cuidados que a redefinição de senha exige.

---

## SMTP e serviços transacionais

- O protocolo de envio é o SMTP, e há duas formas de falar com ele:
- Enviar é fácil; chegar na caixa de entrada é difícil. Sem SPF, DKIM e DMARC configurados no domínio, a mensagem vai para spam.
- Serviços transacionais existem basicamente para resolver isso.

---

## SMTP e serviços transacionais: Tabela

- SMTP direto (Gmail, provedor): a aplicação conecta a um servidor SMTP | projeto pequeno, sala de aula
- Serviço transacional (API): requisição HTTP para Resend, SendGrid, SES | produção
- Caixa de teste (Ethereal, Mailpit): intercepta e mostra sem entregar | desenvolvimento e testes

---

## Enviando com `nodemailer`

- O `nodemailer` é o cliente SMTP padrão em Node. A configuração vive no ambiente, nunca no código:
- Vale a mesma regra de Configuração: apenas no `.env`, nunca versionado.

---

## Enviando com `nodemailer`: Exemplo 1

```txt
MAIL_HOST="smtp.ethereal.email"
MAIL_PORT=587
MAIL_USER=""
MAIL_PASSWORD=""
MAIL_FROM="InvestApp <nao-responda@investapp.dev>"
```

---

## Enviando com `nodemailer`: Exemplo 2

```ts
export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT ?? 587),
  // 587 usa STARTTLS; `secure: true` só para a porta 465.
  secure: Number(process.env.MAIL_PORT) === 465,
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD },
});
```

---

## Testando sem enviar

- Nenhum teste deve entregar mensagem a um endereço real. Três alternativas:

---

## Testando sem enviar: Exemplo 1

```ts
    const conta = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({ /* dados da conta */ });
    const info = await transporter.sendMail({ /* … */ });
    console.log(nodemailer.getTestMessageUrl(info));
    //=> https://ethereal.email/message/… (prévia no navegador)
```

---

## Testando sem enviar: Exemplo 2

```bash
    docker run -p 1025:1025 -p 8025:8025 axllent/mailpit
```

---

## Confirmação de cadastro

- O e-mail de confirmação prova que o endereço existe e pertence a quem se cadastrou. O fluxo usa um token de uso único:
- Quem tem o token entra na conta. Guarde apenas o hash, dê validade curta e invalide após o uso: as mesmas três regras de qualquer segredo.

---

## Confirmação de cadastro: Exemplo

```ts
export async function criarTokenDeConfirmacao(userId: string) {
  const token = randomBytes(32).toString('base64url');
  await prisma.emailToken.create({
    // Guarda o hash: um vazamento do banco não entrega tokens utilizáveis.
    data: {
      userId,
      tokenHash: createHash('sha256').update(token).digest('hex'),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });
  return token;   // só o e-mail recebe o valor original
}
```

---

## Redefinição de senha

- É o fluxo mais delicado da aplicação, porque é uma porta de entrada legítima que não exige saber a senha atual.
- { "email": "qualquer@example.com" }
- { "message": "Se o e-mail estiver cadastrado, enviaremos as instruções." }
- As regras que tornam esse fluxo seguro:
- Nem a antiga (não existe: só o hash), nem uma nova gerada pelo servidor.

---

## Redefinição de senha: Tabela

- Resposta idêntica para e-mail inexistente: enumeração de contas
- Token aleatório de 32 bytes: adivinhação
- Guardar apenas o hash do token: uso de tokens vazados do banco
- Validade curta (15 a 60 minutos): reuso de um link antigo encontrado no e-mail
- Invalidar após o uso: reutilização do mesmo link
- Limite de requisições na rota: uso da API como ferramenta de spam

---

## Redefinição de senha: Exemplo

```ts
export async function solicitarRedefinicao(req: Request, res: Response) {
  const { email } = req.body as { email?: string };
  const user = email ? await User.findByEmail(email) : null;
  if (user) {
    const token = await criarTokenDeRedefinicao(user.id);
    await sendMail({
      to: user.email,
      subject: 'Redefinição de senha',
      html: `<p>Use o link para redefinir: <a href="${config.appUrl}/reset?token=${token}">redefinir senha</a></p>`,
    });
  }
```

---

## Envio fora do caminho da requisição

- Um SMTP lento transforma um cadastro de 50 ms em um cadastro de 3 s: e uma falha no provedor transforma em `500` uma operação que já deu certo:
- Se o processo cair entre a resposta e o envio, o e-mail se perde sem registro.
- Em produção, o envio vira um job em uma fila com retentativa (BullMQ, pg-boss).
- O padrão acima é o suficiente para aprender: e o suficiente para e-mails não críticos.

---

## Envio fora do caminho da requisição: Exemplo

```ts
export async function store(req: Request, res: Response) {
  const user = await User.create(req.body);
  // A resposta não espera o SMTP.
  res.status(201).json(user);
  sendMail({ to: user.email, subject: 'Bem-vindo', html: boasVindas(user) }).catch((error) =>
    console.error({ level: 'error', evento: 'falha-envio-email', userId: user.id, error }),
  );
}
```

---

## Exercício

- No projeto `express-auth`:
- Configure o `nodemailer` com Ethereal e envie um e-mail de boas-vindas no cadastro.
- Imprima a URL de prévia com `getTestMessageUrl` e abra a mensagem no navegador.
- Implemente `POST /auth/password/forgot` respondendo sempre `202`.
- Implemente `POST /auth/password/reset` que valide o token, troque a senha e invalide o

---

## Exercício: Exemplo

```ts
  export async function redefinir(req: Request, res: Response) {
    const { token, password } = req.body as { token?: string; password?: string };
    if (!token || !password || password.length < 8) {
      throw new HttpError(422, 'Token e senha (mínimo 8 caracteres) são obrigatórios');
    }
    const hash = createHash('sha256').update(token).digest('hex');
    const registro = await prisma.passwordToken.findUnique({ where: { tokenHash: hash } });
    if (!registro || registro.expiresAt < new Date()) {
      throw new HttpError(400, 'Token inválido ou expirado');
    }
```

---

## Desafio

- Implemente a invalidação de sessões após a troca de senha usando o campo `tokenVersion` sugerido na aula de Autenticação: incremente-o na redefinição e...
- Teste que a sessão aberta em outro navegador é derrubada.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Envio de e-mail a partir de uma API Express: SMTP, nodemailer, serviços transacionais, confirmação de cadastro e redefinição de senha com token de uso...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Envio

- Por que testes não devem enviar e-mail de verdade?
- Porque a suíte passa a depender de rede e de um provedor externo, fica lenta e pode entregar mensagens a endereços reais.
- Caixas de teste ou um transporte falso resolvem.
- Por que o envio não deve bloquear a resposta do cadastro?
- Porque o SMTP é lento e pode falhar: o usuário esperaria segundos, e uma falha no provedor devolveria `500` para uma operação que já foi concluída com...

---

## Redefinição de senha

- Por que responder `202` mesmo para e-mail inexistente?
- Porque uma resposta diferente revelaria quais e-mails têm conta no sistema.
- A mensagem condicional ("se estiver cadastrado") mantém a experiência aceitável sem vazar nada.
- Por que guardar o hash do token e não o token?
- Porque quem tem o token entra na conta. Com apenas o hash no banco, um vazamento não entrega tokens utilizáveis: mesma lógica das senhas.

---

## Próxima aula

- Tempo Real: manter o cliente atualizado sem ele perguntar.

---

## Resumo da Aula

- **Express.js: Envio de E-mail** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
