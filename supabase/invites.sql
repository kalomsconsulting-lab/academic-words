-- Study Cards — konta tylko na zaproszenie. Wklej całość w Supabase: SQL Editor → New query → Run.
-- Niezależne od pozostałych plików. Skrypt można uruchamiać wielokrotnie.
--
-- Jak to działa:
-- • Administrator (tabela app_admins) dodaje w aplikacji adres e-mail do listy zaproszeń (invites)
--   i wysyła zaproszenie (e-mail / komunikator) z linkiem do aplikacji.
-- • Hook „Before User Created” pozwala założyć konto tylko adresom z listy zaproszeń.
--   Obce adresy dostają komunikat „Ten adres nie ma zaproszenia…”, konto się nie tworzy.
-- • Istniejące konta logują się dalej bez zmian.
--
-- PO URUCHOMIENIU (jednorazowo):
-- 1. Authentication → Auth Hooks → Before User Created → Postgres → funkcja public.hook_before_user_created → Save.
-- 2. Authentication → Sign In / Providers: „Allow new users to sign up” musi być WŁĄCZONE
--    (o tym, kto może założyć konto, decyduje teraz hook).
-- 3. Nadaj sobie rolę administratora — odkomentuj i uzupełnij ostatnią linię tego pliku
--    (adres, którym logujesz się w aplikacji), potem uruchom ją osobno.

-- Administratorzy aplikacji (bez polityk RLS: tabela niedostępna z aplikacji, sprawdza ją is_admin()).
create table if not exists public.app_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- Lista zaproszonych adresów.
create table if not exists public.invites (
  email      text primary key check (email = lower(email) and email like '%@%'),
  name       text,
  invited_by uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.app_admins enable row level security;
alter table public.invites enable row level security;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from public.app_admins where user_id = (select auth.uid()));
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "invites: admin select" on public.invites;
drop policy if exists "invites: admin insert" on public.invites;
drop policy if exists "invites: admin delete" on public.invites;

create policy "invites: admin select" on public.invites
  for select to authenticated using (public.is_admin());
create policy "invites: admin insert" on public.invites
  for insert to authenticated with check (public.is_admin());
create policy "invites: admin delete" on public.invites
  for delete to authenticated using (public.is_admin());

grant select, insert, delete on public.invites to authenticated;

-- Lista zaproszeń ze statusem (czy konto już istnieje) — tylko dla administratora.
create or replace function public.list_invites()
returns table (email text, name text, invited_at timestamptz, joined_at timestamptz, last_sign_in_at timestamptz)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Brak uprawnień administratora' using errcode = '42501';
  end if;
  return query
    select i.email, i.name, i.created_at, u.created_at, u.last_sign_in_at
    from public.invites i
    left join auth.users u on lower(u.email) = i.email
    order by i.created_at desc;
end;
$$;

revoke execute on function public.list_invites() from public, anon;
grant execute on function public.list_invites() to authenticated;

-- Hook „Before User Created”: konto tylko dla zaproszonych adresów.
create or replace function public.hook_before_user_created(event jsonb) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  v_email text := lower(event -> 'user' ->> 'email');
begin
  if v_email is not null and exists (select 1 from public.invites where email = v_email) then
    return '{}'::jsonb;
  end if;
  return jsonb_build_object('error', jsonb_build_object(
    'http_code', 403,
    'message', 'Ten adres nie ma zaproszenia do Study Cards. Poproś administratora o zaproszenie.'));
end;
$$;

revoke execute on function public.hook_before_user_created(jsonb) from public, anon, authenticated;
grant execute on function public.hook_before_user_created(jsonb) to supabase_auth_admin;

-- 3. Administrator (uzupełnij adres i uruchom tę linię osobno):
-- insert into public.app_admins (user_id) select id from auth.users where lower(email) = 'twoj@adres.pl' on conflict do nothing;
