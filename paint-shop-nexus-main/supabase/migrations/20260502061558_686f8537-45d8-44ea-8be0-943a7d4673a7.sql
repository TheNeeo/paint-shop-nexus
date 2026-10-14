-- Revoke EXECUTE on internal SECURITY DEFINER functions from API roles.
-- They are still callable from within RLS policies / triggers because policies
-- evaluate as the function owner, and triggers run regardless of grants.

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.has_admin_or_manager_role(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;