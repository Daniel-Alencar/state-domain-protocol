-- =============================================================
-- SCHEMA COMPLETO — protocolo-soberano
-- Gerado a partir de 6 migrations (20260508 → 20260526)
-- Aplique este arquivo via SQL Editor no seu Supabase próprio.
-- =============================================================


-- ===============================================================
-- 1. ENUM
-- ===============================================================

CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');


-- ===============================================================
-- 2. FUNÇÕES AUXILIARES
-- (criadas antes das tabelas pois são referenciadas em triggers)
-- ===============================================================

-- Atualiza updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Verifica se um usuário possui determinado papel
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Retorna estatísticas do usuário autenticado
CREATE OR REPLACE FUNCTION public.get_my_stats()
RETURNS TABLE (
  total_sessions   integer,
  active_streak    integer,
  validated_reports integer
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid    uuid := auth.uid();
  streak integer := 0;
  d      date    := current_date;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  LOOP
    IF EXISTS (
      SELECT 1 FROM public.sessions
      WHERE user_id = uid AND started_at::date = d
    ) THEN
      streak := streak + 1;
      d := d - 1;
    ELSE
      EXIT;
    END IF;
  END LOOP;

  RETURN QUERY
    SELECT
      (SELECT count(*)::int FROM public.sessions WHERE user_id = uid),
      streak,
      (SELECT count(*)::int FROM public.reports  WHERE user_id = uid AND status = 'validated');
END;
$$;

-- Impede que o papel 'admin' seja atribuído a outro e-mail que não o autorizado
CREATE OR REPLACE FUNCTION public.enforce_admin_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_email text;
BEGIN
  IF NEW.role = 'admin'::public.app_role THEN
    SELECT email INTO target_email FROM auth.users WHERE id = NEW.user_id;
    IF target_email IS DISTINCT FROM 'glaubertgia@gmail.com' THEN
      RAISE EXCEPTION 'Apenas glaubertgia@gmail.com pode receber o papel de administrador.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Cria perfil, papel padrão e assinatura gratuita ao cadastrar novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  INSERT INTO public.subscriptions (user_id, status, plan_tier)
  VALUES (NEW.id, 'active', 'free');

  RETURN NEW;
END;
$$;


-- ===============================================================
-- 3. TABELAS
-- ===============================================================

-- ---- user_roles -----------------------------------------------
CREATE TABLE public.user_roles (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       public.app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ---- profiles -------------------------------------------------
CREATE TABLE public.profiles (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url   text,
  bio          text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ---- sessions -------------------------------------------------
CREATE TABLE public.sessions (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  archetype_id     text,
  frequency_ids    text[]      DEFAULT '{}',
  duration_seconds integer     NOT NULL DEFAULT 0,
  started_at       timestamptz NOT NULL DEFAULT now(),
  created_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_sessions_user_started ON public.sessions (user_id, started_at DESC);

-- ---- reports --------------------------------------------------
CREATE TABLE public.reports (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title        text        NOT NULL,
  body         text        NOT NULL,
  archetype_id text,
  status       text        NOT NULL DEFAULT 'pending', -- pending | validated | rejected
  validated_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- ---- subscriptions --------------------------------------------
CREATE TABLE public.subscriptions (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid        NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  status             text        NOT NULL DEFAULT 'active',  -- active | canceled | past_due
  plan_tier          text        NOT NULL DEFAULT 'free',    -- free | iniciado | soberano
  current_period_end timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;


-- ===============================================================
-- 4. TRIGGERS
-- ===============================================================

-- updated_at automático
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Garante que apenas o e-mail autorizado receba o papel de admin
CREATE TRIGGER enforce_admin_email_insert
  BEFORE INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.enforce_admin_email();

-- Cria perfil/papel/assinatura automaticamente ao registrar novo usuário
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ===============================================================
-- 5. ROW LEVEL SECURITY — POLICIES
-- ===============================================================

-- ---- user_roles -----------------------------------------------
CREATE POLICY "users read own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "admins read all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING      (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ---- profiles -------------------------------------------------
CREATE POLICY "profiles selectable by owner"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "profiles insert own"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles update own"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- ---- sessions -------------------------------------------------
CREATE POLICY "sessions select own"
  ON public.sessions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "sessions insert own"
  ON public.sessions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sessions update own"
  ON public.sessions FOR UPDATE TO authenticated
  USING      (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sessions delete own"
  ON public.sessions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- ---- reports --------------------------------------------------
CREATE POLICY "reports select own"
  ON public.reports FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "reports insert own"
  ON public.reports FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "reports update own pending"
  ON public.reports FOR UPDATE TO authenticated
  USING      (auth.uid() = user_id AND status = 'pending')
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admins read all reports"
  ON public.reports FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update reports"
  ON public.reports FOR UPDATE TO authenticated
  USING      (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ---- subscriptions --------------------------------------------
CREATE POLICY "subscription select own"
  ON public.subscriptions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Usuário só pode inserir assinatura gratuita para si mesmo
CREATE POLICY "subscriptions insert own free"
  ON public.subscriptions FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND plan_tier = 'free'
    AND status = 'active'
    AND current_period_end IS NULL
  );

-- Apenas admins podem alterar planos/status de assinatura
CREATE POLICY "admins manage subs"
  ON public.subscriptions FOR ALL TO authenticated
  USING      (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- ===============================================================
-- 6. PERMISSÕES DAS FUNÇÕES
-- ===============================================================

-- Funções de trigger: nenhum papel executa diretamente
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user()          FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.enforce_admin_email()      FROM PUBLIC, anon, authenticated;

-- Funções de usuário: somente authenticated
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

REVOKE ALL ON FUNCTION public.get_my_stats() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_my_stats() TO authenticated;


-- ===============================================================
-- 7. SEED — papel de admin para o e-mail autorizado
-- (executa apenas se o usuário já existir no banco)
-- ===============================================================

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE u.email = 'glaubertgia@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
