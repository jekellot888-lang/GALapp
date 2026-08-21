"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppState, today, type Mood } from "@/lib/state";
import { useShake } from "@/lib/useShake";
import { feedback } from "@/lib/haptics";
import { affirmationForDay, randomAffirmation } from "@/lib/affirmations";
import InstallSheet from "@/components/InstallSheet";

/** Words, not faces. Emoji as a UI control is the loudest AI tell there is. */
const MOODS: { id: Mood; label: string }[] = [
  { id: "good", label: "Good" },
  { id: "okay", label: "Okay" },
  { id: "low", label: "Low" },
  { id: "tough", label: "Tough" },
];

const GOALS = [
  { id: "water", label: "Drink a glass of water" },
  { id: "breathe", label: "Take 3 deep breaths" },
  { id: "save", label: "Save a small amount" },
  { id: "move", label: "Move your body 5 min" },
];

/** Where the onboarding answer points. Keyed to lib/state Focus. */
const FIRST = {
  money: { href: "/finance", title: "Money of your own", sub: "Earning it, keeping it, and what is yours by right." },
  calm: { href: "/health", title: "Feeling steadier", sub: "Rest, mood, and getting your breath back." },
  safety: { href: "/support", title: "Staying safe", sub: "A plan, your rights, and someone to call." },
} as const;

function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Home() {
  const router = useRouter();
  const { state, ready, setMood, toggleGoal } = useAppState();
  const t = today();

  /**
   * First run, and the disguise.
   *
   * The calculator redirect fires once per browsing session rather than once
   * per navigation — otherwise tapping Home in the nav would bounce her back
   * out of the app she just unlocked. sessionStorage is the right scope for
   * "since she opened it".
   */
  useEffect(() => {
    if (!ready) return;
    if (!state.onboarded) {
      router.replace("/welcome");
      return;
    }
    if (state.disguise && !sessionStorage.getItem("gal.opened")) {
      sessionStorage.setItem("gal.opened", "1");
      router.replace("/calculator");
    }
  }, [ready, state.onboarded, state.disguise, router]);

  const daily = useMemo(() => affirmationForDay(t), [t]);
  const [affirmation, setAffirmation] = useState(daily);
  const [swapping, setSwapping] = useState(false);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Fade the old line out, swap the text at the bottom of the fade, let the new
   * one come back. A transition, not a keyframe: shake can fire again before the
   * last swap settles, and a transition retargets from its current value.
   */
  const reroll = useCallback(() => {
    /* A swap already mid-fade wins. Without this, taps arriving faster than the
       fade-out restart it every time and the line never swaps back in. */
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
      <header className="mb-lg">
        <p className="text-sm text-ink-2">{greeting()},</p>
        <h1 className="font-display text-display font-semibold leading-[1.05] tracking-display">
          {state.name ?? "you"}
        </h1>
        {ready && state.streak > 0 && (
          <p className="tnum mt-3xs text-sm text-ink-2">
            {state.streak} day{state.streak === 1 ? "" : "s"} in a row
          </p>
        )}
      </header>

      <InstallSheet />

      {/* Onboarding asked what she wanted first and this is where that answer
          goes. A setup question whose answer changes nothing is worse than not
          asking it. */}
      {ready && state.focus && (
        <Link
          href={FIRST[state.focus].href}
          className="tap tap-tint rule-top rule-bottom -mx-5 mb-lg block px-5 py-md active:bg-paper-2"
        >
          <span className="block text-xs uppercase tracking-label text-ink-2">
            First for you
          </span>
          <span className="mt-3xs block font-display text-lg font-semibold tracking-heading">
            {FIRST[state.focus].title}
          </span>
          <span className="mt-3xs block text-sm text-ink-2">
            {FIRST[state.focus].sub}
          </span>
        </Link>
      )}

      {/* The affirmation is the one set-piece this page is allowed. It earns it
          by being type, not a gradient box with a quote in it. */}
      <section className="rule-top rule-bottom mb-lg py-lg">
        <p
          data-swapping={swapping}
          aria-live="polite"
          className="aff font-display text-2xl font-semibold leading-[1.25] tracking-heading"
        >
          {affirmation}
        </p>
        <div className="mt-md flex items-center justify-between gap-sm">
          <span className="text-xs text-ink-2">Today&rsquo;s line</span>
          {status === "needs-permission" ? (
            <button
              onClick={enable}
              className="tap min-h-11 shrink-0 rounded-pill border border-rule px-md text-sm text-ink-2 active:bg-paper-2"
            >
              Turn on shake
            </button>
          ) : (
            <button
              onClick={reroll}
              className="tap min-h-11 shrink-0 rounded-pill border border-rule px-md text-sm text-ink-2 active:bg-paper-2"
            >
              {status === "listening" ? "Shake, or tap" : "New one"}
            </button>
          )}
        </div>
      </section>

      {/* Mood */}
      <section className="mb-lg">
        <h2 className="font-display text-lg font-semibold tracking-heading">
          How are you today?
        </h2>
        <div className="mt-sm grid grid-cols-4 gap-2xs">
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
                className={`tap min-h-11 rounded-inner border text-sm ${
                  on
                    ? "border-accent bg-accent font-semibold text-accent-ink"
                    : "border-rule text-ink-2 active:bg-paper-2"
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>
        {mood === "tough" && (
          <Link
            href="/support"
            className="tap rise mt-sm block rounded-inner bg-accent px-md py-xs text-center text-sm font-semibold text-accent-ink"
          >
            Talk to someone now
          </Link>
        )}
      </section>

      {/* Goals */}
      <section className="mb-lg">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-lg font-semibold tracking-heading">
            Today&rsquo;s goals
          </h2>
          <span className="tnum text-sm text-ink-2">
            {done.length}/{GOALS.length}
          </span>
        </div>
        <ul className="index mt-sm rule-top">
          {GOALS.map((g) => {
            const on = done.includes(g.id);
            return (
              <li key={g.id}>
                <button
                  onClick={() => {
                    toggleGoal(g.id);
                    feedback(10);
                  }}
                  aria-pressed={on}
                  className="tap tap-tint -mx-5 flex w-[calc(100%+2.5rem)] items-center gap-xs px-5 py-xs text-left active:bg-paper-2"
                >
                  <span
                    className={`tap grid h-5 w-5 shrink-0 place-items-center rounded-full border text-xs ${
                      on
                        ? "border-accent bg-accent text-accent-ink"
                        : "border-rule-strong"
                    }`}
                    aria-hidden
                  >
                    {on ? "✓" : ""}
                  </span>
                  <span className={on ? "text-ink-2 line-through" : ""}>{g.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <Link
        href="/support"
        className="tap tap-tint rule-top -mx-5 block px-5 py-md active:bg-paper-2"
      >
        <span className="block font-display text-lg font-semibold tracking-heading">
          Need someone to talk to?
        </span>
        <span className="mt-3xs block text-sm text-ink-2">
          Confidential support, any time.
        </span>
      </Link>
    </main>
  );
}
