-- Study Cards — widok rodzica. Wklej całość w Supabase: SQL Editor → New query → Run.
-- Wymaga wcześniej uruchomionego schema.sql (tabela progress). Skrypt można uruchamiać wielokrotnie.
--
-- Jak to działa:
-- • Rodzic tworzy w aplikacji kod rodziny (tabela family_codes).
-- • Dziecko wpisuje kod u siebie; funkcja join_family zapisuje powiązanie (family_links).
-- • Rodzic może CZYTAĆ postęp połączonych dzieci i zmieniać im ścieżkę nauki (set_child_level).
--   Niczego więcej nie zmienia; dzieci nadal widzą wyłącznie swój postęp.

-- Kod rodziny: jeden na rodzica.
create table if not exists public.family_codes (
  parent_id  uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  code       text not null unique,
  created_at timestamptz not null default now()
);

-- Powiązania rodzic → dziecko.
create table if not exists public.family_links (
  parent_id   uuid not null references auth.users (id) on delete cascade,
  child_id    uuid not null references auth.users (id) on delete cascade,
  child_email text,
  child_name  text,
  created_at  timestamptz not null default now(),
  primary key (parent_id, child_id)
);

alter table public.family_codes enable row level security;
alter table public.family_links enable row level security;

drop policy if exists "own family code: select" on public.family_codes;
drop policy if exists "own family code: insert" on public.family_codes;
drop policy if exists "own family code: update" on public.family_codes;
create policy "own family code: select" on public.family_codes
  for select to authenticated using ((select auth.uid()) = parent_id);
create policy "own family code: insert" on public.family_codes
  for insert to authenticated with check ((select auth.uid()) = parent_id);
create policy "own family code: update" on public.family_codes
  for update to authenticated using ((select auth.uid()) = parent_id) with check ((select auth.uid()) = parent_id);

-- Powiązanie widzi i może usunąć zarówno rodzic, jak i dziecko. Dodaje się je tylko przez join_family.
drop policy if exists "family link: select" on public.family_links;
drop policy if exists "family link: delete" on public.family_links;
create policy "family link: select" on public.family_links
  for select to authenticated using ((select auth.uid()) in (parent_id, child_id));
create policy "family link: delete" on public.family_links
  for delete to authenticated using ((select auth.uid()) in (parent_id, child_id));

-- Rodzic czyta postęp połączonych dzieci (obok reguły "own progress: select" z schema.sql).
drop policy if exists "parent reads child progress" on public.progress;
create policy "parent reads child progress" on public.progress
  for select to authenticated using (
    exists (select 1 from public.family_links f
            where f.parent_id = (select auth.uid()) and f.child_id = progress.user_id));

grant select, insert, update on public.family_codes to authenticated;
grant select, delete on public.family_links to authenticated;

-- Dziecko dołącza do rodziny kodem rodzica.
create or replace function public.join_family(p_code text, p_name text default null)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_parent uuid;
begin
  if auth.uid() is null then raise exception 'Najpierw zaloguj się w aplikacji'; end if;
  select parent_id into v_parent from public.family_codes where code = upper(trim(p_code));
  if v_parent is null then raise exception 'Nie ma takiego kodu rodziny'; end if;
  if v_parent = auth.uid() then raise exception 'To Twój własny kod rodziny'; end if;
  insert into public.family_links (parent_id, child_id, child_email, child_name)
  values (v_parent, auth.uid(), auth.jwt() ->> 'email', nullif(trim(p_name), ''))
  on conflict (parent_id, child_id) do update set child_name = excluded.child_name, child_email = excluded.child_email;
end;
$$;

-- Rodzic ustawia dziecku ścieżkę nauki (settings.level w stanie dziecka). settingsTs = teraz,
-- więc przy najbliższej synchronizacji na urządzeniu dziecka ta zmiana wygrywa.
create or replace function public.set_child_level(p_child uuid, p_level text)
returns void
language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.family_links where parent_id = auth.uid() and child_id = p_child) then
    raise exception 'To konto nie jest połączone z Twoim';
  end if;
  if p_level !~ '^[a-z0-9_]{1,20}$' then raise exception 'Nieprawidłowa ścieżka'; end if;
  update public.progress
     set state = jsonb_set(
                   jsonb_set(state, '{settings,level}', to_jsonb(p_level), true),
                   '{settingsTs}', to_jsonb((extract(epoch from now()) * 1000)::bigint), true),
         updated_at = now()
   where user_id = p_child;
  if not found then
    raise exception 'Dziecko nie ma jeszcze zapisanego postępu: niech raz zaloguje się w aplikacji';
  end if;
end;
$$;

revoke all on function public.join_family(text, text) from public, anon;
revoke all on function public.set_child_level(uuid, text) from public, anon;
grant execute on function public.join_family(text, text) to authenticated;
grant execute on function public.set_child_level(uuid, text) to authenticated;
