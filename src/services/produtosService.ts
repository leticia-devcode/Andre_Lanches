import { obterSupabase } from '../lib/supabase';
import type { Produto } from '../domain/tipos';

// ─────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────

/** Colunas lidas da tabela `produtos`. */
const COLUNAS_PRODUTO = 'id, slug, nome, descricao, preco, secao, opcoes, ordem';

const MENSAGEM_ERRO_CARDAPIO =
  'Não foi possível carregar o cardápio. Verifique sua internet e tente de novo.';

// ─────────────────────────────────────────────
// Funções
// ─────────────────────────────────────────────

/**
 * Lista os produtos ativos do cardápio, na ordem de exibição.
 *
 * O RLS já esconde os produtos inativos; o filtro `.eq('ativo', true)`
 * deixa isso explícito.
 *
 * @throws Error com mensagem amigável se a consulta falhar.
 */
export async function listarProdutos(): Promise<Produto[]> {
  const supabase = obterSupabase();
  const { data, error } = await supabase
    .from('produtos')
    .select(COLUNAS_PRODUTO)
    .eq('ativo', true)
    .order('ordem', { ascending: true });

  if (error) {
    console.warn('listarProdutos:', error.message);
    throw new Error(MENSAGEM_ERRO_CARDAPIO);
  }

  return data ?? [];
}
