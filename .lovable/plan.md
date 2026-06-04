# Plano de revisão

## 1. Diagnóstico atual da autenticação

**Como está hoje** (`src/routes/login.tsx` + `src/lib/auth-context.tsx`):
- Signup chama `supabase.auth.signUp` com `emailRedirectTo: /app` — funcional, mas depende da configuração do Auth do backend.
- Login usa `signInWithPassword`.
- Reset de senha usa `resetPasswordForEmail` apontando para `/reset-password` (rota existe).
- Trigger `handle_new_user` insere em `profiles`, `user_roles` e `subscriptions` no signup.

**Causas prováveis dos sintomas relatados:**
1. **"Não aceita criar conta"** — provavelmente o Auth do projeto está com `auto_confirm_email = false` (correto para fluxo com confirmação) **mas sem template de email configurado** ou com SMTP padrão limitado, então o email nunca chega → usuário não confirma → login falha com "Email not confirmed".
2. **"Login falha em contas já criadas"** — mesmas contas nunca foram confirmadas; Supabase bloqueia signIn de email não confirmado.
3. Mensagens de erro genéricas ("Falha de autenticação") escondem o motivo real.

## 2. Correções de autenticação (sem mexer em outras partes)

1. **Garantir fluxo com confirmação de email ativo**: aplicar `configure_auth` com `auto_confirm_email: false`, `disable_signup: false`, `password_hibp_enabled: true`.
2. **Provisionar emails da Lovable** (domínio + templates de auth) via `scaffold_auth_email_templates` — gera templates branded para signup, recovery, magic-link etc. Se ainda não houver domínio, abrir o diálogo de setup de email.
3. **Melhorar mensagens de erro no `login.tsx`** — detectar `email_not_confirmed`, `invalid_credentials`, `user_already_exists` e mostrar texto claro em PT, com botão "Reenviar email de confirmação" (`supabase.auth.resend({ type: 'signup', email })`).
4. **Tela pós-signup**: em vez de só um toast, mostrar estado "Confirme seu email — enviamos um link para X" com botão de reenviar.
5. **Adicionar Google OAuth** já existe via `lovable.auth` — garantir provider Google habilitado (`configure_social_auth ["google"]`) para o botão funcionar sem `Unsupported provider`.
6. Nenhuma alteração em tabelas, triggers, RLS ou outras rotas.

## 3. Tipografia — landing e telas internas

Sem mexer em layout/funcionalidade, apenas classes Tailwind e tokens em `src/styles.css`:

- **`src/routes/index.tsx`** (landing):
  - "CLAREZA · DIREÇÃO · DOMÍNIO" → subir de `text-xs md:text-sm` para `text-lg md:text-2xl`, peso `font-medium`, cor `text-foreground` (mais claro).
  - Parágrafo "Uma infraestrutura de foco…" → `text-base md:text-xl`, cor `text-foreground/85` em vez de `text-muted-foreground`.
  - Botões/links secundários: subir de `text-[10px]` para `text-xs md:text-sm` e cor `text-foreground/80`.
  - Pilares (01–05): label de `text-sm` para `text-base md:text-lg`, código `text-[10px]` → `text-xs`.

- **`src/routes/app.tsx`** (após "Iniciar calibração"): mesmo tratamento — subir tamanhos base e usar `text-foreground` / `text-foreground/85` em vez de `text-muted-foreground` em textos informativos.

- **Globais**: criar utilitário `.text-tracked` continua, mas aumentar opacidade padrão de `--muted-foreground` levemente no tema dark para melhor contraste (apenas o token, sem trocar cores semânticas).

## 4. Navegação — fixar 7 abas no mobile (`src/components/AppShell.tsx`)

Hoje a barra inferior usa `justify-around` + `px-2` com 7 itens de `text-[8px]` — em telas estreitas (<360px) o 7º ("Performance") é cortado.

Mudanças:
- Trocar layout para `grid grid-cols-7 gap-0` ocupando 100% da largura, com `px-1 py-2`.
- Cada item: `flex flex-col items-center` com `text-[10px]` (label) e código `text-[9px]`.
- Labels mais curtos quando necessário só no mobile via classe (ex.: "Performance" → manter, mas reduzir padding lateral).
- Aumentar contraste: ativo `text-signal`, inativo `text-foreground/70` (em vez de `text-muted-foreground`).
- Header desktop: subir `text-[10px]` → `text-xs` e cor inativa `text-foreground/70`.

## 5. Página Determinações — visibilidade e cards (`src/routes/determinacoes.tsx`)

Sem tocar em lógica de gravação/áudio/IA. Apenas estrutura visual:

- **Cabeçalho da seção de gravação**: título "Iniciar gravação" e descrição → `text-base md:text-lg`, cor `text-foreground`.
- **Label do Volume e botão "Iniciar gravação"**: aumentar para `text-sm`, botão com borda mais clara.
- **Lista "Suas determinações"**:
  - Cada item dentro de um `<article>` com classe `rounded-xl border border-border/70 bg-card/60 p-4 md:p-5 shadow-sm` para separação nítida.
  - Espaçamento entre cards: `space-y-4`.
  - Linha de topo do card: título da determinação `text-base md:text-lg font-medium text-foreground`; botão **Excluir** alinhado à direita, com `text-foreground/80 hover:text-destructive` e ícone visível (não apenas texto sombreado).
  - Texto analisado pela IA dentro de bloco `bg-muted/30 rounded-md p-3 text-sm text-foreground/90`.
  - Linha de ações (play loop, play gravação): botões com `border border-border/70`, label `text-xs` e ícone maior.
  - Sugestão da IA e pré-aprovados em sub-blocos com `border-t border-border/50 pt-3 mt-3` e título `text-xs uppercase tracking-wider text-foreground/70`.
- Resultado: cada determinação fica visualmente isolada, com hierarquia clara entre título, transcrição, ações e sugestões — preservando a estética minimal/dark já existente.

## 6. O que NÃO será alterado

- Lógica de gravação, WebAudio, ganho de voz, engine binaural.
- Esquema de banco, RLS, triggers, funções.
- Rotas existentes além das citadas.
- Componentes de outras páginas (Frequências, Arquétipos, Relatos, Rede, Performance) — só herdarão melhoria de contraste via tokens globais e header.

## Detalhes técnicos (resumo de arquivos tocados)

```
src/routes/login.tsx              → mensagens claras + reenviar confirmação + estado pós-signup
src/routes/index.tsx              → tamanhos/cores de texto
src/routes/app.tsx                → tamanhos/cores de texto
src/components/AppShell.tsx       → grid-cols-7 mobile + tamanhos/contraste
src/routes/determinacoes.tsx      → cards delimitados + tipografia
src/styles.css                    → leve ajuste de --muted-foreground (contraste)
+ configure_auth / configure_social_auth / scaffold_auth_email_templates  (backend)
```
