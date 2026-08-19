import Link from "next/link";

export default function Offline() {
  return (
    <main className="pt-10">
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-muted">
        No connection
      </p>
      <h1 className="mt-2 font-display text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em]">
        You&rsquo;re offline
      </h1>
      <p className="mt-2 max-w-[38ch] leading-relaxed text-muted">
        Pages you have already opened still work, and your check-ins are saved on this
        phone either way. This one needs a connection — try again when you have signal.
      </p>

      <Link
        href="/"
        className="tap mt-7 block rounded-card bg-wine p-4 text-center font-semibold text-white shadow-lift"
      >
        Back to home
      </Link>
    </main>
  );
}
