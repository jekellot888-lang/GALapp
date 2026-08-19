"use client";
import { useEffect } from "react";

/**
 * Someone reading about abuse may be doing it on a phone another person can pick
 * up. Quick exit replaces the current history entry so Back does not return here,
 * then leaves for a neutral site.
 */
const NEUTRAL = "https://www.google.com";

export default function QuickExit() {
  const bail = () => {
    try {
      window.location.replace(NEUTRAL);
    } catch {
      window.location.href = NEUTRAL;
    }
  };

  // Press Escape twice quickly on a keyboard.
  useEffect(() => {
    let last = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const now = Date.now();
      if (now - last < 600) bail();
      last = now;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <button
      onClick={bail}
      className="tap mb-4 min-h-11 w-full rounded-pill border border-line bg-white text-sm font-semibold text-muted shadow-card active:bg-blush active:text-ink"
    >
      Quick exit
    </button>
  );
}
