import { Router } from 'express';

import HostController from '@/controllers/hosts.controller.ts';
import { requireJsonContentType as requireJson } from '@/middlewares/requireJsonContentType.ts';
import { validate } from '@/middlewares/validate.ts';
import {
  createHostSchema,
  readHostByIdSchema,
  readHostsSchema,
  removeHostSchema,
  updateHostSchema,
} from '@/schemas/host.schema.ts';

const router = Router();

router.post('/hosts', requireJson, validate(createHostSchema), HostController.create);
router.get('/hosts', validate(readHostsSchema), HostController.read);
router.get('/hosts/:id', validate(readHostByIdSchema), HostController.readById);
router.put('/hosts/:id', requireJson, validate(updateHostSchema), HostController.update);
router.delete('/hosts/:id', validate(removeHostSchema), HostController.remove);

export default router;
