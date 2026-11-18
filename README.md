# André Lanches

Aplicativo de pedidos para Android e iOS feito com React Native, Expo SDK 58 e
TypeScript. O cardápio, as promoções, o registro de pedidos e as mensagens de
contato usam Supabase. O cliente pode revisar o pedido e enviá-lo pelo WhatsApp.

## Tecnologias

- React Native, Expo SDK 58 e TypeScript
- Supabase (Postgres, Row Level Security e funções RPC)
- `@expo/vector-icons`
- `react-native-safe-area-context`

## Requisitos

- Node.js 22.18 ou mais recente
- npm
- Expo Go atualizado para o SDK do projeto (para testar em dispositivo)
- Projeto Supabase (para carregar o cardápio e registrar pedidos)

## Configuração

1. Instale as dependências:

   ```sh
   npm install
   ```

2. No SQL Editor do seu projeto Supabase, execute [`supabase/schema.sql`](./supabase/schema.sql).
   Isso cria as tabelas, políticas RLS, a função `criar_pedido` e os dados iniciais.

3. Crie o arquivo local `.env` a partir do modelo:

   ```powershell
   Copy-Item .env.example .env
   ```

4. Preencha `EXPO_PUBLIC_SUPABASE_URL` e
   `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` no `.env` com os valores do seu
   projeto Supabase. Não use a chave `service_role` no aplicativo.

5. Inicie o Expo e leia o QR Code com o Expo Go:

   ```sh
   npx expo start -c
   ```

Sem as variáveis do Supabase, o aplicativo ainda abre, mas o cardápio e as
operações remotas exibem um erro de configuração/conexão.

## Verificações

```sh
npx tsc --noEmit
npm test
npx expo install --check
npx expo export --platform android
npx expo export --platform ios
```

`npm test` executa os testes do banco com PGlite e os testes das regras do app.

## Estrutura

- `src/components` e `src/screens`: interface e telas
- `src/context`: tema e alertas
- `src/domain`: regras de carrinho, pagamento, pedido, validação e navegação
- `src/hooks` e `src/services`: consultas e operações do Supabase
- `src/theme`: cores e tokens visuais
- `supabase`: schema do banco e testes
- `assets`: ícones e imagens estáticas do aplicativo

O aplicativo inicia por `index.ts`, que registra `App.tsx`. A pasta `app/`
contém somente arquivos de rota legado e não é o ponto de entrada deste projeto.

## Segurança

O app usa somente a chave Supabase publishable/anon, que pode estar no cliente.
O acesso ao banco deve continuar protegido pelas políticas RLS. A função
`criar_pedido` recalcula os preços no banco; pedidos não são gravados diretamente
nas tabelas pelo app. Nunca adicione chaves `service_role`, arquivos `.env` ou
outros segredos ao repositório.

O arquivo `.env` é ignorado pelo Git; `.env.example` contém apenas nomes e
valores de exemplo para configuração local.
