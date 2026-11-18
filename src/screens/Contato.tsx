import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Linking,
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
import { validarContato, type ErrosContato } from '../domain/validacoes';
import { urlWhatsApp } from '../domain/mensagemWhatsApp';
import { CONTATO, MENSAGEM_INICIAL } from '../config/contato';
import { enviarContato } from '../services/contatoService';
import { espacos, raios, sombra, tipografia, type Paleta } from '../theme';
import { useEstilos } from '../context/TemaContext';
import { useAlerta } from '../context/AlertaContext';
import type { DadosContato } from '../domain/tipos';

const VAZIO: DadosContato = { nome: '', contato: '', mensagem: '' };

export default function Contato() {
  const { s, cores } = useEstilos(criarEstilos);
  const alerta = useAlerta();
  const [dados, setDados] = useState(VAZIO);
  const [erros, setErros] = useState<ErrosContato>({});
  const [enviando, setEnviando] = useState(false);

  const campo = (nome: keyof DadosContato) => (valor: string) =>
    setDados((atual) => ({ ...atual, [nome]: valor }));

  async function enviar() {
    const novosErros = validarContato(dados);
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      alerta('Ops!', 'Confira os campos destacados.', 'erro');
      return;
    }

    setEnviando(true);
    try {
      await enviarContato(dados);
      alerta(
        'Mensagem enviada!',
        `Obrigado, ${dados.nome.trim()}! Responderemos em breve.`,
        'sucesso',
      );
      setDados(VAZIO);
    } catch (erro) {
      const texto = erro instanceof Error ? erro.message : 'Tente de novo.';
      alerta('Não foi possível enviar', texto, 'erro');
    } finally {
      setEnviando(false);
    }
  }

  function abrirWhatsApp() {
    Linking.openURL(urlWhatsApp(CONTATO.whatsapp, MENSAGEM_INICIAL)).catch(() =>
      alerta(
        'Não foi possível abrir o WhatsApp',
        `Chame no ${CONTATO.exibicao}.`,
        'erro',
      ),
    );
  }

  return (
    <KeyboardAvoidingView
      style={s.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={s.conteudo} keyboardShouldPersistTaps="handled">
        <Text style={s.titulo}>Fale com a gente</Text>
        <View style={s.card}>
          <Campo
            rotulo="Nome"
            valor={dados.nome}
            onChangeText={campo('nome')}
            erro={erros.nome}
            placeholder="Seu nome"
            autoCapitalize="words"
          />
          <Campo
            rotulo="E-mail ou WhatsApp"
            valor={dados.contato}
            onChangeText={campo('contato')}
            erro={erros.contato}
            placeholder="voce@email.com ou (61) 98137-5520"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Campo
            rotulo="Mensagem"
            valor={dados.mensagem}
            onChangeText={campo('mensagem')}
            erro={erros.mensagem}
            placeholder="Escreva sua mensagem"
            multilinha
          />
          <BotaoPrimario texto="Enviar" onPress={enviar} carregando={enviando} />
        </View>
        <Pressable style={s.zap} onPress={abrirWhatsApp} accessibilityRole="button">
          <View style={s.zapIcone}>
            <Ionicons name="logo-whatsapp" size={26} color={cores.onPrimary} />
          </View>
          <View style={s.zapTextos}>
            <Text style={s.zapTitulo}>Entregamos na sua casa!</Text>
            <Text style={s.zapTexto}>Toque para chamar no WhatsApp</Text>
            <Text style={s.zapNumero}>{CONTATO.exibicao}</Text>
          </View>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const criarEstilos = (c: Paleta) =>
  StyleSheet.create({
    flex: { flex: 1 },
    conteudo: { padding: espacos.m, paddingBottom: 120 },
    titulo: { ...tipografia.titulo, color: c.primary, marginBottom: espacos.m },
    card: {
      backgroundColor: c.surface,
      borderRadius: raios.card,
      padding: espacos.m,
      marginBottom: espacos.m,
      ...sombra,
    },
    zap: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.surface,
      borderRadius: raios.card,
      padding: espacos.m,
      ...sombra,
    },
    zapIcone: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: espacos.m,
    },
    zapTextos: { flex: 1 },
    zapTitulo: { ...tipografia.nome, fontWeight: '700', color: c.text },
    zapTexto: { ...tipografia.descricao, color: c.textoSuave },
    zapNumero: { ...tipografia.rotulo, color: c.primary, marginTop: 2 },
  });
