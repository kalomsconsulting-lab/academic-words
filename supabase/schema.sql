-- Academic Words — tabela postępu. Wklej całość w Supabase: SQL Editor → New query → Run.
-- Jeden wiersz na użytkownika; cały stan aplikacji jako JSON.

create table if not exists public.progress (
  user_id    uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  state      jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

-- Każdy zalogowany użytkownik widzi i zmienia wyłącznie swój wiersz.
drop policy if exists "own progress: select" on public.progress;
drop policy if exists "own progress: insert" on public.progress;
drop policy if exists "own progress: update" on public.progress;

create policy "own progress: select" on public.progress
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "own progress: insert" on public.progress
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "own progress: update" on public.progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update on public.progress to authenticated;
