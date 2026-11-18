import 'react-native-url-polyfill/auto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────
// Variáveis de ambiente
// ─────────────────────────────────────────────

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const chave = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const MENSAGEM_CONFIGURACAO =
  'Variáveis do Supabase não encontradas. Confira o arquivo .env e reinicie o servidor com: npx expo start -c';
let cliente: SupabaseClient | null = null;

/** Cria o cliente somente quando um serviço precisar acessar o Supabase. */
export function obterSupabase(): SupabaseClient {
  if (!url || !chave) {
    throw new Error(MENSAGEM_CONFIGURACAO);
  }

  if (!cliente) {
    cliente = createClient(url, chave, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return cliente;
}
