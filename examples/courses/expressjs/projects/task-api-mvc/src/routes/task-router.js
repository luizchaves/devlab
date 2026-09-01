import { Router } from 'express';
import * as taskController from '../controllers/task-controller.js';

const router = Router();

// #region routes
// O router conhece apenas os caminhos: quem responde e o controller.
router.get('/', taskController.index);
router.get('/:id', taskController.show);
router.post('/', taskController.store);
router.put('/:id', taskController.update);
router.delete('/:id', taskController.destroy);
// #endregion

export default router;
