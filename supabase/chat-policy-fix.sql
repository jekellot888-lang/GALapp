-- GAL chat policy fix.
-- Run this after the main setup partially succeeded.

drop policy if exists "Read chat setting" on public.chat_settings;
drop policy if exists "Members read their rooms" on public.chat_rooms;
drop policy if exists "Members read room members" on public.chat_members;
drop policy if exists "Members update themselves" on public.chat_members;
drop policy if exists "Members read visible room messages" on public.chat_messages;
drop policy if exists "Members write room messages" on public.chat_messages;
drop policy if exists "Members report messages" on public.chat_reports;

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

create policy "Read chat setting" on public.chat_settings for select to authenticated using (true);
create policy "Members read their rooms" on public.chat_rooms for select to authenticated using (disabled = false and public.gal_is_room_member(chat_rooms.id));
create policy "Members read room members" on public.chat_members for select to authenticated using (user_id = (select auth.uid()));
create policy "Members update themselves" on public.chat_members for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "Members read visible room messages" on public.chat_messages for select to authenticated using (hidden = false and created_at > now() - interval '72 hours' and public.gal_is_room_member(chat_messages.room_id));
create policy "Members write room messages" on public.chat_messages for insert to authenticated with check (user_id = (select auth.uid()) and public.gal_is_room_member(chat_messages.room_id) and exists (select 1 from public.chat_settings s where s.id = true and s.enabled = true));
create policy "Members report messages" on public.chat_reports for insert to authenticated with check (user_id = (select auth.uid()) and exists (select 1 from public.chat_messages msg where msg.id = chat_reports.message_id and public.gal_is_room_member(msg.room_id)));
