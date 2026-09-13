import { PrismaAdapter } from '@auth/prisma-adapter';
import type { Role } from '@prisma/client';
import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? '').trim().toLowerCase();

        if (!email.endsWith('@example.com')) {
          return null;
        }

        return prisma.user.upsert({
          where: { email },
          update: {},
          create: {
            email,
            name: email.split('@')[0],
          },
        });
      },
    }),
  ],
  callbacks: {
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

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
