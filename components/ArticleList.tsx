"use client";

import { useState } from "react";
import Link from "next/link";
import { TOPICS, bySection, type Section } from "@/content/articles";

export default function ArticleList({
  section,
  title,
  intro,
  eyebrow,
}: {
  section: Section;
  title: string;
  intro: string;
  eyebrow: string;
}) {
  const [topic, setTopic] = useState<string | null>(null);
  const all = bySection(section);
  const topics = TOPICS[section];

  // Only offer a pill that actually has something behind it.
  const live = topics.filter((t) => all.some((a) => a.topic === t));
  const items = topic ? all.filter((a) => a.topic === topic) : all;

  return (
    <main>
      <header className="grain relative mb-6 overflow-hidden rounded-card bg-mulled p-5 text-white shadow-lift">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-white/80">
          {eyebrow}
        </p>
        <h1 className="mt-1.5 font-display text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.02em]">
          {title}
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-white/90">{intro}</p>
      </header>

      {live.length > 0 && (
        <div className="-mx-5 mb-5 flex gap-2 overflow-x-auto px-5 pb-1">
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
        <div className="rounded-card border border-line bg-white p-6 text-center shadow-card">
          <p className="font-display text-lg font-semibold">Nothing here yet</p>
          <p className="mx-auto mt-1.5 max-w-[34ch] text-sm text-muted">
            New reads land here as they are written.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {/* Only the first few stagger. Past that the cascade is just a wait on
              a list she opens several times a day. */}
          {items.map((a, i) => (
            <li key={a.slug} className="rise" style={{ animationDelay: `${Math.min(i, 5) * 30}ms` }}>
              <Link
                href={`/read/${a.slug}`}
                className="tap tap-lift block rounded-card bg-white p-4 shadow-card active:shadow-lift"
              >
                {a.topic && (
                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    {a.topic}
                  </span>
                )}
                <p className="mt-1 font-display text-[1.0625rem] font-semibold leading-snug">
                  {a.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{a.blurb}</p>
                <p className="tnum mt-2.5 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-wine">
                  {a.minutes} min read{a.level ? ` · ${a.level}` : ""}
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
      className={`tap min-h-11 shrink-0 whitespace-nowrap rounded-pill border px-4 text-sm font-semibold ${
        on
          ? "border-wine bg-wine text-white"
          : "border-line bg-white text-muted active:bg-blush"
      }`}
    >
      {children}
    </button>
  );
}
