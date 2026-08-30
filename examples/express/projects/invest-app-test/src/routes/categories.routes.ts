import { Router } from 'express';

import CategoryController from '@/controllers/categories.controller.ts';
import { isAuthenticated } from '@/middlewares/isAuthenticated.ts';
import { validate } from '@/middlewares/validate.ts';
import { readCategoriesSchema, readCategoryByIdSchema } from '@/schemas/category.schema.ts';

const router = Router();

router.get('/categories', isAuthenticated, validate(readCategoriesSchema), CategoryController.read);
router.get('/categories/:id', isAuthenticated, validate(readCategoryByIdSchema), CategoryController.readById);

export default router;
