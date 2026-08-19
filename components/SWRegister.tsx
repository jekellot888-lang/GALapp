"use client";
import { useEffect } from "react";

/**
 * The service worker is cache-first for everything that is not a navigation,
 * including /_next/static/chunks/*. That is exactly what we want in production
 * and exactly wrong in dev: every edit emits new chunks, the worker replays the
 * old ones, and React hydrates against markup that no longer matches — a wall
 * of hydration errors that has nothing to do with the code you just wrote.
 *
 * So: register in production only. To test offline behaviour or the install
 * flow, run `npm run build && npm start`, which is the build the worker is
 * written for anyway.
 */
export default function SWRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      /* A worker installed by an earlier dev session keeps controlling this page
         and would go on serving stale chunks. Tear it down rather than just
         declining to register a new one. */
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister());
        if (regs.length && "caches" in window) {
          caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
        }
      });
      return;
    }

    const reg = () => navigator.serviceWorker.register("/sw.js").catch(() => {});
    if (document.readyState === "complete") reg();
    else window.addEventListener("load", reg);
  }, []);
  return null;
}
