import { requireSession, toResponse } from '@/server/session';
import { findUserById } from '@/server/users';

// #region me
/** Perfil do usuário da sessão: a rota privada mais simples do projeto (CA02.3). */
export async function GET() {
  try {
    const session = await requireSession();
    const user = await findUserById(session.user.id);
    if (!user) return Response.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    return Response.json({ user });
  } catch (error) {
    return toResponse(error);
  }
}
// #endregion
