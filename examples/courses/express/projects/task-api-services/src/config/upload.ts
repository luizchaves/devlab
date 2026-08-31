import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import multer from 'multer';

import { HttpError } from '#errors/HttpError.ts';

const TIPOS_PERMITIDOS = ['image/png', 'image/jpeg', 'image/webp'];
const TAMANHO_MAXIMO = 2 * 1024 * 1024; // 2 MB

// #region storage
/**
 * O nome do arquivo e gerado pelo servidor, nunca aproveitado do cliente.
 *
 * `originalname` chega do navegador e pode conter `../`, bytes nulos ou um
 * nome que sobrescreve outro arquivo. Um UUID elimina os tres problemas de uma
 * vez, e a extensao vem do tipo declarado — nao do nome.
 */
const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (_req, file, callback) => {
    callback(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`);
  },
});
// #endregion

// #region upload
/**
 * Tres limites, e todos importam:
 *
 * - `fileSize` impede que um upload gigante esgote o disco;
 * - `files` impede que mil arquivos venham numa requisicao so;
 * - `fileFilter` recusa o que nao for imagem antes de gravar.
 */
export const upload = multer({
  storage,
  limits: { fileSize: TAMANHO_MAXIMO, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
      return callback(new HttpError(415, 'Envie uma imagem PNG, JPEG ou WebP'));
    }

    callback(null, true);
  },
});
// #endregion
