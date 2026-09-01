export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface UserInput {
  name?: string;
  email?: string;
  password?: string;
}

/** O usuario como ele sai da API: sem o hash da senha, com o avatar. */
export type PublicUser = Omit<User, 'password'> & { image?: { path: string } | null };
