'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// #region hook
/**
 * Estado de tela na URL (`?filter=all&sort=value&dir=desc`): recarregar
 * mantém a escolha e compartilhar o link reproduz a tela; o valor padrão não
 * aparece (CA07.8, CA08.17). A leitura no clique usa `window.location`, não
 * o hook, para dois cliques seguidos não usarem parâmetros defasados.
 */
export function useUrlState<T extends Record<string, string>>(defaults: T): [T, (next: Partial<T>) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const values = Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [key, params.get(key) ?? fallback])) as T;

  const set = (next: Partial<T>) => {
    const query = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(next)) {
      if (value == null || value === defaults[key]) query.delete(key);
      else query.set(key, value);
    }
    const qs = query.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return [values, set];
}
// #endregion
