import { Router } from 'express';

import HostController from '@/controllers/hosts.controller.ts';
import { isAuthenticated } from '@/middlewares/isAuthenticated.ts';
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

// `isAuthenticated` vem antes de tudo: sem token, a validacao nem chega a rodar.
router.post(
  '/hosts',
  isAuthenticated,
  requireJson,
  validate(createHostSchema),
  HostController.create
);
router.get('/hosts', isAuthenticated, validate(readHostsSchema), HostController.read);
router.get('/hosts/:id', isAuthenticated, validate(readHostByIdSchema), HostController.readById);
router.put(
  '/hosts/:id',
  isAuthenticated,
  requireJson,
  validate(updateHostSchema),
  HostController.update
);
router.delete('/hosts/:id', isAuthenticated, validate(removeHostSchema), HostController.remove);

export default router;
