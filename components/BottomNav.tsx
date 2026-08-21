"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Four tabs, one per thing she actually does: today, reading, other women, help.
 *
 * It was six. Money, Health and Learn were three labels on one activity, so
 * they collapsed into Read with a segmented control. Rooms stays because it is
 * a distinct place with other people in it, but note it is opt-in — a signed-out
 * user tapping it gets the explanation, not a dead end.
 *
 * Support is last and never moves. In a bar people learn by position, the
 * emergency route has to be in the same place every time.
 */
const TABS = [
  { href: "/", label: "Home" },
  { href: "/read", label: "Read" },
  { href: "/rooms", label: "Rooms" },
  { href: "/support", label: "Support" },
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
    <nav
      aria-label="Sections"
      className="chrome fixed inset-x-0 bottom-0 z-40 rule-top bg-paper pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-md">
        {TABS.map((t) => {
          const on = t.href === active;
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                aria-current={on ? "page" : undefined}
                className={`tap relative flex min-h-14 items-center justify-center text-sm ${
                  on ? "font-semibold text-accent" : "text-ink-2"
                }`}
              >
                {/* A drawn rule above the label, not a floating dot. */}
                <span
                  aria-hidden
                  className={`tap absolute inset-x-0 top-0 mx-auto h-[2px] bg-accent ${
                    on ? "w-8 opacity-100" : "w-0 opacity-0"
                  }`}
                />
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
