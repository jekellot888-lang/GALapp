import type { Config } from "tailwindcss";

/**
 * Every value here points at a token in tokens.css. Nothing is defined twice,
 * and nothing in a component may inline a colour — see design.md.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--color-paper)",
        "paper-2": "var(--color-paper-2)",
        "paper-3": "var(--color-paper-3)",
        ink: "var(--color-ink)",
        "ink-2": "var(--color-ink-2)",
        rule: "var(--color-rule)",
        "rule-strong": "var(--color-rule-strong)",
        accent: "var(--color-accent)",
        "accent-deep": "var(--color-accent-deep)",
        "accent-ink": "var(--color-accent-ink)",
        "accent-2": "var(--color-accent-2)",
        "accent-2-tint": "var(--color-accent-2-tint)",
        "wine-tint": "var(--color-wine-tint)",
        "wine-tint-2": "var(--color-wine-tint-2)",
        "wine-edge": "var(--color-wine-edge)",
        "wine-ink": "var(--color-wine-ink)",
        "rose-tint": "var(--color-rose-tint)",
        "rose-tint-2": "var(--color-rose-tint-2)",
        "rose-edge": "var(--color-rose-edge)",
        "rose-ink": "var(--color-rose-ink)",
        "on-rose": "var(--color-on-rose)",
        calm: "var(--color-calm)",
        "calm-tint": "var(--color-calm-tint)",
        "calm-tint-2": "var(--color-calm-tint-2)",
        "calm-edge": "var(--color-calm-edge)",
        "on-calm": "var(--color-on-calm)",
      },
      fontFamily: {
        display: "var(--font-display)",
        sans: "var(--font-body)",
      },
      fontSize: {
        xs: "var(--text-xs)",
        sm: "var(--text-sm)",
        base: "var(--text-base)",
        md: "var(--text-md)",
        lg: "var(--text-lg)",
        xl: "var(--text-xl)",
        "2xl": "var(--text-2xl)",
        "display-s": "var(--text-display-s)",
        display: "var(--text-display)",
      },
      letterSpacing: {
        display: "var(--track-display)",
        heading: "var(--track-heading)",
        label: "var(--track-label)",
      },
      spacing: {
        "3xs": "var(--space-3xs)",
        "2xs": "var(--space-2xs)",
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
      },
      borderRadius: {
        inner: "var(--radius-inner)",
        card: "var(--radius-card)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        nav: "var(--shadow-nav)",
        lift: "var(--shadow-lift)",
      },
    },
  },
  plugins: [],
};
export default config;
