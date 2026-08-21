"use client";

import { useState } from "react";
import Link from "next/link";
import { useAppState, type Contact } from "@/lib/state";
import QuickExit from "@/components/QuickExit";

/**
 * Trusted contacts. Device-local, never sent anywhere, capped at three.
 *
 * Three is not an arbitrary cap. A longer list is a longer list for somebody
 * else to read, and a message going to eight people is a message that gets
 * discussed rather than acted on.
 */
export default function Contacts() {
  const { state, ready, update } = useAppState();
  const contacts = state.contacts ?? [];
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const full = contacts.length >= 3;

  const add = () => {
    setError(null);
    if (name.trim().length < 1) return setError("Give them a name you'll recognise.");
    if (phone.replace(/\D/g, "").length < 7) return setError("That number looks too short.");
    const next: Contact = {
      id: `${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
    };
    update({ contacts: [...contacts, next] });
    setName("");
    setPhone("");
  };

  const remove = (id: string) =>
    update({ contacts: contacts.filter((c) => c.id !== id) });

  return (
    <main>
      <QuickExit />

      <header className="mb-lg">
        <h1 className="font-display text-display font-semibold leading-[1.05] tracking-display">
          Trusted contacts
        </h1>
        <p className="mt-2xs max-w-[38ch] text-md leading-relaxed text-ink-2">
          Up to three people Quiet Mode can message for you. They stay on this
          phone and are never sent anywhere.
        </p>
      </header>

      {!ready ? null : (
        <>
          {contacts.length > 0 && (
            <ul className="index rule-top mb-lg">
              {contacts.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-sm py-md">
                  <span>
                    <span className="block font-display text-lg font-semibold tracking-heading">
                      {c.name}
                    </span>
                    <span className="tnum mt-3xs block text-sm text-ink-2">{c.phone}</span>
                  </span>
                  <button
                    onClick={() => remove(c.id)}
                    className="tap min-h-11 shrink-0 rounded-pill border border-rule px-md text-sm text-ink-2 active:bg-paper-2"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}

          {full ? (
            <p className="rule-top py-md text-sm leading-relaxed text-ink-2">
              That is three. Remove one to add somebody else.
            </p>
          ) : (
            <section className="rule-top pt-md">
              <h2 className="font-display text-lg font-semibold tracking-heading">
                Add someone
              </h2>
              <div className="mt-sm space-y-sm">
                <label className="block">
                  <span className="block text-sm text-ink-2">Name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={40}
                    className="mt-3xs min-h-11 w-full rounded-inner border border-rule bg-paper-2 px-xs text-base text-ink"
                  />
                </label>
                <label className="block">
                  <span className="block text-sm text-ink-2">Phone</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    inputMode="tel"
                    placeholder="+256…"
                    className="tnum mt-3xs min-h-11 w-full rounded-inner border border-rule bg-paper-2 px-xs text-base text-ink"
                  />
                </label>
                <button
                  onClick={add}
                  className="tap min-h-11 w-full rounded-inner bg-accent px-md font-semibold text-accent-ink"
                >
                  Add contact
                </button>
                {error && (
                  <p role="alert" className="text-sm text-accent">
                    {error}
                  </p>
                )}
              </div>
            </section>
          )}

          <Link
            href="/quiet"
            className="tap rule-top -mx-5 mt-lg block px-5 py-md active:bg-paper-2"
          >
            <span className="block font-display text-lg font-semibold tracking-heading">
              Open Quiet Mode
            </span>
            <span className="mt-3xs block text-sm text-ink-2">
              Dark screen, the lines, and hold to message these people.
            </span>
          </Link>
        </>
      )}
    </main>
  );
}
