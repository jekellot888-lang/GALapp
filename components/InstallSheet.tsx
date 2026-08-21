"use client";
import { useCallback, useEffect, useState } from "react";
import { useAppState } from "@/lib/state";

/**
 * Install prompt, both platforms.
 *
 * This used to be iOS-only, which was backwards: Android is the majority phone
 * in Uganda and it is the platform with the *better* install path. Android
 * fires `beforeinstallprompt`, which buys a real one-tap install. iOS fires
 * nothing and never has — Safari has no install prompt at all, so the only
 * route there is Share → Add to Home Screen, done by hand, which is why that
 * branch teaches the steps instead.
 *
 * Neither branch shows once the app is already installed.
 */
type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export default function InstallSheet() {
  const { state, ready, update } = useAppState();
  const [mode, setMode] = useState<"none" | "ios" | "android">("none");
  const [deferred, setDeferred] = useState<InstallEvent | null>(null);

  useEffect(() => {
    if (!ready || state.installDismissed) return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      setMode("ios");
      return;
    }

    // Android/Chrome. The event fires once and must be captured to be reusable.
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as InstallEvent);
      setMode("android");
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    // If it already installed during this session, stop offering.
    const onInstalled = () => setMode("none");
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [ready, state.installDismissed]);

  const install = useCallback(async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    // Dismissing the OS sheet is an answer; do not nag on the next render.
    if (outcome !== "accepted") update({ installDismissed: true });
    setMode("none");
  }, [deferred, update]);

  if (mode === "none") return null;

  return (
    <aside className="rise rule-top rule-bottom mb-lg py-md">
      <p className="font-display text-lg font-semibold tracking-heading">
        Put GAL on your home screen
      </p>

      {mode === "android" ? (
        <>
          <p className="mt-2xs max-w-[44ch] text-sm leading-relaxed text-ink-2">
            It opens like any other app, works without signal for anything you have
            already read, and does not show up in your browser tabs.
          </p>
          <button
            onClick={install}
            className="tap mt-sm min-h-11 w-full rounded-inner bg-accent px-md font-semibold text-accent-ink"
          >
            Add to home screen
          </button>
        </>
      ) : (
        <>
          <ol className="mt-2xs space-y-3xs text-sm leading-relaxed text-ink-2">
            <li>1. Tap the Share button at the bottom of Safari</li>
            <li>2. Scroll down and tap &ldquo;Add to Home Screen&rdquo;</li>
            <li>3. Tap Add, then open GAL from your home screen</li>
          </ol>
          <p className="mt-2xs max-w-[44ch] text-xs text-ink-2">
            Do this first — your streak and check-ins are saved separately once
            installed, so anything saved in this tab will not carry over.
          </p>
        </>
      )}

      <button
        onClick={() => update({ installDismissed: true })}
        className="tap -ml-1 mt-sm min-h-11 rounded-pill px-xs text-sm text-ink-2 active:bg-paper-2"
      >
        Not now
      </button>
    </aside>
  );
}
