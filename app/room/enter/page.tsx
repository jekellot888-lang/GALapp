"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QuickExit from "@/components/QuickExit";
import { setAlias, sessionId } from "@/lib/room/client";

/**
 * The way in.
 *
 * The device check-in above the name field is not filler and not a disclaimer.
 * It is the one thing the sector's own chat guidance says to do at the start of
 * every conversation — ask whether the phone might be watched, and say plainly
 * that chat carries a risk if it is. Everything else on this screen could go
 * before that does.
 *
 * No account is created here. The name is written to this device and the id is
 * a random string, and neither reaches the server except attached to a message
 * that expires in a day.
 */
export default function EnterRoom() {
  const router = useRouter();
  const [alias, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const go = () => {
    const a = alias.trim();
    if (a.length < 2) return setError("Pick a name of at least 2 characters.");
    setAlias(a);
    sessionId();
    router.push("/room");
  };

  return (
    <main>
      <QuickExit />

      <header className="mb-lg">
        <h1 className="font-display text-display font-semibold leading-[1.05] tracking-display">
          The room
        </h1>
        <p className="mt-2xs max-w-[38ch] text-md leading-relaxed text-ink-2">
          Other women, talking. No account, and nothing you say here is kept
          longer than a day.
        </p>
      </header>

      <section className="rule-top rule-bottom mb-lg py-md">
        <h2 className="font-display text-lg font-semibold tracking-heading">
          Before you go in
        </h2>
        <ul className="mt-2xs space-y-3xs text-sm leading-relaxed text-ink-2">
          <li>
            If someone might be checking this phone, they can read this room too.
            It is not hidden and it is not encrypted.
          </li>
          <li>Everything posted disappears after a day.</li>
          <li>Nobody is watching the room live. Reports are read within a day.</li>
          <li>Pick a name that is not your own, and do not say where you live.</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold tracking-heading">
          A name to go by
        </h2>
        <input
          value={alias}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go()}
          maxLength={24}
          autoComplete="off"
          placeholder="Not your real name"
          className="mt-sm min-h-11 w-full rounded-inner border border-rule bg-paper-2 px-xs text-base text-ink"
        />
        <button
          onClick={go}
          className="tap mt-sm min-h-11 w-full rounded-inner bg-accent px-md font-semibold text-accent-ink"
        >
          Go in
        </button>
        {error && (
          <p role="alert" className="mt-sm text-sm leading-relaxed text-accent">
            {error}
          </p>
        )}
      </section>

      <Link
        href="/ask"
        className="tap rule-top mt-lg -mx-5 block px-5 py-md text-sm text-ink-2 active:bg-paper-2"
      >
        Not now — take me to Ask instead
      </Link>
    </main>
  );
}
