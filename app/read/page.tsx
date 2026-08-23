"use client";

import { useState } from "react";
import Link from "next/link";
import { TOPICS, bySection, type Section } from "@/content/articles";
import QuickExit from "@/components/QuickExit";

/**
 * One reading tab.
 *
 * Money, Health and Learn used to be three separate tabs, which put six items
 * in a bar that has room for four. They were never three activities — they were
 * one activity wearing three labels, and the tab bar was carrying the product's
 * org chart instead of what she actually does.
 *
 * So the sections became a segmented control inside a single tab. The routes
 * /finance, /health and /learn still exist and still work: they are deep links
 * now rather than destinations, which is what the onboarding focus card and the
 * clinics link need.
 */
const SECTIONS: { id: Section; label: string }[] = [
  { id: "finance", label: "Money" },
  { id: "health", label: "Health" },
  { id: "learn", label: "Learn" },
];

export default function Read() {
  const [section, setSection] = useState<Section>("health");
  const [topic, setTopic] = useState<string | null>(null);

  const all = bySection(section);
  const live = TOPICS[section].filter((t) => all.some((a) => a.topic === t));
  const items = topic ? all.filter((a) => a.topic === topic) : all;

  const pick = (s: Section) => {
    setSection(s);
    setTopic(null); // A topic from Money means nothing under Health.
  };

  return (
    <main>
      {/* These pages name what she is reading about — "He Beat You", "Going to
          the Police" — several titles at once. The article itself carried a
          quick exit and the list that advertises it did not, which was the
          wrong way round. */}
      <QuickExit />

      <header className="mb-md">
        <h1 className="font-display text-display font-semibold leading-[1.05] tracking-display">
          Read
        </h1>
        <p className="mt-2xs max-w-[38ch] text-md leading-relaxed text-ink-2">
          Short guides. Start anywhere — nothing here is in order.
        </p>
      </header>

      {/* Section switcher. A segmented control, not a second row of pills, so it
          reads as a different level from the topic filters below it. */}
      <div
        role="tablist"
        aria-label="Sections"
        className="mb-sm flex rounded-pill border border-rule bg-paper-2 p-3xs"
      >
        {SECTIONS.map((s) => {
          const on = s.id === section;
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={on}
              onClick={() => pick(s.id)}
              className={`tap seg-opt min-h-11 flex-1 rounded-pill text-sm ${
                on ? "bg-accent font-semibold text-accent-ink" : "text-ink-2"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {live.length > 0 && (
        <div className="-mx-5 mb-md flex gap-2xs overflow-x-auto px-5 pb-3xs">
          <Pill on={topic === null} onClick={() => setTopic(null)}>
            All
          </Pill>
          {live.map((t) => (
            <Pill key={t} on={topic === t} onClick={() => setTopic(t)}>
              {t}
            </Pill>
          ))}
        </div>
      )}

      {items.length === 0 ? (
        <p className="rule-top py-lg text-ink-2">
          Nothing here yet. New reads land here as they are written.
        </p>
      ) : (
        <ul className="index rule-top">
          {items.map((a, i) => (
            <li key={a.slug} className="rise" style={{ animationDelay: `${Math.min(i, 5) * 30}ms` }}>
              <Link
                href={`/read/${a.slug}`}
                className="tap tap-tint -mx-5 block px-5 py-md active:bg-paper-2"
              >
                <h2 className="font-display text-lg font-semibold leading-[1.25] tracking-heading">
                  {a.title}
                </h2>
                <p className="mt-3xs max-w-[46ch] text-sm leading-relaxed text-ink-2">
                  {a.blurb}
                </p>
                <p className="tnum mt-2xs text-xs text-rose-ink">
                  {a.minutes} min
                  {a.topic ? ` · ${a.topic}` : ""}
                  {a.level ? ` · ${a.level}` : ""}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {section === "health" && (
        <Link
          href="/clinics"
          className="tap tap-tint rule-top -mx-5 mt-xl block px-5 py-md active:bg-paper-2"
        >
          <span className="block font-display text-lg font-semibold tracking-heading">
            Clinics near you
          </span>
          <span className="mt-3xs block text-sm text-ink-2">
            Places you can go, and what they cost.
          </span>
        </Link>
      )}
    </main>
  );
}

function Pill({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={`tap min-h-11 shrink-0 whitespace-nowrap rounded-pill border px-md text-sm ${
        on
          ? "border-accent bg-accent font-semibold text-accent-ink"
          : "border-rose-edge bg-rose-tint text-rose-ink active:bg-rose-tint-2"
      }`}
    >
      {children}
    </button>
  );
}
