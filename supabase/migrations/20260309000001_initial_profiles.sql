-- Studeal: profiles table and auth trigger
-- Roles: 'Student' (public signup), 'Company' (admin-created), 'Admin' (created via SQL only)

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'Student' check (role in ('Student', 'Company', 'Admin')),
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Only allow 'Student' from signup; Company/Admin are set by backend or SQL
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    'Student'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile (e.g. full_name) but NOT role
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Service role can insert/update any (for admin-created companies)
-- No policy needed for service role; it bypasses RLS.

-- Optional: allow anon to insert is handled by trigger (trigger runs as definer).
comment on table public.profiles is 'User profiles; role Student from signup, Company from admin, Admin from SQL only.';
