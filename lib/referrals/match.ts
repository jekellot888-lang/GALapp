/**
 * The matcher behind /ask.
 *
 * A lookup, not a model. It can only ever return rows that exist in
 * `content/referrals.ts`, which means it cannot invent a phone number — not
 * "is unlikely to", cannot. On a surface where a wrong number is the failure
 * that matters, that property is worth more than fluency.
 *
 * It runs in the browser with no network. The service worker caches the shell
 * cache-first, so this answers at zero bars, on no airtime, for free. That is
 * most of the reason it is not an API call.
 *
 * What it gives up is phrasing. "he took my phone and i have no money" will not
 * score well against any entry here. The UI carries a visible category menu
 * beside the text box so there is always a route that does not depend on
 * guessing what she typed.
 */

import { REFERRALS, type Referral, type ReferralCategory } from "@/content/referrals";

/**
 * Words that carry no signal about what she needs. Dropping them stops "how do
 * I open a bank account" from scoring against every entry that happens to use
 * the word "do" in its description.
 */
const STOPWORDS = new Set([
  "the", "and", "for", "with", "how", "can", "you", "get", "got", "need",
  "want", "please", "help", "where", "what", "who", "any", "some", "have",
  "has", "was", "are", "but", "not", "this", "that", "there", "here", "from",
  "about", "near", "find", "looking", "look", "tell", "give", "does", "did",
  "would", "could", "should", "will", "just", "now", "know", "make", "take",
]);

/** Crude singular-ising. "banks" and "bank" should be the same token. */
const stem = (t: string) => (t.length > 3 && t.endsWith("s") ? t.slice(0, -1) : t);

const tokenize = (s: string): string[] =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
    .map(stem);

/**
 * Direct category words. Redundant with good keywords, and worth having anyway:
 * it means a bare "police" works even against an entry whose keyword list
 * somebody forgot to fill in properly.
 */
const CATEGORY_WORDS: Record<string, ReferralCategory> = {
  bank: "bank",
  account: "bank",
  money: "bank",
  saving: "bank",
  hospital: "hospital",
  clinic: "hospital",
  doctor: "hospital",
  sick: "hospital",
  police: "police",
  station: "police",
  report: "police",
  lawyer: "legal",
  legal: "legal",
  court: "legal",
  counsellor: "mental-health",
  counselling: "mental-health",
  shelter: "shelter",
  refuge: "shelter",
};

const WEIGHT = { keyword: 3, name: 2, what: 1, category: 2 };

export type Match = { referral: Referral; score: number };

/**
 * Score every referral against the query and return the ones that scored.
 *
 * An entry is worth showing if it gives her something to act on — a number or a
 * page. `verified` no longer decides whether it appears, only how it is
 * presented: see the note on provenance in `content/referrals.ts`.
 */
export function match(query: string, limit = 4): Match[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const wantedCategories = new Set(
    tokens.map((t) => CATEGORY_WORDS[t]).filter(Boolean) as ReferralCategory[]
  );

  const scored: Match[] = [];

  for (const referral of REFERRALS) {
    const actionable = referral.phone || referral.url;
    if (!actionable) continue;

    const keywords = new Set(referral.keywords.map(stem));
    const nameTokens = new Set(tokenize(referral.name));
    const whatTokens = new Set(tokenize(referral.what));

    let score = 0;
    for (const t of tokens) {
      if (keywords.has(t)) score += WEIGHT.keyword;
      else if (nameTokens.has(t)) score += WEIGHT.name;
      else if (whatTokens.has(t)) score += WEIGHT.what;
    }
    if (wantedCategories.has(referral.category)) score += WEIGHT.category;

    if (score > 0) scored.push({ referral, score });
  }

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

/** The category menu beside the box. Always works, never depends on phrasing. */
export function byCategory(category: ReferralCategory, limit = 6): Match[] {
  return REFERRALS.filter(
    (r) => r.category === category && (r.phone || r.url)
  )
    .slice(0, limit)
    .map((referral) => ({ referral, score: 0 }));
}

/**
 * Whether there is anything at all to show yet.
 *
 * Ships false, and the page says so honestly instead of pretending to be a bot
 * with nothing behind it. See the header of `content/referrals.ts`.
 */
export const hasAnyReferrals = () =>
  REFERRALS.some((r) => r.phone || r.url);
