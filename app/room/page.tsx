"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QuickExit from "@/components/QuickExit";
import { useRoom, sessionId, getAlias, forgetRoom } from "@/lib/room/client";
import { MAX_LENGTH } from "@/lib/room/shared";

/**
 * The room.
 *
 * Shape carried over from the version removed at fe24ce5 — list, composer,
 * delete your own, report anybody's — with the backend swapped and the account
 * dropped. What is new is that reporting pulls the message for everybody
 * straight away rather than filing it for later.
 */
export default function Room() {
  const router = useRouter();
  const [alias, setAliasState] = useState("");
  const [sid, setSid] = useState("");
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [reported, setReported] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const { messages, closed, offline, ready, refresh } = useRoom(Boolean(alias));

  useEffect(() => {
    const a = getAlias();
    if (!a) {
      router.replace("/room/enter");
      return;
    }
    setAliasState(a);
    setSid(sessionId());
  }, [router]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const send = async () => {
    const body = draft.trim();
    if (!body || sending) return;
    setError(null);
    setSending(true);
    setDraft("");
    try {
      const res = await fetch("/api/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alias, body, sid }),
      });
      const json = await res.json();
      if (!res.ok) {
        setDraft(body); // Put her words back rather than losing them.
        setError(json.error ?? "That did not send.");
      } else {
        await refresh();
      }
    } catch {
      setDraft(body);
      setError("That did not send. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const remove = async (id: string) => {
    await fetch(`/api/room?id=${encodeURIComponent(id)}&sid=${encodeURIComponent(sid)}`, {
      method: "DELETE",
    });
    await refresh();
  };

  const report = async (id: string) => {
    setReported((s) => new Set(s).add(id));
    await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await refresh();
  };

  const leave = () => {
    forgetRoom();
    router.replace("/ask");
  };

  if (!alias) return null;

  return (
    <main className="flex min-h-[70dvh] flex-col">
      <QuickExit />

      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-display-s font-semibold leading-[1.1] tracking-display">
          The room
        </h1>
        <button onClick={leave} className="tap min-h-11 text-sm text-ink-2 underline underline-offset-4">
          Leave
        </button>
      </div>

      <p className="mt-3xs text-xs text-ink-2">
        You are {alias} here. Everything disappears after a day.
      </p>

      <div className="index mt-md flex-1 rule-top">
        {!ready ? (
          <p className="py-md text-sm text-ink-2">Loading…</p>
        ) : closed ? (
          <div className="py-md">
            <p className="font-display text-lg font-semibold tracking-heading">
              The room is closed
            </p>
            <p className="mt-2xs max-w-[46ch] text-sm leading-relaxed text-ink-2">
              It has been shut for now. Support and Ask are still there, and
              nothing you wrote is kept.
            </p>
          </div>
        ) : messages.length === 0 ? (
          <p className="py-md text-sm leading-relaxed text-ink-2">
            Nobody has said anything today. You can be the first.
          </p>
        ) : (
          [...messages].reverse().map((m) => (
            <article key={m.id} className="py-sm">
              <p className="text-xs text-ink-2">
                {m.alias}
                {m.sid === sid && " · you"}
              </p>
              <p className="selectable mt-3xs text-md leading-relaxed">{m.body}</p>
              <div className="mt-3xs flex gap-sm">
                {m.sid === sid ? (
                  <button
                    onClick={() => remove(m.id)}
                    className="tap min-h-11 text-xs text-ink-2 underline underline-offset-4"
                  >
                    Delete
                  </button>
                ) : reported.has(m.id) ? (
                  <span className="flex min-h-11 items-center text-xs text-ink-2">
                    Reported and removed. Thank you.
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

      {offline && (
        <p className="mt-sm text-xs text-ink-2">
          You are offline. This is the last of it that reached your phone.
        </p>
      )}

      {!closed && (
        <div className="rule-top sticky bottom-24 mt-sm bg-paper pt-sm">
          <div className="flex items-end gap-2xs">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={2}
              maxLength={MAX_LENGTH}
              placeholder="Say something"
              className="min-h-11 flex-1 resize-none rounded-inner border border-rule bg-paper-2 px-xs py-2xs text-base text-ink"
            />
            <button
              onClick={send}
              disabled={sending || !draft.trim()}
              className="tap min-h-11 shrink-0 rounded-inner bg-accent px-md font-semibold text-accent-ink disabled:opacity-45"
            >
              Send
            </button>
          </div>
          <p className="mt-3xs text-xs text-ink-2">
            Links are removed automatically. No photos, no private messages.
          </p>
          {error && (
            <p role="alert" className="mt-2xs text-sm leading-relaxed text-accent">
              {error}
            </p>
          )}
        </div>
      )}

      <Link
        href="/support"
        className="tap rule-top mt-lg -mx-5 block px-5 py-md text-sm text-ink-2 active:bg-paper-2"
      >
        Talk to someone instead
      </Link>
    </main>
  );
}
