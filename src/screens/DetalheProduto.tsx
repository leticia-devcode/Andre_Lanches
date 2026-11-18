import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BotaoPrimario from '../components/BotaoPrimario';
import SeletorQuantidade from '../components/SeletorQuantidade';
import { criarLinha, limitarQuantidade } from '../domain/carrinho';
import { imagemDoProduto } from '../lib/imagem';
import { formatarPreco } from '../utils/formatarPreco';
import { espacos, raios, sombra, tipografia, type Paleta } from '../theme';
import { useEstilos } from '../context/TemaContext';
import type { LinhaPedido, ProdutoDetalhe as ProdutoDetalheTipo } from '../domain/tipos';

interface Props {
  produto: ProdutoDetalheTipo;
  onVoltar: () => void;
  onAdicionar: (linha: LinhaPedido, quantidade: number) => void;
}

export default function DetalheProduto({ produto, onVoltar, onAdicionar }: Props) {
  const { s, cores } = useEstilos(criarEstilos);
  const [sabor, setSabor] = useState<string | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const imagem = imagemDoProduto(produto.slug);
  const precisaSabor = Boolean(produto.opcoes?.length) && !sabor;
  const total = Number(produto.preco) * quantidade;

  return (
    <ScrollView contentContainerStyle={s.conteudo}>
      <Pressable style={s.voltar} onPress={onVoltar} accessibilityRole="button">
        <Ionicons name="arrow-back" size={20} color={cores.primary} />
        <Text style={s.voltarTexto}> Voltar ao cardápio</Text>
      </Pressable>
      <View style={s.card}>
        {imagem ? (
          <Image source={imagem} style={s.foto} resizeMode="cover" />
        ) : (
          <View style={[s.foto, s.placeholder]}>
            <Ionicons name="image-outline" size={48} color={cores.textoSuave} />
          </View>
        )}
        <Text style={s.nome}>{produto.nome}</Text>
        {produto.descricao ? <Text style={s.descricao}>{produto.descricao}</Text> : null}
        <Text style={s.preco}>{formatarPreco(produto.preco)}</Text>
        {produto.opcoes?.length ? (
          <View style={s.opcoes}>
            <Text style={s.rotulo}>Escolha o sabor</Text>
            <View style={s.chips}>
              {produto.opcoes.map((opcao) => {
                const ativo = opcao === sabor;
                return (
                  <Pressable
                    key={opcao}
                    style={[s.chip, ativo && s.chipAtivo]}
                    onPress={() => setSabor(opcao)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: ativo }}
                  >
                    <Text style={[s.chipTexto, ativo && s.chipTextoAtivo]}>{opcao}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}
        <View style={s.linhaQtd}>
          <Text style={s.rotulo}>Quantidade</Text>
          <SeletorQuantidade
            quantidade={quantidade}
            onMenos={() => setQuantidade((q) => limitarQuantidade(q - 1))}
            onMais={() => setQuantidade((q) => limitarQuantidade(q + 1))}
          />
        </View>
        <View style={s.largura}>
          <BotaoPrimario
            texto={
              precisaSabor
                ? 'Escolha um sabor'
                : `Adicionar ao pedido · ${formatarPreco(total)}`
            }
            desabilitado={precisaSabor}
            onPress={() => onAdicionar(criarLinha(produto, sabor), quantidade)}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const criarEstilos = (c: Paleta) =>
  StyleSheet.create({
    conteudo: { padding: espacos.m, paddingBottom: 120 },
    voltar: {
      height: 44,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: espacos.p,
    },
    voltarTexto: { ...tipografia.rotulo, color: c.primary },
    card: {
      backgroundColor: c.surface,
      borderRadius: raios.card,
      padding: espacos.g,
      alignItems: 'center',
      ...sombra,
    },
    foto: {
      width: 150,
      height: 150,
      borderRadius: 75,
      borderWidth: 2,
      borderColor: c.primary,
      marginBottom: espacos.m,
    },
    placeholder: {
      backgroundColor: c.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    nome: { ...tipografia.titulo, color: c.text, textAlign: 'center' },
    descricao: {
      ...tipografia.descricao,
      color: c.textoSuave,
      textAlign: 'center',
      marginTop: 4,
    },
    preco: { ...tipografia.titulo, color: c.primary, marginTop: espacos.m },
    opcoes: { alignSelf: 'stretch', marginTop: espacos.g },
    rotulo: { ...tipografia.rotulo, color: c.text },
    chips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: espacos.p,
      marginTop: espacos.p,
    },
    chip: {
      minHeight: 44,
      paddingHorizontal: espacos.m,
      borderRadius: raios.pilula,
      borderWidth: 1,
      borderColor: c.borda,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chipAtivo: { backgroundColor: c.primary, borderColor: c.primary },
    chipTexto: { ...tipografia.rotulo, color: c.text },
    chipTextoAtivo: { color: c.onPrimary },
    linhaQtd: {
      alignSelf: 'stretch',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: espacos.g,
      marginBottom: espacos.m,
    },
    largura: { alignSelf: 'stretch' },
  });
