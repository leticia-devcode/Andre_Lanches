import { ActivityIndicator, Pressable, RefreshControl, ScrollView } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import BannerPromocao from '../components/BannerPromocao';
import CartaoProduto from '../components/CartaoProduto';
import useProdutos from '../hooks/useProdutos';
import usePromocao from '../hooks/usePromocao';
import { agruparPorSecao, emLinhas } from '../domain/cardapio';
import { imagemDoProduto } from '../lib/imagem';
import { espacos, raios, tipografia, type Paleta } from '../theme';
import { useEstilos } from '../context/TemaContext';
import type { Produto, Promocao } from '../domain/tipos';

interface Props {
  onAbrirProduto: (produto: Produto) => void;
  onAbrirPromocao: (promocao: Promocao) => void;
}

export default function ListaProdutos({ onAbrirProduto, onAbrirPromocao }: Props) {
  const { s, cores } = useEstilos(criarEstilos);
  const produtos = useProdutos();
  const promocao = usePromocao();

  function atualizar() {
    produtos.refetch();
    promocao.refetch();
  }

  if (produtos.loading && produtos.data.length === 0) {
    return (
      <View style={s.centro}>
        <ActivityIndicator size="large" color={cores.primary} />
        <Text style={s.mensagem}>Carregando o cardápio...</Text>
      </View>
    );
  }

  if (produtos.error) {
    return (
      <View style={s.centro}>
        <Text style={s.mensagem}>{produtos.error}</Text>
        <Pressable style={s.botao} onPress={atualizar} accessibilityRole="button">
          <Text style={s.botaoTexto}>Tentar de novo</Text>
        </Pressable>
      </View>
    );
  }

  const secoes = agruparPorSecao(produtos.data);
  const promo = promocao.data;

  return (
    <ScrollView
      contentContainerStyle={s.conteudo}
      refreshControl={
        <RefreshControl
          refreshing={produtos.loading && produtos.data.length > 0}
          onRefresh={atualizar}
          tintColor={cores.primary}
          colors={[cores.primary]}
        />
      }
    >
      {promo ? (
        <BannerPromocao
          slug={promo.slug}
          titulo={promo.titulo}
          descricao={promo.descricao}
          preco={promo.preco}
          precoOriginal={promo.preco_original}
          onPress={() => onAbrirPromocao(promo)}
        />
      ) : null}

      {secoes.length === 0 ? (
        <Text style={s.vazio}>
          O cardápio está vazio por enquanto. Puxe para atualizar.
        </Text>
      ) : null}

      {secoes.map((secao) => (
        <View key={secao.titulo}>
          <Text style={s.secao}>{secao.titulo}</Text>
          {emLinhas(secao.itens, 2).map((linha) => (
            <View key={linha[0].slug} style={s.linha}>
              {linha.map((produto) => (
                <CartaoProduto
                  key={produto.slug}
                  imagem={imagemDoProduto(produto.slug)}
                  nome={produto.nome}
                  descricao={produto.descricao}
                  preco={produto.preco}
                  onPress={() => onAbrirProduto(produto)}
                />
              ))}
              {linha.length < 2 ? <View style={s.sobra} /> : null}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const criarEstilos = (c: Paleta) =>
  StyleSheet.create({
    conteudo: { padding: espacos.m, paddingBottom: 120 },
    secao: {
      ...tipografia.secao,
      color: c.text,
      marginTop: espacos.m,
      marginBottom: espacos.p,
    },
    linha: { flexDirection: 'row', gap: espacos.p + 4, marginBottom: espacos.p + 4 },
    sobra: { flex: 1 },
    centro: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: espacos.g,
    },
    mensagem: {
      ...tipografia.nome,
      color: c.text,
      textAlign: 'center',
      marginTop: espacos.p,
    },
    vazio: {
      ...tipografia.nome,
      color: c.textoSuave,
      textAlign: 'center',
      marginTop: espacos.g,
    },
    botao: {
      marginTop: espacos.m,
      backgroundColor: c.primary,
      borderRadius: raios.card,
      paddingVertical: 12,
      paddingHorizontal: espacos.g,
    },
    botaoTexto: { ...tipografia.preco, color: c.onPrimary },
  });
