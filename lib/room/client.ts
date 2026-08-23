"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RoomMessage } from "@/lib/room/shared";

/**
 * Polling, with the tab's attention taken into account.
 *
 * Four seconds while she is looking, twenty when the tab is hidden, and stop
 * altogether after a minute hidden. A room nobody is reading should not keep
 * a phone's radio awake, and on a metered connection that is her money.
 *
 * Deliberately not a socket. See the note in app/api/room/route.ts.
 */

const FAST_MS = 4000;
const SLOW_MS = 20000;
const SLEEP_AFTER_MS = 60000;

export type RoomState = {
  messages: RoomMessage[];
  closed: boolean;
  offline: boolean;
  ready: boolean;
};

export function useRoom(active: boolean) {
  const [state, setState] = useState<RoomState>({
    messages: [],
    closed: false,
    offline: false,
    ready: false,
  });

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hiddenSince = useRef<number | null>(null);
  /* Survives re-renders so a slow response cannot overwrite a newer one. */
  const seq = useRef(0);

  const tick = useCallback(async () => {
    const mine = ++seq.current;
    try {
      const res = await fetch("/api/room", { cache: "no-store" });
      const json = await res.json();
      if (mine !== seq.current) return;
      setState({
        messages: Array.isArray(json.messages) ? json.messages : [],
        closed: Boolean(json.closed),
        offline: false,
        ready: true,
      });
    } catch {
      if (mine !== seq.current) return;
      /* Keep whatever is already on screen. A blank room would read as
         "everyone left", which is a worse lie than "you are offline". */
      setState((s) => ({ ...s, offline: true, ready: true }));
    }
  }, []);

  useEffect(() => {
    if (!active) return;

    let stopped = false;

    const schedule = () => {
      if (stopped) return;
      const hidden = document.visibilityState === "hidden";
      if (hidden) {
        if (hiddenSince.current === null) hiddenSince.current = Date.now();
        if (Date.now() - hiddenSince.current > SLEEP_AFTER_MS) return;
      } else {
        hiddenSince.current = null;
      }
      timer.current = setTimeout(async () => {
        await tick();
        schedule();
      }, hidden ? SLOW_MS : FAST_MS);
    };

    /* One immediate read so the room is not blank while the first poll waits. */
    tick().then(schedule);

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      hiddenSince.current = null;
      if (timer.current) clearTimeout(timer.current);
      tick().then(schedule);
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      stopped = true;
      if (timer.current) clearTimeout(timer.current);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [active, tick]);

  return { ...state, refresh: tick };
}

/* ── Device-local identity ────────────────────────────────────────────────── */

const SID_KEY = "gal.room.sid";
const ALIAS_KEY = "gal.room.alias";

/**
 * A random string, so she can delete what she wrote. Not an account, not linked
 * to anything about her, and it never leaves the device except attached to a
 * message that expires in a day.
 */
export function sessionId(): string {
  if (typeof window === "undefined") return "";
  let s = localStorage.getItem(SID_KEY);
  if (!s) {
    s = crypto.randomUUID();
    localStorage.setItem(SID_KEY, s);
  }
  return s;
}

export const getAlias = () =>
  typeof window === "undefined" ? "" : localStorage.getItem(ALIAS_KEY) ?? "";

export const setAlias = (a: string) => localStorage.setItem(ALIAS_KEY, a.trim().slice(0, 24));

/** Forget the name and the id. The quickest way out of the room, permanently. */
export function forgetRoom() {
  localStorage.removeItem(SID_KEY);
  localStorage.removeItem(ALIAS_KEY);
}
