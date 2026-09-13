import { describe, expect, it } from 'vitest';
import { MAX_SIZE, receiptPath, validateReceipt } from './file-validation';

describe('validateReceipt', () => {
  it('CA05.2 — recusa tipo fora da lista e arquivo acima do limite antes do upload', () => {
    expect(validateReceipt({ type: 'application/x-msdownload', size: 10 })).toBe('Envie um PDF, PNG ou JPG.');
    expect(validateReceipt({ type: 'application/pdf', size: MAX_SIZE + 1 })).toBe('O arquivo pode ter no máximo 5 MB.');
    expect(validateReceipt({ type: 'image/png', size: 1024 })).toBeNull();
  });
});

describe('receiptPath', () => {
  it('CA05.5 — monta <userId>/<transactionId>/<uuid>.<ext> sem o nome original', () => {
    const path = receiptPath({ userId: 'u1', transactionId: 't1', fileName: 'Nota Corretagem.PDF', uuid: 'abc' });
    expect(path).toBe('u1/t1/abc.pdf');
    expect(receiptPath({ userId: 'u1', transactionId: 't1', fileName: 'semextensao', uuid: 'x' })).toBe('u1/t1/x.semextensao');
    expect(receiptPath({ userId: 'u1', transactionId: 't1', fileName: 'a.', uuid: 'x' })).toBe('u1/t1/x.bin');
  });
});
