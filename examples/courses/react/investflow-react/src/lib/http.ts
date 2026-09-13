// #region http
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly fieldErrors: Record<string, string> = {}
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** `fetch` com JSON e erro tipado: o React Query recebe `ApiError` em `error`. */
export async function api<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { error?: string; fieldErrors?: Record<string, string> };
    throw new ApiError(response.status, body.error ?? `Erro ${response.status}`, body.fieldErrors);
  }

  // 204 não tem corpo.
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
// #endregion
