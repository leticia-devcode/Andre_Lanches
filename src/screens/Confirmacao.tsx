import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BotaoPrimario from '../components/BotaoPrimario';
import { subtotal } from '../domain/carrinho';
import { montarMensagem, urlWhatsApp } from '../domain/mensagemWhatsApp';
import { rotuloPagamento } from '../domain/pagamento';
import { CONTATO } from '../config/contato';
import { formatarPreco } from '../utils/formatarPreco';
import { espacos, raios, sombra, tipografia, type Paleta } from '../theme';
import { useEstilos } from '../context/TemaContext';
import { useAlerta } from '../context/AlertaContext';
import type { Pedido } from '../domain/tipos';

interface Props {
  pedido: Pedido;
  onNovoPedido: () => void;
}

export default function Confirmacao({ pedido, onNovoPedido }: Props) {
  const { s, cores } = useEstilos(criarEstilos);
  const alerta = useAlerta();

  function enviarWhatsApp() {
    const url = urlWhatsApp(CONTATO.whatsapp, montarMensagem(pedido));
    Linking.openURL(url).catch(() =>
      alerta(
        'Não foi possível abrir o WhatsApp',
        `Chame no ${CONTATO.exibicao}.`,
        'erro',
      ),
    );
  }

  let pagamento = rotuloPagamento(pedido.pagamento);
  if (pedido.pagamento === 'dinheiro') {
    const pago = formatarPreco(pedido.valorPago);
    const troco = formatarPreco(pedido.troco);
    pagamento +=
      pedido.valorPago != null
        ? ` · troco para ${pago} (troco ${troco})`
        : ' · sem troco';
  }
  const { cliente } = pedido;

  return (
    <ScrollView contentContainerStyle={s.conteudo}>
      <View style={s.topo}>
        <View style={s.selo}>
          <Ionicons name="checkmark-circle" size={44} color={cores.onPrimary} />
        </View>
        <Text style={s.titulo}>Pedido #{pedido.numero} pronto!</Text>
        <Text style={s.sub}>Falta só um passo para a lanchonete receber.</Text>
      </View>
      <View style={s.aviso}>
        <Text style={s.avisoTexto}>
          Seu pedido só chega até o André Lanches depois que você enviar pelo WhatsApp.
        </Text>
        <Pressable style={s.botaoZap} onPress={enviarWhatsApp} accessibilityRole="button">
          <Ionicons name="logo-whatsapp" size={20} color={cores.primary} />
          <Text style={s.botaoZapTexto}>Enviar pedido pelo WhatsApp</Text>
        </Pressable>
      </View>
      {!pedido.salvo ? (
        <Text style={s.nota}>
          Não conseguimos registrar o pedido no sistema, mas você pode enviá-lo pelo
          WhatsApp.
        </Text>
      ) : null}
      <View style={s.card}>
        <Text style={s.secao}>Resumo</Text>
        {pedido.itens.map((item) => (
          <View key={item.produto.id} style={s.linha}>
            <Text style={s.linhaNome}>
              {item.qtd}x {item.produto.nome}
            </Text>
            <Text style={s.linhaValor}>{formatarPreco(subtotal(item))}</Text>
          </View>
        ))}
        <View style={[s.linha, s.total]}>
          <Text style={s.totalRotulo}>Total</Text>
          <Text style={s.totalValor}>{formatarPreco(pedido.total)}</Text>
        </View>
      </View>
      <View style={s.card}>
        <Text style={s.secao}>Entrega e pagamento</Text>
        <Text style={s.info}>
          {cliente.nome} · {cliente.telefone}
        </Text>
        <Text style={s.info}>
          {cliente.endereco}
          {cliente.complemento ? ` (${cliente.complemento})` : ''}
        </Text>
        <Text style={s.info}>Pagamento na entrega: {pagamento}</Text>
        {pedido.observacao ? <Text style={s.info}>Obs.: {pedido.observacao}</Text> : null}
      </View>
      <BotaoPrimario texto="Voltar ao cardápio" onPress={onNovoPedido} />
    </ScrollView>
  );
}

const criarEstilos = (c: Paleta) =>
  StyleSheet.create({
    conteudo: { padding: espacos.m, paddingBottom: 120 },
    topo: { alignItems: 'center', paddingVertical: espacos.m },
    selo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: espacos.m,
      ...sombra,
    },
    titulo: { ...tipografia.titulo, color: c.primary, textAlign: 'center' },
    sub: {
      ...tipografia.descricao,
      color: c.textoSuave,
      marginTop: 4,
      textAlign: 'center',
    },
    aviso: {
      backgroundColor: c.primary,
      borderRadius: raios.card,
      padding: espacos.m,
      marginBottom: espacos.m,
      ...sombra,
    },
    avisoTexto: { ...tipografia.descricao, color: c.onPrimary, marginBottom: espacos.m },
    botaoZap: {
      height: 48,
      borderRadius: raios.card,
      backgroundColor: c.surface,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    botaoZapTexto: { ...tipografia.preco, color: c.primary, marginLeft: espacos.p },
    nota: { ...tipografia.descricao, color: c.textoSuave, marginBottom: espacos.m },
    card: {
      backgroundColor: c.surface,
      borderRadius: raios.card,
      padding: espacos.m,
      marginBottom: espacos.m,
      ...sombra,
    },
    secao: { ...tipografia.secao, color: c.text, marginBottom: espacos.p },
    linha: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    linhaNome: { ...tipografia.nome, color: c.text, flex: 1 },
    linhaValor: { ...tipografia.nome, color: c.text },
    total: {
      marginTop: espacos.p,
      paddingTop: espacos.p,
      borderTopWidth: 1,
      borderTopColor: c.borda,
    },
    totalRotulo: { ...tipografia.secao, color: c.text },
    totalValor: { ...tipografia.secao, color: c.primary },
    info: { ...tipografia.descricao, color: c.text, lineHeight: 21, marginBottom: 2 },
  });
