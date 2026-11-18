import { obterSupabase } from '../lib/supabase';
import type { PayloadPedido } from '../domain/tipos';

// ─────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────

const MENSAGEM_ERRO_PEDIDO = 'Não foi possível registrar o pedido no sistema.';

// ─────────────────────────────────────────────
// Funções
// ─────────────────────────────────────────────

/**
 * Grava o pedido pela função `criar_pedido` e devolve o número (#1001, #1002...).
 *
 * O payload não leva preços: o banco recalcula tudo.
 *
 * @throws Error com mensagem amigável se a gravação falhar.
 */
export async function criarPedido(payload: PayloadPedido): Promise<number> {
  const supabase = obterSupabase();
  const { data, error } = await supabase.rpc('criar_pedido', { p: payload });

  if (error) {
    console.warn('criarPedido:', error.message);
    throw new Error(MENSAGEM_ERRO_PEDIDO);
  }

  return data;
}
