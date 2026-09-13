import type { Role } from '@/generated/prisma/client';
import type { NextAuthConfig } from 'next-auth';

// #region config
/**
 * Parte da configuração do NextAuth que não toca o banco. O `proxy.ts` roda em
 * toda requisição e só precisa ler o JWT; por isso ele importa este arquivo, e
 * não o `auth.ts`, que carrega o Prisma.
 */
export const authConfig = {
  pages: { signIn: '/signin' },
  session: { strategy: 'jwt' },
  providers: [],
  callbacks: {
    // O JWT guarda o papel para que páginas e rotas decidam sem consultar o banco.
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.sub ?? '';
      session.user.role = token.role as Role;
      return session;
    },
  },
} satisfies NextAuthConfig;
// #endregion
