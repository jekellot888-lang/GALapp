"use client";

/**
 * The only real haptic a web page can fire on iOS (17.4+): flipping a native
 * switch control produces a Taptic tick. Kept off-screen and out of the a11y
 * tree; lib/haptics.ts clicks the label. On Android this does nothing and
 * navigator.vibrate handles it instead.
 */
export default function HapticSwitch() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed -left-[9999px] top-0 h-px w-px overflow-hidden">
      <label id="gal-haptic-label" htmlFor="gal-haptic">
        {/* @ts-expect-error — `switch` is a Safari-only attribute, not in React's types */}
        <input id="gal-haptic" type="checkbox" switch="" tabIndex={-1} />
      </label>
    </div>
  );
}
