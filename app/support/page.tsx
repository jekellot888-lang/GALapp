"use client";

import { RESOURCES, liveResources } from "@/content/support";
import QuickExit from "@/components/QuickExit";

export default function Support() {
  const live = liveResources();
  const pending = RESOURCES.length - live.length;

  return (
    <main>
      <QuickExit />

      <h1 className="font-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em]">
        Support
      </h1>
      <p className="mb-7 mt-1.5 text-muted">
        Free and confidential. You do not have to explain yourself to use these.
      </p>

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

      {pending > 0 && (
        <p className="mt-6 rounded-card bg-white/60 p-3 text-xs text-muted">
          ⚠ Build note, remove before launch: {pending} resource
          {pending === 1 ? "" : "s"} in content/support.ts still unverified and hidden from
          users.
        </p>
      )}

      <p className="mt-6 text-xs text-muted">
        GAL does not record who you call, and nothing you do here is sent anywhere.
      </p>
    </main>
  );
}
