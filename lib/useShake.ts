"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Shake detection via DeviceMotionEvent.
 *
 * iOS 13+ REQUIRES DeviceMotionEvent.requestPermission(), and it must be called
 * from inside a real user gesture (a tap). It cannot be called on page load —
 * it will reject. So this hook exposes `enable()` for you to wire to a button.
 *
 * Also requires a secure context (HTTPS). Vercel gives us that; `localhost` also
 * counts, but testing over http://192.168.x.x on your phone will NOT work.
 */

type MotionCtor = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

export type ShakeStatus = "unsupported" | "needs-permission" | "listening" | "denied";

export function useShake(onShake: () => void, threshold = 18) {
  const [status, setStatus] = useState<ShakeStatus>("unsupported");
  const last = useRef({ x: 0, y: 0, z: 0, at: 0 });
  const cooldown = useRef(0);
  const handler = useRef(onShake);
  handler.current = onShake;

  useEffect(() => {
    if (typeof window === "undefined" || !("DeviceMotionEvent" in window)) {
      setStatus("unsupported");
      return;
    }
    const M = window.DeviceMotionEvent as MotionCtor;
    // iOS gates behind a prompt; Android/desktop Chrome does not.
    setStatus(typeof M.requestPermission === "function" ? "needs-permission" : "listening");
  }, []);

  const listen = useCallback(() => {
    const onMotion = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity;
      if (!a || a.x == null || a.y == null || a.z == null) return;

      const now = Date.now();
      if (now - last.current.at < 90) return;

      const delta =
        Math.abs(a.x - last.current.x) +
        Math.abs(a.y - last.current.y) +
        Math.abs(a.z - last.current.z);

      last.current = { x: a.x, y: a.y, z: a.z, at: now };

      if (delta > threshold && now - cooldown.current > 1200) {
        cooldown.current = now;
        handler.current();
      }
    };

    window.addEventListener("devicemotion", onMotion);
    return () => window.removeEventListener("devicemotion", onMotion);
  }, [threshold]);

  // Non-iOS: start straight away.
  useEffect(() => {
    if (status !== "listening") return;
    return listen();
  }, [status, listen]);

  /** Call this from a tap handler, never on mount. */
  const enable = useCallback(async () => {
    const M = window.DeviceMotionEvent as MotionCtor;
    if (typeof M.requestPermission !== "function") {
      setStatus("listening");
      return;
    }
    try {
      const res = await M.requestPermission();
      setStatus(res === "granted" ? "listening" : "denied");
    } catch {
      setStatus("denied");
    }
  }, []);

  return { status, enable };
}
