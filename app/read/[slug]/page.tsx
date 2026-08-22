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

  const back = SECTION_LABEL[a.section] ?? "Back";

  return (
    <main>
      {a.sensitive && <QuickExit />}

      <Link
        href={`/${a.section}`}
        className="tap -ml-1 inline-flex min-h-11 items-center gap-2xs pl-1 pr-2xs text-sm text-ink-2"
      >
        <span aria-hidden>←</span> {back}
      </Link>

      <article className="mt-2xs">
        <h1 className="font-display text-display-s font-semibold leading-[1.1] tracking-display">
          {a.title}
        </h1>
        {/* The one label that survives: it carries real information. */}
        <p className="tnum mt-2xs text-xs text-ink-2">
          {a.minutes} min{a.level ? ` · ${a.level}` : ""}
        </p>

        {a.body.length === 0 ? (
          /* Deliberately honest — no filler. See the header of content/articles.ts. */
          <div className="rule-top mt-md pt-md">
            <p className="font-display text-lg font-semibold tracking-heading">
              This one is not here
            </p>
            <p className="mt-2xs max-w-[46ch] text-sm leading-relaxed text-ink-2">
              The few pages still missing are the medical and legal ones, where
              being roughly right is the same as being wrong. GAL would rather
              show you nothing than something nobody checked against a proper
              source.
            </p>
            <Link
              href={`/${a.section}`}
              className="tap mt-md inline-flex min-h-11 items-center rounded-pill border border-rule px-md text-sm text-ink-2 active:bg-paper-2"
            >
              Back to {back}
            </Link>
          </div>
        ) : (
          <div className="mt-md max-w-[68ch] space-y-sm text-md leading-[1.72]">
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
            className="tap mt-2xl block rounded-inner bg-accent px-md py-xs text-center font-semibold text-accent-ink"
          >
            Talk to someone
          </Link>
        )}
      </article>
    </main>
  );
}
