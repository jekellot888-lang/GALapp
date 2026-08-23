/**
 * The room's store. Redis when it is configured, memory when it is not.
 *
 * ── Why Redis and not a database ────────────────────────────────────────────
 * Nothing here is meant to last. Messages expire in a day, there is no user
 * table, and there is nothing to leak, subpoena, or migrate. A cache is the
 * honest shape for that; a database would invite somebody to start keeping
 * things. Upstash over its REST API, so no driver, no pooling, and no fifth
 * dependency.
 *
 * ── The memory fallback ─────────────────────────────────────────────────────
 * With no Redis env vars the store keeps messages in process memory. That is
 * correct for local development and wrong for production, where each Function
 * instance would hold its own copy and two women would sit in two different
 * rooms believing they were in one. `roomConfigured()` is how the UI knows,
 * and the room says it is switched off rather than half-working — the same
 * stance Elle takes without her key.
 */

import {
  KEEP,
  TTL_SECONDS,
  MAX_LENGTH,
  SLOW_MS,
  HOURLY_CAP,
  type RoomMessage,
} from "./shared";

export type { RoomMessage };
export { MAX_LENGTH, SLOW_MS, HOURLY_CAP };

const KEY = "gal:room:general";
const CLOSED = "gal:room:closed";

/* ── Redis over REST ──────────────────────────────────────────────────────── */

const url = () =>
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const token = () =>
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

/**
 * Whether the room can work at all.
 *
 * Redis if it is there. Failing that, memory is acceptable in development —
 * one process, one copy, and it is the only way the room is testable before
 * anybody provisions Upstash. In production memory is not acceptable: each
 * Function instance would hold its own, and two women would sit in what they
 * both believed was the same room. There the answer is no, and the UI says the
 * room is switched off rather than half-working.
 */
export const hasRedis = () => Boolean(url() && token());
export const roomConfigured = () =>
  hasRedis() || process.env.NODE_ENV !== "production";

async function cmd<T = unknown>(...args: (string | number)[]): Promise<T | null> {
  if (!hasRedis()) return null;
  try {
    const res = await fetch(url(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    const json = (await res.json()) as { result?: T; error?: string };
    if (json.error) {
      console.error("[room] redis:", json.error);
      return null;
    }
    return (json.result ?? null) as T | null;
  } catch (e) {
    console.error("[room] redis unreachable:", e);
    return null;
  }
}

/* ── Memory fallback, dev only ────────────────────────────────────────────── */

type Mem = { msgs: RoomMessage[]; closed: boolean; hits: Map<string, number[]> };
const mem: Mem =
  ((globalThis as Record<string, unknown>).__galRoom as Mem) ??
  ((globalThis as Record<string, unknown>).__galRoom = {
    msgs: [],
    closed: false,
    hits: new Map(),
  });

/* ── Sanitising, server side and authoritative ────────────────────────────── */

/**
 * Strip anything link-shaped.
 *
 * Grooming runs through links, and a room that cannot carry one is materially
 * harder to work. The replacement is visible on purpose: silently altering what
 * she wrote would be worse than refusing it, because she would not know the
 * message she sent is not the message that arrived.
 */
export function sanitise(input: string): string {
  return input
    .replace(/\bhttps?:\/\/\S+/gi, "[link removed]")
    .replace(/\bwww\.\S+/gi, "[link removed]")
    .replace(/\b[\w.-]+\.(com|net|org|ug|io|co|me|link)\b\S*/gi, "[link removed]")
    .replace(/\s{3,}/g, "  ")
    .trim()
    .slice(0, MAX_LENGTH);
}

/* ── Reads and writes ─────────────────────────────────────────────────────── */

export async function isClosed(): Promise<boolean> {
  if (!hasRedis()) return mem.closed;
  return (await cmd<string>("GET", CLOSED)) === "1";
}

export async function readRoom(): Promise<RoomMessage[]> {
  if (!hasRedis()) {
    const cutoff = Date.now() - TTL_SECONDS * 1000;
    return mem.msgs.filter((m) => m.at > cutoff).slice(0, KEEP);
  }
  const raw = (await cmd<string[]>("LRANGE", KEY, 0, KEEP - 1)) ?? [];
  const out: RoomMessage[] = [];
  for (const r of raw) {
    try {
      out.push(JSON.parse(r) as RoomMessage);
    } catch {
      /* A row we cannot parse is a row we drop. Never throw at her. */
    }
  }
  return out;
}

/**
 * Rate limit, per device.
 *
 * Two gates rather than one: SLOW_MS stops a burst, HOURLY_CAP stops a patient
 * flood that would slip under it. Returns null when allowed, or a sentence that
 * can be shown to her as-is.
 */
export async function rateLimit(sid: string): Promise<string | null> {
  const now = Date.now();

  if (!hasRedis()) {
    const hits = (mem.hits.get(sid) ?? []).filter((t) => now - t < 3600_000);
    if (hits.length && now - hits[hits.length - 1] < SLOW_MS) {
      return "Give it a few seconds before sending again.";
    }
    if (hits.length >= HOURLY_CAP) {
      return "That is a lot of messages in one hour. Try again a bit later.";
    }
    mem.hits.set(sid, [...hits, now]);
    return null;
  }

  const last = await cmd<string>("GET", `gal:rl:last:${sid}`);
  if (last && now - Number(last) < SLOW_MS) {
    return "Give it a few seconds before sending again.";
  }
  const count = (await cmd<number>("INCR", `gal:rl:hr:${sid}`)) ?? 1;
  if (count === 1) await cmd("EXPIRE", `gal:rl:hr:${sid}`, 3600);
  if (count > HOURLY_CAP) {
    return "That is a lot of messages in one hour. Try again a bit later.";
  }
  await cmd("SET", `gal:rl:last:${sid}`, String(now), "EX", 60);
  return null;
}

export async function postMessage(m: RoomMessage): Promise<void> {
  if (!hasRedis()) {
    mem.msgs.unshift(m);
    mem.msgs = mem.msgs.slice(0, KEEP);
    return;
  }
  await cmd("LPUSH", KEY, JSON.stringify(m));
  await cmd("LTRIM", KEY, 0, KEEP - 1);
  await cmd("EXPIRE", KEY, TTL_SECONDS);
}

/**
 * Remove one message.
 *
 * `sid` is supplied when she is deleting her own and omitted when a report is
 * pulling it. A report must not need to know whose it was.
 */
export async function removeMessage(id: string, sid?: string): Promise<boolean> {
  if (!hasRedis()) {
    const before = mem.msgs.length;
    mem.msgs = mem.msgs.filter((m) => m.id !== id || (sid ? m.sid !== sid : false));
    return mem.msgs.length < before;
  }
  const raw = (await cmd<string[]>("LRANGE", KEY, 0, KEEP - 1)) ?? [];
  for (const r of raw) {
    try {
      const m = JSON.parse(r) as RoomMessage;
      if (m.id !== id) continue;
      if (sid && m.sid !== sid) return false;
      await cmd("LREM", KEY, 1, r);
      return true;
    } catch {
      /* skip */
    }
  }
  return false;
}

/** Find one message, so a report can carry what was actually said. */
export async function findMessage(id: string): Promise<RoomMessage | null> {
  const all = await readRoom();
  return all.find((m) => m.id === id) ?? null;
}
