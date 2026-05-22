## Diagnóstico

Os dois bugs têm a mesma raiz: a lista global de "arquétipos ativos" (limite de 3) está sendo consultada antes de iniciar qualquer som, e quando ela já está cheia (ou desatualizada), o código bloqueia silenciosamente o `start()` da frequência.

### Bug 1 — Tocar em loop não dispara as frequências

Em `src/routes/determinacoes.tsx`, dentro de `play()`:

- Antes de cada `start()`, o código verifica `activeArchetypes.length + activated >= MAX`.
- `activeArchetypes` é um valor de hook (`useActiveArchetypes`) que pode estar com 3 IDs herdados de um loop anterior (ou de uma sessão na aba Arquétipos).
- Resultado: o loop da voz começa, mas Tubarão / Arqueiro / Templário são contados como "bloqueados" e nunca tocam.

### Bug 2 — Botão "Ativar / Tocar apenas frequência" na aba Arquétipos não emite som

Em `src/routes/arquetipos.tsx`, `activate()` chama `addActiveArchetype()` antes de chamar `start()`. Se já houver 3 arquétipos no estado global (deixados ativos por uma execução anterior da aba Determinações), `addActiveArchetype` retorna `false` e o `start()` nunca é chamado. A toast de erro pode até passar despercebida.

Também há um segundo detalhe: o botão usa `isRunning(selected.freqId)` sem se inscrever no engine, então o rótulo não atualiza — mas o som em si deve sair. A causa real do "não sai som" é o teto de 3 cheio.

## Correção

### 1. `src/routes/determinacoes.tsx` — função `play()`
- Ao tocar uma determinação, primeiro **parar tudo o que estava tocando** (`stopAll()` no engine e `clearAllActiveArchetypes()` no estado).
- Em seguida, montar o mix dessa gravação a partir do `preset` visível no card (no máximo 3).
- Para cada ID válido em `getArchetype(id)`, chamar `start({ freqId, carrier, beat, minutes: 25 })` **sincronicamente dentro do handler de clique** (sem `await` antes), para garantir o gesto do usuário no iOS/Safari.
- Registrar os IDs no estado ativo com `addActiveArchetype` apenas para refletir a UI; ignorar o retorno (já limpamos o estado).
- Disparar `setActiveDetermination(d.id)` por último, em paralelo às frequências.
- Toast mostra exatamente quais arquétipos entraram com a voz.

### 2. `src/routes/determinacoes.tsx` — função `stopPlay()`
- Parar a gravação (`setActiveDetermination(null)`).
- Parar todas as frequências do mix (`stopAll()`).
- Limpar o estado global (`clearAllActiveArchetypes()`) para liberar o teto para o próximo play.

### 3. `src/routes/arquetipos.tsx` — funções `activate()` e `toggleAudio()`
- Em `activate()`: chamar `start()` primeiro (efeito sonoro garantido dentro do gesto). Depois tentar `addActiveArchetype`; se falhar por causa do teto, mostrar uma toast clara dizendo "Limite de 3 atingido — pare uma frequência ativa ou pare o loop da determinação" e parar o som que acabou de iniciar para não ficar órfão.
- Em `toggleAudio()`: já funciona sem passar pelo teto — manter como está, apenas garantir que `start()` rode síncrono no clique.
- Inscrever o componente no `subscribe()` do engine para que o rótulo `audioOn` reflita o estado real em tempo real.

### 4. Pequeno extra de robustez
- No `binaural-engine.ts`, garantir que `ensureCtx()` chame `ctx.resume()` síncrono no primeiro `start()` (já está, mas confirmar). Sem mudança funcional se já estiver correto.

## Arquivos a editar

- `src/routes/determinacoes.tsx` — funções `play` e `stopPlay`.
- `src/routes/arquetipos.tsx` — funções `activate`, `toggleAudio` e assinar o engine para atualizar o rótulo.

Nenhuma mudança em schema, RLS, server functions ou no engine binaural em si.

## Resultado esperado

- Clicar em "Tocar em loop" numa gravação com Tubarão, Arqueiro e Templário pré-aprovados → a voz entra em loop **e** as três frequências começam juntas no fone.
- Na aba Arquétipos, clicar em "Ativar" ou "Tocar apenas frequência" → o som sai imediatamente no fone, mesmo que tenha havido um loop anterior na aba Determinações.
- "Parar loop" e "Desligar arquétipo" deixam o sistema limpo para a próxima ativação.