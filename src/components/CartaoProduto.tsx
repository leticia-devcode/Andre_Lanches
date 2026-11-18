import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatarPreco } from '../utils/formatarPreco';
import { espacos, raios, sombra, tipografia, type Paleta } from '../theme';
import { useEstilos } from '../context/TemaContext';
import type { Preco } from '../domain/tipos';

interface Props {
  imagem: ImageSourcePropType | null;
  nome: string;
  descricao: string | null;
  preco: Preco;
  onPress: () => void;
}

export default function CartaoProduto({ imagem, nome, descricao, preco, onPress }: Props) {
  const { s, cores } = useEstilos(criarEstilos);

  return (
    <Pressable
      style={s.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${nome}, ${formatarPreco(preco)}`}
    >
      {imagem ? (
        <Image source={imagem} style={s.foto} resizeMode="cover" />
      ) : (
        <View style={[s.foto, s.placeholder]}>
          <Ionicons name="image-outline" size={28} color={cores.textoSuave} />
        </View>
      )}
      <Text style={s.nome} numberOfLines={1}>{nome}</Text>
      <Text style={s.descricao} numberOfLines={2}>{descricao}</Text>
      <View style={s.espaco} />
      <Text style={s.preco}>{formatarPreco(preco)}</Text>
    </Pressable>
  );
}

const criarEstilos = (c: Paleta) =>
  StyleSheet.create({
    card: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: c.surface,
      borderRadius: raios.card,
      paddingVertical: espacos.m,
      paddingHorizontal: 12,
      ...sombra,
    },
    foto: {
      width: 72,
      height: 72,
      borderRadius: 36,
      borderWidth: 2,
      borderColor: c.primary,
      marginBottom: 12,
    },
    placeholder: {
      backgroundColor: c.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    nome: { ...tipografia.nome, fontWeight: '600', color: c.text, textAlign: 'center' },
    descricao: { ...tipografia.descricao, color: c.textoSuave, textAlign: 'center' },
    espaco: { flex: 1 },
    preco: { ...tipografia.preco, color: c.primary, marginTop: espacos.p },
  });
