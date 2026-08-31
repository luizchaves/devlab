---
marp: true
theme: default
paginate: true
style: |
  section::after {
    content: attr(data-marpit-pagination) ' / ' attr(data-marpit-pagination-total);
  }
lang: pt-BR
title: "Express.js: Cadastro de Usuário"
description: "A rota pública de cadastro em uma API Express: modelo de usuário, hash da senha no model, campos que nunca saem na resposta, atribuição em massa, e-mail único e enumeração de contas."
---

<!-- _class: lead -->

# Express.js: Cadastro de Usuário

A rota pública de cadastro em uma API Express: modelo de usuário, hash da senha no model, campos que nunca saem na resposta, atribuição em massa, e-mail único e enumeração de contas.

---

## Objetivo

- Ao final você terá uma rota `POST` pública que cria usuários com a senha protegida por hash, garante e-mail único, nunca devolve campos sensíveis e não...

---

## Projeto de Referência

- Projeto executável: `examples/courses/express/projects/auth`
- Use o código real como base da aula, dos testes manuais e das alterações propostas.
- Os slides resumem decisões; a implementação completa continua nos arquivos de exemplo.

---

## Mapa da Aula

- **Objetivo**
- **O modelo de usuário**
- **O fluxo do cadastro**
- **O hash pertence ao model**
- **O controller**
- **A resposta**
- **Enumeração de contas**
- **Requisitos de senha**

---

## Contexto da Aula

- O cadastro é a única rota que qualquer pessoa da internet pode chamar com sucesso, e é a porta de entrada de todo o resto do sistema.
- Esta aula constrói essa rota com o cuidado que ela exige.

---

## O modelo de usuário

- O model de usuário difere dos demais em um ponto: ele tem um campo que entra mas nunca sai.
- Extraia os campos permitidos explicitamente; nunca repasse o corpo inteiro.

---

## O modelo de usuário: Exemplo

```txt
model User {
  id          String       @id @default(cuid())
  name        String
  email       String       @unique
  password    String
  role        String       @default("user")
  createdAt   DateTime     @default(now())
  investments Investment[]
}
```

---

## O fluxo do cadastro

- Cada etapa tem um responsável, e a ordem importa: a senha só é derivada depois de a entrada ser aceita.

---

## O hash pertence ao model

- A derivação da senha fica no model, e não no controller, por um motivo prático: assim toda origem que criar usuário: a rota, o seed, um script de...
- Duas decisões desse arquivo merecem atenção.
- A primeira é `toPublic`: nenhuma função devolve o objeto com a senha, exceto a que existe especificamente para o login.
- A segunda é o nome deliberadamente feio da exceção:
- Em vez de remover o campo depois de buscá-lo, impeça que ele saia do banco:

---

## O hash pertence ao model: Exemplo 1

```ts
/** Remove a senha antes de qualquer coisa sair do model. */
function toPublic({ password: _password, ...user }: UserWithPassword): User {
  return user;
}
```

---

## O hash pertence ao model: Exemplo 2

```ts
/** Unico ponto que devolve o hash — usado apenas no login. */
export function findByEmailWithPassword(email: string): UserWithPassword | undefined
```

---

## O controller

- O controller valida, verifica o conflito e delega. Note que ele nunca vê a senha em hash: e que os campos são extraídos um a um:

---

## A resposta

- { "name": "Bruno", "email": "bruno@example.com", "password": "senha-secreta" }
- { "id": "e7a04a8a-bbfc-4ea8-ba20-081e5de33737", "name": "Bruno", "email": "bruno@example.com", "role": "user" }
- E os dois erros previstos no contrato:
- { "name": "Curto", "email": "curto@example.com", "password": "1234" }
- { "error": { "status": 422, "message": "A senha precisa ter ao menos 8 caracteres" } }

---

## Enumeração de contas

- O `409` acima é honesto e cômodo: e revela quem tem conta no sistema.
- Um script que envia uma lista de e-mails descobre quais estão cadastrados só pelo status da resposta.
- A saída sem esse dilema é confirmar por e-mail: a API responde `201` em qualquer caso e a mensagem enviada é diferente: "confirme seu cadastro" ou...
- Numa rede social, saber que um e-mail tem conta é irrelevante. Num sistema de saúde ou financeiro, é dado sensível.
- A decisão é de produto: o que não vale é tomá-la por descuido.

