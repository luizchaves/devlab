import { transactionSchema } from '@/core/assets';
import { handle, validationResponse } from '@/server/http';
import { requireSession } from '@/server/session';
import { deleteTransaction, updateTransaction } from '@/server/transactions';

type Context = { params: Promise<{ id: string }> };

export const PATCH = handle(async (request: Request, { params }: Context) => {
  const session = await requireSession();
  const parsed = transactionSchema.omit({ assetId: true }).safeParse(await request.json());
  if (!parsed.success) return validationResponse(parsed.error);

  const transaction = await updateTransaction(session.user.id, (await params).id, parsed.data);
  return Response.json({ transaction });
});

export const DELETE = handle(async (_request: Request, { params }: Context) => {
  const session = await requireSession();
  await deleteTransaction(session.user.id, (await params).id);
  return new Response(null, { status: 204 });
});
