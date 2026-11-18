import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BotaoPrimario from '../components/BotaoPrimario';
import SeletorQuantidade from '../components/SeletorQuantidade';
import { subtotal, totalPedido } from '../domain/carrinho';
import { imagemDoProduto } from '../lib/imagem';
import { formatarPreco } from '../utils/formatarPreco';
import { espacos, raios, sombra, tipografia, type Paleta } from '../theme';
import { useEstilos } from '../context/TemaContext';
import type { ItemCarrinho } from '../domain/tipos';

interface Props {
  itens: ItemCarrinho[];
  onAlterar: (id: string, delta: number) => void;
  onLimpar: () => void;
  onVerCardapio: () => void;
  onFinalizar: () => void;
}

export default function Carrinho({
  itens,
  onAlterar,
  onLimpar,
  onVerCardapio,
  onFinalizar,
}: Props) {
  const { s, cores } = useEstilos(criarEstilos);

  if (itens.length === 0) {
    return (
      <View style={s.vazio}>
        <View style={s.vazioIcone}>
          <Ionicons name="cart-outline" size={40} color={cores.primary} />
        </View>
        <Text style={s.titulo}>Seu pedido está vazio</Text>
        <Text style={s.vazioTexto}>Escolha um lanche no cardápio para começar.</Text>
        <View style={s.larguraBotao}>
          <BotaoPrimario texto="Ver cardápio" onPress={onVerCardapio} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={s.conteudo}>
      <Text style={s.titulo}>Seu pedido</Text>
      {itens.map((item) => {
        const imagem = imagemDoProduto(item.produto.slug);
        return (
          <View key={item.produto.id} style={s.item}>
            {imagem ? (
              <Image source={imagem} style={s.foto} />
            ) : (
              <View style={[s.foto, s.placeholder]}>
                <Ionicons name="image-outline" size={22} color={cores.textoSuave} />
              </View>
            )}
            <View style={s.info}>
              <Text style={s.nome} numberOfLines={1}>
                {item.produto.nome}
              </Text>
              <Text style={s.preco}>{formatarPreco(subtotal(item))}</Text>
            </View>
            <SeletorQuantidade
              quantidade={item.qtd}
              onMenos={() => onAlterar(item.produto.id, -1)}
              onMais={() => onAlterar(item.produto.id, 1)}
            />
          </View>
        );
      })}
      <View style={s.resumo}>
        <Text style={s.resumoRotulo}>Total</Text>
        <Text style={s.resumoValor}>{formatarPreco(totalPedido(itens))}</Text>
      </View>
      <BotaoPrimario texto="Finalizar pedido" onPress={onFinalizar} />
      <Pressable style={s.limpar} onPress={onLimpar} accessibilityRole="button">
        <Ionicons name="trash-outline" size={18} color={cores.primary} />
        <Text style={s.limparTexto}>Limpar pedido</Text>
      </Pressable>
    </ScrollView>
  );
}

const criarEstilos = (c: Paleta) =>
  StyleSheet.create({
    conteudo: { padding: espacos.m, paddingBottom: 120 },
    titulo: { ...tipografia.titulo, color: c.primary, marginBottom: espacos.m },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.surface,
      borderRadius: raios.card,
      padding: 12,
      marginBottom: 12,
      ...sombra,
    },
    foto: {
      width: 56,
      height: 56,
      borderRadius: 28,
      borderWidth: 2,
      borderColor: c.primary,
    },
    placeholder: {
      backgroundColor: c.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    info: { flex: 1, marginHorizontal: 12 },
    nome: { ...tipografia.nome, color: c.text },
    preco: { ...tipografia.preco, color: c.primary, marginTop: 2 },
    resumo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: c.surface,
      borderRadius: raios.card,
      padding: espacos.m,
      marginVertical: espacos.m,
      ...sombra,
    },
    resumoRotulo: { ...tipografia.secao, color: c.text },
    resumoValor: { ...tipografia.titulo, color: c.primary },
    limpar: {
      height: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    limparTexto: { ...tipografia.rotulo, color: c.primary, marginLeft: 6 },
    vazio: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: espacos.g,
    },
    vazioIcone: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: c.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: espacos.m,
      ...sombra,
    },
    vazioTexto: { ...tipografia.descricao, color: c.textoSuave, textAlign: 'center' },
    larguraBotao: { alignSelf: 'stretch', marginTop: espacos.m },
  });
