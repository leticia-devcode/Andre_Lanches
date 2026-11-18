import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { espacos, raios, sombra, tipografia, type Paleta } from '../theme';
import { useEstilos } from '../context/TemaContext';
import type { NomeIcone } from '../domain/tipos';

const DIFERENCIAIS: { icone: NomeIcone; titulo: string; texto: string }[] = [
  {
    icone: 'flame-outline',
    titulo: 'Chapa na hora',
    texto: 'Nada vem pronto. Cada lanche é montado depois que você pede.',
  },
  {
    icone: 'pricetag-outline',
    titulo: 'Preço de bairro',
    texto: 'Promoção todo dia: X-Salada + Batata por R$ 24,90.',
  },
  {
    icone: 'home-outline',
    titulo: 'Entrega na porta',
    texto: 'Ligou, chegou. Entregamos na sua casa.',
  },
];

export default function SobreNos() {
  const { s, cores } = useEstilos(criarEstilos);

  return (
    <ScrollView contentContainerStyle={s.conteudo}>
      <Text style={s.titulo}>Sobre Nós</Text>
      <View style={s.card}>
        <Text style={s.cardTitulo}>Nossa história</Text>
        <Text style={s.paragrafo}>
          Tudo começou na cozinha de casa, num sábado de jogo, quando o André resolveu
          fazer hambúrguer para os amigos da rua. Eles pediram mais um, depois outro, e
          quando ele viu a fila já passava da calçada do vizinho.
        </Text>
        <Text style={s.paragrafo}>
          Da chapa improvisada nasceu o André Lanches: uma lanchonete onde o cliente tem
          nome, o pão sai tostado na hora e o “quer mais um?” chega sem ninguém precisar
          pedir.
        </Text>
      </View>
      <View style={[s.card, s.cardMissao]}>
        <Text style={[s.cardTitulo, s.textoClaro]}>Nossa missão</Text>
        <Text style={[s.paragrafo, s.textoClaro]}>
          Servir lanche bom, quente e honesto, por um preço que cabe no bolso, com a
          rapidez de quem sabe que a fome não espera.
        </Text>
      </View>
      <View style={s.card}>
        <Text style={s.cardTitulo}>Nosso diferencial</Text>
        {DIFERENCIAIS.map((item) => (
          <View key={item.titulo} style={s.linha}>
            <View style={s.iconeCirculo}>
              <Ionicons name={item.icone} size={24} color={cores.primary} />
            </View>
            <View style={s.linhaTextos}>
              <Text style={s.linhaTitulo}>{item.titulo}</Text>
              <Text style={s.linhaTexto}>{item.texto}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const criarEstilos = (c: Paleta) =>
  StyleSheet.create({
    conteudo: { padding: espacos.m, paddingBottom: 120 },
    titulo: { ...tipografia.titulo, color: c.primary, marginBottom: espacos.m },
    card: {
      backgroundColor: c.surface,
      borderRadius: raios.card,
      padding: espacos.m,
      marginBottom: espacos.m,
      ...sombra,
    },
    cardMissao: { backgroundColor: c.primary },
    cardTitulo: { ...tipografia.secao, color: c.text, marginBottom: espacos.p },
    paragrafo: {
      ...tipografia.nome,
      lineHeight: 23,
      color: c.text,
      marginBottom: espacos.p,
    },
    textoClaro: { color: c.onPrimary },
    linha: { flexDirection: 'row', alignItems: 'center', marginTop: espacos.m },
    iconeCirculo: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: c.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: espacos.m,
    },
    linhaTextos: { flex: 1 },
    linhaTitulo: {
      ...tipografia.nome,
      fontWeight: '700',
      color: c.text,
      marginBottom: 2,
    },
    linhaTexto: { ...tipografia.descricao, lineHeight: 20, color: c.textoSuave },
  });
