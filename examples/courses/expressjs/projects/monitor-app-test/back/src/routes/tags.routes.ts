import { Router } from 'express';

import TagController from '@/controllers/tags.controller.ts';
import { isAuthenticated } from '@/middlewares/isAuthenticated.ts';
import { requireJsonContentType as requireJson } from '@/middlewares/requireJsonContentType.ts';
import { validate } from '@/middlewares/validate.ts';
import { createTagSchema, readTagsSchema } from '@/schemas/tag.schema.ts';

const router = Router();

router.post('/tags', isAuthenticated, requireJson, validate(createTagSchema), TagController.create);
router.get('/tags', isAuthenticated, validate(readTagsSchema), TagController.read);

export default router;
