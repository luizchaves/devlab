/** Usuario como ele sai do model — nunca com a senha. */
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

/** Usuario com o hash da senha: so o model de autenticacao enxerga. */
export interface UserWithPassword extends User {
  password: string;
}

export interface SignUpInput {
  name?: string;
  email?: string;
  password?: string;
}

export interface Investment {
  id: string;
  name: string;
  amount: number;
  userId: string;
}

export interface InvestmentInput {
  name?: string;
  amount?: number;
}
