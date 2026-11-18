import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BotaoPrimario from '../components/BotaoPrimario';
import Campo from '../components/Campo';
import OpcoesPagamento from '../components/OpcoesPagamento';
import { totalItens, totalPedido } from '../domain/carrinho';
import { calcularTroco } from '../domain/pagamento';
import { validarCheckout, type ErrosCheckout } from '../domain/validacoes';
import { formatarPreco } from '../utils/formatarPreco';
import { espacos, raios, sombra, tipografia, type Paleta } from '../theme';
import { useEstilos } from '../context/TemaContext';
import { useAlerta } from '../context/AlertaContext';
import type { DadosCheckout, ItemCarrinho } from '../domain/tipos';

const DADOS_INICIAIS: DadosCheckout = {
  nome: '',
  telefone: '',
  endereco: '',
  complemento: '',
  pagamento: null,
  troco: '',
  observacao: '',
};

interface Props {
  itens: ItemCarrinho[];
  onVoltar: () => void;
  onConfirmar: (dados: DadosCheckout) => Promise<void>;
}

export default function Checkout({ itens, onVoltar, onConfirmar }: Props) {
  const { s, cores } = useEstilos(criarEstilos);
  const alerta = useAlerta();
  const [dados, setDados] = useState(DADOS_INICIAIS);
  const [erros, setErros] = useState<ErrosCheckout>({});
  const [enviando, setEnviando] = useState(false);
  const total = totalPedido(itens);
  const troco = dados.pagamento === 'dinheiro' ? calcularTroco(dados.troco, total) : null;

  function campo<K extends keyof DadosCheckout>(nome: K) {
    return (valor: DadosCheckout[K]) =>
      setDados((atual) => ({ ...atual, [nome]: valor }));
  }

  async function confirmar() {
    const novosErros = validarCheckout(dados, total);
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      alerta('Ops!', 'Confira os campos destacados.', 'erro');
      return;
    }
    setEnviando(true);
    try {
      await onConfirmar(dados);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={s.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={s.conteudo} keyboardShouldPersistTaps="handled">
        <Pressable style={s.voltar} onPress={onVoltar} accessibilityRole="button">
          <Ionicons name="arrow-back" size={20} color={cores.primary} />
          <Text style={s.voltarTexto}> Voltar ao pedido</Text>
        </Pressable>
        <Text style={s.titulo}>Finalizar pedido</Text>
        <View style={s.card}>
          <Text style={s.secao}>Entrega</Text>
          <Campo
            rotulo="Seu nome"
            valor={dados.nome}
            onChangeText={campo('nome')}
            erro={erros.nome}
            placeholder="Seu nome"
            autoCapitalize="words"
          />
          <Campo
            rotulo="Telefone / WhatsApp"
            valor={dados.telefone}
            onChangeText={campo('telefone')}
            erro={erros.telefone}
            placeholder="(61) 98137-5520"
            keyboardType="phone-pad"
          />
          <Campo
            rotulo="Rua, número e bairro"
            valor={dados.endereco}
            onChangeText={campo('endereco')}
            erro={erros.endereco}
            placeholder="Rua, número e bairro"
          />
          <Campo
            rotulo="Complemento (opcional)"
            valor={dados.complemento}
            onChangeText={campo('complemento')}
            placeholder="Apartamento, bloco, referência"
          />
        </View>
        <View style={s.card}>
          <Text style={s.secao}>Pagamento</Text>
          <OpcoesPagamento
            selecionado={dados.pagamento}
            onSelecionar={campo('pagamento')}
            erro={erros.pagamento}
          />
          {dados.pagamento === 'dinheiro' ? (
            <View style={s.troco}>
              <Campo
                rotulo="Troco para quanto? (opcional)"
                valor={dados.troco}
                onChangeText={campo('troco')}
                erro={erros.troco}
                placeholder="Ex.: 50,00 (deixe vazio se não precisa)"
                keyboardType="decimal-pad"
              />
              {troco?.informado && !troco.erro ? (
                <Text style={s.trocoValor}>Troco: {formatarPreco(troco.troco)}</Text>
              ) : null}
            </View>
          ) : null}
        </View>
        <View style={s.card}>
          <Campo
            rotulo="Observações (opcional)"
            valor={dados.observacao}
            onChangeText={campo('observacao')}
            placeholder="Ex.: sem cebola, tocar a campainha"
            multilinha
          />
        </View>
        <View style={s.resumo}>
          <Text style={s.resumoRotulo}>Total ({totalItens(itens)} itens)</Text>
          <Text style={s.resumoValor}>{formatarPreco(total)}</Text>
        </View>
        <BotaoPrimario
          texto="Confirmar pedido"
          onPress={confirmar}
          carregando={enviando}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const criarEstilos = (c: Paleta) =>
  StyleSheet.create({
    flex: { flex: 1 },
    conteudo: { padding: espacos.m, paddingBottom: 120 },
    voltar: { height: 44, flexDirection: 'row', alignItems: 'center' },
    voltarTexto: { ...tipografia.rotulo, color: c.primary },
    titulo: { ...tipografia.titulo, color: c.primary, marginBottom: espacos.m },
    card: {
      backgroundColor: c.surface,
      borderRadius: raios.card,
      padding: espacos.m,
      marginBottom: espacos.m,
      ...sombra,
    },
    secao: { ...tipografia.secao, color: c.text, marginBottom: espacos.m },
    troco: { marginTop: espacos.m },
    trocoValor: { ...tipografia.preco, color: c.primary, marginBottom: espacos.p },
    resumo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: espacos.m,
    },
    resumoRotulo: { ...tipografia.secao, color: c.text },
    resumoValor: { ...tipografia.titulo, color: c.primary },
  });
