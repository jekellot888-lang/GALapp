import type { Config } from "tailwindcss";

/**
 * One accent (wine) with two deeper partners used only inside the affirmation
 * gradient. The old berry/violet pair was a saturated magenta-to-purple fade —
 * it read as generic, and white text on it measured 4.37:1, under AA.
 *
 * Every text colour below is contrast-checked against the two surfaces it
 * actually sits on: blush (#FDF2F6) and white.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        wine:   "#6D1F3A",
        /** Affirmation gradient partners. White on either clears 9:1. */
        plum:   "#5A1930",
        mulled: "#7E2A4E",
        blush:  "#FDF2F6",
        ink:    "#2A1520",
        /** Was #8A7480 — 3.93:1 on blush, under AA. Now 4.97 / 5.43. */
        muted:  "#79646F",
        line:   "#F0DDE6",
      },
      fontFamily: {
        /* Body stays on the system stack: SF Pro on iPhone is the point of a
           PWA that wants to feel native, and it costs nothing to load. */
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      /* Varied, not uniform: containers soften, inner controls stay tighter. */
      borderRadius: { card: "20px", inner: "14px", pill: "999px" },
      boxShadow: {
        card:  "0 1px 2px rgba(109,31,58,0.04), 0 3px 14px rgba(109,31,58,0.06)",
        lift:  "0 2px 4px rgba(109,31,58,0.06), 0 10px 30px rgba(109,31,58,0.10)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.14)",
      },
      transitionTimingFunction: {
        /* Slight overshoot on press-release, so taps feel physical. */
        press: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
