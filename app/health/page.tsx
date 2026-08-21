import Link from "next/link";
import ArticleList from "@/components/ArticleList";

export default function Page() {
  return (
    <>
      <ArticleList
        section="health"
        title="Health"
        intro="Mind and body, in plain language. Nothing here is a diagnosis."
      />
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
    </>
  );
}
