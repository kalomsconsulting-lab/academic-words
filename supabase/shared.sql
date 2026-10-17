-- Study Cards — wspólne materiały („Dla wszystkich”). Wklej całość w Supabase: SQL Editor → New query → Run.
-- Niezależne od schema.sql i family.sql. Skrypt można uruchamiać wielokrotnie.
--
-- Jak to działa:
-- • Przy dodawaniu materiałów użytkownik wybiera „Tylko dla mnie” (zapis w jego wierszu progress)
--   albo „Dla wszystkich” (zapis tutaj, jeden wiersz na kartę, id "s-…").
-- • Czytać może każdy, także bez logowania. Dodawać — zalogowany. Usuwać — tylko autor.
-- • Edycji nie ma: poprawka = usunięcie i ponowne dodanie.

create table if not exists public.shared_items (
  id          text primary key check (id like 's-%'),
  item        jsonb not null,
  source      text not null,
  author_id   uuid not null default auth.uid() references auth.users (id) on delete cascade,
  author_name text,
  created_at  timestamptz not null default now()
);

alter table public.shared_items enable row level security;

drop policy if exists "shared items: read" on public.shared_items;
drop policy if exists "shared items: insert own" on public.shared_items;
drop policy if exists "shared items: delete own" on public.shared_items;

create policy "shared items: read" on public.shared_items
  for select to anon, authenticated using (true);

create policy "shared items: insert own" on public.shared_items
  for insert to authenticated with check ((select auth.uid()) = author_id);

create policy "shared items: delete own" on public.shared_items
  for delete to authenticated using ((select auth.uid()) = author_id);

grant select on public.shared_items to anon, authenticated;
grant insert, delete on public.shared_items to authenticated;
