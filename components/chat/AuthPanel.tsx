"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Sign-in by six-digit email code, not a password.
 *
 * A password is a thing stored on a phone somebody else may pick up, and a
 * saved password is a standing key to her account. A one-time code leaves
 * nothing behind on the device and cannot be reused.
 *
 * The alias is asked for at the same time, and is deliberately not her name.
 */
export default function AuthPanel({ onDone }: { onDone: () => void }) {
  const supabase = createClient();
  const [stage, setStage] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [alias, setAlias] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendCode = async () => {
    if (!supabase) return;
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("That email doesn't look right.");
    if (alias.trim().length < 2) return setError("Pick a name of at least 2 characters.");
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true, data: { alias: alias.trim() } },
    });
    setBusy(false);
    if (error) return setError(error.message);
    setStage("code");
  };

  const verify = async () => {
    if (!supabase) return;
    setError(null);
    setBusy(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: "email",
    });
    if (error) {
      setBusy(false);
      return setError(error.message);
    }
    // The profile carries the alias. Upsert so a repeat sign-in is not an error.
    if (data.user) {
      await supabase
        .from("profiles")
        .upsert({ id: data.user.id, alias: alias.trim() }, { onConflict: "id" });
    }
    setBusy(false);
    onDone();
  };

  return (
    <section>
      <h2 className="font-display text-lg font-semibold tracking-heading">
        {stage === "email" ? "Join the rooms" : "Check your email"}
      </h2>

      {stage === "email" ? (
        <div className="mt-sm space-y-sm">
          <label className="block">
            <span className="block text-sm text-ink-2">A name to go by</span>
            <input
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              maxLength={24}
              autoComplete="off"
              placeholder="Not your real name"
              className="mt-3xs min-h-11 w-full rounded-inner border border-rule bg-paper-2 px-xs text-base text-ink"
            />
          </label>
          <label className="block">
            <span className="block text-sm text-ink-2">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              inputMode="email"
              autoComplete="email"
              className="mt-3xs min-h-11 w-full rounded-inner border border-rule bg-paper-2 px-xs text-base text-ink"
            />
            <span className="mt-3xs block text-xs text-ink-2">
              Used once to send a code. Use an address only you can open.
            </span>
          </label>
          <button
            onClick={sendCode}
            disabled={busy}
            className="tap min-h-11 w-full rounded-inner bg-accent px-md font-semibold text-accent-ink disabled:opacity-45"
          >
            {busy ? "Sending…" : "Send me a code"}
          </button>
        </div>
      ) : (
        <div className="mt-sm space-y-sm">
          <label className="block">
            <span className="block text-sm text-ink-2">Six-digit code</span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              className="tnum mt-3xs min-h-11 w-full rounded-inner border border-rule bg-paper-2 px-xs text-base tracking-[0.2em] text-ink"
            />
          </label>
          <button
            onClick={verify}
            disabled={busy}
            className="tap min-h-11 w-full rounded-inner bg-accent px-md font-semibold text-accent-ink disabled:opacity-45"
          >
            {busy ? "Checking…" : "Join"}
          </button>
          <button
            onClick={() => { setStage("email"); setCode(""); setError(null); }}
            className="tap min-h-11 w-full rounded-pill border border-rule text-sm text-ink-2 active:bg-paper-2"
          >
            Use a different email
          </button>
        </div>
      )}

      {/* Inline, specific, no alert() and no "Oops". */}
      {error && (
        <p role="alert" className="mt-sm text-sm leading-relaxed text-accent">
          {error}
        </p>
      )}
    </section>
  );
}
