"use client";

import { RESOURCES, liveResources, flaggedResources } from "@/content/support";
import Link from "next/link";
import QuickExit from "@/components/QuickExit";
import Icon from "@/components/Icon";

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
        className="tap mb-lg flex min-h-[56px] items-center justify-center gap-2xs rounded-inner bg-accent px-md py-sm font-semibold text-accent-ink shadow-lift"
      >
        <Icon name="quiet" className="h-[18px] w-[18px]" /> Open Quiet Mode
      </Link>

      {/* The barrier is rarely the number — it is not knowing what happens after
          you dial. Saying so plainly is the point of this block. */}
      <section className="app-panel mb-lg p-md">
        <h2 className="font-display text-lg font-semibold tracking-heading">
          What happens when you call
        </h2>
        <p className="mt-2xs max-w-[46ch] text-sm leading-relaxed text-ink-2">
          Whichever line you ring, you will not be forced to report anything, or
          to do anything you do not want to do. You can just talk, and decide
          your next step when you are ready.
        </p>
      </section>

      {live.length === 0 ? (
        <section className="app-panel p-md">
          <h2 className="font-display text-lg font-semibold tracking-heading">
            Where the numbers are
          </h2>
          <p className="mt-2xs max-w-[46ch] text-sm leading-relaxed text-ink-2">
            GAL does not print a helpline it cannot stand behind. The ones
            gathered for this page came secondhand and disagree with each other,
            so they are not here.
          </p>
          <p className="mt-2xs max-w-[46ch] text-sm leading-relaxed text-ink-2">
            Ask holds the numbers each place publishes itself — hospitals, banks,
            and the police emergency line.
          </p>
          <p className="mt-2xs max-w-[46ch] text-sm leading-relaxed text-ink-2">
            And if you need somebody now, you do not need a number first. The
            nearest health facility or police post will see you without one.
          </p>
          <Link
            href="/ask"
            className="tap mt-sm block rounded-inner bg-accent px-md py-xs text-center font-semibold text-accent-ink"
          >
            Open Ask
          </Link>
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
              <p className="tnum mt-3xs text-xs text-calm">
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

      <section className="mt-lg">
        <h2 className="font-display text-lg font-semibold tracking-heading">Help tools</h2>
        <div className="mt-sm grid grid-cols-2 gap-2xs">
          <Tool href="/elle" icon="elle" title="Elle" sub="Think it through" />
          <Tool href="/check" icon="check" title="Check" sub="Nothing saved" />
          <Tool href="/plan" icon="plan" title="Plan" sub="Ticks only" />
          <Tool href="/contacts" icon="contacts" title="Contacts" sub="Up to three" />
        </div>
      </section>

      <p className="mt-lg text-xs text-ink-2">
        GAL does not record who you call, and nothing you do here is sent anywhere.
      </p>
    </main>
  );
}

function Tool({
  href,
  icon,
  title,
  sub,
}: {
  href: string;
  icon: "elle" | "check" | "plan" | "contacts";
  title: string;
  sub: string;
}) {
  return (
    <Link href={href} className="tap app-tile flex min-h-[96px] flex-col justify-between p-sm active:scale-[0.99]">
      <span aria-hidden className="grid h-9 w-9 place-items-center rounded-full bg-rose-tint text-rose-ink">
        <Icon name={icon} className="h-[18px] w-[18px]" />
      </span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="mt-3xs block text-xs text-ink-2">{sub}</span>
      </span>
    </Link>
  );
}
