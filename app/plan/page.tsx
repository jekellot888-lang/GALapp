"use client";

import Link from "next/link";
import { useAppState } from "@/lib/state";
import QuickExit from "@/components/QuickExit";

/**
 * Safety plan. Six steps, ticks only, kept on this phone.
 *
 * There is no free-text field anywhere on this screen, and that is deliberate.
 * A plan reading "go to Aisha's on Kabaka Anjagala road, she knows" is far more
 * useful to the person she is leaving than it is to her. The tick records that
 * she has sorted a step; the detail stays in her head, where it cannot be read.
 *
 * Steps are from the Elle design canvas.
 */
const STEPS = [
  { id: "place", title: "Somewhere to go", sub: "One place you can reach at any hour without asking permission." },
  { id: "people", title: "Three people who know", sub: "They do not need the details. They need to know to answer the phone." },
  { id: "docs", title: "Documents copied", sub: "ID, birth certificates, land papers — photographed and stored off this phone." },
  { id: "money", title: "Money you can reach", sub: "Cash or mobile money in your own name. Any amount beats none." },
  { id: "bag", title: "A bag you can grab", sub: "Kept somewhere outside the house if that is safer." },
  { id: "word", title: "A word for help", sub: "A phrase you can text or say on a call that means come now." },
];

export default function Plan() {
  const { state, ready, update } = useAppState();
  const done = state.plan ?? [];

  const toggle = (id: string) =>
    update({ plan: done.includes(id) ? done.filter((x) => x !== id) : [...done, id] });

  return (
    <main>
      <QuickExit />

      <header className="mb-lg">
        <h1 className="font-display text-display font-semibold leading-[1.05] tracking-display">
          My safety plan
        </h1>
        <p className="mt-2xs max-w-[38ch] text-md leading-relaxed text-ink-2">
          Kept on this phone only.{" "}
          <span className={`tnum ${done.length ? "font-semibold text-calm" : ""}`}>
            {ready ? `${done.length} of ${STEPS.length} ready.` : ""}
          </span>
        </p>
      </header>

      <ul className="index rule-top">
        {STEPS.map((s) => {
          const on = done.includes(s.id);
          return (
            <li key={s.id}>
              <button
                onClick={() => toggle(s.id)}
                aria-pressed={on}
                className="tap tap-tint -mx-5 flex w-[calc(100%+2.5rem)] items-start gap-xs px-5 py-md text-left active:bg-paper-2"
              >
                <span
                  aria-hidden
                  className={`tap mt-3xs grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs ${
                    on ? "border-calm bg-calm text-on-calm" : "border-rule-strong"
                  }`}
                >
                  {on ? "✓" : ""}
                </span>
                <span>
                  <span
                    className={`block font-display text-lg font-semibold tracking-heading ${
                      on ? "text-ink-2 line-through" : ""
                    }`}
                  >
                    {s.title}
                  </span>
                  <span className="mt-3xs block max-w-[44ch] text-sm leading-relaxed text-ink-2">
                    {s.sub}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-lg max-w-[44ch] text-sm leading-relaxed text-ink-2">
        Nothing here says where you will go or who you will call. That is on
        purpose — a written plan is the first thing read if this phone is taken.
      </p>

      <Link
        href="/quiet"
        className="tap mt-lg block rounded-inner bg-accent px-md py-sm text-center font-semibold text-accent-ink"
      >
        Open Quiet Mode
      </Link>
    </main>
  );
}
