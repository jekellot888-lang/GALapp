"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useAppState, today, type Mood } from "@/lib/state";
import { useShake } from "@/lib/useShake";
import { feedback } from "@/lib/haptics";
import { affirmationForDay, randomAffirmation } from "@/lib/affirmations";
import InstallSheet from "@/components/InstallSheet";

const MOODS: { id: Mood; face: string; label: string }[] = [
  { id: "good", face: "🙂", label: "Good" },
  { id: "okay", face: "😐", label: "Okay" },
  { id: "low", face: "🙁", label: "Low" },
  { id: "tough", face: "😣", label: "Tough" },
];

const GOALS = [
  { id: "water", label: "Drink a glass of water" },
  { id: "breathe", label: "Take 3 deep breaths" },
  { id: "save", label: "Save a small amount" },
  { id: "move", label: "Move your body 5 min" },
];

function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
  const { state, ready, setMood, toggleGoal } = useAppState();
  const t = today();

  const daily = useMemo(() => affirmationForDay(t), [t]);
  const [affirmation, setAffirmation] = useState(daily);
  const [swapping, setSwapping] = useState(false);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Fade the old line out, swap the text at the bottom of the fade, let the new
   * one come back. Shake can fire again mid-swap, so the pending timer is always
   * cleared first — the opacity transition retargets from wherever it is rather
   * than restarting, which is why this is a transition and not a keyframe.
   */
  const reroll = useCallback(() => {
    /* A swap already mid-fade wins. Without this, taps arriving faster than the
       fade-out restart it every time and the line never swaps back in — it just
       stays invisible for as long as she keeps tapping. Shake is rate-limited
       upstream; the button is not. */
    if (swapTimer.current) return;
    setSwapping(true);
    feedback(14);
    swapTimer.current = setTimeout(() => {
      setAffirmation((cur) => randomAffirmation(cur));
      setSwapping(false);
      swapTimer.current = null;
    }, 110);
  }, []);

  useEffect(() => () => {
    if (swapTimer.current) clearTimeout(swapTimer.current);
  }, []);

  const { status, enable } = useShake(reroll);

  const mood = state.moods[t];
  const done = state.goals[t] ?? [];

  return (
    <main>
      <header className="mb-7 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{greeting()},</p>
          <h1 className="font-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em]">
            {state.name ?? "you"} <span aria-hidden>✨</span>
          </h1>
        </div>
        {ready && state.streak > 0 && (
          <span className="tnum shrink-0 rounded-pill bg-white px-3 py-1.5 text-sm font-semibold text-wine shadow-card">
            {state.streak} day{state.streak === 1 ? "" : "s"}
          </span>
        )}
      </header>

      <InstallSheet />

      {/* Mood */}
      <section className="mb-5 rounded-card bg-white p-4 shadow-card">
        <h2 className="mb-3 text-base font-semibold">How are you feeling today?</h2>
        <div className="grid grid-cols-4 gap-2">
          {MOODS.map((m) => {
            const on = mood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setMood(m.id);
                  feedback(10);
                }}
                aria-pressed={on}
                className={`tap flex flex-col items-center gap-1 rounded-inner border py-3 ${
                  on
                    ? "border-wine bg-blush shadow-[inset_0_0_0_1px_rgba(109,31,58,0.45)]"
                    : "border-line bg-white"
                }`}
              >
                <span className="text-2xl" aria-hidden>
                  {m.face}
                </span>
                <span className={`text-xs ${on ? "font-semibold text-wine" : "text-muted"}`}>
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>
        {mood === "tough" && (
          <Link
            href="/support"
            className="tap rise mt-3 block rounded-inner bg-wine px-4 py-3 text-center text-sm font-semibold text-white shadow-lift"
          >
            Talk to someone now
          </Link>
        )}
      </section>

      {/* Affirmation — the signature. Shake to change it.
          Radial highlight over a wine base, not a 45° two-tone fade, plus a
          grain overlay so the fill has some tooth. White here measures 11:1. */}
      <section
        className="grain relative mb-7 overflow-hidden rounded-card bg-mulled p-5 text-white shadow-lift"
        style={{
          backgroundImage:
            "radial-gradient(120% 100% at 12% 0%, #8C2F4A 0%, #6D1F3A 46%, #4E1528 100%)",
        }}
      >
        <p
          data-swapping={swapping}
          aria-live="polite"
          className="aff font-display text-[1.4rem] font-medium leading-[1.35] tracking-[-0.01em]"
        >
          {affirmation}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-white/80">
            Daily affirmation
          </span>
          {status === "needs-permission" ? (
            <button
              onClick={enable}
              className="tap min-h-11 shrink-0 rounded-pill bg-white/20 px-4 text-xs font-semibold shadow-inset active:bg-white/30"
            >
              Turn on shake
            </button>
          ) : (
            <button
              onClick={reroll}
              className="tap min-h-11 shrink-0 rounded-pill bg-white/20 px-4 text-xs font-semibold shadow-inset active:bg-white/30"
            >
              {status === "listening" ? "Shake, or tap" : "New one"}
            </button>
          )}
        </div>
      </section>

      {/* Goals */}
      <section className="mb-7">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-lg font-semibold tracking-[-0.01em]">
            Today&rsquo;s goals
          </h2>
          <span className="tnum text-sm font-semibold text-wine">
            {done.length}/{GOALS.length}
          </span>
        </div>
        <ul className="overflow-hidden rounded-card bg-white shadow-card">
          {GOALS.map((g, i) => {
            const on = done.includes(g.id);
            return (
              <li key={g.id} className={i > 0 ? "border-t border-line" : ""}>
                <button
                  onClick={() => {
                    toggleGoal(g.id);
                    feedback(10);
                  }}
                  aria-pressed={on}
                  className="tap flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-blush"
                >
                  <span
                    className={`tap grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs ${
                      on ? "scale-105 border-wine bg-wine text-white" : "border-line"
                    }`}
                    aria-hidden
                  >
                    {on ? "✓" : ""}
                  </span>
                  <span className={on ? "text-muted line-through" : ""}>{g.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <Link
        href="/support"
        className="tap tap-lift flex items-center justify-between gap-3 rounded-card border border-line bg-white p-4 shadow-card active:shadow-lift"
      >
        <span>
          <span className="block font-semibold">Need someone to talk to?</span>
          <span className="mt-0.5 block text-sm text-muted">
            Confidential support, any time.
          </span>
        </span>
        <span aria-hidden className="text-lg text-wine">
          →
        </span>
      </Link>
    </main>
  );
}
