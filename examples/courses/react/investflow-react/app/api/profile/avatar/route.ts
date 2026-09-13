import { handle } from '@/server/http';
import { removeAvatar, uploadAvatar } from '@/server/profile';
import { requireSession } from '@/server/session';

export const POST = handle(async (request: Request) => {
  const session = await requireSession();
  const file = (await request.formData()).get('file');
  if (!(file instanceof File)) return Response.json({ error: 'Envie uma imagem no campo `file`.' }, { status: 400 });
  return Response.json({ profile: await uploadAvatar(session.user.id, file) });
});

export const DELETE = handle(async () => {
  const session = await requireSession();
  return Response.json({ profile: await removeAvatar(session.user.id) });
});
