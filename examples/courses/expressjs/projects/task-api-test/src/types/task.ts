// #region entity
/** Tarefa como ela sai do model e entra na resposta HTTP. */
export interface Task {
  id: number;
  title: string;
  description: string | null;
  done: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  tags?: Tag[];
}

export type Priority = 'low' | 'medium' | 'high';

export interface Tag {
  id: number;
  name: string;
  color: string;
}
// #endregion

// #region page
/** Envelope de uma listagem paginada. */
export interface Page<T> {
  data: T[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}
// #endregion
