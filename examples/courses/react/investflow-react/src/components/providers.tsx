'use client';

import { useEffect, type ReactNode } from 'react';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/lib/query-client';
import { usePreferences } from '@/store/preferences';

// #region providers
/**
 * Fronteira cliente da aplicação: React Query, toasts e os efeitos das
 * preferências. Fica no `layout.tsx` raiz para valer em todas as páginas.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <PreferenceEffects />
      {children}
      <Toaster richColors position="top-right" />
    </QueryProvider>
  );
}
// #endregion

// #region effects
/**
 * Espelha o store em atributos do `<html>`: o CSS lê `data-theme` para o
 * modo escuro e `data-hide-values` para trocar valores por `••••••`.
 */
function PreferenceEffects() {
  const theme = usePreferences((state) => state.theme);
  const hideValues = usePreferences((state) => state.hideValues);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const apply = () => {
      const resolved = theme === 'system' ? (media.matches ? 'dark' : 'light') : theme;
      root.dataset.theme = resolved;
    };

    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.hideValues = String(hideValues);
  }, [hideValues]);

  return null;
}
// #endregion
