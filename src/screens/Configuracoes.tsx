import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { OPCOES_TEMA } from '../domain/tema';
import { espacos, raios, sombra, tipografia, type Paleta } from '../theme';
import { useEstilos, useTema } from '../context/TemaContext';

export type IdNotificacao = 'promocoes' | 'pedido' | 'novidades';
export type Notificacoes = Record<IdNotificacao, boolean>;

const NOTIFICACOES: { id: IdNotificacao; titulo: string; detalhe: string }[] = [
  { id: 'promocoes', titulo: 'Promoções e combos', detalhe: 'Ofertas do dia' },
  {
    id: 'pedido',
    titulo: 'Status do pedido',
    detalhe: 'Quando o pedido sair para entrega',
  },
  {
    id: 'novidades',
    titulo: 'Novidades do cardápio',
    detalhe: 'Lanches e bebidas novos',
  },
];

interface Props {
  notificacoes: Notificacoes;
  onNotificacao: (id: IdNotificacao, valor: boolean) => void;
}

export default function Configuracoes({ notificacoes, onNotificacao }: Props) {
  const { s, cores } = useEstilos(criarEstilos);
  const { preferencia, setPreferencia } = useTema();

  return (
    <ScrollView contentContainerStyle={s.conteudo}>
      <Text style={s.titulo}>Configurações</Text>
      <View style={s.card}>
        <Text style={s.secao}>Notificações</Text>
        {NOTIFICACOES.map((item) => (
          <View key={item.id} style={s.linha}>
            <View style={s.textos}>
              <Text style={s.nome}>{item.titulo}</Text>
              <Text style={s.detalhe}>{item.detalhe}</Text>
            </View>
            <Switch
              value={notificacoes[item.id]}
              onValueChange={(valor) => onNotificacao(item.id, valor)}
              trackColor={{ false: cores.borda, true: cores.primary }}
              thumbColor="#FFFFFF"
              accessibilityLabel={item.titulo}
            />
          </View>
        ))}
      </View>
      <View style={s.card}>
        <Text style={s.secao}>Tema</Text>
        <View accessibilityRole="radiogroup">
          {OPCOES_TEMA.map((opcao) => {
            const ativa = opcao.id === preferencia;
            return (
              <Pressable
                key={opcao.id}
                style={[s.opcao, ativa && s.opcaoAtiva]}
                onPress={() => setPreferencia(opcao.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: ativa }}
              >
                <View style={[s.radio, ativa && s.radioAtivo]}>
                  {ativa ? <View style={s.radioMiolo} /> : null}
                </View>
                <Text style={s.nome}>{opcao.rotulo}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={s.dica}>Sistema segue o tema claro ou escuro do seu celular.</Text>
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
    secao: { ...tipografia.secao, color: c.text, marginBottom: espacos.p },
    linha: { flexDirection: 'row', alignItems: 'center', minHeight: 56 },
    textos: { flex: 1, paddingRight: espacos.p },
    nome: { ...tipografia.nome, fontWeight: '600', color: c.text },
    detalhe: { ...tipografia.descricao, color: c.textoSuave },
    opcao: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 48,
      borderRadius: raios.card,
      paddingHorizontal: espacos.p,
    },
    opcaoAtiva: { backgroundColor: c.selecionado },
    radio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: c.borda,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    radioAtivo: { borderColor: c.primary },
    radioMiolo: { width: 10, height: 10, borderRadius: 5, backgroundColor: c.primary },
    dica: { ...tipografia.descricao, color: c.textoSuave, marginTop: espacos.p },
  });
