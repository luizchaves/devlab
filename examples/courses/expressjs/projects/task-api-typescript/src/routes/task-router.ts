import { Router } from 'express';

import * as taskController from '#controllers/task-controller.ts';
import { requireJson } from '#middlewares/require-json.ts';

const router = Router();

// #region routes
// O router conhece apenas os caminhos: quem responde e o controller.
router.get('/', taskController.index);
router.get('/:id', taskController.show);
router.post('/', requireJson, taskController.store);
router.put('/:id', requireJson, taskController.update);
router.delete('/:id', taskController.destroy);
// #endregion

export default router;
