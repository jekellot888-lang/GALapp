"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QuickExit from "@/components/QuickExit";
import ThemeToggle from "@/components/ThemeToggle";
import Icon from "@/components/Icon";
import { getSupabase, supabaseConfigured } from "@/lib/supabase";

type Room = { id: string; code: string; name: string };
type ChatMessage = {
  id: string;
  room_id: string;
  user_id: string;
  nickname: string;
  body: string;
  created_at: string;
  hidden?: boolean;
};

const NICK_KEY = "gal.room.nickname";
const CODE_KEY = "gal.room.code";
const DEFAULT_CODE = "SISTER";
const LINK_RE = /(https?:\/\/|www\.|[a-z0-9.-]+\.[a-z]{2,})/i;

const cleanNickname = (value: string) =>
  value.replace(/\s+/g, " ").trim().slice(0, 24);

const cleanCode = (value: string) =>
  value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 16);

const cleanBody = (value: string) =>
  value.replace(/\s+/g, " ").trim().slice(0, 500);

function timeLabel(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function friendlyError(message: string) {
  if (/function public\.gal_join_room|schema cache|chat_/.test(message)) {
    return "The chat database is not set up yet. Run supabase/chat-schema.sql in Supabase.";
  }
  if (/anonymous|provider|signup/i.test(message)) {
    return "Anonymous sign-in is not enabled yet in Supabase.";
  }
  if (/Room not found/i.test(message)) return "That room code does not exist.";
  if (/row-level security|permission denied/i.test(message)) {
    return "Supabase blocked the request. Check the chat RLS policies.";
  }
  return message;
}

export default function RoomPage() {
  const supabase = useMemo(() => getSupabase(), []);
  const [nickname, setNickname] = useState("");
  const [code, setCode] = useState(DEFAULT_CODE);
  const [room, setRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [lastSentAt, setLastSentAt] = useState(0);
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    setNickname(localStorage.getItem(NICK_KEY) ?? "");
    setCode(localStorage.getItem(CODE_KEY) ?? DEFAULT_CODE);
  }, []);

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const loadMessages = useCallback(
    async (roomId: string) => {
      if (!supabase) return;
      const { data, error: loadError } = await supabase
        .from("chat_messages")
        .select("id, room_id, user_id, nickname, body, created_at")
        .eq("room_id", roomId)
        .eq("hidden", false)
        .order("created_at", { ascending: true })
        .limit(100);

      if (loadError) throw loadError;
      setMessages((data ?? []) as ChatMessage[]);
    },
    [supabase]
  );

  useEffect(() => {
    if (!supabase || !room) return;

    const channel = supabase
      .channel(`gal-room-${room.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${room.id}`,
        },
        (payload) => {
          const incoming = payload.new as ChatMessage;
          if (incoming.hidden) return;
          setMessages((current) =>
            current.some((m) => m.id === incoming.id)
              ? current
              : [...current, incoming]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room, supabase]);

  const join = async () => {
    setError(null);
    setStatus("Opening the room...");

    if (!supabaseConfigured() || !supabase) {
      setStatus(null);
      setError("Supabase is not configured for this app yet.");
      return;
    }

    const nextNickname = cleanNickname(nickname);
    const nextCode = cleanCode(code);
    if (nextNickname.length < 2) {
      setStatus(null);
      setError("Choose a nickname with at least 2 letters.");
      return;
    }
    if (nextCode.length < 4) {
      setStatus(null);
      setError("Enter the room code.");
      return;
    }

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      let id = sessionData.session?.user.id ?? null;
      if (!id) {
        const { data, error: authError } = await supabase.auth.signInAnonymously();
        if (authError) throw authError;
        id = data.user?.id ?? null;
      }
      if (!id) throw new Error("Could not create a room identity.");

      const { data, error: joinError } = await supabase.rpc("gal_join_room", {
        p_code: nextCode,
        p_nickname: nextNickname,
      });
      if (joinError) throw joinError;

      const joined = Array.isArray(data) ? (data[0] as Room | undefined) : null;
      if (!joined) throw new Error("Room not found.");

      localStorage.setItem(NICK_KEY, nextNickname);
      localStorage.setItem(CODE_KEY, nextCode);
      setNickname(nextNickname);
      setCode(nextCode);
      setUserId(id);
      setRoom(joined);
      await loadMessages(joined.id);
      setStatus(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not open the room.";
      setStatus(null);
      setError(friendlyError(message));
    }
  };

  const send = async () => {
    if (!supabase || !room || !userId || sending) return;
    setError(null);

    const body = cleanBody(draft);
    if (!body) return;
    if (LINK_RE.test(body)) {
      setError("Links are not allowed in the room.");
      return;
    }
    if (Date.now() - lastSentAt < 7000) {
      setError("Wait a few seconds before sending again.");
      return;
    }

    const tempId = `local-${Date.now()}`;
    const optimistic: ChatMessage = {
      id: tempId,
      room_id: room.id,
      user_id: userId,
      nickname,
      body,
      created_at: new Date().toISOString(),
    };

    setDraft("");
    setLastSentAt(Date.now());
    setSending(true);
    setMessages((current) => [...current, optimistic]);

    const { data, error: sendError } = await supabase
      .from("chat_messages")
      .insert({
        room_id: room.id,
        user_id: userId,
        nickname,
        body,
      })
      .select("id, room_id, user_id, nickname, body, created_at")
      .single();

    if (sendError) {
      setMessages((current) => current.filter((m) => m.id !== tempId));
      setError(friendlyError(sendError.message));
      setSending(false);
      return;
    }

    setMessages((current) =>
      current.map((m) => (m.id === tempId ? (data as ChatMessage) : m))
    );
    setSending(false);
  };

  const report = async (message: ChatMessage) => {
    if (!supabase || message.id.startsWith("local-")) return;
    setMessages((current) => current.filter((m) => m.id !== message.id));
    await supabase.rpc("gal_report_message", {
      p_message_id: message.id,
      p_reason: "reported in GAL",
    });
  };

  return (
    <main>
      <QuickExit />

      <header className="mb-lg flex items-start justify-between gap-sm">
        <div>
          <h1 className="font-display text-display font-semibold leading-[1.05] tracking-display">
            Room
          </h1>
          <p className="mt-2xs max-w-[38ch] text-md leading-relaxed text-ink-2">
            A small room for talking with other women. No email, no password.
          </p>
        </div>
        <ThemeToggle />
      </header>

      {!room ? (
        <section className="app-panel p-md">
          <div className="flex items-center gap-xs">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-rose-tint text-rose-ink">
              <Icon name="room" className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold tracking-heading">
                Join a room
              </h2>
              <p className="mt-3xs text-sm text-ink-2">
                Start with code SISTER.
              </p>
            </div>
          </div>

          <label className="mt-md block text-sm font-semibold" htmlFor="nickname">
            Nickname
          </label>
          <input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Malaika"
            autoComplete="nickname"
            className="mt-3xs min-h-11 w-full rounded-inner border border-rule bg-paper-2 px-xs text-base text-ink"
          />

          <label className="mt-sm block text-sm font-semibold" htmlFor="room-code">
            Room code
          </label>
          <input
            id="room-code"
            value={code}
            onChange={(e) => setCode(cleanCode(e.target.value))}
            className="tnum mt-3xs min-h-11 w-full rounded-inner border border-rule bg-paper-2 px-xs text-base uppercase text-ink"
          />

          <button
            onClick={join}
            className="tap mt-md min-h-[52px] w-full rounded-inner bg-accent px-md font-semibold text-accent-ink"
          >
            Enter room
          </button>

          <p className="mt-sm text-xs leading-relaxed text-ink-2">
            Use a nickname, not your real name. Messages expire from view after
            72 hours. Links are blocked.
          </p>

          {status && <p className="mt-sm text-sm text-ink-2">{status}</p>}
          {error && (
            <p role="alert" className="mt-sm text-sm font-semibold text-accent">
              {error}
            </p>
          )}
        </section>
      ) : (
        <>
          <section className="app-panel flex min-h-[62dvh] flex-col overflow-hidden">
            <div className="flex items-center justify-between gap-sm border-b border-rule px-md py-sm">
              <div>
                <h2 className="font-display text-lg font-semibold tracking-heading">
                  {room.name}
                </h2>
                <div className="mt-3xs flex flex-wrap items-center gap-2xs text-xs text-ink-2">
                  <span className="tnum">Code {room.code}</span>
                  <span aria-hidden className="h-1 w-1 rounded-full bg-rule-strong" />
                  <span className="inline-flex items-center gap-[0.35rem] text-calm">
                    <span aria-hidden className="h-2 w-2 rounded-full bg-calm" />
                    Live as {nickname}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setRoom(null);
                  setMessages([]);
                }}
                className="tap min-h-11 rounded-pill border border-rule px-sm text-sm text-ink-2 active:bg-paper-2"
              >
                Leave
              </button>
            </div>

            <ul ref={listRef} className="flex-1 space-y-xs overflow-y-auto px-sm py-md">
              {messages.length === 0 ? (
                <li className="px-xs py-lg text-center text-sm text-ink-2">
                  No messages yet.
                </li>
              ) : (
                messages.map((message) => {
                  const mine = message.user_id === userId;
                  return (
                    <li
                      key={message.id}
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[82%] rounded-inner px-sm py-xs ${
                          mine
                            ? "bg-accent text-accent-ink"
                            : "border border-rule bg-paper text-ink"
                        }`}
                      >
                        {!mine && (
                          <p className="text-xs font-semibold text-rose-ink">
                            {message.nickname}
                          </p>
                        )}
                        <p className="mt-3xs selectable text-sm leading-relaxed">
                          {message.body}
                        </p>
                        <div className="mt-3xs flex items-center justify-between gap-sm">
                          <span className={`tnum text-[0.7rem] ${mine ? "text-accent-ink" : "text-ink-2"}`}>
                            {timeLabel(message.created_at)}
                          </span>
                          {!mine && (
                            <button
                              onClick={() => report(message)}
                              className="tap text-[0.7rem] underline underline-offset-4"
                            >
                              Report
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </section>

          <section className="glass sticky bottom-24 mt-sm rounded-card border border-rule p-sm shadow-lift">
            <label className="sr-only" htmlFor="room-message">
              Message
            </label>
            <div className="flex gap-2xs">
              <textarea
                id="room-message"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder="Write a short message"
                className="min-h-11 flex-1 resize-none rounded-inner border border-rule bg-paper-2 px-xs py-2xs text-base text-ink"
              />
              <button
                onClick={send}
                disabled={sending || !cleanBody(draft)}
                className="tap min-h-11 shrink-0 rounded-inner bg-accent px-md font-semibold text-accent-ink disabled:cursor-not-allowed disabled:opacity-55"
              >
                {sending ? "Sending" : "Send"}
              </button>
            </div>
            {error && (
              <p role="alert" className="mt-2xs text-sm font-semibold text-accent">
                {error}
              </p>
            )}
          </section>
        </>
      )}
    </main>
  );
}
