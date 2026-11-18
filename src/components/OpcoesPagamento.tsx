import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FORMAS_PAGAMENTO } from '../domain/pagamento';
import { espacos, raios, tipografia, type Paleta } from '../theme';
import { useEstilos } from '../context/TemaContext';
import type { FormaPagamentoId } from '../domain/tipos';

interface Props {
  selecionado: FormaPagamentoId | null;
  onSelecionar: (id: FormaPagamentoId) => void;
  erro?: string;
}

export default function OpcoesPagamento({ selecionado, onSelecionar, erro }: Props) {
  const { s, cores } = useEstilos(criarEstilos);

  return (
    <View>
      <Text style={s.rotulo}>Forma de pagamento</Text>
      <View accessibilityRole="radiogroup">
        {FORMAS_PAGAMENTO.map((forma) => {
          const ativa = forma.id === selecionado;
          return (
            <Pressable
              key={forma.id}
              style={[s.opcao, ativa && s.opcaoAtiva]}
              onPress={() => onSelecionar(forma.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected: ativa }}
            >
              <View style={[s.radio, ativa && s.radioAtivo]}>
                {ativa ? <View style={s.radioMiolo} /> : null}
              </View>
              <Ionicons
                name={forma.icone}
                size={24}
                color={cores.primary}
                style={s.icone}
              />
              <View style={s.textos}>
                <Text style={s.nome}>{forma.rotulo}</Text>
                <Text style={s.detalhe}>{forma.detalhe}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
      {erro ? <Text style={s.erro}>{erro}</Text> : null}
    </View>
  );
}

const criarEstilos = (c: Paleta) =>
  StyleSheet.create({
    rotulo: { ...tipografia.rotulo, color: c.text, marginBottom: 6 },
    opcao: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 64,
      borderRadius: raios.card,
      borderWidth: 1,
      borderColor: c.borda,
      backgroundColor: c.surface,
      paddingHorizontal: espacos.m,
      paddingVertical: espacos.p,
      marginBottom: espacos.p,
    },
    opcaoAtiva: { borderWidth: 2, borderColor: c.primary, backgroundColor: c.selecionado },
    radio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: c.borda,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioAtivo: { borderColor: c.primary },
    radioMiolo: { width: 10, height: 10, borderRadius: 5, backgroundColor: c.primary },
    icone: { marginLeft: espacos.m },
    textos: { flex: 1, marginLeft: 12 },
    nome: { ...tipografia.nome, fontWeight: '600', color: c.text },
    detalhe: { ...tipografia.descricao, color: c.textoSuave },
    erro: { ...tipografia.erro, color: c.erro, marginTop: 6 },
  });
