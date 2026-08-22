"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * The opening screen: Elle's monogram and a line from the brand.
 *
 * ── Why it is gated, and do not ungate it ───────────────────────────────────
 * This never renders when the calculator disguise is on. A cold start with the
 * disguise set goes straight to /calculator, and the whole point of that is
 * that somebody who picks up her phone sees a calculator. A branded screen
 * flashing a monogram and a campaign line in front of that would undo it in the
 * one second that matters. `app/page.tsx` decides; this component only obeys.
 *
 * ── Once per session, not per navigation ────────────────────────────────────
 * sessionStorage, same scope and for the same reason as the disguise redirect:
 * "since she opened it". Tapping Home in the nav must not replay it.
 *
 * ── It is always skippable ──────────────────────────────────────────────────
 * A tap anywhere dismisses it, the whole surface is the control, and it clears
 * itself after a beat regardless. Nothing in this app should hold her behind a
 * screen she did not ask for, least of all an advert.
 */

const HOLD_MS = 2600;

export default function Splash({ onDone }: { onDone?: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const dismiss = () => {
    if (leaving) return;
    setLeaving(true);
    timers.current.push(setTimeout(() => onDone?.(), 320));
  };

  useEffect(() => {
    timers.current.push(setTimeout(dismiss, HOLD_MS));
    const t = timers.current;
    return () => t.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Skip"
      onClick={dismiss}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && dismiss()}
      data-leaving={leaving || undefined}
      className="splash fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center gap-md bg-paper px-lg text-center"
    >
      <Image
        src="/icons/icon-192.png"
        alt=""
        width={88}
        height={88}
        priority
        className="splash-mark rounded-[22%]"
      />

      <p className="splash-line max-w-[26ch] font-display text-display-s font-semibold leading-[1.15] tracking-display text-ink">
        Don&rsquo;t forget to vote for Elle on the Miss World app.
      </p>

      <span className="splash-line text-xs text-ink-2" style={{ animationDelay: "220ms" }}>
        Tap to continue
      </span>
    </div>
  );
}
