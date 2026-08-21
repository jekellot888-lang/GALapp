"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client.
 *
 * Only the chat half of GAL touches this. Mood, goals, streaks and reading stay
 * in localStorage and never reach a server — see lib/state.ts.
 *
 * Returns null when the env vars are absent, which is the normal state for a
 * local checkout with no Supabase project wired up. Callers must handle null and
 * degrade to "chat unavailable" rather than throwing: the rest of the app has to
 * keep working without a backend.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}

export const chatConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
