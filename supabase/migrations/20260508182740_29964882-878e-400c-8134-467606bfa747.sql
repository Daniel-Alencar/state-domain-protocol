
-- =============== ROLES ===============
create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users read own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);
create policy "admins read all roles" on public.user_roles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "admins manage roles" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- =============== TIMESTAMP TRIGGER ===============
create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end;
$$;

-- =============== PROFILES ===============
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles selectable by owner" on public.profiles
  for select to authenticated using (auth.uid() = user_id);
create policy "profiles insert own" on public.profiles
  for insert to authenticated with check (auth.uid() = user_id);
create policy "profiles update own" on public.profiles
  for update to authenticated using (auth.uid() = user_id);

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at_column();

-- Auto-create profile + default role on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.email));
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  insert into public.subscriptions (user_id, status, plan_tier) values (new.id, 'active', 'free');
  return new;
end;
$$;

-- =============== SESSIONS ===============
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  archetype_id text,
  frequency_ids text[] default '{}',
  duration_seconds integer not null default 0,
  started_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.sessions enable row level security;

create policy "sessions select own" on public.sessions
  for select to authenticated using (auth.uid() = user_id);
create policy "sessions insert own" on public.sessions
  for insert to authenticated with check (auth.uid() = user_id);

create index idx_sessions_user_started on public.sessions(user_id, started_at desc);

-- =============== REPORTS ===============
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  archetype_id text,
  status text not null default 'pending', -- pending | validated | rejected
  validated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.reports enable row level security;

create policy "reports select own" on public.reports
  for select to authenticated using (auth.uid() = user_id);
create policy "reports insert own" on public.reports
  for insert to authenticated with check (auth.uid() = user_id);
create policy "reports update own pending" on public.reports
  for update to authenticated
  using (auth.uid() = user_id and status = 'pending')
  with check (auth.uid() = user_id);
create policy "admins read all reports" on public.reports
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "admins update reports" on public.reports
  for update to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger reports_updated_at before update on public.reports
  for each row execute function public.update_updated_at_column();

-- =============== SUBSCRIPTIONS ===============
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  status text not null default 'active', -- active | canceled | past_due
  plan_tier text not null default 'free', -- free | iniciado | soberano
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "subscription select own" on public.subscriptions
  for select to authenticated using (auth.uid() = user_id);
create policy "admins manage subs" on public.subscriptions
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create trigger subscriptions_updated_at before update on public.subscriptions
  for each row execute function public.update_updated_at_column();

-- Trigger after profiles + subscriptions exist
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============== STATS FUNCTION ===============
create or replace function public.get_user_stats(_user_id uuid)
returns table (
  total_sessions integer,
  active_streak integer,
  validated_reports integer
) language plpgsql stable security definer set search_path = public as $$
declare
  streak integer := 0;
  d date := current_date;
begin
  loop
    if exists (select 1 from public.sessions where user_id = _user_id and started_at::date = d) then
      streak := streak + 1;
      d := d - 1;
    else
      exit;
    end if;
  end loop;

  return query
    select
      (select count(*)::int from public.sessions where user_id = _user_id),
      streak,
      (select count(*)::int from public.reports where user_id = _user_id and status = 'validated');
end;
$$;
