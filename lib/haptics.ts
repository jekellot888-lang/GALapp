"use client";

/**
 * HAPTICS ON iPHONE: navigator.vibrate() does not exist in iOS Safari. Not
 * restricted, not permission-gated — absent. Calling it does nothing, silently.
 *
 * The one real haptic a website can trigger on iOS (17.4+) is the switch-toggle
 * tick: an <input type="checkbox" switch> flipped by a <label> click produces a
 * genuine Taptic Engine tap. We use that in components/Haptic.tsx.
 *
 * Everywhere else we fall back to a visual pulse, because a confirmation the user
 * cannot perceive is not a confirmation.
 */

export function canVibrate(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}

export function buzz(pattern: number | number[] = 12): boolean {
  if (!canVibrate()) return false;
  try {
    return navigator.vibrate(pattern);
  } catch {
    return false;
  }
}

/** Toggles a hidden iOS switch to borrow its Taptic tick. No-op elsewhere. */
export function iosTick() {
  if (typeof document === "undefined") return;
  const el = document.getElementById("gal-haptic") as HTMLInputElement | null;
  if (!el) return;
  const label = document.getElementById("gal-haptic-label") as HTMLLabelElement | null;
  label?.click();
}

/** Try real haptics, then the iOS trick. Returns true if either likely fired. */
export function feedback(pattern: number | number[] = 12): boolean {
  if (buzz(pattern)) return true;
  iosTick();
  return false;
}
