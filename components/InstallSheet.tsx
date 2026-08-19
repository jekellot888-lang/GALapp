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
    <aside className="rise mb-5 rounded-card border border-wine/20 bg-white p-4 shadow-card">
      <p className="font-display text-lg font-semibold">Add GAL to your home screen</p>
      <ol className="mt-2 space-y-1 text-sm leading-relaxed text-muted">
        <li>1. Tap the Share button at the bottom of Safari</li>
        <li>2. Scroll down and tap &ldquo;Add to Home Screen&rdquo;</li>
        <li>3. Tap Add, then open GAL from your home screen</li>
      </ol>
      <p className="mt-2 text-xs text-muted">
        Do this first — your streak and check-ins are saved separately once installed.
      </p>
      <button
        onClick={() => update({ installDismissed: true })}
        className="tap -ml-1 mt-3 min-h-11 rounded-pill px-3 text-sm font-semibold text-wine active:bg-blush"
      >
        Got it
      </button>
    </aside>
  );
}
