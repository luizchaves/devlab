import { transactionSchema } from '@/core/assets';
import { handle, validationResponse } from '@/server/http';
import { requireSession } from '@/server/session';
import { createTransaction } from '@/server/transactions';

export const POST = handle(async (request: Request) => {
  const session = await requireSession();
  const parsed = transactionSchema.safeParse(await request.json());
  if (!parsed.success) return validationResponse(parsed.error);

  const transaction = await createTransaction(session.user.id, parsed.data);
  return Response.json({ transaction }, { status: 201 });
});
