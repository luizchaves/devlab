'use client';

import { useMutation } from '@tanstack/react-query';
import { Trash2, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { validateAvatar } from '@/core/file-validation';
import { api, ApiError } from '@/lib/http';
import { formatDate } from '@/lib/format';

export type Profile = { id: string; email: string; name: string; role: 'INVESTOR' | 'ADMIN'; createdAt: string; avatarUrl: string | null };

// #region view
/**
 * Meu perfil (CA11.1–CA11.4): nome editável; e-mail, papel e data só leitura;
 * avatar no bucket público. Depois de salvar, `router.refresh()` refaz o
 * layout do servidor para a barra mostrar o nome e a foto novos.
 */
export function ProfileView({ initial }: { initial: Profile }) {
  const router = useRouter();
  const [profile, setProfile] = useState(initial);
  const [name, setName] = useState(initial.name);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const apply = (next: Profile) => {
    setProfile(next);
    router.refresh();
  };

  const save = useMutation({
    mutationFn: (input: { name: string }) => api<{ profile: Profile }>('/api/profile', { method: 'PATCH', body: JSON.stringify(input) }).then((r) => r.profile),
    onSuccess: (next) => {
      apply(next);
      toast.success('Perfil atualizado.');
    },
    onError: (err) => setError(err instanceof ApiError ? (err.fieldErrors.name ?? err.message) : 'Não foi possível salvar.'),
  });

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData();
      form.append('file', file);
      const response = await fetch('/api/profile/avatar', { method: 'POST', body: form });
      const body = (await response.json()) as { profile?: Profile; error?: string };
      if (!response.ok || !body.profile) throw new Error(body.error ?? 'Não foi possível enviar a imagem.');
      return body.profile;
    },
    onSuccess: (next) => {
      apply(next);
      toast.success('Foto de perfil atualizada.');
    },
    onError: (err) => toast.error(err.message),
  });

  const remove = useMutation({
    mutationFn: () => api<{ profile: Profile }>('/api/profile/avatar', { method: 'DELETE' }).then((r) => r.profile),
    onSuccess: (next) => {
      apply(next);
      toast.success('Foto de perfil removida.');
    },
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('O nome não pode ficar em branco.');
      return;
    }
    save.mutate({ name });
  };

  const pick = (file: File | null) => {
    if (!file) return;
    const invalid = validateAvatar(file);
    if (invalid) {
      toast.error(invalid);
      return;
    }
    upload.mutate(file);
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[18rem_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- bucket público, sem otimização
          <img src={profile.avatarUrl} alt={`Avatar de ${profile.name}`} data-avatar-img className="mx-auto size-28 rounded-full object-cover" />
        ) : (
          <span data-avatar-initial className="mx-auto grid size-28 place-items-center rounded-full bg-emerald-100 text-4xl font-bold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100">
            {profile.name.charAt(0).toUpperCase()}
          </span>
        )}
        <p className="mt-4 text-lg font-bold">{profile.name}</p>
        <Badge data-profile-role className="mt-1">{profile.role === 'ADMIN' ? 'Administrador' : 'Investidor'}</Badge>
        <input ref={fileInput} data-avatar-input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" onChange={(e) => pick(e.target.files?.[0] ?? null)} />
        <div className="mt-5 grid gap-2">
          <Button variant="secondary" onClick={() => fileInput.current?.click()} pending={upload.isPending}>
            <Upload className="size-4" aria-hidden /> {profile.avatarUrl ? 'Trocar foto' : 'Enviar foto'}
          </Button>
          {profile.avatarUrl && (
            <Button variant="ghost" onClick={() => remove.mutate()} pending={remove.isPending} data-avatar-remove>
              <Trash2 className="size-4 text-rose-600" aria-hidden /> Remover foto
            </Button>
          )}
        </div>
        <p className="mt-3 text-xs text-slate-500">PNG, JPG, WEBP ou GIF até 2 MB.</p>
      </div>

      <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900" noValidate>
        <h1 className="text-2xl font-bold">Meu perfil</h1>
        <Field label="Nome completo" error={error ?? undefined}>
          {(c) => <Input {...c} name="name" value={name} onChange={(e) => setName(e.target.value)} />}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="E-mail" hint="Não pode ser alterado.">
            {(c) => <Input {...c} id="email" value={profile.email} readOnly />}
          </Field>
          <Field label="Cadastro">
            {(c) => <Input {...c} id="createdAt" value={formatDate(profile.createdAt)} readOnly />}
          </Field>
        </div>
        <div className="flex justify-end">
          <Button type="submit" pending={save.isPending} data-save-profile>
            Salvar
          </Button>
        </div>
      </form>
    </section>
  );
}
// #endregion
