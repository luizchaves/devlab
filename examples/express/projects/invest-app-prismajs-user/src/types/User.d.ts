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

/** O usuario como ele sai da API: sem o hash da senha. */
export type PublicUser = Omit<User, 'password'>;
