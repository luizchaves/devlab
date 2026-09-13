'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type PreferencesState = {
  hideValues: boolean;
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  toggleHideValues: () => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      hideValues: false,
      commandOpen: false,
      setCommandOpen: (commandOpen) => set({ commandOpen }),
      toggleHideValues: () => set((state) => ({ hideValues: !state.hideValues })),
    }),
    {
      name: 'investflow-react:preferences',
      partialize: (state) => ({ hideValues: state.hideValues }),
    }
  )
);
