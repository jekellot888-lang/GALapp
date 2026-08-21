"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { liveResources, RESOURCES } from "@/content/support";
import { useAppState } from "@/lib/state";

/**
 * Quiet Mode — the panic surface.
 *
 * Always dark, in both schemes. Not a style choice: a lit screen in a dark room
 * is the thing that gets noticed, and this is the screen she opens when being
 * noticed is the danger.
 *
 * ── What this screen does NOT do ────────────────────────────────────────────
 * The design canvas describes holding to "send your live location to your three
 * contacts" with "no message appearing on this phone". A web app cannot do that.
 * There is no API that lets a page send an SMS silently, on iOS or Android, and
 * there never has been. Building something that looks like it does would be the
 * worst possible lie to tell here.
 *
 * So the hold does the honest version: it takes a location fix, writes the
 * message, and opens her SMS composer with everything filled in and the
 * recipients set. She taps send. The screen says exactly that before she holds,
 * so nobody is relying on a silent alert that was never going to fire.
 */
const HOLD_MS = 1500;

export default function Quiet() {
  const { state, ready } = useAppState();
  const live = liveResources();
  const [held, setHeld] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const contacts = state.contacts ?? [];

  const clear = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setHeld(0);
  }, []);

  useEffect(() => clear, [clear]);

  const fire = useCallback(async () => {
    clear();
    if (contacts.length === 0) return;
    setStatus("Getting your location…");

    const numbers = contacts.map((c) => c.phone.replace(/\s/g, "")).join(",");
    const send = (text: string) => {
      setStatus(null);
      // iOS wants ?&body=, Android wants ?body=. This form works on both.
      window.location.href = `sms:${numbers}?&body=${encodeURIComponent(text)}`;
    };

    if (!navigator.geolocation) {
      return send("I need help. Please call me.");
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: la, longitude: lo } = pos.coords;
        send(
          `I need help. Please call me. My location: https://maps.google.com/?q=${la.toFixed(5)},${lo.toFixed(5)}`
        );
      },
      // A refused or failed fix must not stop the message going out.
      () => send("I need help. Please call me."),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, [contacts, clear]);

  const start = useCallback(() => {
    if (contacts.length === 0) return;
    clear();
    const began = Date.now();
    timer.current = setInterval(() => {
      const pct = Math.min(1, (Date.now() - began) / HOLD_MS);
      setHeld(pct);
      if (pct >= 1) fire();
    }, 50);
  }, [contacts.length, clear, fire]);

  return (
    <div className="quiet fixed inset-0 z-[80] overflow-y-auto px-5 pb-10 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <header className="flex items-start justify-between gap-sm">
        <div>
          <h1 className="font-display text-[1.75rem] font-semibold leading-[1.1] tracking-display">
            Quiet mode
          </h1>
          <p className="mt-3xs text-sm text-[color:var(--q-dim)]">
            No sound. Nothing stays on this screen.
          </p>
        </div>
        <Link
          href="/"
          className="tap min-h-11 shrink-0 rounded-pill border border-[color:var(--q-rule)] px-md text-sm"
        >
          Close
        </Link>
      </header>

      {/* Call targets. Same gate as everywhere else — nothing dials until a
          human has phoned it and set verified: true. */}
      <section className="mt-lg">
        {live.length === 0 ? (
          <div className="rounded-inner border border-[color:var(--q-rule)] p-md">
            <p className="font-semibold">No numbers are confirmed yet</p>
            <p className="mt-2xs text-sm leading-relaxed text-[color:var(--q-dim)]">
              GAL will not dial a line it has not called itself. Right now that means
              this screen has nothing to offer you, and the honest thing is to say so:
              go to the nearest police post or health facility.
            </p>
            <p className="mt-2xs text-xs text-[color:var(--q-dim)]">
              {RESOURCES.length} lines are recorded and waiting on verification.
            </p>
          </div>
        ) : (
          <ul className="space-y-2xs">
            {live.map((r) => (
              <li key={r.id}>
                <a
                  href={`tel:${r.phone.replace(/\s/g, "")}`}
                  className="tap flex min-h-[76px] items-center justify-between rounded-inner bg-[color:var(--q-tile)] px-md"
                >
                  <span>
                    <span className="block font-display text-lg font-semibold">{r.name}</span>
                    <span className="mt-3xs block text-sm text-[color:var(--q-dim)]">{r.what}</span>
                  </span>
                  <span className="tnum ml-sm shrink-0 font-display text-xl font-semibold">
                    {r.phone}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Hold to alert */}
      <section className="mt-lg">
        <h2 className="font-display text-lg font-semibold tracking-heading">
          Tell someone where you are
        </h2>

        {!ready ? null : contacts.length === 0 ? (
          <>
            <p className="mt-2xs text-sm leading-relaxed text-[color:var(--q-dim)]">
              No trusted contacts yet. Add up to three and this will reach them.
            </p>
            <Link
              href="/contacts"
              className="tap mt-sm flex min-h-[56px] w-full items-center justify-center rounded-inner border border-[color:var(--q-rule)] font-semibold"
            >
              Add contacts
            </Link>
          </>
        ) : (
          <>
            <button
              onPointerDown={start}
              onPointerUp={clear}
              onPointerLeave={clear}
              onPointerCancel={clear}
              onContextMenu={(e) => e.preventDefault()}
              className="tap relative mt-sm min-h-[92px] w-full overflow-hidden rounded-inner bg-[color:var(--q-accent)] px-md font-semibold text-[color:var(--q-accent-ink)]"
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 bg-[color:var(--q-accent-ink)]/25"
                style={{ width: `${held * 100}%`, transition: "width 50ms linear" }}
              />
              <span className="relative">
                {held > 0 ? "Keep holding…" : `Hold to message ${contacts.length}`}
              </span>
            </button>

            {/* Said before she holds, not after. */}
            <p className="mt-2xs text-sm leading-relaxed text-[color:var(--q-dim)]">
              This opens your messages app with the text and your location already
              written, addressed to {contacts.map((c) => c.name).join(", ")}. You tap
              send. A web page cannot send it for you, and it will show in your
              messages afterwards.
            </p>
          </>
        )}

        {status && (
          <p role="status" className="mt-2xs text-sm text-[color:var(--q-dim)]">
            {status}
          </p>
        )}
      </section>

      <section className="mt-lg flex gap-2xs">
        <Link
          href="/calculator"
          className="tap flex min-h-11 flex-1 items-center justify-center rounded-pill border border-[color:var(--q-rule)] text-sm"
        >
          Calculator
        </Link>
        <Link
          href="/support"
          className="tap flex min-h-11 flex-1 items-center justify-center rounded-pill border border-[color:var(--q-rule)] text-sm"
        >
          All lines
        </Link>
      </section>
    </div>
  );
}
