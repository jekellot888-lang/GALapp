/**
 * Types and limits used by both halves of the room.
 *
 * Separate from `store.ts` on purpose. The store reads `process.env` and talks
 * to Redis, and importing a value from it inside a client component would pull
 * all of that into the browser bundle. Next.js would blank the secrets rather
 * than leak them, but shipping server code to a phone on a metered connection
 * is its own cost. Types erase at build; constants do not.
 */

export type RoomMessage = {
  id: string;
  alias: string;
  body: string;
  /** Epoch ms. */
  at: number;
  /**
   * A random per-device string, so she can delete what she wrote. It is not an
   * account, it is not linked to anything about her, and it expires with the
   * message it belongs to.
   */
  sid: string;
};

export const MAX_LENGTH = 500;
export const MAX_ALIAS = 24;
/** One message per this many ms, per device. */
export const SLOW_MS = 5000;
/** And this many per hour, so a slow drip cannot still flood the room. */
export const HOURLY_CAP = 30;
/** Messages live a day. Long enough not to be empty, short enough to keep nothing. */
export const TTL_SECONDS = 60 * 60 * 24;
/** How many the room holds at once. */
export const KEEP = 100;
