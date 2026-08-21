"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import QuickExit from "@/components/QuickExit";

type Msg = {
  id: string;
  body: string;
  created_at: string;
  author_id: string;
  profiles: { alias: string } | null;
};

export default function Room() {
  const { slug } = useParams<{ slug: string }>();
  const supabase = createClient();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("");
  const [me, setMe] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [reported, setReported] = useState<Set<string>>(new Set());
  const endRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    if (!supabase) return setReady(true);
    const { data: s } = await supabase.auth.getSession();
    setMe(s.session?.user.id ?? null);

    const { data: room } = await supabase
      .from("rooms")
      .select("id,name")
      .eq("slug", slug)
      .single();
    if (!room) return setReady(true);
    setRoomId(room.id);
    setRoomName(room.name);

    const { data } = await supabase
      .from("messages")
      .select("id,body,created_at,author_id,profiles(alias)")
      .eq("room_id", room.id)
      .order("created_at", { ascending: true })
      .limit(200);
    setMsgs((data as unknown as Msg[]) ?? []);
    setReady(true);
  }, [supabase, slug]);

  useEffect(() => { load(); }, [load]);

  // Realtime: append rows as they arrive, then re-read the alias for the row.
  useEffect(() => {
    if (!supabase || !roomId) return;
    const ch = supabase
      .channel(`room:${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
        async (payload) => {
          const row = payload.new as Msg;
          const { data } = await supabase
            .from("profiles")
            .select("alias")
            .eq("id", row.author_id)
            .single();
          setMsgs((cur) =>
            cur.some((m) => m.id === row.id) ? cur : [...cur, { ...row, profiles: data ?? null }]
          );
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [supabase, roomId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [msgs.length]);

  const send = async () => {
    const body = draft.trim();
    if (!supabase || !roomId || !me || !body) return;
    setError(null);
    setDraft("");
    const { error } = await supabase
      .from("messages")
      .insert({ room_id: roomId, author_id: me, body });
    if (error) {
      setDraft(body); // Put her words back rather than losing them.
      setError("That didn't send. Check your connection and try again.");
    }
  };

  const remove = async (id: string) => {
    if (!supabase) return;
    await supabase.from("messages").delete().eq("id", id);
    setMsgs((cur) => cur.filter((m) => m.id !== id));
  };

  /**
   * Reporting is deliberately one-way. She gets a confirmation and nothing else:
   * no count, no status, no way to check later. `reports` has no select policy
   * for reporters, so the UI could not reveal more even if it tried — which
   * matters when the person reported might be reading over her shoulder.
   */
  const report = async (id: string) => {
    if (!supabase || !me) return;
    await supabase.from("reports").insert({ message_id: id, reporter_id: me });
    setReported((cur) => new Set(cur).add(id));
  };

  return (
    <main className="flex min-h-[70dvh] flex-col">
      <QuickExit />

      <Link
        href="/rooms"
        className="tap -ml-1 inline-flex min-h-11 items-center gap-2xs pl-1 pr-2xs text-sm text-ink-2"
      >
        <span aria-hidden>←</span> Rooms
      </Link>

      <h1 className="mt-2xs font-display text-display-s font-semibold leading-[1.1] tracking-display">
        {roomName || "Room"}
      </h1>

      <div className="index mt-md flex-1 rule-top">
        {!ready ? (
          <p className="py-md text-sm text-ink-2">Loading…</p>
        ) : !me ? (
          <p className="py-md text-sm leading-relaxed text-ink-2">
            <Link href="/rooms" className="font-semibold text-accent underline underline-offset-4">
              Join the rooms
            </Link>{" "}
            to read and post here.
          </p>
        ) : msgs.length === 0 ? (
          <p className="py-md text-sm leading-relaxed text-ink-2">
            Nothing here yet. You can be the first to say something.
          </p>
        ) : (
          msgs.map((m) => (
            <article key={m.id} className="py-sm">
              <p className="text-xs text-ink-2">
                {m.profiles?.alias ?? "Someone"}
                {m.author_id === me && " · you"}
              </p>
              <p className="selectable mt-3xs text-md leading-relaxed">{m.body}</p>
              <div className="mt-3xs flex gap-sm">
                {m.author_id === me ? (
                  <button
                    onClick={() => remove(m.id)}
                    className="tap min-h-11 text-xs text-ink-2 underline underline-offset-4"
                  >
                    Delete
                  </button>
                ) : reported.has(m.id) ? (
                  <span className="flex min-h-11 items-center text-xs text-ink-2">
                    Reported. Thank you.
                  </span>
                ) : (
                  <button
                    onClick={() => report(m.id)}
                    className="tap min-h-11 text-xs text-ink-2 underline underline-offset-4"
                  >
                    Report
                  </button>
                )}
              </div>
            </article>
          ))
        )}
        <div ref={endRef} />
      </div>

      {me && (
        <div className="rule-top sticky bottom-24 mt-sm bg-paper pt-sm">
          <div className="flex items-end gap-2xs">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={2}
              maxLength={2000}
              placeholder="Say something"
              className="min-h-11 flex-1 resize-none rounded-inner border border-rule bg-paper-2 px-xs py-2xs text-base text-ink"
            />
            <button
              onClick={send}
              disabled={!draft.trim()}
              className="tap min-h-11 shrink-0 rounded-inner bg-accent px-md font-semibold text-accent-ink disabled:opacity-45"
            >
              Send
            </button>
          </div>
          {error && (
            <p role="alert" className="mt-2xs text-sm text-accent">
              {error}
            </p>
          )}
        </div>
      )}
    </main>
  );
}
