"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState, type Focus } from "@/lib/state";

/**
 * First run. Three steps, from the Elle design canvas.
 *
 * Step 3's copy in the canvas promised Elle could send a location "without
 * anything showing on this screen". No web app can do that, so the promise is
 * corrected here rather than carried over — see app/quiet/page.tsx for the
 * longer note. Onboarding is exactly the wrong place to set an expectation the
 * emergency screen then fails to meet.
 */
type Opt = { id: string; label: string; sub: string };

const STEPS: { kicker: string; title: string; body: string; cta: string; opts: Opt[] }[] = [
  {
    /* The one place the acronym is spelled out. She sees it once, on first run,
       and never has to wonder what the name means again. */
    kicker: "Guide · Assist · Liberate",
    title: "GAL is yours, and it is quiet.",
    body: "No notifications you did not ask for, and a calculator you can hide behind. Choose how it should open.",
    cta: "Continue",
    opts: [
      { id: "calc", label: "Open as a calculator", sub: "Recommended if someone checks your phone" },
      { id: "plain", label: "Open normally", sub: "Straight to your home screen" },
    ],
  },
  {
    kicker: "Step 2",
    title: "What should GAL put first?",
    body: "You can change this any time. It only decides what sits at the top of your home screen.",
    cta: "Continue",
    opts: [
      { id: "money", label: "Money of my own", sub: "Saving, earning, independence" },
      { id: "calm", label: "Feeling steadier", sub: "Rest, mood, breathing" },
      { id: "safety", label: "Staying safe", sub: "Plans, rights, someone to call" },
    ],
  },
  {
    kicker: "Step 3",
    title: "Three people who would answer.",
    body: "Add them now or later. GAL can write them a message with your location and open it ready to send — you tap send yourself, and it will show in your messages.",
    cta: "Enter GAL",
    opts: [],
  },
];

export default function Welcome() {
  const router = useRouter();
  const { update } = useAppState();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<Record<number, string>>({});
  const step = STEPS[i];

  const next = () => {
    if (i === 0) update({ disguise: picked[0] === "calc" });
    if (i === 1 && picked[1]) update({ focus: picked[1] as Focus });
    if (i < STEPS.length - 1) return setI(i + 1);
    update({ onboarded: true });
    router.replace("/");
  };

  const skip = () => {
    update({ onboarded: true });
    router.replace("/");
  };

  return (
    <main className="flex min-h-[78dvh] flex-col pt-lg">
      {/* Progress. Three marks, not a percentage — it is three screens. */}
      <div className="mb-lg flex gap-3xs" aria-hidden>
        {STEPS.map((_, n) => (
          <span
            key={n}
            className={`h-[3px] flex-1 rounded-pill ${n <= i ? "bg-accent" : "bg-rule"}`}
          />
        ))}
      </div>

      <p className="text-xs uppercase tracking-label text-ink-2">{step.kicker}</p>
      <h1 className="mt-2xs font-display text-display font-semibold leading-[1.05] tracking-display">
        {step.title}
      </h1>
      <p className="mt-2xs max-w-[40ch] text-md leading-relaxed text-ink-2">{step.body}</p>

      {step.opts.length > 0 && (
        <ul className="mt-lg space-y-2xs">
          {step.opts.map((o) => {
            const on = picked[i] === o.id;
            return (
              <li key={o.id}>
                <button
                  onClick={() => setPicked({ ...picked, [i]: o.id })}
                  aria-pressed={on}
                  className={`tap w-full rounded-inner border px-md py-sm text-left ${
                    on ? "border-accent bg-accent-2-tint" : "border-rule active:bg-paper-2"
                  }`}
                >
                  <span className="block font-semibold">{o.label}</span>
                  <span className="mt-3xs block text-sm text-ink-2">{o.sub}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {i === 2 && (
        <button
          onClick={() => {
            update({ onboarded: true });
            router.replace("/contacts");
          }}
          className="tap mt-lg min-h-11 w-full rounded-pill border border-rule text-sm text-ink-2 active:bg-paper-2"
        >
          Add them now
        </button>
      )}

      <div className="mt-auto pt-xl">
        <button
          onClick={next}
          disabled={step.opts.length > 0 && !picked[i]}
          className="tap min-h-[52px] w-full rounded-inner bg-accent px-md font-semibold text-accent-ink disabled:opacity-45"
        >
          {step.cta}
        </button>
        <button
          onClick={skip}
          className="tap mt-2xs min-h-11 w-full text-sm text-ink-2 underline underline-offset-4"
        >
          Skip for now
        </button>
      </div>
    </main>
  );
}
