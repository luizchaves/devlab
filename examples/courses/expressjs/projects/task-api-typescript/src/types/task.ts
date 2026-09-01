// #region entity
/** Tarefa como ela sai do model e entra na resposta HTTP. */
export interface Task {
  id: number;
  title: string;
  done: boolean;
}
// #endregion

// #region input
/**
 * Corpo aceito na criacao/atualizacao.
 *
 * Todo campo e opcional porque `req.body` chega do cliente: quem garante a
 * presenca dos obrigatorios e a validacao, nao o tipo.
 */
export interface TaskInput {
  title?: string;
  done?: boolean;
}
// #endregion
