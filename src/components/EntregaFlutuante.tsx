import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CONTATO } from '../config/contato';
import { espacos, raios, sombra, tipografia, type Paleta } from '../theme';
import { useEstilos } from '../context/TemaContext';
import { useAlerta } from '../context/AlertaContext';

export default function EntregaFlutuante() {
  const { s, cores } = useEstilos(criarEstilos);
  const alerta = useAlerta();
  const insets = useSafeAreaInsets();

  function ligar() {
    Linking.openURL(CONTATO.link).catch(() =>
      alerta(
        'Não foi possível abrir o discador',
        `Ligue para ${CONTATO.exibicao}.`,
        'erro',
      ),
    );
  }

  return (
    <Pressable
      style={[s.botao, { bottom: espacos.m + insets.bottom }]}
      onPress={ligar}
      accessibilityRole="button"
      accessibilityLabel={`Ligar para ${CONTATO.exibicao}`}
      accessibilityHint="No celular, isto abre o discador"
    >
      <View style={s.icone}>
        <Ionicons name="call-outline" size={22} color={cores.primary} />
      </View>
      <View>
        <Text style={s.titulo}>Entregamos na sua casa!</Text>
        <Text style={s.numero}>{CONTATO.exibicao}</Text>
      </View>
    </Pressable>
  );
}

const criarEstilos = (c: Paleta) =>
  StyleSheet.create({
    botao: {
      position: 'absolute',
      right: espacos.m,
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.primary,
      borderRadius: raios.pilula,
      paddingLeft: 8,
      paddingRight: espacos.m,
      ...sombra,
    },
    icone: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: espacos.p,
    },
    titulo: { ...tipografia.preco, color: c.onPrimary },
    numero: { ...tipografia.descricao, color: c.onPrimary },
  });