---

## Requisitos de senha

- O que exigir de uma senha mudou nos últimos anos, e a orientação atual do NIST contraria boa parte do que ainda se vê por aí:
- O `bcrypt` ignora tudo depois de 72 bytes: uma senha longa é silenciosamente cortada. O Argon2 não tem esse limite.
- Se usar `bcrypt`, valide o comprimento máximo em vez de deixar a truncagem acontecer sem que ninguém saiba.

---

## Requisitos de senha: Tabela

- Comprimento mínimo: ao menos 8; idealmente 12
- Comprimento máximo: permitir ao menos 64 caracteres
- Exigir maiúscula, número e símbolo: não: leva a `Senha@123`
- Trocar a senha a cada 90 dias: não: leva a `Senha1`, `Senha2`
- Bloquear senhas conhecidamente vazadas: sim: é a regra que mais protege
- Aceitar espaços e Unicode: sim: frases longas são senhas boas

---

## Exercício

- No projeto `express-auth`:
- Acrescente `role` ao corpo da requisição de cadastro e confirme que ele é ignorado.
- Faça o cadastro rejeitar senhas com menos de 8 ou mais de 64 caracteres.
- Normalize o e-mail com `trim()` e `toLowerCase()` antes de gravar e de comparar.
- Escreva um teste que cadastre duas vezes o mesmo e-mail com maiúsculas diferentes e

---

## Exercício: Exemplo

```ts
  export function signUp(req: Request, res: Response) {
    // `role` não é extraído: o cliente não escolhe o próprio papel.
    const { name, email, password } = (req.body ?? {}) as SignUpInput;
    if (!name || !email || !password) {
      throw new HttpError(422, 'Os campos "name", "email" e "password" são obrigatórios');
    }
    const normalizado = email.trim().toLowerCase();
    if (password.length < 8 || password.length > 64) {
      throw new HttpError(422, 'A senha precisa ter entre 8 e 64 caracteres');
    }
```

---

## Desafio

- Implemente a verificação contra senhas vazadas usando o modelo de *k-anonymity* da API do Have I Been Pwned: calcule o `SHA-1` da senha, envie apenas...
- Explique por que esse desenho não entrega a senha ao serviço consultado.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- A rota pública de cadastro em uma API Express: modelo de usuário, hash da senha no model, campos que nunca saem na resposta, atribuição em massa,...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Modelo

- Por que o hash da senha fica no model e não no controller?
- Para que toda origem que cria usuário: rota, seed, script de importação: passe pelo mesmo caminho.
- No controller, cada nova origem precisaria lembrar de aplicar o hash.
- O que é atribuição em massa e como evitá-la?
- É repassar `req.body` inteiro para o model, permitindo ao cliente definir campos que não deveria: como `role: 'admin'`.

---

## Segurança

- O que é enumeração de contas?
- Descobrir quais e-mails têm conta no sistema pela diferença de resposta: um `409` para cadastrado e `201` para novo.
- Confirmar por e-mail elimina a diferença observável pela API.
- Por que exigir maiúscula, número e símbolo piora a segurança?
- Porque leva a padrões previsíveis como `Senha@123`, que os dicionários de ataque já cobrem.

---

## Na prática

- O projeto executável desta aula é Express Auth; a etapa correspondente do InvestApp é InvestApp: Cadastro de Usuário.

---

## Próxima aula

- Autenticação: trocar as credenciais por um token.

---

## Arquivos-Chave da Aula

- **src/models/user-model.ts**: `examples/courses/express/projects/auth/src/models/user-model.ts` (linhas marcadas `12-15,33`)
- **src/controllers/auth-controller.ts**: `examples/courses/express/projects/auth/src/controllers/auth-controller.ts` (linhas marcadas `11,17-19,21-23`)

---

## Resumo da Aula

- **Express.js: Cadastro de Usuário** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
