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

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav
      aria-label="Sections"
      className="chrome fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex max-w-md">
        {TABS.map((t) => {
          const on = t.href === "/" ? path === "/" : path.startsWith(t.href);
          return (
            <li key={t.href} className="flex-1">
              <Link
                href={t.href}
                aria-current={on ? "page" : undefined}
                className={`tap relative flex min-h-14 flex-col items-center justify-center gap-1.5 text-xs ${
                  on ? "font-semibold text-wine" : "text-muted active:text-ink"
                }`}
              >
                {/* Active marker sits above the label as a short bar rather than
                    a 1.5px dot — visible at a glance on a phone. */}
                <span
                  aria-hidden
                  className={`tap absolute top-1.5 h-[3px] rounded-pill bg-wine ${
                    on ? "w-6 opacity-100" : "w-0 opacity-0"
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
