import { Router } from 'express';

import * as taskController from '#controllers/task-controller.ts';
import { authenticate } from '#middlewares/authenticate.ts';
import { requireJson } from '#middlewares/require-json.ts';
import { validate } from '#middlewares/validate.ts';
import {
  createTaskSchema,
  listTasksSchema,
  removeTaskSchema,
  showTaskSchema,
  updateTaskSchema,
} from '#schemas/task.ts';

const router = Router();

// #region authenticate
// Aplicado ao router inteiro: nenhuma rota de /tasks e publica, e nao existe o
// risco de esquecer o middleware ao acrescentar uma rota nova.
router.use(authenticate);
// #endregion

// #region routes
// A validacao entra antes do controller: nenhum dado invalido chega la dentro.
router.get('/', validate(listTasksSchema), taskController.index);
router.get('/:id', validate(showTaskSchema), taskController.show);
router.post('/', requireJson, validate(createTaskSchema), taskController.store);
router.put('/:id', requireJson, validate(updateTaskSchema), taskController.update);
router.delete('/:id', validate(removeTaskSchema), taskController.destroy);
// #endregion

export default router;
