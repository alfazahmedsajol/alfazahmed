revoke execute on function public.claim_owner_admin() from public, anon;
revoke execute on function public.is_admin() from public, anon;
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.claim_owner_admin() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;