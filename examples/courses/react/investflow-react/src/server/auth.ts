import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { signInSchema } from '@/core/auth';
import { authConfig } from './auth.config';
import { verifyCredentials } from './users';

// #region nextauth
/**
 * NextAuth com o provedor `Credentials`: e-mail e senha conferidos por
 * `verifyCredentials`. Devolver `null` faz o NextAuth responder com
 * `CredentialsSignin`, sem dizer qual campo falhou.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'E-mail', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = signInSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await verifyCredentials(parsed.data.email, parsed.data.password);
        if (!user) return null;

        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
});
// #endregion
