"use client";

import { useState } from "react";
import Link from "next/link";
import QuickExit from "@/components/QuickExit";

/**
 * "Is this abuse?" — a private check.
 *
 * NOTHING ON THIS SCREEN IS SAVED. Not to localStorage, not anywhere. This is
 * the one place in GAL that deliberately forgets, and it is not an oversight to
 * be tidied up later: a stored record reading "I have been hit, pushed,
 * threatened, or forced" is the single most dangerous string this app could
 * leave on a phone that gets taken off her. Answers live in component state and
 * die when she navigates away.
 *
 * The result never scores her out of five and never congratulates her for
 * answering. It reflects back what she described, says it is not her fault, and
 * puts the next step one tap away. Copy is from the Elle design canvas; the
 * canvas version named a specific helpline inline, which is routed through the
 * support gate here instead so no unverified number reaches her.
 */
const STATEMENTS = [
  "I change my behaviour to keep someone calm",
  "I am afraid of how someone reacts when they are angry",
  "I have stopped seeing friends or handling my own money",
  "I have been hit, pushed, threatened, or forced",
  "I feel small, controlled, or unable to make my own choices",
];

function result(n: number) {
  if (n === 0)
    return {
      title: "Nothing selected — and that is fine.",
      body: "You can come back to this any time. It is here whenever something starts to feel off.",
    };
  if (n <= 2)
    return {
      title: "Some of this is worth watching.",
      body: "One or two of these can be an ordinary bad patch, or the start of a pattern. The read below takes five minutes and is the clearest thing we have on telling the two apart.",
    };
  return {
    title: "What you describe is abuse.",
    body: "You do not need proof, and you do not need anyone's permission to ask for help. A safety plan can be started quietly, one step at a time, and nothing has to happen today.",
  };
}

export default function Check() {
  const [picked, setPicked] = useState<number[]>([]);
  const [shown, setShown] = useState(false);

  const toggle = (i: number) => {
    setShown(false);
    setPicked((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]));
  };

  const r = result(picked.length);

  return (
    <main>
      <QuickExit />

      <header className="mb-lg">
        <h1 className="font-display text-display font-semibold leading-[1.05] tracking-display">
          Is this abuse?
        </h1>
        <p className="mt-2xs max-w-[38ch] text-md leading-relaxed text-ink-2">
          A private check. Nothing here is saved, counted, or sent — it disappears
          when you leave this screen.
        </p>
      </header>

      <ul className="index rule-top">
        {STATEMENTS.map((s, i) => {
          const on = picked.includes(i);
          return (
            <li key={i}>
              <button
                onClick={() => toggle(i)}
                aria-pressed={on}
                className="tap tap-tint -mx-5 flex w-[calc(100%+2.5rem)] items-start gap-xs px-5 py-md text-left active:bg-paper-2"
              >
                <span
                  aria-hidden
                  className={`tap mt-3xs grid h-6 w-6 shrink-0 place-items-center rounded-full border text-xs ${
                    on ? "border-accent bg-accent text-accent-ink" : "border-rule-strong"
                  }`}
                >
                  {on ? "✓" : ""}
                </span>
                <span className="max-w-[40ch] text-md leading-relaxed">{s}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {!shown ? (
        <button
          onClick={() => setShown(true)}
          className="tap mt-lg min-h-[52px] w-full rounded-inner bg-accent px-md font-semibold text-accent-ink"
        >
          See my result
        </button>
      ) : (
        <section className="rule-top mt-lg pt-md">
          <h2 className="font-display text-xl font-semibold leading-[1.2] tracking-heading">
            {r.title}
          </h2>
          <p className="mt-2xs max-w-[44ch] text-md leading-relaxed text-ink-2">{r.body}</p>

          <div className="index mt-md rule-top">
            <Link
              href="/read/patterns-that-harm-you"
              className="tap tap-tint -mx-5 block px-5 py-md active:bg-paper-2"
            >
              <span className="block font-display text-lg font-semibold tracking-heading">
                Understanding Patterns That Harm You
              </span>
              <span className="mt-3xs block text-sm text-ink-2">5 min read</span>
            </Link>
            {picked.length > 0 && (
              <>
                <Link
                  href="/plan"
                  className="tap tap-tint -mx-5 block px-5 py-md active:bg-paper-2"
                >
                  <span className="block font-display text-lg font-semibold tracking-heading">
                    Start a safety plan
                  </span>
                  <span className="mt-3xs block text-sm text-ink-2">
                    Six steps, ticks only, kept on this phone.
                  </span>
                </Link>
                <Link
                  href="/support"
                  className="tap tap-tint -mx-5 block px-5 py-md active:bg-paper-2"
                >
                  <span className="block font-display text-lg font-semibold tracking-heading">
                    Someone to talk to
                  </span>
                  <span className="mt-3xs block text-sm text-ink-2">
                    Free, confidential, and you do not have to explain yourself.
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Clearing is offered explicitly, because "it disappears when you
              leave" is only reassuring if she can also make it disappear now. */}
          <button
            onClick={() => {
              setPicked([]);
              setShown(false);
            }}
            className="tap mt-lg min-h-11 w-full rounded-pill border border-rule text-sm text-ink-2 active:bg-paper-2"
          >
            Clear my answers
          </button>
        </section>
      )}
    </main>
  );
}
