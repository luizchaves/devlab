'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { signUpAction, type AuthFormState } from './actions';
import { PasswordInput } from './password-input';

export function SignUpForm() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(signUpAction, {});

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <Field label="Nome completo" error={state.fieldErrors?.name}>
        {(control) => <Input {...control} name="name" autoComplete="name" required />}
      </Field>
      <Field label="E-mail" error={state.fieldErrors?.email}>
        {(control) => <Input {...control} name="email" type="email" autoComplete="email" required />}
      </Field>
      <Field label="Senha" hint="Pelo menos 8 caracteres." error={state.fieldErrors?.password}>
        {(control) => <PasswordInput {...control} name="password" autoComplete="new-password" required />}
      </Field>
      {state.error && (
        <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
          {state.error}
        </p>
      )}
      <Button type="submit" size="lg" pending={pending}>
        Criar conta
      </Button>
      <p className="text-center text-sm text-slate-500">
        Já tem conta?{' '}
        <Link href="/signin" className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400">
          Entrar
        </Link>
      </p>
    </form>
  );
}
