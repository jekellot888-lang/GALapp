"use client";

import { RESOURCES, liveResources, flaggedResources } from "@/content/support";
import QuickExit from "@/components/QuickExit";

export default function Support() {
  const live = liveResources();
  const pending = RESOURCES.length - live.length;
  const flagged = flaggedResources();

  return (
    <main>
      <QuickExit />

      <header className="grain relative mb-6 overflow-hidden rounded-card bg-mulled p-5 text-white shadow-lift">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-white/80">
          Tap to call
        </p>
        <h1 className="mt-1.5 font-display text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.02em]">
          Support
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-white/90">
          Free and confidential. You do not have to explain yourself to use these.
        </p>
      </header>

      {/* The barrier is rarely the number — it is not knowing what happens after
          you dial. Saying so plainly is the point of this block. */}
      <section className="mb-6 rounded-card border border-line bg-white p-4 shadow-card">
        <h2 className="font-display text-base font-semibold">
          What happens when you call
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          The line is free, confidential and judgement-free. You will not be forced to
          report anything, or to do anything you do not want to do. You can just talk —
          and decide your next step when you are ready.
        </p>
      </section>

      {live.length === 0 ? (
        <div className="rounded-card border border-wine/30 bg-white p-5 shadow-card">
          <p className="font-display text-lg font-semibold">Numbers are being confirmed</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            We only list a line once we have called it ourselves and someone answered. If
            you need help right now, go to the nearest health facility or police station.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {live.map((r) => (
            <li key={r.id} className="rounded-card bg-white p-4 shadow-card">
              <p className="font-display text-[1.0625rem] font-semibold">{r.name}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{r.what}</p>
              <p className="mt-1.5 text-xs text-muted">
                {r.hours} · {r.cost}
              </p>
              {r.address && <p className="mt-1 text-xs text-muted">{r.address}</p>}
              <a
                href={`tel:${r.phone.replace(/\s/g, "")}`}
                className="tap mt-3.5 block rounded-inner bg-wine px-4 py-3.5 text-center font-semibold text-white shadow-lift"
              >
                Call {r.phone}
              </a>
            </li>
          ))}
        </ul>
      )}

      {process.env.NODE_ENV !== "production" && pending > 0 && (
        <p className="mt-6 rounded-card bg-white/60 p-3 text-xs text-muted">
          ⚠ Dev only: {pending} of {RESOURCES.length} resources in content/support.ts are
          unverified and hidden from users
          {flagged.length > 0 && `, ${flagged.length} carrying an unresolved flag`}. Call
          each one, then set verified: true.
        </p>
      )}

      <p className="mt-6 text-xs text-muted">
        GAL does not record who you call, and nothing you do here is sent anywhere.
      </p>
    </main>
  );
}
