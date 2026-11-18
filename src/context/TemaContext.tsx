import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { cores, type Paleta } from '../theme';
import { resolverEsquema } from '../domain/tema';
import type { Esquema, PreferenciaTema } from '../domain/tipos';

interface ValorTema {
  cores: Paleta;
  esquema: Esquema;
  preferencia: PreferenciaTema;
  setPreferencia: (preferencia: PreferenciaTema) => void;
}

const Contexto = createContext<ValorTema | null>(null);

export function TemaProvider({ children }: { children: ReactNode }) {
  const sistema = useColorScheme();
  const [preferencia, setPreferencia] = useState<PreferenciaTema>('sistema');
  const esquema = resolverEsquema(preferencia, sistema);

  const valor = useMemo(
    () => ({ cores: cores[esquema], esquema, preferencia, setPreferencia }),
    [esquema, preferencia],
  );
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useTema(): ValorTema {
  const valor = useContext(Contexto);
  if (!valor) {
    throw new Error('useTema precisa estar dentro do <TemaProvider>.');
  }
  return valor;
}

export function useEstilos<T>(criar: (cores: Paleta) => T): { s: T; cores: Paleta } {
  const { cores: paleta } = useTema();
  return useMemo(() => ({ s: criar(paleta), cores: paleta }), [criar, paleta]);
}
