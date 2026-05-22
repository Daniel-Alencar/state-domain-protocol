
-- Trigger-only functions: revoke EXECUTE from everyone (only the trigger context needs them)
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.enforce_admin_email() FROM PUBLIC, anon, authenticated;

-- User-facing definer functions: deny anon; allow only authenticated
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

REVOKE ALL ON FUNCTION public.get_my_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_stats() TO authenticated;
