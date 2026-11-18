import { useCallback, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Header from './src/components/Header';
import EntregaFlutuante from './src/components/EntregaFlutuante';
import { AlertaProvider } from './src/context/AlertaContext';
import { TemaProvider, useTema } from './src/context/TemaContext';
import { adicionarItem, alterarQuantidade, totalItens } from './src/domain/carrinho';
import { abaAtiva } from './src/domain/navegacao';
import { montarPayload, montarPedido, numeroLocal } from './src/domain/pedido';
import { criarPedido } from './src/services/pedidoService';
import Abertura from './src/screens/Abertura';
import Carrinho from './src/screens/Carrinho';
import Checkout from './src/screens/Checkout';
import Confirmacao from './src/screens/Confirmacao';
import Configuracoes, {
  type IdNotificacao,
  type Notificacoes,
} from './src/screens/Configuracoes';
import Contato from './src/screens/Contato';
import DetalheProduto from './src/screens/DetalheProduto';
import ListaProdutos from './src/screens/ListaProdutos';
import SobreNos from './src/screens/SobreNos';
import type {
  DadosCheckout,
  IdAba,
  ItemCarrinho,
  LinhaPedido,
  Pedido,
  Produto,
  ProdutoDetalhe,
  Promocao,
  Tela,
} from './src/domain/tipos';

export default function App() {
  return (
    <SafeAreaProvider>
      <TemaProvider>
        <AlertaProvider>
          <Aplicativo />
        </AlertaProvider>
      </TemaProvider>
    </SafeAreaProvider>
  );
}

function Aplicativo() {
  const { cores, esquema } = useTema();
  const [tela, setTela] = useState<Tela>('abertura');
  const [telaAnterior, setTelaAnterior] = useState<Tela>('lanches');
  const [produto, setProduto] = useState<ProdutoDetalhe | null>(null);
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [notificacoes, setNotificacoes] = useState<Notificacoes>({
    promocoes: false,
    pedido: false,
    novidades: false,
  });

  const entrar = useCallback(() => setTela('lanches'), []);

  function abrirConfiguracoes() {
    if (tela === 'config') {
      setTela(telaAnterior);
      return;
    }
    setTelaAnterior(tela);
    setTela('config');
  }

  function abrirProduto(item: Produto) {
    setProduto(item);
    setTela('detalhe');
  }

  function abrirPromocao(promo: Promocao) {
    setProduto({
      slug: promo.slug,
      nome: promo.titulo,
      descricao: promo.descricao,
      preco: promo.preco,
      opcoes: null,
    });
    setTela('detalhe');
  }

  function adicionarAoCarrinho(linha: LinhaPedido, quantidade: number) {
    setItens((atuais) => adicionarItem(atuais, linha, quantidade));
  }

  function atualizarNotificacao(id: IdNotificacao, valor: boolean) {
    setNotificacoes((atuais) => ({ ...atuais, [id]: valor }));
  }

  async function confirmarPedido(dados: DadosCheckout) {
    const pedidoLocal = montarPedido({
      numero: numeroLocal(),
      itens,
      dados,
      salvo: false,
    });

    try {
      const numero = await criarPedido(montarPayload(pedidoLocal));
      setPedido({ ...pedidoLocal, numero: String(numero), salvo: true });
    } catch (erro) {
      if (!(erro instanceof Error)) {
        throw erro;
      }
      setPedido(pedidoLocal);
    }
    setTela('confirmacao');
  }

  function iniciarNovoPedido() {
    setItens([]);
    setPedido(null);
    setProduto(null);
    setTela('lanches');
  }

  let conteudo: ReactNode = null;
  switch (tela) {
    case 'abertura':
      conteudo = <Abertura onEntrar={entrar} />;
      break;
    case 'lanches':
      conteudo = (
        <ListaProdutos onAbrirProduto={abrirProduto} onAbrirPromocao={abrirPromocao} />
      );
      break;
    case 'detalhe':
      conteudo = produto ? (
        <DetalheProduto
          produto={produto}
          onVoltar={() => setTela('lanches')}
          onAdicionar={adicionarAoCarrinho}
        />
      ) : (
        <TelaIndisponivel onVoltar={() => setTela('lanches')} />
      );
      break;
    case 'carrinho':
      conteudo = (
        <Carrinho
          itens={itens}
          onAlterar={(id, delta) =>
            setItens((atuais) => alterarQuantidade(atuais, id, delta))
          }
          onLimpar={() => setItens([])}
          onVerCardapio={() => setTela('lanches')}
          onFinalizar={() => setTela('checkout')}
        />
      );
      break;
    case 'checkout':
      conteudo = (
        <Checkout
          itens={itens}
          onVoltar={() => setTela('carrinho')}
          onConfirmar={confirmarPedido}
        />
      );
      break;
    case 'confirmacao':
      conteudo = pedido ? (
        <Confirmacao pedido={pedido} onNovoPedido={iniciarNovoPedido} />
      ) : (
        <TelaIndisponivel onVoltar={() => setTela('lanches')} />
      );
      break;
    case 'sobre':
      conteudo = <SobreNos />;
      break;
    case 'contato':
      conteudo = <Contato />;
      break;
    case 'config':
      conteudo = (
        <Configuracoes notificacoes={notificacoes} onNotificacao={atualizarNotificacao} />
      );
      break;
  }

  const mostrarNavegacao = tela !== 'abertura';

  return (
    <View style={[styles.container, { backgroundColor: cores.background }]}>
      <StatusBar style={esquema === 'escuro' ? 'light' : 'dark'} />
      {mostrarNavegacao ? (
        <Header
          aba={abaAtiva(tela)}
          onNavegar={(aba: IdAba) => setTela(aba)}
          quantidade={totalItens(itens)}
          onCarrinho={() => setTela('carrinho')}
          onConfig={abrirConfiguracoes}
        />
      ) : null}
      <View style={styles.conteudo}>{conteudo}</View>
      {mostrarNavegacao ? <EntregaFlutuante /> : null}
    </View>
  );
}

function TelaIndisponivel({ onVoltar }: { onVoltar: () => void }) {
  return (
    <View style={styles.indisponivel}>
      <Text>Esta tela não está disponível.</Text>
      <Pressable onPress={onVoltar} accessibilityRole="button">
        Voltar ao cardápio
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  conteudo: { flex: 1 },
  indisponivel: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
});
