"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient, chatConfigured } from "@/lib/supabase/client";

/**
 * The moderator queue.
 *
 * Not linked from anywhere in the app. A moderator types the URL. There is no
 * reason for a link to this to exist on a phone that might be taken off someone.
 *
 * Access is enforced in the database, not here: `is_moderator()` gates the
 * reports read and both action functions. Hiding this page would achieve
 * nothing on its own, and the page not rendering is a courtesy, not the control.
 */
type Row = {
  id: string;
  reason: string | null;
  created_at: string;
  messages: {
    id: string;
    body: string;
    hidden_at: string | null;
    author_id: string;
    profiles: { alias: string; muted_until: string | null } | null;
  } | null;
};

export default function Moderate() {
  const supabase = createClient();
  const [ready, setReady] = useState(false);
  const [isMod, setIsMod] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!supabase) return setReady(true);
    const { data: s } = await supabase.auth.getSession();
    if (!s.session) {
      setReady(true);
      return;
    }
    // A non-moderator simply gets nothing back — the policy denies the read.
    const { data, error } = await supabase
      .from("reports")
      .select("id,reason,created_at,messages(id,body,hidden_at,author_id,profiles(alias,muted_until))")
      .order("created_at", { ascending: false })
      .limit(100);
    setIsMod(!error && data !== null);
    setRows((data as unknown as Row[]) ?? []);
    setReady(true);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  // Supabase's rpc() returns a thenable builder, not a Promise, so PromiseLike.
  const act = async (key: string, fn: () => PromiseLike<unknown>) => {
    setBusy(key);
    await fn();
    await load();
    setBusy(null);
  };

  if (!chatConfigured()) {
    return (
      <main className="pt-xl">
        <h1 className="font-display text-display-s font-semibold tracking-display">Moderation</h1>
        <p className="mt-2xs text-md text-ink-2">Rooms are not switched on for this build.</p>
      </main>
    );
  }

  return (
    <main>
      <header className="mb-lg">
        <h1 className="font-display text-display font-semibold leading-[1.05] tracking-display">
          Moderation
        </h1>
        <p className="mt-2xs max-w-[40ch] text-md leading-relaxed text-ink-2">
          Reported messages, newest first. Hiding removes it from every room and
          keeps the row for audit.
        </p>
      </header>

      {!ready ? (
        <p className="text-sm text-ink-2">Loading…</p>
      ) : !isMod ? (
        <p className="rule-top py-md text-sm leading-relaxed text-ink-2">
          This account cannot see the queue.{" "}
          <Link href="/rooms" className="font-semibold text-accent underline underline-offset-4">
            Sign in
          </Link>{" "}
          as a moderator, or ask to be added to the moderators table.
        </p>
      ) : rows.length === 0 ? (
        <p className="rule-top py-md text-sm leading-relaxed text-ink-2">
          Nothing reported. That is the good outcome, but check back — an empty
          queue and an unwatched queue look identical from here.
        </p>
      ) : (
        <ul className="index rule-top">
          {rows.map((r) => {
            const m = r.messages;
            if (!m) return null;
            const muted = m.profiles?.muted_until
              ? new Date(m.profiles.muted_until) > new Date()
              : false;
            return (
              <li key={r.id} className="py-md">
                <p className="text-xs text-ink-2">
                  {m.profiles?.alias ?? "Unknown"}
                  {muted && " · muted"}
                  {m.hidden_at && " · hidden"}
                </p>
                <p className="selectable mt-3xs text-md leading-relaxed">{m.body}</p>
                {r.reason && (
                  <p className="mt-3xs text-sm text-ink-2">Reason: {r.reason}</p>
                )}

                <div className="mt-sm flex flex-wrap gap-2xs">
                  <button
                    disabled={busy === r.id}
                    onClick={() =>
                      act(r.id, () =>
                        supabase!.rpc("mod_hide_message", {
                          p_message: m.id,
                          p_hide: !m.hidden_at,
                        })
                      )
                    }
                    className="tap min-h-11 rounded-pill border border-rule px-md text-sm active:bg-paper-2 disabled:opacity-45"
                  >
                    {m.hidden_at ? "Unhide" : "Hide"}
                  </button>
                  <button
                    disabled={busy === r.id}
                    onClick={() =>
                      act(r.id, () =>
                        supabase!.rpc("mod_mute", {
                          p_profile: m.author_id,
                          p_hours: muted ? 0 : 24,
                        })
                      )
                    }
                    className="tap min-h-11 rounded-pill border border-rule px-md text-sm active:bg-paper-2 disabled:opacity-45"
                  >
                    {muted ? "Unmute" : "Mute 24h"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
