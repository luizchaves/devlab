/** Usuario como ele sai do model — sem a senha, sempre. */
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string | null;
  verifiedAt: string | null;
  createdAt: string;
}

export type Role = 'user' | 'admin';
