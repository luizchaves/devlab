import { handle } from '@/server/http';
import { receiptSignedUrl, uploadReceipt } from '@/server/receipts';
import { requireSession } from '@/server/session';

type Context = { params: Promise<{ id: string }> };

// #region routes
/** `POST` multipart com o campo `file`: anexa o comprovante ao lançamento do dono. */
export const POST = handle(async (request: Request, { params }: Context) => {
  const session = await requireSession();
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return Response.json({ error: 'Envie um arquivo no campo `file`.' }, { status: 400 });

  const receiptPath = await uploadReceipt(session.user.id, (await params).id, file);
  return Response.json({ receiptPath }, { status: 201 });
});

/** `GET`: URL assinada de 60 s do comprovante, só para o dono. */
export const GET = handle(async (_request: Request, { params }: Context) => {
  const session = await requireSession();
  return Response.json(await receiptSignedUrl(session.user.id, (await params).id));
});
// #endregion
