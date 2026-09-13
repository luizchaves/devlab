import { beforeEach, describe, expect, it } from 'vitest';
import { usePreferences } from './preferences';

describe('preferences store', () => {
  beforeEach(() => {
    usePreferences.setState({ theme: 'system', hideValues: false, paletteOpen: false });
  });

  it('CA11.9 — o tema gira claro → escuro → automático', () => {
    const { cycleTheme } = usePreferences.getState();
    cycleTheme();
    expect(usePreferences.getState().theme).toBe('light');
    cycleTheme();
    expect(usePreferences.getState().theme).toBe('dark');
    cycleTheme();
    expect(usePreferences.getState().theme).toBe('system');
  });

  it('CA11.10 — ocultar valores alterna e persiste só o necessário', () => {
    usePreferences.getState().toggleHideValues();
    expect(usePreferences.getState().hideValues).toBe(true);
    usePreferences.getState().setPaletteOpen(true);

    const persisted = JSON.parse(localStorage.getItem('investflow:preferences') ?? '{}');
    expect(persisted.state).toEqual({ theme: 'system', hideValues: true });
  });
});
