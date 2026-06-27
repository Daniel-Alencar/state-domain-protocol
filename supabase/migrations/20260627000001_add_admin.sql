-- ===============================================================
-- Adiciona danielalencar746@gmail.com como administrador
-- e atualiza o guard para aceitar os dois e-mails autorizados
-- ===============================================================

-- 1. Atualiza a função que protege o papel de admin
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
    IF target_email NOT IN ('glaubertgia@gmail.com', 'danielalencar746@gmail.com') THEN
      RAISE EXCEPTION 'E-mail não autorizado a receber o papel de administrador.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- 2. Concede o papel admin ao novo e-mail (se o usuário já existir)
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE u.email = 'danielalencar746@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
