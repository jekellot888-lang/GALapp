/**
 * ⚠⚠ NOTHING IN THIS FILE SHIPS UNVERIFIED. ⚠⚠
 *
 * This is the single highest-liability surface in GAL. A wrong or dead number
 * here is worse than no number at all: someone in trouble dials it, nothing
 * happens, and they stop trying.
 *
 * Rules before any entry goes live:
 *   1. Phone the number. A human or a working system must answer.
 *   2. Confirm the operating hours and the cost (free / standard rates).
 *   3. Confirm it serves the caller's location.
 *   4. Record who verified it and when.
 *
 * ── Where these came from (2026-08-19) ──────────────────────────────────────
 * Transcribed from screenshots of the Base44 build. That is a real source, not
 * invention, so the numbers are recorded here rather than thrown away — but
 * every one is still `verified: false` and therefore still hidden from users.
 * A screenshot proves the number was displayed. It does not prove it answers.
 *
 * Transcribing them surfaced three problems that are exactly why rule 1 exists.
 * See `CONFLICTS` below. Resolve each by calling, then set `verified: true`.
 */

export type Resource = {
  id: string;
  name: string;
  /** Leave empty until step 1 above is done. */
  phone: string;
  what: string;
  hours: string;
  cost: string;
  /** Street address, where the resource is a place rather than only a line. */
  address?: string;
  verified: boolean;
  verifiedOn?: string;
  verifiedBy?: string;
  /** Anything the verifier needs to resolve before this can go live. */
  flag?: string;
};

/**
 * Unresolved contradictions in the source. Do not guess your way past these.
 *
 * 1. Mental Health Uganda (0800 212 121) was listed twice with different hours
 *    — once "Mon–Fri, 8:30am–5pm", once "24/7". Both cannot be true, and the
 *    difference decides whether someone calls at 2am and gets nothing.
 * 2. Uganda Law Society legal aid appeared as two different numbers,
 *    "0800000051" and "08000051". At least one is a transcription error.
 * 3. The source listed several lines twice under slightly different names
 *    (MIFUMI ×3, Sauti 116 ×2, Police GBV ×2). Deduplicated here; confirm the
 *    survivors are the canonical ones.
 */
export const CONFLICTS = [
  "mental-health-uganda: hours contradict between two source entries",
  "uganda-law-society: two different numbers in source",
] as const;

export const RESOURCES: Resource[] = [
  {
    id: "police-emergency",
    name: "Uganda Police Emergency",
    phone: "999",
    what: "National emergency line for police, fire and immediate danger.",
    hours: "24/7",
    cost: "Free",
    verified: false,
  },
  {
    id: "ambulance-fire",
    name: "National Ambulance & Fire",
    phone: "112",
    what: "National emergency line for ambulance and fire.",
    hours: "24/7",
    cost: "Free",
    verified: false,
  },
  {
    id: "sauti-116",
    name: "Sauti 116 — Child & GBV Helpline",
    phone: "116",
    what: "Uganda's national helpline for children and survivors of gender-based violence.",
    hours: "24/7",
    cost: "Toll-free",
    verified: false,
  },
  {
    id: "mifumi",
    name: "MIFUMI Domestic Violence Helpline",
    phone: "0800 200 250",
    what: "Domestic violence support and counselling.",
    hours: "24/7",
    cost: "Toll-free",
    verified: false,
  },
  {
    id: "police-gbv",
    name: "Police GBV Helpline",
    phone: "0800 199 195",
    what: "Gender-based violence helpline run by the Uganda Police.",
    hours: "24/7",
    cost: "Toll-free",
    verified: false,
  },
  {
    id: "police-gbv-alt",
    name: "Police GBV Helpline (alternate)",
    phone: "0707 772 691",
    what: "Alternate Uganda Police gender-based violence line.",
    hours: "24/7",
    cost: "Standard rates — confirm on call",
    verified: false,
    flag: "Mobile prefix, so probably not toll-free. Confirm the cost before listing.",
  },
  {
    id: "mental-health-uganda",
    name: "Mental Health Uganda Helpline",
    phone: "0800 212 121",
    what: "Free, confidential mental health counselling and emotional support.",
    hours: "",
    cost: "Toll-free",
    verified: false,
    flag: "Hours contradict in the source (24/7 vs Mon–Fri 8:30am–5pm). Confirm before listing.",
  },
  {
    id: "butabika-crisis",
    name: "Butabika Mental Health Crisis Line",
    phone: "0800 211 306",
    what: "Mental health crisis line at Butabika National Referral Hospital.",
    hours: "24/7",
    cost: "Toll-free",
    verified: false,
  },
  {
    id: "uganda-law-society",
    name: "Uganda Law Society — Legal Aid",
    phone: "",
    what: "Free legal advice and guidance.",
    hours: "Mon–Fri, 9am–5pm",
    cost: "Toll-free",
    verified: false,
    flag: "Source gave two different numbers (0800000051 / 08000051). Establish which is real before filling this in.",
  },
  {
    id: "justice-centres",
    name: "Justice Centres Uganda",
    phone: "0800 100 210",
    what: "Free legal aid and representation on civil and family matters.",
    hours: "Mon–Fri, 9am–5pm",
    cost: "Toll-free",
    verified: false,
  },
  {
    id: "unhcr-frrm",
    name: "UNHCR FRRM Helpline",
    phone: "0800 32 32 32",
    what: "Referral line for protection services and support.",
    hours: "24/7",
    cost: "Toll-free",
    verified: false,
  },
  {
    id: "miss-uganda-foundation",
    name: "Miss Uganda Foundation",
    phone: "+256 754 300040",
    what: "Support and referrals through the foundation's office.",
    hours: "Mon–Fri, 9am–5pm",
    cost: "Standard rates",
    address: "Lungujja Avenue, off Makerere Close, Kalema",
    verified: false,
    flag: "Address was truncated in the source. Confirm the full address.",
  },
];

/** The gate. Nothing reaches a user until someone has phoned it. */
export const liveResources = () => RESOURCES.filter((r) => r.verified && r.phone);

/** Entries carrying a question a human still has to answer. */
export const flaggedResources = () => RESOURCES.filter((r) => r.flag);
