-- GAL — moderation, and a fix for a hole in the first schema.
--
-- Safe to run on a database that already has schema.sql, and safe to run twice.
-- If you have not run schema.sql yet, you do not need this file: it is already
-- folded into schema.sql for fresh installs.

-- ─────────────────────────────────────────────────────────────────────────────
-- FIX: a muted user could unmute themselves.
--
-- The "own profile update" policy allows updating your own row, and RLS has no
-- way to say "your own row EXCEPT this column". muted_until lives on that row,
-- so anyone muted could clear it with one request against the anon key.
--
-- Column privileges are the mechanism RLS lacks. After this, `authenticated`
-- can write exactly one column of profiles, and muting happens only through the
-- definer function below.
-- ─────────────────────────────────────────────────────────────────────────────
revoke update on public.profiles from authenticated;
grant  update (alias) on public.profiles to authenticated;

-- Same reasoning for messages: a user may delete their own row, but must never
-- write hidden_at, which is a moderator's record of a decision.
revoke update on public.messages from authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- Who moderates. A separate table, not a flag on profiles, so the policy that
-- checks it does not have to read the table it is protecting.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.moderators (
  id         uuid primary key references auth.users(id) on delete cascade,
  added_at   timestamptz not null default now(),
  note       text
);

alter table public.moderators enable row level security;

create or replace function public.is_moderator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.moderators m where m.id = auth.uid());
$$;

-- A moderator can see the roster. Nobody else can see that it exists.
drop policy if exists "moderators readable by moderators" on public.moderators;
create policy "moderators readable by moderators"
  on public.moderators for select
  to authenticated
  using (public.is_moderator());

-- ─────────────────────────────────────────────────────────────────────────────
-- The queue. Reports stay invisible to reporters — see schema.sql — so this
-- adds a read for moderators only.
-- ─────────────────────────────────────────────────────────────────────────────
drop policy if exists "reports readable by moderators" on public.reports;
create policy "reports readable by moderators"
  on public.reports for select
  to authenticated
  using (public.is_moderator());

-- Moderators need to read hidden messages to judge them; everyone else does not.
drop policy if exists "moderators read hidden messages" on public.messages;
create policy "moderators read hidden messages"
  on public.messages for select
  to authenticated
  using (public.is_moderator());

-- ─────────────────────────────────────────────────────────────────────────────
-- Moderator actions. Definer functions rather than broad UPDATE grants, so the
-- only writes possible are these two, and both check the caller first.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.mod_hide_message(p_message uuid, p_hide boolean default true)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_moderator() then
    raise exception 'not a moderator';
  end if;
  update public.messages
     set hidden_at = case when p_hide then now() else null end
   where id = p_message;
end;
$$;

create or replace function public.mod_mute(p_profile uuid, p_hours int default 24)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_moderator() then
    raise exception 'not a moderator';
  end if;
  -- p_hours = 0 lifts the mute.
  update public.profiles
     set muted_until = case when p_hours <= 0 then null
                            else now() + make_interval(hours => p_hours) end
   where id = p_profile;
end;
$$;

revoke all on function public.mod_hide_message(uuid, boolean) from public, anon;
revoke all on function public.mod_mute(uuid, int)            from public, anon;
grant execute on function public.mod_hide_message(uuid, boolean) to authenticated;
grant execute on function public.mod_mute(uuid, int)            to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- Make yourself the first moderator. Find your user id in
-- Authentication → Users, then:
--
--   insert into public.moderators (id, note) values ('YOUR-UUID', 'founder');
-- ─────────────────────────────────────────────────────────────────────────────
