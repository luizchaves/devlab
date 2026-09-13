'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

// #region hook
/**
 * Estado de tela na URL (`?filter=all&sort=value&dir=desc`): recarregar
 * mantém a escolha e compartilhar o link reproduz a tela; o valor padrão não
 * aparece (CA07.8, CA08.17). A leitura no clique parte da última query escrita
 * (o `router.replace` é assíncrono), para dois cliques seguidos não usarem
 * parâmetros defasados.
 */
export function useUrlState<T extends Record<string, string>>(defaults: T): [T, (next: Partial<T>) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const values = Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [key, params.get(key) ?? fallback])) as T;
  const pending = useRef<string | null>(null);
  const current = params.toString();
  // Quando a URL alcança a última escrita, volta a ler dela.
  useEffect(() => {
    if (pending.current === current) pending.current = null;
  }, [current]);

  const set = (next: Partial<T>) => {
    const query = new URLSearchParams(pending.current ?? current);
    for (const [key, value] of Object.entries(next)) {
      if (value == null || value === defaults[key]) query.delete(key);
      else query.set(key, value);
    }
    const qs = query.toString();
    pending.current = qs;
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return [values, set];
}
// #endregion
