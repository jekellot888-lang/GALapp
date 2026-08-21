"use client";

import Link from "next/link";
import { CLINICS, liveClinics, prcClinics } from "@/content/clinics";
import QuickExit from "@/components/QuickExit";

/**
 * Clinics — a directory, not a booking system.
 *
 * The canvas designed a booking flow: pick a doctor, pick a day, pick a slot,
 * "Book appointment". GAL cannot hold a slot, cannot tell a clinic she is
 * coming, and cannot tell her if they close early. A button reading "Book
 * appointment" that does none of those things sends someone across Kampala on
 * the strength of a confirmation screen that meant nothing.
 *
 * So this lists places and lets her call them. That is a smaller promise and it
 * is one the app can actually keep.
 */
export default function Clinics() {
  const live = liveClinics();
  const prc = prcClinics();

  return (
    <main>
      <QuickExit />

      <header className="mb-lg">
        <h1 className="font-display text-display font-semibold leading-[1.05] tracking-display">
          Clinics
        </h1>
        <p className="mt-2xs max-w-[38ch] text-md leading-relaxed text-ink-2">
          Places you can go, and what they cost. GAL does not book for you — you
          call them, or you walk in.
        </p>
      </header>

      {live.length === 0 ? (
        <section className="rule-top rule-bottom py-md">
          <h2 className="font-display text-lg font-semibold tracking-heading">
            No clinics listed yet
          </h2>
          <p className="mt-2xs max-w-[46ch] text-sm leading-relaxed text-ink-2">
            We list a clinic once someone has phoned it, confirmed the address by a
            second source, and checked what it actually costs. Nothing here is filled
            in from a web search.
          </p>
          <p className="mt-2xs max-w-[46ch] text-sm leading-relaxed text-ink-2">
            If you need care now, go to the nearest health centre or hospital. After a
            rape, go as soon as you can — some treatment only works within the first
            few days, and you do not have to report anything to receive it.
          </p>
        </section>
      ) : (
        <>
          {prc.length > 0 && (
            <section className="mb-lg">
              <h2 className="font-display text-lg font-semibold tracking-heading">
                Care after rape
              </h2>
              <p className="mt-2xs max-w-[46ch] text-sm leading-relaxed text-ink-2">
                Time matters here. You do not have to report anything to be treated.
              </p>
              <ul className="index mt-sm rule-top">
                {prc.map((c) => (
                  <ClinicRow key={c.id} c={c} />
                ))}
              </ul>
            </section>
          )}
          <ul className="index rule-top">
            {live
              .filter((c) => !c.prc)
              .map((c) => (
                <ClinicRow key={c.id} c={c} />
              ))}
          </ul>
        </>
      )}

      {process.env.NODE_ENV !== "production" && (
        <p className="rule-top mt-xl pt-sm text-xs text-ink-2">
          Dev only: {CLINICS.length} clinics in content/clinics.ts, {live.length} live.
          The file ships empty on purpose — see its header before adding any.
        </p>
      )}

      <Link
        href="/support"
        className="tap tap-tint rule-top -mx-5 mt-xl block px-5 py-md active:bg-paper-2"
      >
        <span className="block font-display text-lg font-semibold tracking-heading">
          Someone to talk to
        </span>
        <span className="mt-3xs block text-sm text-ink-2">
          Free and confidential lines, and a safety plan.
        </span>
      </Link>
    </main>
  );
}

function ClinicRow({ c }: { c: ReturnType<typeof liveClinics>[number] }) {
  return (
    <li className="py-md">
      <h3 className="font-display text-lg font-semibold tracking-heading">{c.name}</h3>
      <p className="mt-3xs max-w-[46ch] text-sm leading-relaxed text-ink-2">{c.what}</p>
      <p className="mt-3xs text-sm text-ink-2">{c.address}</p>
      <p className="tnum mt-3xs text-xs text-ink-2">
        {c.hours} · {c.cost}
        {c.walkIn ? " · walk-ins" : ""}
      </p>
      <a
        href={`tel:${c.phone.replace(/\s/g, "")}`}
        className="tap mt-sm block rounded-inner bg-accent px-md py-xs text-center font-semibold text-accent-ink"
      >
        Call {c.phone}
      </a>
    </li>
  );
}
