import { Router } from 'express';

import * as eventsController from '#controllers/events-controller.ts';
import { authenticate } from '#middlewares/authenticate.ts';

const router = Router();

// #region routes
// O fluxo tambem e autenticado: cada pessoa so recebe os proprios eventos.
router.get('/events', authenticate, eventsController.stream);
// #endregion

export default router;
