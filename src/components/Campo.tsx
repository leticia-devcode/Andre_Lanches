import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { espacos, raios, tipografia, type Paleta } from '../theme';
import { useEstilos } from '../context/TemaContext';

interface Props {
  rotulo: string;
  valor: string;
  onChangeText: (texto: string) => void;
  erro?: string;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  multilinha?: boolean;
  autoCapitalize?: TextInputProps['autoCapitalize'];
}

export default function Campo({
  rotulo,
  valor,
  onChangeText,
  erro,
  placeholder,
  keyboardType = 'default',
  multilinha = false,
  autoCapitalize = 'sentences',
}: Props) {
  const { s, cores } = useEstilos(criarEstilos);

  return (
    <View style={s.grupo}>
      <Text style={s.rotulo}>{rotulo}</Text>
      <TextInput
        style={[s.input, multilinha && s.longo, erro ? s.inputErro : null]}
        value={valor}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={cores.textoSuave}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multilinha}
        textAlignVertical={multilinha ? 'top' : 'center'}
      />
      {erro ? <Text style={s.erro}>{erro}</Text> : null}
    </View>
  );
}

const criarEstilos = (c: Paleta) =>
  StyleSheet.create({
    grupo: { marginBottom: espacos.m },
    rotulo: { ...tipografia.rotulo, color: c.text, marginBottom: 6 },
    input: {
      height: 48,
      borderRadius: raios.card,
      borderWidth: 1,
      borderColor: c.borda,
      backgroundColor: c.surface,
      paddingHorizontal: espacos.m,
      color: c.text,
      fontSize: 16,
    },
    longo: { height: 96, paddingTop: 12 },
    inputErro: { borderWidth: 2, borderColor: c.erro },
    erro: { ...tipografia.erro, color: c.erro, marginTop: 4 },
  });
