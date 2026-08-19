"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Home" },
  { href: "/finance", label: "Money" },
  { href: "/health", label: "Health" },
  { href: "/learn", label: "Learn" },
  { href: "/support", label: "Support" },
];

/**
 * Solid paper with a hairline top rule. The old version was frosted glass —
 * banned outright in this genre, and it made the labels fight whatever text
 * happened to scroll underneath.
 */
export default function BottomNav() {
  const path = usePathname();
  return (
    <nav
      aria-label="Sections"
      className="chrome fixed inset-x-0 bottom-0 z-40 rule-top bg-paper pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-md">
        {TABS.map((t) => {
          const on = t.href === "/" ? path === "/" : path.startsWith(t.href);
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
