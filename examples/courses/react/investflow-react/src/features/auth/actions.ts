'use server';

import { AuthError } from 'next-auth';
import { INVALID_CREDENTIALS_MESSAGE, signInSchema, signUpSchema } from '@/core/auth';
import { signIn, signOut } from '@/server/auth';
import { createUser, EmailInUseError } from '@/server/users';

export type AuthFormState = {
  error?: string;
  fieldErrors?: Partial<Record<'name' | 'email' | 'password', string>>;
};

/** Só aceita destino relativo: evita redirecionar para outro site depois do login. */
function safeCallbackUrl(value: FormDataEntryValue | null) {
  const url = String(value ?? '');
  return url.startsWith('/') && !url.startsWith('//') ? url : '/dashboard';
}

// #region signin
/**
 * Server Action do login: valida, delega ao NextAuth e traduz a falha em uma
 * mensagem única (CA02.2). No sucesso o NextAuth redireciona por conta própria.
 */
export async function signInAction(_previous: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsOf(parsed.error) };
  }

  try {
    await signIn('credentials', { ...parsed.data, redirectTo: safeCallbackUrl(formData.get('callbackUrl')) });
    return {};
  } catch (error) {
    if (error instanceof AuthError) return { error: INVALID_CREDENTIALS_MESSAGE };
    // O redirect do Next também é lançado como exceção: precisa seguir adiante.
    throw error;
  }
}
// #endregion

// #region signup
/** Cria a conta e já abre a sessão (CA02.1). */
export async function signUpAction(_previous: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsOf(parsed.error) };
  }

  try {
    await createUser(parsed.data);
  } catch (error) {
    if (error instanceof EmailInUseError) return { fieldErrors: { email: error.message } };
    throw error;
  }

  await signIn('credentials', {
    email: parsed.data.email,
    password: parsed.data.password,
    redirectTo: '/dashboard',
  });
  return {};
}
// #endregion

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}

function fieldErrorsOf(error: { issues: { path: PropertyKey[]; message: string }[] }) {
  const fieldErrors: AuthFormState['fieldErrors'] = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]) as keyof NonNullable<AuthFormState['fieldErrors']>;
    fieldErrors[key] ??= issue.message;
  }
  return fieldErrors;
}
