import { randomBytes } from 'node:crypto';
import { resolve } from 'node:path';

import multer from 'multer';

import HttpError from '@/errors/HttpError.ts';

const uploadPath = resolve('public', 'imgs', 'profile');

const storageTypes = {
  local: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadPath),
    filename: (_req, file, cb) => {
      // Prefixo aleatorio gerado pelo servidor: dois usuarios que enviem
      // `avatar.png` nao se sobrescrevem, e ninguem adivinha a URL do outro.
      cb(null, `${randomBytes(16).toString('hex')}-${file.originalname}`);
    },
  }),
};

const config = {
  dest: uploadPath,
  storage: storageTypes[(process.env.STORAGE_TYPE ?? 'local') as keyof typeof storageTypes],
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new HttpError('Invalid file type', 400));
    }
  },
};

export default config;
