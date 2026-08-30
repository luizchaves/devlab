/** Usuario como ele sai do model e entra na resposta HTTP. */
export interface User {
  id: number;
  name: string;
  email: string;
}

/**
 * Corpo aceito na criacao/atualizacao.
 *
 * Todo campo e opcional porque `req.body` chega do cliente: quem garante a
 * presenca dos obrigatorios e a validacao, nao o tipo.
 */
export interface UserInput {
  name?: string;
  email?: string;
}
