"use client";
import { useEffect, useState } from "react";
import { useAppState } from "@/lib/state";

/**
 * iOS has NO install prompt. beforeinstallprompt does not exist in Safari.
 * The only route is Share -> Add to Home Screen, done by hand. So we teach it.
 *
 * We show this only when running in a normal browser tab, never once installed.
 */
export default function InstallSheet() {
  const { state, ready, update } = useAppState();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!ready || state.installDismissed) return;
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setShow(!standalone && isIOS);
  }, [ready, state.installDismissed]);

  if (!show) return null;

  return (
    <aside className="rise rule-top rule-bottom mb-lg py-md">
      <p className="font-display text-lg font-semibold tracking-heading">
        Add GALL to your home screen
      </p>
      <ol className="mt-2xs space-y-3xs text-sm leading-relaxed text-ink-2">
        <li>1. Tap the Share button at the bottom of Safari</li>
        <li>2. Scroll down and tap &ldquo;Add to Home Screen&rdquo;</li>
        <li>3. Tap Add, then open GALL from your home screen</li>
      </ol>
      <p className="mt-2xs text-xs text-ink-2">
        Do this first — your streak and check-ins are saved separately once installed.
      </p>
      <button
        onClick={() => update({ installDismissed: true })}
        className="tap mt-sm min-h-11 rounded-pill border border-rule px-md text-sm text-ink-2 active:bg-paper-2"
      >
        Got it
      </button>
    </aside>
  );
}
