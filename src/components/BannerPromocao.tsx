import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { imagemDoProduto } from '../lib/imagem';
import { formatarPreco } from '../utils/formatarPreco';
import { espacos, raios, sombra, tipografia, type Paleta } from '../theme';
import { useEstilos } from '../context/TemaContext';
import type { Preco } from '../domain/tipos';

interface Props {
  slug: string;
  titulo: string;
  descricao: string | null;
  preco: Preco;
  precoOriginal: Preco | null;
  onPress: () => void;
}

export default function BannerPromocao({
  slug,
  titulo,
  descricao,
  preco,
  precoOriginal,
  onPress,
}: Props) {
  const { s, cores } = useEstilos(criarEstilos);
  const economia = precoOriginal ? Number(precoOriginal) - Number(preco) : 0;

  return (
    <Pressable
      style={s.sombra}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${titulo} por ${formatarPreco(preco)}. Toque para pedir`}
    >
      <ImageBackground
        source={imagemDoProduto(slug) ?? undefined}
        style={s.container}
        imageStyle={s.foto}
        resizeMode="cover"
      >
        <View style={s.escurecer} />
        <View style={s.topo}>
          <View style={s.selo}>
            <Text style={s.seloTexto}>PROMOÇÃO!</Text>
          </View>
          {economia > 0 ? (
            <View style={s.economia}>
              <Text style={s.economiaTexto}>Economize {formatarPreco(economia)}</Text>
            </View>
          ) : null}
        </View>
        <Text style={s.titulo}>{titulo}</Text>
        <Text style={s.descricao}>{descricao}</Text>
        <View style={s.rodape}>
          <View>
            {precoOriginal ? (
              <Text style={s.de}>{formatarPreco(precoOriginal)}</Text>
            ) : null}
            <Text style={s.preco}>{formatarPreco(preco)}</Text>
          </View>
          <View style={s.botao}>
            <Text style={s.botaoTexto}>Pedir agora</Text>
            <Ionicons name="arrow-forward" size={18} color={cores.onPrimary} />
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const criarEstilos = (c: Paleta) =>
  StyleSheet.create({
    sombra: { borderRadius: raios.card, ...sombra, shadowOpacity: 0.25, elevation: 6 },
    container: {
      height: 208,
      borderRadius: raios.card,
      borderWidth: 3,
      borderColor: c.primary,
      backgroundColor: c.primary,
      padding: espacos.m,
      justifyContent: 'flex-end',
      overflow: 'hidden',
    },
    foto: { borderRadius: raios.card - 3 },
    escurecer: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.45)' },
    topo: {
      position: 'absolute',
      top: espacos.m,
      left: espacos.m,
      right: espacos.m,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    selo: {
      backgroundColor: c.destaque,
      borderRadius: raios.pilula,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    seloTexto: {
      ...tipografia.descricao,
      fontWeight: '700',
      letterSpacing: 1.5,
      color: '#E50021',
    },
    economia: {
      backgroundColor: c.primary,
      borderRadius: raios.pilula,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    economiaTexto: { ...tipografia.descricao, fontWeight: '700', color: c.onPrimary },
    titulo: { ...tipografia.titulo, fontSize: 26, color: '#FFFFFF' },
    descricao: { ...tipografia.descricao, color: '#FFFFFF' },
    rodape: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      marginTop: espacos.p,
    },
    de: {
      ...tipografia.descricao,
      color: 'rgba(255,255,255,0.8)',
      textDecorationLine: 'line-through',
    },
    preco: { fontSize: 32, fontWeight: '700', color: '#FFE18C', letterSpacing: -0.5 },
    botao: {
      height: 44,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.primary,
      borderRadius: raios.pilula,
      paddingHorizontal: 20,
    },
    botaoTexto: { ...tipografia.preco, color: c.onPrimary, marginRight: 6 },
  });
