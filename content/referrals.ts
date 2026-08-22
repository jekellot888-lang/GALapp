/**
 * ⚠⚠ NOTHING IN THIS FILE SHIPS UNVERIFIED. ⚠⚠
 *
 * Referral directory for the bot on /ask — banks, hospitals, police, and the
 * other places she might need to reach. Same gate as `content/support.ts`, for
 * the same reason: a wrong number is worse than no number, because someone
 * dials it, nothing happens, and they stop trying.
 *
 * ── How an entry gets here ──────────────────────────────────────────────────
 * 1. Researched from a primary source with `docs/scrape-prompt.md`. That gives
 *    a candidate with `source`, `checkedOn`, and `verified: false`.
 * 2. Somebody phones the number. A human or a working system answers.
 * 3. Confirm hours, cost, and that it serves her location.
 * 4. Set `verified: true` with `verifiedOn` and `verifiedBy`.
 *
 * The research step is not step 4. Reading a phone number on a bank's website
 * proves the bank published it, not that it answers today. Scraping turned
 * "find the numbers" into "call down a list" — it did not remove the calling.
 *
 * ── Why this ships empty ────────────────────────────────────────────────────
 * Because none of it has been called yet. The bot says so plainly rather than
 * showing a number that might be dead. A visible gap beats a plausible
 * fabrication, and on this surface the gap is the honest answer.
 *
 * Entries with `verified: false` are invisible to `liveReferrals()`. They are
 * still worth committing: they carry their source and their flags, so the next
 * person picks up the calling where the last one stopped.
 */

export type ReferralCategory =
  | "bank"
  | "hospital"
  | "police"
  | "legal"
  | "mental-health"
  | "shelter";

export type Referral = {
  id: string;
  category: ReferralCategory;
  name: string;
  /** One plain sentence, written to her. What she gets by contacting them. */
  what: string;
  /** Empty until somebody has phoned it. The gate reads this. */
  phone: string;
  /** The single most useful page — account opening, not the homepage. */
  url?: string;
  address?: string;
  hours?: string;
  /** Whether the call is free decides whether she can make it with no airtime. */
  cost?: string;
  /** Lowercase words she might actually type. The matcher scores against these. */
  keywords: string[];
  /** Exact page the information was read on. */
  source?: string;
  /** ISO date the source was read. Not a verification date. */
  checkedOn?: string;
  verified: boolean;
  verifiedOn?: string;
  verifiedBy?: string;
  /** Anything contradictory or unresolved. Do not guess past these. */
  flag?: string;
};

export const REFERRALS: Referral[] = [
  // Paste research output here. Everything arrives verified: false.
];

/** The gate. Same shape as liveResources() in content/support.ts. */
export const liveReferrals = () =>
  REFERRALS.filter((r) => r.verified && r.phone);

/**
 * Entries that have a useful link but no confirmed phone line yet.
 *
 * A bank's account-opening page is safe to show unverified in a way a phone
 * number is not: she can see for herself whether the page loads and what it
 * says. A dead number gives her nothing back. So links pass a lower bar than
 * numbers do — but they still never appear as though they were checked.
 */
export const linkOnlyReferrals = () =>
  REFERRALS.filter((r) => !r.verified && r.url);

export const referralsByCategory = (c: ReferralCategory) =>
  liveReferrals().filter((r) => r.category === c);
