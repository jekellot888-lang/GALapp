"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon, { type IconName } from "@/components/Icon";

/**
 * Four tabs, one per thing she actually does: today, reading, other women, help.
 *
 * Icons sit above the labels rather than replacing them. An icon-only bar looks
 * tidier and costs comprehension, and this is not an app where somebody should
 * have to guess which mark means help.
 *
 * Support is last and never moves. In a bar people learn by position, the
 * emergency route has to be in the same place every time.
 */
const TABS: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/read", label: "Read", icon: "read" },
  { href: "/ask", label: "Ask", icon: "ask" },
  { href: "/room", label: "Room", icon: "room" },
  { href: "/support", label: "Support", icon: "support" },
];

/** Deep links that should still light up their parent tab. */
const ALIASES: Record<string, string> = {
  "/finance": "/read",
  "/health": "/read",
  "/learn": "/read",
  "/clinics": "/read",
  "/plan": "/support",
  "/contacts": "/support",
  "/check": "/support",
};

export default function BottomNav() {
  const path = usePathname();

  // Quiet mode, the calculator and onboarding are full-surface: no nav.
  if (["/quiet", "/calculator", "/welcome"].includes(path)) return null;

  const active =
    ALIASES[path] ??
    (path === "/" ? "/" : TABS.slice(1).find((t) => path.startsWith(t.href))?.href ?? "/");

  return (
    /* Functional chrome: translucent, stable, and thumb-first. */
    <nav
      aria-label="Sections"
      className="glass fixed inset-x-0 bottom-0 z-40 border-t border-rule pb-[env(safe-area-inset-bottom)] shadow-nav
                 md:inset-x-auto md:bottom-5 md:left-1/2 md:w-[27rem] md:-translate-x-1/2
                 md:overflow-hidden md:rounded-card md:border md:border-rule md:pb-0 md:shadow-lift"
    >
      <ul className="mx-auto flex max-w-md px-1 py-1 md:px-1.5 md:py-1.5">
        {TABS.map((t) => {
          const on = t.href === active;
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                aria-current={on ? "page" : undefined}
                className={`tap relative flex min-h-[58px] flex-col items-center justify-center gap-[3px] rounded-inner text-xs ${
                  on ? "bg-wine-tint font-semibold text-accent" : "text-ink-2 active:bg-paper-2"
                }`}
              >
                {/* A drawn rule above the label, not a floating dot. */}
                <span
                  aria-hidden
                  className={`nav-mark absolute inset-x-0 top-1 mx-auto h-[2px] rounded-pill bg-accent ${
                    on ? "w-7 opacity-100" : "w-0 opacity-0"
                  }`}
                />
                <Icon name={t.icon} className="nav-icon h-[22px] w-[22px]" />
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
