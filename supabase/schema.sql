-- GAL — chat schema
--
-- Run this once in the Supabase SQL editor (Dashboard → SQL Editor → New query).
--
-- Everything here is scoped to the OPT-IN half of the app. Mood, goals, streaks
-- and reading stay on the device and never reach this database. Only a woman who
-- deliberately signs up to talk to other women has a row here at all.
--
-- Threat model this is written against: the phone may be picked up by the person
-- she is trying to get away from. That drives three choices below —
--   1. No real names. A profile carries an alias and nothing else.
--   2. No direct messages. Rooms only, so nobody can single her out in private.
--   3. Messages expire. A conversation history is a record of who she talks to.
--
-- RLS is ON for every table and there is no service-role usage in the app, so a
-- leaked anon key still cannot read anything these policies do not allow.

-- ─────────────────────────────────────────────────────────────────────────────
-- Profiles: one alias per auth user. No email, no phone, no real name.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  alias       text not null check (char_length(alias) between 2 and 24),
  created_at  timestamptz not null default now(),
  -- Set by a moderator. A muted profile can read but not post.
  muted_until timestamptz
);

alter table public.profiles enable row level security;

-- Aliases are visible to signed-in users, because a room needs to show who spoke.
create policy "profiles readable by authenticated"
  on public.profiles for select
  to authenticated
  using (true);

create policy "own profile insert"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "own profile update"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Rooms: a small fixed set, seeded below. Users join, they do not create rooms —
-- an unmoderatable long tail of user-made rooms is not something this product
-- can look after.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.rooms (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  blurb       text not null,
  sort        int  not null default 0,
  is_active   boolean not null default true
);

alter table public.rooms enable row level security;

create policy "active rooms readable by authenticated"
  on public.rooms for select
  to authenticated
  using (is_active);

-- ─────────────────────────────────────────────────────────────────────────────
-- Messages. Expire by default; see the cleanup job at the bottom.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  room_id     uuid not null references public.rooms(id) on delete cascade,
  author_id   uuid not null references public.profiles(id) on delete cascade,
  body        text not null check (char_length(body) between 1 and 2000),
  created_at  timestamptz not null default now(),
  -- Soft-delete by a moderator. Hidden rows stay for audit, out of every read.
  hidden_at   timestamptz
);

create index if not exists messages_room_created_idx
  on public.messages (room_id, created_at desc);

alter table public.messages enable row level security;

create policy "messages readable by authenticated"
  on public.messages for select
  to authenticated
  using (hidden_at is null);

-- Posting requires: it is your own row, you have a profile, and you are not muted.
create policy "post as self when not muted"
  on public.messages for insert
  to authenticated
  with check (
    auth.uid() = author_id
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and (p.muted_until is null or p.muted_until < now())
    )
  );

-- She can always remove her own words. Nobody can edit anyone else's.
create policy "delete own messages"
  on public.messages for delete
  to authenticated
  using (auth.uid() = author_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Reports: how a message reaches a moderator.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.reports (
  id          uuid primary key default gen_random_uuid(),
  message_id  uuid not null references public.messages(id) on delete cascade,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason      text,
  created_at  timestamptz not null default now(),
  unique (message_id, reporter_id)
);

alter table public.reports enable row level security;

create policy "file own report"
  on public.reports for insert
  to authenticated
  with check (auth.uid() = reporter_id);

-- Deliberately no select policy: a reporter cannot see reports, including her
-- own. Nothing in the UI should reveal that a report exists.

-- ─────────────────────────────────────────────────────────────────────────────
-- Column privileges.
--
-- RLS cannot say "your own row EXCEPT this column", and muted_until lives on the
-- profile row. Without this, anyone muted could clear their own mute. Column
-- grants are the mechanism RLS lacks.
-- ─────────────────────────────────────────────────────────────────────────────
revoke update on public.profiles from authenticated;
grant  update (alias) on public.profiles to authenticated;

-- A user deletes her own messages; she never writes hidden_at, which is a
-- moderator's record of a decision.
revoke update on public.messages from authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- Realtime
-- ─────────────────────────────────────────────────────────────────────────────
alter publication supabase_realtime add table public.messages;

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed rooms
-- ─────────────────────────────────────────────────────────────────────────────
insert into public.rooms (slug, name, blurb, sort) values
  ('starting-over', 'Starting over',  'Leaving, rebuilding, and the parts nobody warns you about.', 1),
  ('money',         'Money talk',     'Earning it, keeping it, and getting it back.',                2),
  ('studying',      'Campus',         'Hostel life, exams, and staying safe on the walk home.',      3),
  ('just-today',    'Just today',     'No topic. Say how the day went.',                             4)
on conflict (slug) do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- Retention. A message history is a record of who she talks to, so it does not
-- live forever. Enable pg_cron in the dashboard, then run this block.
--
--   select cron.schedule(
--     'gal-expire-messages', '0 * * * *',
--     $$ delete from public.messages where created_at < now() - interval '30 days' $$
--   );
--
-- Until pg_cron is on, run the delete by hand or leave it — nothing breaks, the
-- table just grows. Shorten the interval if you want a tighter guarantee.
-- ─────────────────────────────────────────────────────────────────────────────
