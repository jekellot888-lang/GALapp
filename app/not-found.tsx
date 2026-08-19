import Link from "next/link";

export default function NotFound() {
  return (
    <main className="pt-xl">
      <h1 className="font-display text-display font-semibold leading-[1.05] tracking-display">
        This one isn&rsquo;t here
      </h1>
      <p className="mt-2xs max-w-[38ch] text-md leading-relaxed text-ink-2">
        The link may be old, or the page may have moved. Nothing has gone wrong with
        your account — GALL doesn&rsquo;t have accounts.
      </p>

      <div className="index mt-xl rule-top">
        <Link href="/" className="tap tap-tint -mx-5 block px-5 py-md active:bg-paper-2">
          <span className="block font-display text-lg font-semibold tracking-heading">
            Home
          </span>
          <span className="mt-3xs block text-sm text-ink-2">Back to the start.</span>
        </Link>
        <Link href="/support" className="tap tap-tint -mx-5 block px-5 py-md active:bg-paper-2">
          <span className="block font-display text-lg font-semibold tracking-heading">
            Support
          </span>
          <span className="mt-3xs block text-sm text-ink-2">
            Confidential help, any time.
          </span>
        </Link>
      </div>
    </main>
  );
}
