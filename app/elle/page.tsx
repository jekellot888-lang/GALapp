"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import QuickExit from "@/components/QuickExit";

/**
 * Talk to Elle.
 *
 * Like the self-check, this screen forgets: the transcript lives in component
 * state and dies on navigate. Nothing is written to localStorage and nothing is
 * stored server-side.
 *
 * Unlike every other screen in GAL, her words leave the phone — they go to an
 * AI service to be answered. That is the one thing the rest of the app promises
 * not to do, so it is said plainly before she types rather than buried in a
 * policy she will not read.
 */
type Msg = { role: "user" | "assistant"; content: string };

export default function Elle() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [started, setStarted] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => () => abort.current?.abort(), []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [msgs]);

  const send = useCallback(async () => {
    const text = draft.trim();
    if (!text || busy) return;

    const next: Msg[] = [...msgs, { role: "user", content: text }];
    setMsgs([...next, { role: "assistant", content: "" }]);
    setDraft("");
    setBusy(true);

    const ctrl = new AbortController();
    abort.current = ctrl;

    try {
      const res = await fetch("/api/elle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
        signal: ctrl.signal,
      });

      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => null);
        setMsgs([
          ...next,
          { role: "assistant", content: j?.error ?? "Elle could not be reached." },
        ]);
        return;
      }

      // Stream into the last message as it arrives.
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        setMsgs([...next, { role: "assistant", content: acc }]);
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setMsgs([
          ...next,
          {
            role: "assistant",
            content:
              "That did not go through. Check your connection — and if this is urgent, use Support instead of waiting.",
          },
        ]);
      }
    } finally {
      setBusy(false);
      abort.current = null;
    }
  }, [draft, busy, msgs]);

  if (!started) {
    return (
      <main>
        <QuickExit />
        <header className="mb-lg">
          <h1 className="font-display text-display font-semibold leading-[1.05] tracking-display">
            Talk to Elle
          </h1>
          <p className="mt-2xs max-w-[38ch] text-md leading-relaxed text-ink-2">
            Someone to think out loud with, at any hour.
          </p>
        </header>

        {/* Stated before she types, not after. */}
        <section className="rule-top rule-bottom mb-lg py-md">
          <h2 className="font-display text-lg font-semibold tracking-heading">
            Read this first
          </h2>
          <ul className="mt-2xs space-y-3xs text-sm leading-relaxed text-ink-2">
            <li>
              What you type here is sent to an AI service to be answered. This is the
              one part of GAL that leaves your phone.
            </li>
            <li>GAL does not save the conversation. It disappears when you leave.</li>
            <li>Elle is not a counsellor, a lawyer, or an emergency service.</li>
            <li>Do not send your full name, your address, or anyone else&rsquo;s.</li>
          </ul>
        </section>

        <button
          onClick={() => setStarted(true)}
          className="tap min-h-[52px] w-full rounded-inner bg-accent px-md font-semibold text-accent-ink"
        >
          Start talking
        </button>
        <Link
          href="/support"
          className="tap mt-2xs flex min-h-11 w-full items-center justify-center rounded-pill border border-rule text-sm text-ink-2 active:bg-paper-2"
        >
          I want a person instead
        </Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-[72dvh] flex-col">
      <QuickExit />

      <Link
        href="/support"
        className="tap -ml-1 inline-flex min-h-11 items-center gap-2xs pl-1 pr-2xs text-sm text-ink-2"
      >
        <span aria-hidden>←</span> Support
      </Link>

      <div className="index mt-sm flex-1 rule-top">
        {msgs.length === 0 ? (
          <p className="py-md max-w-[44ch] text-sm leading-relaxed text-ink-2">
            Say whatever is on your mind. There is no wrong way to start.
          </p>
        ) : (
          msgs.map((m, i) => (
            <article key={i} className="py-sm">
              <p className="text-xs text-ink-2">{m.role === "user" ? "You" : "Elle"}</p>
              <p className="selectable mt-3xs whitespace-pre-wrap text-md leading-relaxed">
                {m.content ||
                  (busy && i === msgs.length - 1 ? "…" : "")}
              </p>
            </article>
          ))
        )}
        <div ref={endRef} />
      </div>

      <div className="rule-top sticky bottom-24 mt-sm bg-paper pt-sm">
        <div className="flex items-end gap-2xs">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
            maxLength={2000}
            placeholder="Say something"
            className="min-h-11 flex-1 resize-none rounded-inner border border-rule bg-paper-2 px-xs py-2xs text-base text-ink"
          />
          <button
            onClick={send}
            disabled={!draft.trim() || busy}
            className="tap min-h-11 shrink-0 rounded-inner bg-accent px-md font-semibold text-accent-ink disabled:opacity-45"
          >
            {busy ? "…" : "Send"}
          </button>
        </div>
        <p className="mt-2xs text-xs text-ink-2">
          Sent to an AI service. Not saved by GAL.
        </p>
      </div>
    </main>
  );
}
