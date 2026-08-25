-- GAL chatroom setup.
-- Run once in Supabase Dashboard -> SQL Editor.
--
-- Required dashboard setting:
-- Authentication -> Sign In / Providers -> Anonymous Sign-Ins -> Enable.

create extension if not exists pgcrypto;

create table if not exists public.chat_rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  disabled boolean not null default false,
  created_at timestamptz not null default now(),
  constraint chat_rooms_code_format check (code ~ '^[A-Z0-9]{4,16}$')
);

create table if not exists public.chat_members (
  room_id uuid not null references public.chat_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null,
  joined_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  primary key (room_id, user_id),
  constraint chat_members_nickname_length check (char_length(nickname) between 2 and 24)
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.chat_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  nickname text not null,
  body text not null,
  hidden boolean not null default false,
  created_at timestamptz not null default now(),
  constraint chat_messages_body_length check (char_length(body) between 1 and 500),
  constraint chat_messages_no_links check (body !~* '(https?://|www\.|[a-z0-9.-]+\.[a-z]{2,})')
);

create table if not exists public.chat_reports (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.chat_messages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  reason text not null default 'unsafe',
  created_at timestamptz not null default now(),
  unique (message_id, user_id)
);

create table if not exists public.chat_settings (
  id boolean primary key default true,
  enabled boolean not null default true,
  note text,
  updated_at timestamptz not null default now(),
  constraint chat_settings_singleton check (id)
);

insert into public.chat_settings (id, enabled, note)
values (true, true, 'GAL room is open')
on conflict (id) do nothing;

insert into public.chat_rooms (code, name)
values ('SISTER', 'Sister room')
on conflict (code) do nothing;

create index if not exists chat_members_user_idx on public.chat_members(user_id);
create index if not exists chat_messages_room_created_idx on public.chat_messages(room_id, created_at desc);
create index if not exists chat_reports_message_idx on public.chat_reports(message_id);

alter table public.chat_rooms enable row level security;
alter table public.chat_members enable row level security;
alter table public.chat_messages enable row level security;
alter table public.chat_reports enable row level security;
alter table public.chat_settings enable row level security;

revoke all on public.chat_rooms from anon, authenticated;
revoke all on public.chat_members from anon, authenticated;
revoke all on public.chat_messages from anon, authenticated;
revoke all on public.chat_reports from anon, authenticated;
revoke all on public.chat_settings from anon, authenticated;

grant select on public.chat_settings to authenticated;
grant select on public.chat_rooms to authenticated;
grant select, insert, update on public.chat_members to authenticated;
grant select, insert on public.chat_messages to authenticated;
grant insert on public.chat_reports to authenticated;

create or replace function public.gal_is_room_member(p_room_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.chat_members
    where room_id = p_room_id
    and user_id = (select auth.uid())
  );
$$;

grant execute on function public.gal_is_room_member(uuid) to authenticated;

drop policy if exists "Read chat setting" on public.chat_settings;
create policy "Read chat setting" on public.chat_settings for select to authenticated using (true);

drop policy if exists "Members read their rooms" on public.chat_rooms;
create policy "Members read their rooms" on public.chat_rooms for select to authenticated using (disabled = false and public.gal_is_room_member(chat_rooms.id));

drop policy if exists "Members read room members" on public.chat_members;
create policy "Members read room members" on public.chat_members for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "Members update themselves" on public.chat_members;
create policy "Members update themselves" on public.chat_members for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "Members read visible room messages" on public.chat_messages;
create policy "Members read visible room messages" on public.chat_messages for select to authenticated using (hidden = false and created_at > now() - interval '72 hours' and public.gal_is_room_member(chat_messages.room_id));

drop policy if exists "Members write room messages" on public.chat_messages;
create policy "Members write room messages" on public.chat_messages for insert to authenticated with check (user_id = (select auth.uid()) and public.gal_is_room_member(chat_messages.room_id) and exists (select 1 from public.chat_settings s where s.id = true and s.enabled = true));

drop policy if exists "Members report messages" on public.chat_reports;
create policy "Members report messages" on public.chat_reports for insert to authenticated with check (user_id = (select auth.uid()) and exists (select 1 from public.chat_messages msg where msg.id = chat_reports.message_id and public.gal_is_room_member(msg.room_id)));

create or replace function public.gal_join_room(p_code text, p_nickname text)
returns table (id uuid, code text, name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  room record;
  clean_code text := upper(regexp_replace(coalesce(p_code, ''), '[^a-zA-Z0-9]', '', 'g'));
  clean_name text := btrim(regexp_replace(coalesce(p_nickname, ''), '\s+', ' ', 'g'));
begin
  if (select auth.uid()) is null then
    raise exception 'Not signed in';
  end if;

  if not exists (select 1 from public.chat_settings where chat_settings.id = true and enabled = true) then
    raise exception 'Chat is currently closed';
  end if;

  if char_length(clean_name) < 2 or char_length(clean_name) > 24 then
    raise exception 'Nickname must be 2 to 24 characters';
  end if;

  select r.* into room
  from public.chat_rooms r
  where r.code = clean_code
  and r.disabled = false;

  if room.id is null then
    raise exception 'Room not found';
  end if;

  insert into public.chat_members (room_id, user_id, nickname, last_seen_at)
  values (room.id, (select auth.uid()), clean_name, now())
  on conflict (room_id, user_id)
  do update set nickname = excluded.nickname, last_seen_at = now();

  return query select room.id, room.code, room.name;
end;
$$;

grant execute on function public.gal_join_room(text, text) to authenticated;

create or replace function public.gal_report_message(p_message_id uuid, p_reason text default 'unsafe')
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'Not signed in';
  end if;

  insert into public.chat_reports (message_id, user_id, reason)
  values (p_message_id, (select auth.uid()), left(coalesce(p_reason, 'unsafe'), 80))
  on conflict (message_id, user_id) do nothing;

  update public.chat_messages
  set hidden = true
  where id = p_message_id
  and (
    select count(*)
    from public.chat_reports
    where chat_reports.message_id = p_message_id
  ) >= 3;
end;
$$;

grant execute on function public.gal_report_message(uuid, text) to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
    and schemaname = 'public'
    and tablename = 'chat_messages'
  ) then
    alter publication supabase_realtime add table public.chat_messages;
  end if;
end;
$$;
