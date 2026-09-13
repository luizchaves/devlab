import { redirect } from 'next/navigation';
import { auth } from './auth';

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

// #region guards
/** Para route handlers: sem sessão, lança 401 e o handler responde com `toResponse`. */
export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) throw new HttpError(401, 'Sessão necessária.');
  return session;
}

/** Idem, mas só administradores passam (RNF05). */
export async function requireAdmin() {
  const session = await requireSession();
  if (session.user.role !== 'ADMIN') throw new HttpError(403, 'Acesso restrito a administradores.');
  return session;
}

/** Para páginas: sem sessão, redireciona para o login guardando o destino. */
export async function requirePageSession(pathname: string) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/signin?callbackUrl=${encodeURIComponent(pathname)}`);
  }
  return session;
}
// #endregion

/** Converte o erro lançado pelos guards em uma resposta JSON. */
export function toResponse(error: unknown): Response {
  if (error instanceof HttpError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error(error);
  return Response.json({ error: 'Erro interno.' }, { status: 500 });
}
