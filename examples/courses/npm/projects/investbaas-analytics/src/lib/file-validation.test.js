import { describe, expect, it } from 'vitest';
import { MAX_SIZE, receiptPath, validateReceipt } from './file-validation.js';

const fileOf = (name, type, size) => ({ name, type, size });

// #region validate
describe('validateReceipt (TK05-3)', () => {
  it('aceita PDF, PNG e JPG ate 5 MB', () => {
    expect(validateReceipt(fileOf('nota.pdf', 'application/pdf', 1000))).toBeNull();
    expect(validateReceipt(fileOf('nota.png', 'image/png', MAX_SIZE))).toBeNull();
  });

  it('recusa tipo fora da lista, mesmo com extensao amigavel', () => {
    expect(validateReceipt(fileOf('nota.pdf', 'application/x-msdownload', 10))).toBe(
      'Envie um PDF, PNG ou JPG'
    );
  });

  it('recusa acima de 5 MB', () => {
    expect(validateReceipt(fileOf('nota.pdf', 'application/pdf', MAX_SIZE + 1))).toBe(
      'O arquivo pode ter no maximo 5 MB'
    );
  });
});
// #endregion

// #region path
describe('receiptPath (TK05-4)', () => {
  it('monta <user>/<transacao>/<uuid>.<ext> e descarta o nome original', () => {
    const path = receiptPath({
      userId: 'u1',
      transactionId: 't1',
      file: fileOf('../../etc/Passwd.PDF', 'application/pdf', 1),
    });

    expect(path).toMatch(/^u1\/t1\/[0-9a-f-]{36}\.pdf$/);
    expect(path).not.toContain('etc');
  });
});
// #endregion
