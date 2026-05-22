
-- 1) subscriptions: allow user to insert own row
CREATE POLICY "subscriptions insert own"
  ON public.subscriptions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 2) sessions: allow user to delete/update own rows
CREATE POLICY "sessions delete own"
  ON public.sessions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "sessions update own"
  ON public.sessions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 3) Lock admin role to a single email
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

DROP TRIGGER IF EXISTS enforce_admin_email_insert ON public.user_roles;
CREATE TRIGGER enforce_admin_email_insert
  BEFORE INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.enforce_admin_email();

-- 4) Seed admin role for that email if user exists
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE u.email = 'glaubertgia@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
