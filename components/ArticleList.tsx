"use client";

import { useState } from "react";
import Link from "next/link";
import { TOPICS, bySection, type Section } from "@/content/articles";
import QuickExit from "@/components/QuickExit";

/**
 * An index, not a deck of cards. Entries are divided by hairlines and sit
 * directly on the paper. The old version wrapped every entry in a white
 * rounded box with a shadow, which is why five different screens looked like
 * one screen.
 */
export default function ArticleList({
  section,
  title,
  intro,
}: {
  section: Section;
  title: string;
  intro: string;
}) {
  const [topic, setTopic] = useState<string | null>(null);
  const all = bySection(section);

  // Only offer a pill that actually has something behind it.
  const live = TOPICS[section].filter((t) => all.some((a) => a.topic === t));
  const items = topic ? all.filter((a) => a.topic === topic) : all;

  return (
    <main>
      {/* These pages name what she is reading about — "He Beat You", "Going to
          the Police" — several titles at once. The article itself carried a
          quick exit and the list that advertises it did not, which was the
          wrong way round. */}
      <QuickExit />

      <header className="mb-lg">
        <h1 className="font-display text-display font-semibold leading-[1.05] tracking-display">
          {title}
        </h1>
        <p className="mt-2xs max-w-[38ch] text-md leading-relaxed text-ink-2">{intro}</p>
      </header>

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
                <p className="tnum mt-2xs text-xs text-ink-2">
                  {a.minutes} min
                  {a.topic ? ` · ${a.topic}` : ""}
                  {a.level ? ` · ${a.level}` : ""}
                </p>
              </Link>
            </li>
          ))}
        </ul>
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
          : "border-rule text-ink-2 active:bg-paper-2"
      }`}
    >
      {children}
    </button>
  );
}
