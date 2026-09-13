import { auth } from './auth';

export async function requireSession() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Response('Unauthorized', { status: 401 });
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireSession();

  if (session.user.role !== 'ADMIN') {
    throw new Response('Forbidden', { status: 403 });
  }

  return session;
}
