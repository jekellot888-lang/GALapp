"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * Sixty seconds of breathing.
 *
 * This is the one screen where the animation IS the feature. Everywhere else in
 * GAL motion is decoration to be justified; here the circle is the instrument —
 * she paces her breath against it, so removing the motion removes the tool.
 *
 * The timing is not arbitrary and not invented for this screen. It comes from
 * GAL's own guide, breathing-for-calm: "Four in, six out. Longer out than in is
 * what tells your body the threat has passed. Do it six times." Four plus six is
 * ten seconds a cycle, six cycles, sixty seconds — which is also exactly what
 * the design canvas asked for. The app agreeing with itself is the point.
 *
 * CSS animation rather than JS: this runs for a full minute on a cheap phone,
 * and CSS runs off the main thread where requestAnimationFrame does not.
 */
const IN_MS = 4000;
const OUT_MS = 6000;
const CYCLE_MS = IN_MS + OUT_MS;
const CYCLES = 6;

type Stage = "idle" | "running" | "done";

export default function Breathe() {
  const [stage, setStage] = useState<Stage>("idle");
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [cycle, setCycle] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const coreRef = useRef<HTMLSpanElement>(null);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => clear, [clear]);

  const start = useCallback(() => {
    clear();
    setStage("running");
    setCycle(0);
    setPhase("in");
  }, [clear]);

  /**
   * The labels read their position from the circle's own animation rather than
   * from a parallel timer.
   *
   * Two clocks was the obvious implementation and the wrong one: the CSS
   * animation runs off the main thread and never drifts, while setTimeout
   * throttles the moment the tab is backgrounded or the phone is busy. The
   * words would slide out of step with the shape she is breathing against —
   * which, on the one screen where the animation is the instrument, is the
   * whole thing broken.
   *
   * Reading `currentTime` off the running animation means there is only ever
   * one clock. If it pauses, the labels pause with it.
   */
  useEffect(() => {
    if (stage !== "running") return;
    let raf = 0;

    const tick = () => {
      const el = coreRef.current;
      const anim = el?.getAnimations?.()[0];
      const t = typeof anim?.currentTime === "number" ? anim.currentTime : null;

      if (t !== null) {
        const elapsed = t % CYCLE_MS;
        const done = Math.floor(t / CYCLE_MS);
        if (done >= CYCLES) {
          setStage("done");
          return;
        }
        setCycle(done);
        setPhase(elapsed < IN_MS ? "in" : "out");
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stage]);

  const stop = useCallback(() => {
    clear();
    setStage("idle");
  }, [clear]);

  return (
    <main className="flex min-h-[74dvh] flex-col">
      <Link
        href="/"
        className="tap -ml-1 inline-flex min-h-11 items-center gap-2xs pl-1 pr-2xs text-sm text-ink-2"
      >
        <span aria-hidden>←</span> Home
      </Link>

      {stage === "idle" && (
        <div className="mt-lg">
          <h1 className="font-display text-display font-semibold leading-[1.05] tracking-display">
            Three slow breaths
          </h1>
          <p className="mt-2xs max-w-[38ch] text-md leading-relaxed text-ink-2">
            Sixty seconds. In through the nose for four, out through the mouth for
            six. Longer out than in is what tells your body the threat has passed.
          </p>
          <button
            onClick={start}
            className="tap mt-xl min-h-[52px] w-full rounded-inner bg-accent px-md font-semibold text-accent-ink"
          >
            Start
          </button>
          <Link
            href="/read/breathing-for-calm"
            className="tap mt-2xs flex min-h-11 w-full items-center justify-center rounded-pill border border-rose-edge text-sm text-rose-ink active:bg-rose-tint"
          >
            Read about it instead
          </Link>
        </div>
      )}

      {stage === "running" && (
        <div className="flex flex-1 flex-col items-center justify-center">
          {/* The instrument. Two rings: a soft halo that trails the core very
              slightly, so the shape reads as breathing rather than pulsing. */}
          <div className="relative grid h-[260px] w-[260px] place-items-center">
            <span aria-hidden className="breath-halo absolute h-[220px] w-[220px] rounded-full bg-rose-tint-2" />
            <span ref={coreRef} aria-hidden className="breath-core absolute h-[180px] w-[180px] rounded-full bg-accent-2" />
            <p
              aria-live="polite"
              className="relative font-display text-xl font-semibold text-on-rose"
            >
              {phase === "in" ? "Breathe in" : "Breathe out"}
            </p>
          </div>

          <p className="tnum mt-lg text-sm text-ink-2">
            {cycle + 1} of {CYCLES}
          </p>

          <button
            onClick={stop}
            className="tap mt-md min-h-11 rounded-pill border border-rule px-md text-sm text-ink-2 active:bg-paper-2"
          >
            Stop
          </button>
        </div>
      )}

      {stage === "done" && (
        <div className="mt-lg">
          <h1 className="font-display text-display font-semibold leading-[1.05] tracking-display">
            That&rsquo;s a minute.
          </h1>
          <p className="mt-2xs max-w-[38ch] text-md leading-relaxed text-ink-2">
            Nothing has changed outside, but your body has had a moment to catch up.
            You can go again if you want to.
          </p>
          <button
            onClick={start}
            className="tap mt-xl min-h-[52px] w-full rounded-inner bg-accent px-md font-semibold text-accent-ink"
          >
            Again
          </button>
          <Link
            href="/"
            className="tap mt-2xs flex min-h-11 w-full items-center justify-center rounded-pill border border-rule text-sm text-ink-2 active:bg-paper-2"
          >
            Done
          </Link>
        </div>
      )}
    </main>
  );
}
