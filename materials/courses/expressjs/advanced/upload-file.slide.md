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
title: "Express.js: Upload de Arquivo"
description: "Recebimento de arquivos em uma API Express: multipart/form-data, multer, estratégias de armazenamento, validação de tipo e tamanho, nomes seguros e travessia de diretório."
---

<!-- _class: lead -->

# Express.js: Upload de Arquivo

Recebimento de arquivos em uma API Express: multipart/form-data, multer, estratégias de armazenamento, validação de tipo e tamanho, nomes seguros e travessia de diretório.

---

## Objetivo

- Ao final você saberá receber arquivos com `multipart/form-data`, escolher entre gravar em disco, em memória ou em armazenamento externo, validar tipo e...

---

## Mapa da Aula

- **Objetivo**
- **Por que `req.body` chega vazio**
- **Recebendo com `multer`**
- **Onde os bytes ficam**
- **O que guardar no banco**
- **O fluxo completo**
- **Validação de verdade**
- **Servindo o arquivo**

---

## Contexto da Aula

- Um formulário com `` não envia JSON.
- Esta aula trata do formato que ele usa, de como recebê-lo no Express e das validações sem as quais o upload vira a rota mais perigosa da aplicação.

---

## Por que `req.body` chega vazio

- Um formulário com arquivo usa um `Content-Type` diferente, que nenhum dos parsers embutidos do Express interpreta:
- O corpo `multipart` é um fluxo com fronteiras separando cada parte:
- Porque interpretar esse formato exige decidir onde os bytes vão parar: disco, memória ou nuvem: e isso é escolha da aplicação, não do framework.
- Os demais parsers só precisam produzir um objeto.

---

## Por que `req.body` chega vazio: Exemplo

```txt
POST /users/me/avatar HTTP/1.1
Content-Type: multipart/form-data; boundary=----X
------X
Content-Disposition: form-data; name="description"
Foto de perfil
------X
Content-Disposition: form-data; name="avatar"; filename="eu.png"
Content-Type: image/png
<bytes do arquivo>
------X--
```

---

## Recebendo com `multer`

- O `multer` é o middleware padrão para `multipart`. Ele preenche `req.file` (ou `req.files`) e deixa os campos de texto em `req.body`:
- O cliente escolhe esse valor.
- Gere o nome no servidor e guarde o original apenas como metadado.

---

## Recebendo com `multer`: Exemplo 1

```ts
const TIPOS_PERMITIDOS = ['image/png', 'image/jpeg', 'image/webp'];
export const upload = multer({
  storage: multer.diskStorage({
    destination: resolve('uploads'),
    // Nome gerado pelo servidor: o do cliente nunca é usado.
    filename: (_req, file, cb) => cb(null, `${randomUUID()}${extname(file.originalname)}`),
  }),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) =>
    TIPOS_PERMITIDOS.includes(file.mimetype)
      ? cb(null, true)
      : cb(new HttpError(415, 'Formato de imagem não suportado')),
```

---

## Recebendo com `multer`: Exemplo 2

```ts
router.patch(
  '/me/avatar',
  authenticate,
  upload.single('avatar'),
  userController.updateAvatar,
);
```

---

## Onde os bytes ficam

- Três estratégias, com trocas diferentes:
- Simples e barato. Não sobrevive a um contêiner efêmero nem funciona com várias instâncias sem volume compartilhado.
- Útil para redimensionar ou validar antes de persistir. Perigoso sem `limits`: cada upload ocupa RAM.
- O que se usa em produção: escala, sobrevive ao deploy e serve por CDN.

---

## Onde os bytes ficam: Tabela

- Complexidade: baixa | baixa | média
- Sobrevive ao redeploy: com volume | não | sim
- Várias instâncias: não | não | sim
- Consumo de RAM: baixo | alto | alto (temporário)
- Serve por CDN: não | não | sim

---

## Onde os bytes ficam: Exemplo 1

```ts
    multer({ storage: multer.diskStorage({ destination: resolve('uploads') }) });
```

---

## Onde os bytes ficam: Exemplo 2

```ts
    multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });
```

---

## O que guardar no banco

- O arquivo fica no armazenamento; o banco guarda os metadados e a referência:
- A URL muda quando o domínio, o bucket ou o CDN mudam. Guarde a chave e monte a URL na aplicação a partir de uma variável de ambiente.

---

## O que guardar no banco: Exemplo

