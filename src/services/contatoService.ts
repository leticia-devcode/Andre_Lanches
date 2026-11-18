import { obterSupabase } from '../lib/supabase';
import type { DadosContato } from '../domain/tipos';

// ─────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────

const MENSAGEM_ERRO_CONTATO =
  'Não foi possível enviar sua mensagem. Verifique sua internet e tente de novo.';

// ─────────────────────────────────────────────
// Funções
// ─────────────────────────────────────────────

/**
 * Envia a mensagem de contato para a tabela `contatos`.
 *
 * Somente `insert`, sem `.select()`: a política de segurança (RLS) não
 * permite ler contatos. Os textos são gravados sem espaços nas pontas.
 *
 * @throws Error com mensagem amigável se o envio falhar.
 */
export async function enviarContato({
  nome,
  contato,
  mensagem,
}: DadosContato): Promise<void> {
  const supabase = obterSupabase();
  const { error } = await supabase.from('contatos').insert({
    nome: nome.trim(),
    contato: contato.trim(),
    mensagem: mensagem.trim(),
  });

  if (error) {
    console.warn('enviarContato:', error.message);
    throw new Error(MENSAGEM_ERRO_CONTATO);
  }
}
