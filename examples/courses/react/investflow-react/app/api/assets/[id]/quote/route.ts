import { handle, validationResponse } from '@/server/http';
import { manualQuoteSchema } from '@/core/quotes';
import { setManualQuote } from '@/server/quotes/manual';
import { requireSession } from '@/server/session';

type Context = { params: Promise<{ id: string }> };

export const POST = handle(async (request: Request, { params }: Context) => {
  const session = await requireSession();
  const parsed = manualQuoteSchema.safeParse(await request.json());
  if (!parsed.success) return validationResponse(parsed.error);

  const result = await setManualQuote(session.user.id, (await params).id, parsed.data);
  return Response.json(result);
});
