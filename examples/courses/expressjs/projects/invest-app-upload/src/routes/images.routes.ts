import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@/config/multer.ts';
import ImageController from '@/controllers/images.controller.ts';
import { isAuthenticated } from '@/middlewares/isAuthenticated.ts';

const router = Router();

// A cadeia importa: autenticar, receber o arquivo, entao executar o handler.
// Quando o controller roda, o arquivo ja esta gravado e `req.file` preenchido.
const upload = multer(uploadConfig).single('image');

router.post('/users/image', isAuthenticated, upload, ImageController.create);
router.put('/users/image', isAuthenticated, upload, ImageController.update);

export default router;
