import type { Role } from '@/generated/prisma/client';
import type { DefaultSession } from 'next-auth';

// Amplia os tipos do NextAuth com `id` e `role`, preenchidos nos callbacks de `auth.config.ts`.
declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & { id: string; role: Role };
  }

  interface User {
    role: Role;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: Role;
  }
}
