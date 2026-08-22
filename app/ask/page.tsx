"use client";

import { useState } from "react";
import Link from "next/link";
import QuickExit from "@/components/QuickExit";
import Icon from "@/components/Icon";
import { REFERRALS, type ReferralCategory } from "@/content/referrals";
import { match, byCategory, hasAnyReferrals, type Match } from "@/lib/referrals/match";

/**
 * Ask — the referral bot.
 *
 * Runs entirely on the phone. No API call, no key, no account, nothing sent
 * anywhere, and it works with no connection at all because the matcher and its
 * data are compiled into the bundle the service worker already caches.
 *
 * It cannot invent a number. It can only surface rows from
 * `content/referrals.ts`, and those stay hidden until somebody has phoned them.
 * When it has no answer it says so, rather than producing something plausible.
 */

const CATEGORIES: { id: ReferralCategory; label: string }[] = [
  { id: "bank", label: "Money" },
  { id: "hospital", label: "Health" },
  { id: "police", label: "Police" },
  { id: "legal", label: "Legal" },
  { id: "mental-health", label: "Someone to talk to" },
  { id: "shelter", label: "Somewhere to stay" },
];

export default function Ask() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Match[] | null>(null);
  const anything = hasAnyReferrals();

  const ask = () => {
    const q = query.trim();
    if (!q) return;
    setResults(match(q));
  };

  return (
    <main>
      <QuickExit />

      <header className="mb-lg">
        <h1 className="font-display text-display font-semibold leading-[1.05] tracking-display">
          Ask
        </h1>
        <p className="mt-2xs max-w-[38ch] text-md leading-relaxed text-ink-2">
          Where to go and who to call. Works without airtime or a connection,
          and nothing you type here leaves your phone.
        </p>
      </header>

      {!anything ? (
        /* The honest state, and the one that ships today. A search box over an
           empty directory would waste her time and teach her the app is
           useless — better to say what is missing and point at what works. */
        <section className="rule-top rule-bottom py-md">
          <h2 className="font-display text-lg font-semibold tracking-heading">
            Nothing to give you yet
          </h2>
          <p className="mt-2xs max-w-[46ch] text-sm leading-relaxed text-ink-2">
            The places and numbers for this are still being confirmed. We only
            list a line once someone has called it and got an answer, so this
            page stays empty rather than sending you somewhere dead.
          </p>
          <Link
            href="/support"
            className="tap mt-sm block rounded-inner bg-accent px-md py-xs text-center font-semibold text-accent-ink"
          >
            Support
          </Link>
        </section>
      ) : (
        <>
          <div className="flex gap-2xs">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask()}
              placeholder="Open a bank account"
              className="min-h-11 flex-1 rounded-inner border border-rule bg-paper-2 px-xs text-base text-ink"
            />
            <button
              onClick={ask}
              className="tap min-h-11 shrink-0 rounded-inner bg-accent px-md font-semibold text-accent-ink"
            >
              Ask
            </button>
          </div>

          {/* Always reachable, never depends on getting the wording right. */}
          <ul className="mt-sm flex flex-wrap gap-2xs">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => { setQuery(""); setResults(byCategory(c.id)); }}
                  className="tap min-h-11 rounded-pill border border-rule px-sm text-sm text-ink-2 active:bg-paper-2"
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ul>

          {results !== null && results.length === 0 && (
            <section className="rule-top mt-lg pt-md">
              <h2 className="font-display text-lg font-semibold tracking-heading">
                I don&rsquo;t have that one
              </h2>
              <p className="mt-2xs max-w-[46ch] text-sm leading-relaxed text-ink-2">
                Try one of the buttons above, or a plainer word — &ldquo;bank&rdquo;,
                &ldquo;hospital&rdquo;, &ldquo;police&rdquo;. If it is urgent, Support has the
                confirmed lines.
              </p>
            </section>
          )}

          {results !== null && results.length > 0 && (
            <ul className="index rule-top mt-lg">
              {results.map(({ referral: r }) => (
                <li key={r.id} className="py-md">
                  <h2 className="font-display text-lg font-semibold tracking-heading">
                    {r.name}
                  </h2>
                  <p className="mt-3xs max-w-[46ch] text-sm leading-relaxed text-ink-2">
                    {r.what}
                  </p>
                  {(r.hours || r.cost) && (
                    <p className="tnum mt-3xs text-xs text-calm">
                      {[r.hours, r.cost].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {r.address && <p className="mt-3xs text-xs text-ink-2">{r.address}</p>}

                  {/* Wine is act-now. A confirmed line earns it; a website does
                      not, so the link stays quiet and bordered. */}
                  {r.verified && r.phone && (
                    <a
                      href={`tel:${r.phone.replace(/\s/g, "")}`}
                      className="tap mt-sm block rounded-inner bg-accent px-md py-xs text-center font-semibold text-accent-ink"
                    >
                      Call {r.phone}
                    </a>
                  )}
                  {r.url && (
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tap mt-2xs block min-h-11 rounded-inner border border-rule px-md py-xs text-center text-sm text-ink-2 active:bg-paper-2"
                    >
                      Open their website
                    </a>
                  )}
                  {!r.verified && !r.phone && (
                    <p className="mt-2xs text-xs text-ink-2">
                      No confirmed phone line for this one yet.
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      <Link
        href="/elle"
        className="tap tap-tint rule-top mt-lg -mx-5 flex items-start gap-xs px-5 py-md active:bg-paper-2"
      >
        <span aria-hidden className="mt-3xs grid h-9 w-9 shrink-0 place-items-center rounded-full bg-rose-tint text-rose-ink">
          <Icon name="elle" className="h-[18px] w-[18px]" />
        </span>
        <span>
          <span className="block font-display text-lg font-semibold tracking-heading">
            Talk to Elle
          </span>
          <span className="mt-3xs block text-sm text-ink-2">
            For the things a list cannot answer. Needs a connection, and read the
            note first.
          </span>
        </span>
      </Link>

      {process.env.NODE_ENV !== "production" && (
        <p className="rule-top mt-xl pt-sm text-xs text-ink-2">
          Dev only: {REFERRALS.length} entries in content/referrals.ts,{" "}
          {REFERRALS.filter((r) => r.verified && r.phone).length} with a confirmed
          phone line. Research with docs/scrape-prompt.md, then call each one.
        </p>
      )}
    </main>
  );
}
