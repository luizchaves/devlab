import { handle, validationResponse } from '@/server/http';
import { getProfile, profileSchema, updateProfile } from '@/server/profile';
import { requireSession } from '@/server/session';

export const GET = handle(async () => {
  const session = await requireSession();
  return Response.json({ profile: await getProfile(session.user.id) });
});

/** `PATCH { name }`: qualquer outro campo é ignorado; `role` nunca muda por aqui (CA11.4). */
export const PATCH = handle(async (request: Request) => {
  const session = await requireSession();
  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) return validationResponse(parsed.error);
  return Response.json({ profile: await updateProfile(session.user.id, parsed.data) });
});
