"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/Icon";

const HIDDEN = new Set(["/elle", "/room", "/quiet", "/calculator", "/welcome", "/offline"]);

export default function FloatingElleButton() {
  const path = usePathname();

  if (HIDDEN.has(path)) return null;

  return (
    <Link
      href="/elle"
      data-elle-shortcut="true"
      aria-label="Talk to Elle"
      title="Talk to Elle"
      className="tap glass fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-[max(1.25rem,calc((100vw-28rem)/2+1.25rem))] z-30 grid min-h-14 min-w-14 place-items-center rounded-full border border-rule bg-rose-tint text-rose-ink shadow-lift active:bg-rose-tint-2 md:bottom-28"
    >
      <Icon name="elle" className="h-6 w-6" />
    </Link>
  );
}
