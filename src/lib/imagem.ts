import type { ImageSourcePropType } from 'react-native';

// ─────────────────────────────────────────────
// Imagens
// ─────────────────────────────────────────────

/** Logo do app. Enquanto a arte oficial não é adicionada, usa o ícone do projeto. */
export const LOGO: ImageSourcePropType = require('../../assets/icon.png');

/**
 * Imagens dos produtos, que acompanham o app (pasta assets/imagens).
 * A chave é o slug do produto.
 *
 * O Metro exige caminhos literais dentro de `require`, então cada imagem
 * precisa ser listada aqui (não dá para montar o caminho com o slug).
 */
const IMAGENS: Readonly<Record<string, ImageSourcePropType>> = {};

// ─────────────────────────────────────────────
// Funções
// ─────────────────────────────────────────────

/**
 * Devolve a imagem do produto pelo slug.
 * Retorna `null` quando não há imagem: o componente mostra um ícone no lugar.
 */
export function imagemDoProduto(slug: string): ImageSourcePropType | null {
  return IMAGENS[slug] ?? null;
}