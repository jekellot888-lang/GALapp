import Link from "next/link";

export default function NotFound() {
  return (
    <main className="pt-10">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-muted">
        Page not found
      </p>
      <h1 className="mt-2 font-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em]">
        This one isn&rsquo;t here
      </h1>
      <p className="mt-2 max-w-[38ch] leading-relaxed text-muted">
        The link may be old, or the page may have moved. Nothing has gone wrong with
        your account — GAL doesn&rsquo;t have accounts.
      </p>

      <div className="mt-7 space-y-3">
        <Link
          href="/"
          className="tap block rounded-card bg-wine p-4 text-center font-semibold text-white shadow-lift"
        >
          Back to home
        </Link>
        <Link
          href="/support"
          className="tap block rounded-card border border-line bg-white p-4 text-center font-semibold text-wine shadow-card active:bg-blush"
        >
          Find support
        </Link>
      </div>
    </main>
  );
}
