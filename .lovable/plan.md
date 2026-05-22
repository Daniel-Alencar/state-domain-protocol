## Diagnóstico

O fluxo de IA + 3 arquétipos pré-aprovados + tocar em loop funciona para a primeira gravação. Para a segunda gravação o botão "Analisar com IA e salvar" parece morto. Três causas prováveis, todas reais no código atual de `src/routes/determinacoes.tsx` + `src/lib/determinations.ts`:

1. **Quota do localStorage estoura na 2ª gravação.** Hoje cada gravação é salva como `audioDataUrl` (base64) dentro de `localStorage` na chave `ps:determinations:<userId>`. Uma gravação de 20–40s em base64 já passa de 500 KB–1 MB. localStorage tem ~5 MB no total no navegador. Na 2ª ou 3ª gravação, `localStorage.setItem` lança `QuotaExceededError` silenciosamente dentro de `addDetermination → write`. O usuário vê "o botão não fez nada" porque a análise até roda, mas o save quebra sem feedback.
2. **Estado do gravador não é totalmente resetado entre gravações.** Quando o loop anterior ainda está tocando e o usuário clica em "Iniciar gravação", o `<audio>` em loop continua reproduzindo as frequências e a voz antiga — o `SpeechRecognition` pode capturar áudio sujo, ou `getUserMedia` em alguns navegadores entra em conflito. Além disso, `mediaRef.current` e `recogRef.current` da gravação anterior não são limpos antes de iniciar a nova.
3. **Sem feedback visível quando o botão está desabilitado.** O botão fica desabilitado se `!pendingBlob`, `analyzing` ou `transcript.trim().length < 3`. Hoje o usuário não sabe qual condição bloqueou — parece "o botão não funciona".

A regra de negócio é clara: **não pode haver limite de gravações**, cada uma com sua análise independente, e qualquer uma deve poder ser tocada em loop com suas 3 frequências pré-aprovadas.

## Correção

### 1. Mover áudio das gravações do localStorage para IndexedDB
- Criar `src/lib/determinations-audio.ts` com helpers `putAudio(id, blob)`, `getAudioUrl(id)`, `deleteAudio(id)` usando IndexedDB (`indexedDB.open("ps-determinations", 1)` com object store `audio`). IndexedDB tem cota de centenas de MB por origem — efetivamente ilimitado para esse uso.
- Em `src/lib/determinations.ts`:
  - Mudar `Determination.audioDataUrl` para opcional e adicionar `hasAudio: boolean`. Não gravar mais base64 no localStorage.
  - `addDetermination` recebe `audioBlob: Blob`, gera o id, chama `putAudio(id, blob)` e salva apenas metadados (título, transcript, suggestedArchetypes, rationale, preset, hasAudio) no localStorage.
  - `setActiveDetermination(id)`: ao tocar, resolver a URL via `URL.createObjectURL(await getAudioBlob(id))` e revogar o objectURL no `pause`.
  - `removeDetermination` também chama `deleteAudio(id)`.
- Migração: gravações antigas que ainda têm `audioDataUrl` continuam funcionando (fallback). Novas usam IndexedDB.

Resultado: usuário pode salvar dezenas de gravações sem estourar nada.

### 2. Reset robusto entre gravações em `src/routes/determinacoes.tsx`
- Em `startRec()`:
  - Se houver loop ativo (`activeId`), parar o loop e as frequências antes de pedir o microfone (chamar `stopPlay()` interno).
  - Limpar `mediaRef.current = null` e `recogRef.current = null` antes de instanciar novos.
  - `chunksRef.current = []` (já existe), `setPendingBlob(null)`, `setTranscript("")`, `setAnalyzing(false)`.
- Em `stopRec()`: garantir que `mediaRef.current = null` ao final, e que `recording` volta para `false` mesmo se `stop()` lançar.
- `mr.onstop` continua criando o Blob e setando `pendingBlob`.

### 3. Feedback claro no botão "Analisar com IA e salvar"
- Mudar o botão para **sempre clicável** (remover `disabled`), e dentro de `analyzeAndSave()` validar com toast explícito:
  - sem `pendingBlob` → "Grave o áudio primeiro." (já existe)
  - transcript curto → "Digite o que foi falado abaixo — a IA precisa do texto para sugerir arquétipos."
  - `analyzing` já em andamento → "Análise em andamento, aguarde."
- Adicionar `console.log` discreto nos pontos de erro para que, se voltar a falhar, o motivo apareça na aba de logs.
- Envolver `addDetermination` em try/catch e mostrar toast se falhar (em vez de morrer em silêncio).

### 4. Tocar em loop continua igual
- A função `play()` já está correta: para tudo, limpa o estado global, dispara as frequências do `preset` do card e o áudio da gravação em paralelo. Nenhuma mudança aqui.
- A única diferença é que `setActiveDetermination(id)` em `determinations.ts` agora resolve o blob via IndexedDB e cria um objectURL fresco a cada play.

## Arquivos a editar

- `src/lib/determinations-audio.ts` — novo helper IndexedDB.
- `src/lib/determinations.ts` — armazenar só metadados no localStorage, áudio no IndexedDB, suportar gravações legadas com `audioDataUrl`.
- `src/routes/determinacoes.tsx` — reset robusto em `startRec`/`stopRec`, botão "Analisar" sempre clicável com validação por toast, parar loop antes de gravar de novo, try/catch em volta do save.

Nenhuma mudança de schema, RLS, server function ou no engine binaural.

## Resultado esperado

- Posso gravar 1, 5, 20 determinações. Cada uma é analisada pela IA, recebe sua sugestão de 3 arquétipos pré-aprovados e fica salva na lista.
- Clicar em "Tocar em loop" em qualquer card dispara a voz dessa gravação **+** as 3 frequências do preset daquele card específico.
- O botão "Analisar com IA e salvar" nunca mais "trava" sem explicação — se algo faltar, sai uma toast dizendo o quê.
- Iniciar uma nova gravação para automaticamente o loop anterior, evitando contaminação do microfone.
