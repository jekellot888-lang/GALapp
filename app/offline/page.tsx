import Link from "next/link";

export default function Offline() {
  return (
    <main className="pt-xl">
      <h1 className="font-display text-display font-semibold leading-[1.05] tracking-display">
        You&rsquo;re offline
      </h1>
      <p className="mt-2xs max-w-[38ch] text-md leading-relaxed text-ink-2">
        Pages you have already opened still work, and your check-ins are saved on this
        phone either way. This one needs a connection — try again when you have signal.
      </p>
      <Link
        href="/"
        className="tap mt-xl inline-flex min-h-11 items-center rounded-pill border border-rule px-md text-sm text-ink-2 active:bg-paper-2"
      >
        Back to home
      </Link>
    </main>
  );
}
