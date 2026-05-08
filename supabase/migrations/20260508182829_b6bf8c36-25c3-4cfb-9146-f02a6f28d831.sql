
drop function if exists public.get_user_stats(uuid);

create or replace function public.get_my_stats()
returns table (
  total_sessions integer,
  active_streak integer,
  validated_reports integer
) language plpgsql stable security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  streak integer := 0;
  d date := current_date;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;
  loop
    if exists (select 1 from public.sessions where user_id = uid and started_at::date = d) then
      streak := streak + 1;
      d := d - 1;
    else
      exit;
    end if;
  end loop;
  return query
    select
      (select count(*)::int from public.sessions where user_id = uid),
      streak,
      (select count(*)::int from public.reports where user_id = uid and status = 'validated');
end;
$$;

revoke execute on function public.get_my_stats() from public, anon;
grant execute on function public.get_my_stats() to authenticated;
