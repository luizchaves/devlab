import { beforeEach, describe, expect, it, vi } from 'vitest';

// #region mock
const upload = vi.fn();
const createSignedUrl = vi.fn();
const update = vi.fn();
vi.mock('../lib/supabase-client.js', () => ({
  supabase: {
    storage: { from: () => ({ upload, createSignedUrl }) },
    from: () => ({ update }),
  },
}));

const { receiptUrl, uploadReceipt } = await import('./receipts.js');
// #endregion

beforeEach(() => vi.clearAllMocks());

describe('uploadReceipt (TK05-4)', () => {
  it('envia o arquivo e grava so o path na transacao', async () => {
    upload.mockResolvedValue({ error: null });
    const single = vi.fn().mockResolvedValue({ data: { id: 't1' }, error: null });
    update.mockReturnValue({ eq: () => ({ select: () => ({ single }) }) });

    await uploadReceipt({
      userId: 'u1',
      transactionId: 't1',
      file: { name: 'nota.pdf', type: 'application/pdf', size: 1 },
    });

    const [path, , options] = upload.mock.calls[0];
    expect(path).toMatch(/^u1\/t1\//);
    expect(options).toEqual({ contentType: 'application/pdf' });
    expect(update).toHaveBeenCalledWith({ receipt_path: path });
  });

  it('nao toca na transacao se o upload falhar', async () => {
    upload.mockResolvedValue({ error: { message: 'too big' } });

    const { error } = await uploadReceipt({
      userId: 'u1',
      transactionId: 't1',
      file: { name: 'x.pdf', type: 'application/pdf', size: 1 },
    });

    expect(error.message).toBe('too big');
    expect(update).not.toHaveBeenCalled();
  });
});

describe('receiptUrl (TK05-5)', () => {
  it('pede uma URL de 60 segundos', async () => {
    createSignedUrl.mockResolvedValue({ data: { signedUrl: 'https://x/y?token=z' }, error: null });

    const { url } = await receiptUrl('u1/t1/a.pdf');

    expect(createSignedUrl).toHaveBeenCalledWith('u1/t1/a.pdf', 60);
    expect(url).toContain('token=');
  });
});
