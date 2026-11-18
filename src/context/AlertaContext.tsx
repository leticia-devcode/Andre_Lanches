import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { espacos, raios, sombra, tipografia, type Paleta } from '../theme';
import { useEstilos } from './TemaContext';
import type { NomeIcone } from '../domain/tipos';

type TipoAlerta = 'sucesso' | 'erro' | 'info';
type MostrarAlerta = (titulo: string, mensagem: string, tipo?: TipoAlerta) => void;

interface Aviso {
  titulo: string;
  mensagem: string;
  tipo: TipoAlerta;
}

const Contexto = createContext<MostrarAlerta>(() => {});

const ICONES: Record<TipoAlerta, NomeIcone> = {
  sucesso: 'checkmark',
  erro: 'alert-circle',
  info: 'information-circle',
};
const VERDE = '#2E7D32';

export function AlertaProvider({ children }: { children: ReactNode }) {
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const { s, cores } = useEstilos(criarEstilos);

  const mostrar = useCallback<MostrarAlerta>(
    (titulo, mensagem, tipo = 'info') => setAviso({ titulo, mensagem, tipo }),
    [],
  );
  const fechar = useCallback(() => setAviso(null), []);

  const corDoSelo: Record<TipoAlerta, string> = {
    sucesso: VERDE,
    erro: cores.erro,
    info: cores.primary,
  };

  return (
    <Contexto.Provider value={mostrar}>
      {children}
      <Modal transparent animationType="fade" visible={!!aviso} onRequestClose={fechar}>
        <Pressable style={s.fundo} onPress={fechar} accessibilityLabel="Fechar aviso">
          <Pressable style={s.caixa}>
            {aviso ? (
              <>
                <View style={[s.selo, { backgroundColor: corDoSelo[aviso.tipo] }]}>
                  <Ionicons name={ICONES[aviso.tipo]} size={32} color={cores.onPrimary} />
                </View>
                <Text style={s.titulo}>{aviso.titulo}</Text>
                <Text style={s.mensagem}>{aviso.mensagem}</Text>
                <Pressable style={s.botao} onPress={fechar} accessibilityRole="button">
                  <Text style={s.botaoTexto}>OK</Text>
                </Pressable>
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </Contexto.Provider>
  );
}

export function useAlerta(): MostrarAlerta {
  return useContext(Contexto);
}

const criarEstilos = (c: Paleta) =>
  StyleSheet.create({
    fundo: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: espacos.g,
    },
    caixa: {
      width: '100%',
      maxWidth: 320,
      alignItems: 'center',
      backgroundColor: c.surface,
      borderRadius: raios.card,
      padding: espacos.g,
      ...sombra,
    },
    selo: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: espacos.m,
    },
    titulo: { ...tipografia.secao, color: c.text, textAlign: 'center' },
    mensagem: {
      ...tipografia.descricao,
      lineHeight: 20,
      color: c.textoSuave,
      textAlign: 'center',
      marginTop: espacos.p,
    },
    botao: {
      alignSelf: 'stretch',
      height: 48,
      marginTop: espacos.g,
      borderRadius: raios.card,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    botaoTexto: { ...tipografia.preco, color: c.onPrimary },
  });
