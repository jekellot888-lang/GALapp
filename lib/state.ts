"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * GAL keeps everything on the device. No accounts, no server, no PII in transit.
 *
 * iOS NOTE: an installed home-screen PWA gets a DIFFERENT storage bucket than
 * Safari. Anything saved before "Add to Home Screen" will NOT appear afterward.
 * Install first, then use. See components/InstallSheet.tsx for the user-facing copy.
 */

const KEY = "gal.v1";

export type Mood = "good" | "okay" | "low" | "tough";

/** Someone she would want reached in an emergency. Never leaves this device. */
export type Contact = { id: string; name: string; phone: string };

export type AppState = {
  name: string | null;
  moods: Record<string, Mood>; // ISO date -> mood
  goals: Record<string, string[]>; // ISO date -> completed goal ids
  lastSeen: string | null;
  streak: number;
  installDismissed: boolean;
  /** Max 3. Used only by Quiet Mode. Stored here, never sent anywhere. */
  contacts: Contact[];
};

const EMPTY: AppState = {
  name: null,
  moods: {},
  goals: {},
  lastSeen: null,
  streak: 0,
  installDismissed: false,
  contacts: [],
};

export const today = () => new Date().toISOString().slice(0, 10);

const dayBefore = (iso: string) => {
  const d = new Date(iso + "T12:00:00");
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
};

function read(): AppState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return EMPTY;
  }
}

function write(s: AppState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* private mode / quota — fail quiet, app still works for this session */
  }
}

export function useAppState() {
  const [state, setState] = useState<AppState>(EMPTY);
  const [ready, setReady] = useState(false);

  // Hydrate after mount so server and client markup match.
  useEffect(() => {
    const loaded = read();
    const t = today();

    if (loaded.lastSeen !== t) {
      if (loaded.lastSeen === dayBefore(t)) loaded.streak += 1;
      else if (loaded.lastSeen !== null) loaded.streak = 1;
      else loaded.streak = 1;
      loaded.lastSeen = t;
      write(loaded);
    }

    setState(loaded);
    setReady(true);
  }, []);

  const update = useCallback((patch: Partial<AppState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      write(next);
      return next;
    });
  }, []);

  const setMood = useCallback(
    (m: Mood) => {
      setState((prev) => {
        const next = { ...prev, moods: { ...prev.moods, [today()]: m } };
        write(next);
        return next;
      });
    },
    []
  );

  const toggleGoal = useCallback((id: string) => {
    setState((prev) => {
      const t = today();
      const done = prev.goals[t] ?? [];
      const nextDone = done.includes(id) ? done.filter((g) => g !== id) : [...done, id];
      const next = { ...prev, goals: { ...prev.goals, [t]: nextDone } };
      write(next);
      return next;
    });
  }, []);

  return { state, ready, update, setMood, toggleGoal };
}

/** Everything she's saved, as a file she can keep. Her data, her copy. */
export function exportState(): string {
  return JSON.stringify(read(), null, 2);
}
