import { useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text } from 'react-native';
import { LOGO } from '../lib/imagem';
import { espacos, tipografia, type Paleta } from '../theme';
import { useEstilos } from '../context/TemaContext';

export default function Abertura({ onEntrar }: { onEntrar: () => void }) {
  const { s } = useEstilos(criarEstilos);

  useEffect(() => {
    const tempo = setTimeout(onEntrar, 1800);
    return () => clearTimeout(tempo);
  }, [onEntrar]);

  return (
    <Pressable style={s.tela} onPress={onEntrar} accessibilityLabel="Entrar no app">
      <Image source={LOGO} style={s.logo} />
      <Text style={s.nome}>André Lanches</Text>
      <Text style={s.frase}>Lanche bom, quente e honesto</Text>
      <Text style={s.toque}>Toque para entrar</Text>
    </Pressable>
  );
}

const criarEstilos = (c: Paleta) =>
  StyleSheet.create({
    tela: {
      flex: 1,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
      padding: espacos.g,
    },
    logo: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FFFFFF' },
    nome: {
      ...tipografia.titulo,
      fontSize: 32,
      color: c.onPrimary,
      marginTop: espacos.g,
    },
    frase: { ...tipografia.nome, color: c.onPrimary, marginTop: espacos.p },
    toque: {
      ...tipografia.descricao,
      color: c.onPrimary,
      opacity: 0.8,
      marginTop: espacos.gg,
    },
  });
