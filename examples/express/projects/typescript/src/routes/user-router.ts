import { Router } from 'express';

import * as userController from '#controllers/user-controller.ts';
import { requireJson } from '#middlewares/require-json.ts';

const router = Router();

// O router conhece apenas os caminhos: quem responde e o controller.
router.get('/', userController.index);
router.get('/:id', userController.show);
router.post('/', requireJson, userController.store);
router.put('/:id', requireJson, userController.update);
router.delete('/:id', userController.destroy);

export default router;
