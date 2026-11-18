import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { raios, tipografia, type Paleta } from '../theme';
import { useEstilos } from '../context/TemaContext';

interface Props {
  quantidade: number;
  onMenos: () => void;
  onMais: () => void;
}

export default function SeletorQuantidade({ quantidade, onMenos, onMais }: Props) {
  const { s, cores } = useEstilos(criarEstilos);

  return (
    <View style={s.container}>
      <Pressable style={s.botao} onPress={onMenos} accessibilityLabel="Diminuir quantidade">
        <Ionicons name="remove" size={22} color={cores.primary} />
      </Pressable>
      <Text style={s.valor}>{quantidade}</Text>
      <Pressable style={s.botao} onPress={onMais} accessibilityLabel="Aumentar quantidade">
        <Ionicons name="add" size={22} color={cores.primary} />
      </Pressable>
    </View>
  );
}

const criarEstilos = (c: Paleta) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.background,
      borderRadius: raios.pilula,
    },
    botao: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
    valor: { ...tipografia.preco, color: c.text, minWidth: 28, textAlign: 'center' },
  });
