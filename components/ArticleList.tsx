import Link from "next/link";
import { bySection, type Section } from "@/content/articles";

export default function ArticleList({
  section,
  title,
  intro,
}: {
  section: Section;
  title: string;
  intro: string;
}) {
  const items = bySection(section);
  return (
    <main>
      <h1 className="font-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em]">
        {title}
      </h1>
      <p className="mb-7 mt-1.5 text-muted">{intro}</p>

      {items.length === 0 ? (
        /* Composed empty state rather than one grey line. */
        <div className="rounded-card border border-line bg-white p-6 text-center shadow-card">
          <p className="font-display text-lg font-semibold">Nothing here yet</p>
          <p className="mx-auto mt-1.5 max-w-[34ch] text-sm text-muted">
            New reads land here as they are written. In the meantime, Health has the
            most to read.
          </p>
          <Link
            href="/health"
            className="tap mt-4 inline-flex min-h-11 items-center rounded-pill bg-wine px-5 text-sm font-semibold text-white"
          >
            Go to Health
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((a, i) => (
            <li key={a.slug} className="rise" style={{ animationDelay: `${i * 45}ms` }}>
              <Link
                href={`/read/${a.slug}`}
                className="tap tap-lift block rounded-card bg-white p-4 shadow-card active:shadow-lift"
              >
                <p className="font-display text-[1.0625rem] font-semibold leading-snug">
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
