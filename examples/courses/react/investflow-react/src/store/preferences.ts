'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

// #region store
/**
 * Estado global mínimo: só preferências de interface. Dados da carteira
 * nunca entram aqui; eles pertencem ao React Query.
 */
type PreferencesState = {
  theme: Theme;
  hideValues: boolean;
  paletteOpen: boolean;
  cycleTheme: () => void;
  toggleHideValues: () => void;
  setPaletteOpen: (open: boolean) => void;
};

const THEME_ORDER: Theme[] = ['light', 'dark', 'system'];

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'system',
      hideValues: false,
      paletteOpen: false,
      // Claro → escuro → automático, como o botão da versão vanilla (CA11.9).
      cycleTheme: () =>
        set((state) => ({
          theme: THEME_ORDER[(THEME_ORDER.indexOf(state.theme) + 1) % THEME_ORDER.length],
        })),
      toggleHideValues: () => set((state) => ({ hideValues: !state.hideValues })),
      setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
    }),
    {
      name: 'investflow:preferences',
      // `paletteOpen` é efêmero: não persiste.
      partialize: ({ theme, hideValues }) => ({ theme, hideValues }),
    }
  )
);
// #endregion
