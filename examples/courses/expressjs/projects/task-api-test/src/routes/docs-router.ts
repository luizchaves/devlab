import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import { openapi } from '#docs/openapi.ts';

const router = Router();

// #region routes
/** O documento cru, para ferramentas: Insomnia, Postman, geradores de client. */
router.get('/openapi.json', (_req, res) => {
  res.json(openapi);
});

/** A interface navegavel, para pessoas. */
router.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi, { customSiteTitle: 'TaskAPI' }));
// #endregion

export default router;
