"use client";

import { RESOURCES, liveResources, flaggedResources } from "@/content/support";
import Link from "next/link";
import QuickExit from "@/components/QuickExit";

/**
 * Structural restraint here is a safety feature, not a style. Nothing
 * decorative may compete with the numbers.
 */
export default function Support() {
  const live = liveResources();
  const pending = RESOURCES.length - live.length;
  const flagged = flaggedResources();

  return (
    <main>
      <QuickExit />

      <header className="mb-lg">
        <h1 className="font-display text-display font-semibold leading-[1.05] tracking-display">
          Support
        </h1>
        <p className="mt-2xs max-w-[38ch] text-md leading-relaxed text-ink-2">
          Free and confidential. You do not have to explain yourself to use these.
        </p>
      </header>

      {/* Quiet Mode sits above the reassurance block on purpose: someone who
          needs it is not reading, she is scanning for the fastest way out. */}
      <Link
        href="/quiet"
        className="tap mb-lg block rounded-inner bg-accent px-md py-sm text-center font-semibold text-accent-ink"
      >
        Open Quiet Mode
      </Link>

      {/* The barrier is rarely the number — it is not knowing what happens after
          you dial. Saying so plainly is the point of this block. */}
      <section className="rule-top rule-bottom mb-lg py-md">
        <h2 className="font-display text-lg font-semibold tracking-heading">
          What happens when you call
        </h2>
        <p className="mt-2xs max-w-[46ch] text-sm leading-relaxed text-ink-2">
          The line is free, confidential and judgement-free. You will not be forced to
          report anything, or to do anything you do not want to do. You can just talk —
          and decide your next step when you are ready.
        </p>
      </section>

      {live.length === 0 ? (
        <section>
          <h2 className="font-display text-lg font-semibold tracking-heading">
            Numbers are being confirmed
          </h2>
          <p className="mt-2xs max-w-[46ch] text-sm leading-relaxed text-ink-2">
            We only list a line once we have called it ourselves and someone answered. If
            you need help right now, go to the nearest health facility or police station.
          </p>
        </section>
      ) : (
        <ul className="index rule-top">
          {live.map((r) => (
            <li key={r.id} className="py-md">
              <h2 className="font-display text-lg font-semibold tracking-heading">
                {r.name}
              </h2>
              <p className="mt-3xs max-w-[46ch] text-sm leading-relaxed text-ink-2">
                {r.what}
              </p>
              <p className="tnum mt-3xs text-xs text-ink-2">
                {r.hours} · {r.cost}
              </p>
              {r.address && <p className="mt-3xs text-xs text-ink-2">{r.address}</p>}
              <a
                href={`tel:${r.phone.replace(/\s/g, "")}`}
                className="tap mt-sm block rounded-inner bg-accent px-md py-xs text-center font-semibold text-accent-ink"
              >
                Call {r.phone}
              </a>
            </li>
          ))}
        </ul>
      )}

      {process.env.NODE_ENV !== "production" && pending > 0 && (
        <p className="rule-top mt-xl pt-sm text-xs text-ink-2">
          Dev only: {pending} of {RESOURCES.length} resources in content/support.ts are
          unverified and hidden from users
          {flagged.length > 0 && `, ${flagged.length} carrying an unresolved flag`}. Call
          each one, then set verified: true.
        </p>
      )}

      <Link href="/plan" className="tap tap-tint rule-top -mx-5 mt-xl block px-5 py-md active:bg-paper-2">
        <span className="block font-display text-lg font-semibold tracking-heading">My safety plan</span>
        <span className="mt-3xs block text-sm text-ink-2">Six things worth having ready. Ticks only, kept on this phone.</span>
      </Link>

      <Link href="/contacts" className="tap tap-tint rule-top -mx-5 block px-5 py-md active:bg-paper-2">
        <span className="block font-display text-lg font-semibold tracking-heading">Trusted contacts</span>
        <span className="mt-3xs block text-sm text-ink-2">Up to three people Quiet Mode can message. Kept on this phone.</span>
      </Link>

      <p className="mt-lg text-xs text-ink-2">
        GAL does not record who you call, and nothing you do here is sent anywhere.
      </p>
    </main>
  );
}
