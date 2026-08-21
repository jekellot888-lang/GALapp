"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * The disguise screen. A working calculator that looks like a calculator.
 *
 * Hold anywhere for a second and a half to go back to GAL. There is no visible
 * exit control, because a visible exit control is the tell.
 *
 * Honest limits, so nobody over-trusts this:
 *   · It does not disguise the app icon, the app name, or the browser history.
 *     Anyone scrolling the home screen still sees GAL.
 *   · Held open, it is convincing. It is a screen, not a vault.
 */
const KEYS = ["C", "±", "%", "÷", "7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "0", ".", "="];
const HOLD_MS = 1400;

export default function Calculator() {
  const router = useRouter();
  const [display, setDisplay] = useState("0");
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHold = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const startHold = useCallback(() => {
    clearHold();
    timer.current = setTimeout(() => router.push("/"), HOLD_MS);
  }, [clearHold, router]);

  useEffect(() => clearHold, [clearHold]);

  const apply = (a: number, b: number, o: string) =>
    o === "+" ? a + b : o === "−" ? a - b : o === "×" ? a * b : o === "÷" ? (b === 0 ? NaN : a / b) : b;

  const press = (k: string) => {
    const cur = parseFloat(display.replace(/,/g, "")) || 0;
    if (k === "C") { setDisplay("0"); setAcc(null); setOp(null); setFresh(true); return; }
    if (k === "±") { setDisplay(String(cur * -1)); return; }
    if (k === "%") { setDisplay(String(cur / 100)); return; }
    if (["+", "−", "×", "÷"].includes(k)) {
      setAcc(acc === null ? cur : apply(acc, cur, op ?? "="));
      setOp(k); setFresh(true); return;
    }
    if (k === "=") {
      const out = acc === null || !op ? cur : apply(acc, cur, op);
      setDisplay(Number.isFinite(out) ? String(out) : "Error");
      setAcc(null); setOp(null); setFresh(true); return;
    }
    if (k === "." && display.includes(".") && !fresh) return;
    const next = fresh ? (k === "." ? "0." : k) : display + k;
    setDisplay(next.length > 12 ? next.slice(0, 12) : next);
    setFresh(false);
  };

  return (
    <div
      onPointerDown={startHold}
      onPointerUp={clearHold}
      onPointerLeave={clearHold}
      onPointerCancel={clearHold}
      onContextMenu={(e) => e.preventDefault()}
      className="calc fixed inset-0 z-[90] flex select-none flex-col justify-end px-4 pb-8 pt-[max(1.5rem,env(safe-area-inset-top))]"
    >
      <output className="tnum mb-4 block truncate px-2 text-right text-[3.25rem] font-light leading-none">
        {display}
      </output>
      <div className="grid grid-cols-4 gap-2">
        {KEYS.map((k) => (
          <button
            key={k}
            onClick={() => press(k)}
            className={`tap min-h-[68px] rounded-full text-2xl ${
              k === "0" ? "col-span-2 !rounded-[34px]" : ""
            } ${
              ["÷", "×", "−", "+", "="].includes(k)
                ? "bg-[color:var(--c-op)] text-[color:var(--c-op-ink)]"
                : ["C", "±", "%"].includes(k)
                ? "bg-[color:var(--c-fn)] text-[color:var(--c-ink)]"
                : "bg-[color:var(--c-key)] text-[color:var(--c-ink)]"
            }`}
          >
            {k}
          </button>
        ))}
      </div>
      <p className="mt-4 text-center text-[0.7rem] text-[color:var(--c-hint)]">
        hold anywhere to return
      </p>
    </div>
  );
}
