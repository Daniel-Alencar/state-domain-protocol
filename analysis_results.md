# Auditoria — Protocolo Soberano (sovereign-core)

## O que já está implementado ✅

### Estrutura & Infraestrutura
| Item | Status | Detalhes |
|------|--------|---------|
| TanStack Start (SSR) | ✅ | Framework fullstack com SSR via Vite |
| Supabase Auth | ✅ | Login e-mail/senha, Google OAuth, reset de senha |
| Supabase Database | ✅ | 5 tabelas: profiles, sessions, reports, subscriptions, user_roles |
| RLS (Row Level Security) | ✅ | Policies em todas as tabelas, admin lock por e-mail |
| Docker/Easypanel deploy | ✅ | Multi-stage Dockerfile com `docker-entry.mjs` |
| Route protection | ✅ | AppShell redireciona para `/login` se não autenticado |

### Páginas (15 rotas)
| Rota | Tipo | Status |
|------|------|--------|
| `/` (Landing) | Pública | ✅ Completa — hero com QuantumField animado |
| `/login` | Pública | ✅ Login/Signup/Forgot password |
| `/reset-password` | Pública | ✅ Redefinição de senha |
| `/a-ciencia-do-protocolo` | Pública | ✅ Página informativa completa |
| `/como-utilizar` | Pública | ✅ Guia de 5 passos |
| `/treinamento-maestria-frequencial` | Pública | ✅ Página de venda do treinamento |
| `/app` (Centro) | Protegida | ✅ Dashboard principal com estados ativos |
| `/frequencias` | Protegida | ✅ Player binaural funcional com sobreposição |
| `/arquetipos` | Protegida | ✅ 18 arquétipos (clássicos + ancestrais) |
| `/determinacoes` | Protegida | ✅ Gravação de voz + análise IA + loop |
| `/relatos` | Protegida | ✅ CRUD de relatos com validação |
| `/networking` | Protegida | ⚠️ Dados mockados (3 posts hardcoded) |
| `/performance` | Protegida | ⚠️ Gráfico de constância com dados hardcoded |
| `/manual` | Protegida | ✅ Manual operacional completo |

### Funcionalidades Core
| Feature | Status | Detalhes |
|---------|--------|---------|
| Engine binaural (Web Audio API) | ✅ | Tons L/R com batida, sobreposição multi-freq |
| Gravação de voz | ✅ | MediaRecorder API + wake lock |
| Loop de determinação + frequências | ✅ | Voz em loop + até 3 arquétipos binaurais |
| Análise IA (server function) | ✅ | Gemini 2.5 Flash via Lovable gateway |
| Controle de volume voz/frequência | ✅ | Sliders independentes |
| Sistema de patentes (levels) | ✅ | 6 níveis com progressão calculada |
| Entitlements (planos) | ✅ | free / iniciado / soberano |
| Persistência local | ✅ | localStorage para arquétipos/stats/determinações |
| Persistência remota | ✅ | Supabase: sessions, reports, subscriptions |

---

## O que falta para estar completo 🔴🟡🟢

### 🔴 Crítico — Sem isso, a experiência está quebrada

#### 1. SEO / Meta tags genéricas
O `__root.tsx` ainda tem metas com "Lovable App" como título e autor. Precisa ser atualizado:
```
- title: "Lovable App" → "Protocolo Soberano de Harmonia Quântica"
- author: "Lovable" → "Instituto Venditti"
- og:image → imagem real do site (não URL da Lovable R2)
- twitter:site → conta real
```

#### 2. Página `/networking` — 100% mock
Os 3 posts são hardcoded. Não há:
- Tabela no banco para posts de networking
- CRUD real (criar, validar, reconhecer posts)
- Contagem de "Reconhecimento de Sinal" funcional
- "Validação Estratégica" funcional

#### 3. Página `/performance` — Gráfico mockado
- `DAYS = [3, 5, 4, 7, 6, 8, 9, 6, 7, 9, 8, 9, 10, 8]` é hardcoded
- Stats reais do Supabase já existem (`useRemoteStats`), mas o gráfico de barras deveria vir de `sessions` agrupados por dia
- "+18%" é fixo, deveria ser calculado

#### 4. Dashboard `/app` — Stats mockadas
As 4 métricas no grid inferior são hardcoded:
```
Constância: "14d" / "+3"
Patente: "Eixo Ativo" / "42%"
Foco médio: "2h 18m" / "+11%"
Reconhecimentos: "07" / "semana"
```
Deviam usar os dados reais de `useRemoteStats()`.

#### 5. Treinamento — Link CTA morto
`/treinamento-maestria-frequencial` tem um botão "Acessar Treinamento Oficial" que aponta para `href="#"`. Precisa do link real do curso/checkout.

#### 6. Determinações — Armazenamento de áudio frágil
As gravações de áudio das determinações são salvas no **localStorage** (como data URLs ou IndexedDB). Isso significa:
- Limpar cache do browser = perder todas as gravações
- Não sincroniza entre dispositivos
- Não há backup no Supabase Storage

#### 7. Planos/Pagamento — Sem checkout
O sistema de entitlements (free/iniciado/soberano) existe, mas:
- Não há integração com gateway de pagamento (Stripe, etc.)
- Não há página de planos/pricing
- Upgrade de plano é apenas via admin no Supabase
- Não há limitação real de features por tier (o `useEntitlement().has()` existe mas não é usado para gating)

---

### 🟡 Importante — Funciona sem, mas fica incompleto

#### 8. Painel Administrativo
- Admin roles existem no banco
- Admins podem validar/rejeitar relatos via SQL, mas não há UI
- Falta: dashboard admin com lista de relatos pendentes, gestão de usuários, gestão de assinaturas

#### 9. PWA / Instalação
- Não há `manifest.json` para "Adicionar à tela inicial"
- Não há Service Worker para offline
- Para um app de uso diário com áudio em loop, PWA seria essencial

#### 10. Responsividade da navegação
- O navbar mobile (bottom bar) está implementado ✅
- Mas com 7 itens em tela pequena, ficam apertados — poderia colapsar em "mais"

#### 11. E-mail confirmation flow
- O signup envia e-mail de confirmação, mas não há página de "verifique seu e-mail" após cadastro
- O toast "Confira seu e-mail para confirmar acesso" pode ser insuficiente

#### 12. Google Analytics / Tracking
- Não há nenhum analytics configurado
- Para um produto, métricas de uso são essenciais

---

### 🟢 Nice-to-have — Melhorias de polimento

#### 13. Favicon personalizado
- `public/favicon.ico` existe (52KB), mas sem verificação se é o ícone correto do Protocolo Soberano

#### 14. Open Graph image real
- A OG image aponta para uma URL da Lovable R2 — precisa de imagem branded

#### 15. Textos em inglês residuais
- "This page didn't load", "Page not found", "Go home" no `__root.tsx` estão em inglês
- O app é 100% em português no resto

#### 16. Loading states
- `useRemoteStats` e `useEntitlement` retornam `loading`, mas nem sempre são usados para exibir skeleton/loader
