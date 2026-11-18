import { obterSupabase } from '../lib/supabase';
import type { Promocao } from '../domain/tipos';

// ─────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────

/** Colunas lidas da tabela `promocoes`. */
const COLUNAS_PROMOCAO = 'id, slug, titulo, descricao, preco, preco_original' as const;

const MENSAGEM_ERRO_PROMOCAO =
  'Não foi possível carregar a promoção. Verifique sua internet e tente de novo.';

// ─────────────────────────────────────────────
// Funções
// ─────────────────────────────────────────────

/**
 * Busca a promoção ativa mais recente.
 *
 * @returns A promoção, ou `null` quando não há nenhuma ativa.
 * @throws Error com mensagem amigável se a consulta falhar.
 */
export async function buscarPromocaoAtiva(): Promise<Promocao | null> {
  const supabase = obterSupabase();
  const { data, error } = await supabase
    .from('promocoes')
    .select(COLUNAS_PROMOCAO)
    .eq('ativa', true)
    .order('criado_em', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.warn('buscarPromocaoAtiva:', error.message);
    throw new Error(MENSAGEM_ERRO_PROMOCAO);
  }

  return data;
}
