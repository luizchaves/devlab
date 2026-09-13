import { handlers } from '@/server/auth';

// O NextAuth expõe login, logout, CSRF e sessão nesta rota coringa.
export const { GET, POST } = handlers;
