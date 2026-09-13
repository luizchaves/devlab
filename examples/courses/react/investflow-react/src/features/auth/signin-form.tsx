'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { signInAction, type AuthFormState } from './actions';
import { PasswordInput } from './password-input';

// #region form
/**
 * `useActionState` liga o formulário à Server Action: o estado devolvido
 * traz os erros, e `pending` desabilita o botão enquanto a ação roda.
 */
export function SignInForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(signInAction, {});

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <Field label="E-mail" error={state.fieldErrors?.email}>
        {(control) => <Input {...control} name="email" type="email" autoComplete="email" required />}
      </Field>
      <Field label="Senha" error={state.fieldErrors?.password}>
        {(control) => <PasswordInput {...control} name="password" autoComplete="current-password" required />}
      </Field>
      {state.error && (
        <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 dark:bg-rose-950 dark:text-rose-200">
          {state.error}
        </p>
      )}
      <Button type="submit" size="lg" pending={pending}>
        Entrar
      </Button>
      <p className="text-center text-sm text-slate-500">
        Ainda não tem conta?{' '}
        <Link href="/signup" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400">
          Criar conta
        </Link>
      </p>
    </form>
  );
}
// #endregion
