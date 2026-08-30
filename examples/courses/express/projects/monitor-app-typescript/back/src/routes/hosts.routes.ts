import { Router } from 'express';

import HostController from '@/controllers/hosts.controller.ts';
import { requireJsonContentType as requireJson } from '@/middlewares/requireJsonContentType.ts';

const router = Router();

router.post('/hosts', requireJson, HostController.create);
router.get('/hosts', HostController.read);
router.get('/hosts/:id', HostController.readById);
router.put('/hosts/:id', requireJson, HostController.update);
router.delete('/hosts/:id', HostController.remove);

export default router;