```txt
model Image {
  id        String   @id @default(cuid())
  key       String   @unique          // nome gerado no armazenamento
  original  String                    // nome enviado pelo cliente, só informativo
  mimeType  String
  size      Int
  createdAt DateTime @default(now())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## O fluxo completo

- { "id": "c3f1a2", "url": "/uploads/9f1c0d2a-4c7e-4f2b-8f3f-2a6b8c1d0e55.png", "size": 184320, "mimeType": "image/png" }

---

## Validação de verdade

- Para confiar no tipo, é preciso olhar os primeiros bytes do arquivo:
- Se `uploads/` estiver dentro de `public/` e o servidor executar o que houver ali, um arquivo enviado vira código rodando no seu servidor.
- Guarde fora da raiz pública e sirva por uma rota que valide o acesso.

---

## Validação de verdade: Tabela

- Assinatura nos bytes: `.php` renomeado para `.png`
- Nome gerado no servidor: travessia de diretório e sobrescrita
- Diretório fora de `public/`: execução do que foi enviado

---

## Validação de verdade: Exemplo

```ts
const ASSINATURAS: Record<string, number[]> = {
  'image/png': [0x89, 0x50, 0x4e, 0x47],
  'image/jpeg': [0xff, 0xd8, 0xff],
};
function tipoConfere(buffer: Buffer, mimeType: string): boolean {
  const assinatura = ASSINATURAS[mimeType];
  return assinatura?.every((byte, i) => buffer[i] === byte) ?? false;
}
```

---

## Servindo o arquivo

- A rota de leitura precisa resolver o caminho e confirmar que ele continua dentro do diretório permitido:

---

## Servindo o arquivo: Exemplo

```ts
export async function show(req: Request<{ key: string }>, res: Response) {
  const base = resolve('uploads');
  // resolve() normaliza `..`; o startsWith confirma que não escapou.
  const caminho = resolve(base, req.params.key);
  if (!caminho.startsWith(`${base}/`)) {
    throw new HttpError(400, 'Caminho inválido');
  }
  res.sendFile(caminho);
}
```

---

## Exercício

- No projeto `express-auth`:
- Instale o `multer` e crie `src/config/upload.ts` com nome gerado por `randomUUID`.
- Aceite apenas PNG e JPEG, com no máximo 2 MB.
- Crie `PATCH /users/me/avatar` protegida por `authenticate`.
- Traduza o erro `LIMIT_FILE_SIZE` do multer para `413`.

---

## Exercício: Exemplo

```ts
  // O multer usa `code` para sinalizar o motivo da recusa.
  if ((error as { code?: string }).code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: { status: 413, message: 'Arquivo maior que o limite de 2 MB' },
    });
  }
```

---

## Desafio

- Troque o `diskStorage` por `memoryStorage`, valide a assinatura dos bytes antes de gravar e gere uma miniatura de 128×128 com `sharp`.
- Meça o consumo de memória com dez uploads simultâneos de 2 MB e explique por que `limits` deixa de ser opcional nesse desenho.

---

## Perguntas de revisão

- Perguntas de revisão aparece como ponto central da aula, não apenas como item de índice.
- Recebimento de arquivos em uma API Express: multipart/form-data, multer, estratégias de armazenamento, validação de tipo e tamanho, nomes seguros e...
- Relacione a regra com a rota, o middleware, o controller e a resposta HTTP esperada.
- Use o projeto de exemplo para confirmar o comportamento com requisições reais.

---

## Formato

- Por que `express.json()` não resolve o upload?
- Porque o corpo é `multipart/form-data`, um fluxo com partes e fronteiras, e não JSON.
- Interpretá-lo exige decidir onde os bytes serão gravados: escolha da aplicação, não do framework.
- O que `req.file` contém e o que ele não contém?
- Contém metadados: nome gerado, nome original, MIME declarado, tamanho e caminho (ou `buffer`, em memória).

---

## Segurança

- Por que nunca usar o nome enviado pelo cliente?
- Porque ele pode conter `..` e escapar do diretório, sobrescrever arquivos existentes ou carregar caracteres que quebram o sistema de arquivos.
- O nome é gerado pelo servidor.
- Por que verificar a assinatura dos bytes se o `Content-Type` já foi validado?
- Porque o `Content-Type` é declarado pelo cliente e pode mentir. Os primeiros bytes do arquivo são a única evidência do formato real.

---

## Próxima aula

- Envio de E-mail: confirmar cadastro e redefinir senha.

---

## Resumo da Aula

- **Express.js: Upload de Arquivo** foi coberto a partir da página de aula e do projeto executável.
- Os conceitos principais foram ligados a decisões concretas de rota, dados e arquitetura.
- Os exemplos devem ser conferidos no código real, especialmente quando há validação, banco ou autenticação.
- A prática termina quando o comportamento é validado por requisições HTTP e leitura dos arquivos alterados.
