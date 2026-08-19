import { notFound } from "next/navigation";
import Link from "next/link";
import { ARTICLES, bySlug } from "@/content/articles";
import QuickExit from "@/components/QuickExit";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

const SECTION_LABEL: Record<string, string> = {
  health: "Health",
  finance: "Money",
  learn: "Learn",
};

export default function Read({ params }: { params: { slug: string } }) {
  const a = bySlug(params.slug);
  if (!a) notFound();

  return (
    <main>
      {a.sensitive && <QuickExit />}

      <Link
        href={`/${a.section}`}
        className="tap -ml-1 inline-flex min-h-11 items-center gap-1.5 pl-1 pr-2 text-sm font-semibold text-wine"
      >
        <span aria-hidden>←</span> {SECTION_LABEL[a.section] ?? "Back"}
      </Link>

      <article className="mt-3">
        <h1 className="font-display text-[1.85rem] font-semibold leading-[1.15] tracking-[-0.02em]">
          {a.title}
        </h1>
        <p className="tnum mt-2.5 text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted">
          {a.minutes} min read{a.level ? ` · ${a.level}` : ""}
        </p>

        {a.body.length === 0 ? (
          /* Deliberately honest — no filler. See the header of content/articles.ts. */
          <div className="mt-6 rounded-card border border-line bg-white p-5 shadow-card">
            <p className="font-display text-lg font-semibold">Still being written</p>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              We would rather leave this blank than fill it with something we have not
              checked. It will be here once it has been written and read through.
            </p>
            <Link
              href={`/${a.section}`}
              className="tap mt-4 inline-flex min-h-11 items-center rounded-pill border border-line px-5 text-sm font-semibold text-wine active:bg-blush"
            >
              Back to {SECTION_LABEL[a.section] ?? "the list"}
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4 text-[1.0625rem] leading-[1.72]">
            {a.body.map((p, i) => (
              <p key={i} className="selectable">
                {p}
              </p>
            ))}
          </div>
        )}

        {a.sensitive && (
          <Link
            href="/support"
            className="tap mt-9 block rounded-card bg-wine p-4 text-center font-semibold text-white shadow-lift"
          >
            Talk to someone
          </Link>
        )}
      </article>
    </main>
  );
}
