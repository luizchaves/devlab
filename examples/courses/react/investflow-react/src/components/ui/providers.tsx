'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/lib/query-client';
import { usePreferencesStore } from '@/store/preferences';
import { CommandPalette } from './command-palette';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <PreferenceEffects />
      {children}
      <CommandPalette />
      <Toaster richColors position="top-right" />
    </QueryProvider>
  );
}

function PreferenceEffects() {
  const hideValues = usePreferencesStore((state) => state.hideValues);

  useEffect(() => {
    document.documentElement.dataset.hideValues = String(hideValues);
  }, [hideValues]);

  return null;
}
