import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/server/auth.config';

const { auth } = NextAuth(authConfig);

// #region proxy
/**
 * Guarda de rotas privadas (CA02.4): sem sessão, redireciona para `/signin`
 * guardando o destino em `callbackUrl`. As rotas de API respondem 401 por
 * conta própria, via `requireSession`.
 */
export const proxy = auth((request) => {
  if (request.auth?.user) return NextResponse.next();

  const signInUrl = new URL('/signin', request.nextUrl.origin);
  signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(signInUrl);
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/assets/:path*',
    '/analytics/:path*',
    '/origins/:path*',
    '/dividends/:path*',
    '/movements/:path*',
    '/profile/:path*',
    '/admin/:path*',
  ],
};
// #endregion
