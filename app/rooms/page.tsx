"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createClient, chatConfigured } from "@/lib/supabase/client";
import QuickExit from "@/components/QuickExit";
import AuthPanel from "@/components/chat/AuthPanel";

type Room = { id: string; slug: string; name: string; blurb: string };

export default function Rooms() {
  const supabase = createClient();
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);

  const load = useCallback(async () => {
    if (!supabase) return setReady(true);
    const { data: session } = await supabase.auth.getSession();
    const on = Boolean(session.session);
    setSignedIn(on);
    if (on) {
      const { data } = await supabase
        .from("rooms")
        .select("id,slug,name,blurb")
        .order("sort");
      setRooms(data ?? []);
    }
    setReady(true);
  }, [supabase]);

  useEffect(() => {
    load();
    const sub = supabase?.auth.onAuthStateChange(() => load());
    return () => sub?.data.subscription.unsubscribe();
  }, [load, supabase]);

  return (
    <main>
      <QuickExit />

      <header className="mb-lg">
        <h1 className="font-display text-display font-semibold leading-[1.05] tracking-display">
          Rooms
        </h1>
        <p className="mt-2xs max-w-[38ch] text-md leading-relaxed text-ink-2">
          Other women, talking. Rooms only — nobody can message you privately.
        </p>
      </header>

      {/* This is the one place in GAL where something leaves the phone, so it
          says so before she signs up rather than after. */}
      <section className="rule-top rule-bottom mb-lg py-md">
        <h2 className="font-display text-lg font-semibold tracking-heading">
          Before you join
        </h2>
        <ul className="mt-2xs space-y-3xs text-sm leading-relaxed text-ink-2">
          <li>Messages here are stored on a server, unlike the rest of GAL.</li>
          <li>Pick a name that is not your own. Nobody needs to know who you are.</li>
          <li>Anything posted is deleted after 30 days.</li>
          <li>You can leave a room at any time, and delete anything you wrote.</li>
        </ul>
      </section>

      {!chatConfigured() ? (
        <p className="text-sm leading-relaxed text-ink-2">
          Rooms are not switched on for this build. Everything else in GAL works
          without them.
        </p>
      ) : !ready ? (
        <p className="text-sm text-ink-2">Loading…</p>
      ) : !signedIn ? (
        <AuthPanel onDone={load} />
      ) : rooms.length === 0 ? (
        <p className="text-sm text-ink-2">No rooms are open right now.</p>
      ) : (
        <ul className="index rule-top">
          {rooms.map((r, i) => (
            <li key={r.id} className="rise" style={{ animationDelay: `${Math.min(i, 5) * 30}ms` }}>
              <Link
                href={`/rooms/${r.slug}`}
                className="tap tap-tint -mx-5 block px-5 py-md active:bg-paper-2"
              >
                <h2 className="font-display text-lg font-semibold leading-[1.25] tracking-heading">
                  {r.name}
                </h2>
                <p className="mt-3xs max-w-[46ch] text-sm leading-relaxed text-ink-2">
                  {r.blurb}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
