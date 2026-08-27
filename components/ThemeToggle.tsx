"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { feedback } from "@/lib/haptics";

const THEME_KEY = "gal.theme";
type Theme = "light" | "dark";

function systemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function storedTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem(THEME_KEY);
  return saved === "light" || saved === "dark" ? saved : systemTheme();
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const next = storedTheme();
    document.documentElement.dataset.theme = next;
    setTheme(next);
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === "dark"}
      title={`Switch to ${nextTheme} mode`}
      onClick={() => {
        document.documentElement.dataset.theme = nextTheme;
        localStorage.setItem(THEME_KEY, nextTheme);
        setTheme(nextTheme);
        feedback(8);
      }}
      className="tap glass grid min-h-11 min-w-11 place-items-center rounded-full border border-rule text-ink shadow-lift active:bg-paper-2"
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} className="h-5 w-5" />
    </button>
  );
}
