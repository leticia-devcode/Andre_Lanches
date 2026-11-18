import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { espacos, raios, tipografia, type Paleta } from '../theme';
import { useEstilos } from '../context/TemaContext';
import type { NomeIcone } from '../domain/tipos';

interface Props {
  texto: string;
  onPress: () => void;
  desabilitado?: boolean;
  carregando?: boolean;
  icone?: NomeIcone | null;
}

export default function BotaoPrimario({
  texto,
  onPress,
  desabilitado = false,
  carregando = false,
  icone = null,
}: Props) {
  const { s, cores } = useEstilos(criarEstilos);
  const bloqueado = desabilitado || carregando;

  return (
    <Pressable
      style={[s.botao, bloqueado && s.desativado]}
      onPress={onPress}
      disabled={bloqueado}
      accessibilityRole="button"
      accessibilityState={{ disabled: bloqueado }}
    >
      {carregando ? (
        <ActivityIndicator color={cores.onPrimary} />
      ) : (
        <>
          {icone ? <Ionicons name={icone} size={20} color={cores.onPrimary} /> : null}
          <Text style={[s.texto, icone ? s.comIcone : null]}>{texto}</Text>
        </>
      )}
    </Pressable>
  );
}

const criarEstilos = (c: Paleta) =>
  StyleSheet.create({
    botao: {
      height: 48,
      borderRadius: raios.card,
      backgroundColor: c.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    desativado: { opacity: 0.45 },
    texto: { ...tipografia.preco, color: c.onPrimary },
    comIcone: { marginLeft: espacos.p },
  });
