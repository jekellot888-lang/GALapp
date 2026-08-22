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
  {
    id: "police-emergency",
    category: "police",
    name: "Uganda Police Force — emergency",
    what: "The national emergency line. Use it when something is happening now.",
    phone: "999",
    url: "https://upf.go.ug/national-emergence-toll-free-numbers-for-public-safety/",
    hours: "24 hours",
    cost: "Free",
    keywords: ["police", "emergency", "999", "112", "danger", "attack", "help now", "report"],
    source: "https://upf.go.ug/national-emergence-toll-free-numbers-for-public-safety/",
    checkedOn: "2026-08-22",
    verified: false,
    flag: "112 is published alongside 999 on the same page. Confirm which answers, and whether both work on all networks.",
  },
  {
    id: "police-call-centre",
    category: "police",
    name: "Police National Emergency Call Centre",
    what: "The police headquarters call centre, if the emergency line is not getting through.",
    phone: "0800199399",
    url: "https://upf.go.ug/national-emergence-toll-free-numbers-for-public-safety/",
    cost: "Toll free",
    keywords: ["police", "call centre", "headquarters", "report", "emergency"],
    source: "https://upf.go.ug/national-emergence-toll-free-numbers-for-public-safety/",
    checkedOn: "2026-08-22",
    verified: false,
    flag: "A web search attributed a Child and Family Protection Unit line (0800199033) and a GBV helpline (0800199195) to UPF, but neither appears on the official toll-free page. Do not add either until somebody confirms them with the police directly. Hours not published.",
  },
  {
    id: "mglsd",
    category: "legal",
    name: "Ministry of Gender, Labour and Social Development",
    what: "The ministry responsible for gender-based violence and child protection services.",
    phone: "+256414347854",
    url: "https://mglsd.go.ug/contact-us-v-one/",
    address: "Gender & Labour House, Plot 2 George Street, Kampala. P.O. Box 7136.",
    cost: "Standard rates",
    keywords: ["ministry", "gender", "government", "gbv", "child protection", "labour", "social"],
    source: "https://mglsd.go.ug/contact-us-v-one/",
    checkedOn: "2026-08-22",
    verified: false,
    flag: "Main switchboard, not a helpline. The ministry runs Sauti 116, which is already listed in content/support.ts — check the two files do not contradict each other before either goes live.",
  },
  {
    id: "ministry-of-health",
    category: "hospital",
    name: "Ministry of Health — public line",
    what: "The national health line, for questions about where to go and what is available.",
    phone: "0800-100-066",
    url: "https://health.go.ug/contact-us/",
    cost: "Toll free",
    keywords: ["ministry", "health", "government", "hospital", "clinic", "where to go"],
    source: "https://health.go.ug/contact-us/",
    checkedOn: "2026-08-22",
    verified: false,
    flag: "WEAKEST SOURCING HERE. health.go.ug fails TLS verification, so this page could not be read directly — the number came from a search engine's summary of it. Treat as a lead, not a record. An office line of +256417712260 was quoted in the same summary.",
  },
  {
    id: "mulago-hospital",
    category: "hospital",
    name: "Mulago National Referral Hospital",
    what: "The national referral hospital in Kampala. Takes emergencies and referrals from smaller facilities.",
    phone: "0414 554001",
    address: "Mulago Hill, Kampala",
    hours: "24 hours",
    keywords: ["mulago", "hospital", "emergency", "referral", "kampala", "casualty", "doctor"],
    source: "https://upf.go.ug/national-emergence-toll-free-numbers-for-public-safety/",
    checkedOn: "2026-08-22",
    verified: false,
    flag: "NO WORKING OFFICIAL PAGE. health.go.ug/sermon/mulago... 404s and mulago.or.ug is a placeholder stub, so no url is set and this entry stays hidden from /ask. The number came off a police contact list, not from Mulago, published as '0414 554001/6/8, 541250' — a range plus a second line. Phone it, then add a real source.",
  },
  {
    id: "nsambya-hospital",
    category: "hospital",
    name: "St Francis Hospital Nsambya",
    what: "A large mission hospital in Kampala with a toll-free emergency line.",
    phone: "0800 100131",
    url: "https://www.nsambyahospital.or.ug/",
    address: "Nsambya, Kampala",
    hours: "24 hours",
    cost: "Toll free to call. Treatment is charged.",
    keywords: ["nsambya", "hospital", "emergency", "kampala", "mission", "doctor", "casualty"],
    source: "https://www.nsambyahospital.or.ug/",
    checkedOn: "2026-08-22",
    verified: false,
    flag: "Two toll-free lines published (0800 100131 emergency, 0800 140144 general) plus a mobile emergency line +256 741 89 83 82. Confirm which is answered at night.",
  },
  {
    id: "mengo-hospital",
    category: "hospital",
    name: "Mengo Hospital",
    what: "The oldest hospital in Uganda, in Mengo, Kampala. General outpatient and inpatient care.",
    phone: "+256 312 307 100",
    url: "https://mengohospital.org/contact-us/",
    address: "Sir Albert Cook Road, Mengo, Kampala. P.O. Box 7161.",
    keywords: ["mengo", "hospital", "kampala", "clinic", "doctor", "outpatient"],
    source: "https://mengohospital.org/contact-us/",
    checkedOn: "2026-08-22",
    verified: false,
    flag: "Five numbers published. This is the landline; the others are mobile. Opening hours are on a separate page and were not read.",
  },
  {
    id: "stanbic-uganda",
    category: "bank",
    name: "Stanbic Bank Uganda",
    what: "You can open a personal account online with an ID, a photo and a picture of your signature.",
    phone: "0800 250 250",
    url: "https://www.stanbicbank.co.ug/uganda/personal/contact-us",
    address: "Crested Towers, Plot 17 Hannington Road, Kampala",
    cost: "Toll free",
    keywords: ["stanbic", "bank", "account", "open account", "savings", "money", "atm"],
    source: "https://www.stanbicbank.co.ug/uganda/personal/contact-us",
    checkedOn: "2026-08-22",
    verified: false,
    flag: "Online opening is stated for first accounts only; a second account needs a branch. Requirements PDF exists at /static_file/Uganda/Downloadable files/ — read it before describing what she needs to bring.",
  },
  {
    id: "centenary-bank",
    category: "bank",
    name: "Centenary Bank",
    what: "CenteXpress opens an account from a phone with a National ID and a registered SIM.",
    phone: "0800 200 555",
    url: "https://www.centenarybank.co.ug/product-details/centexpress-account/5/savings-accounts",
    address: "Mapeera House, Kampala Road, Kampala",
    hours: "Support 24 hours",
    cost: "Toll free",
    keywords: ["centenary", "bank", "account", "open account", "centexpress", "savings", "money", "mobile"],
    source: "https://www.centenarybank.co.ug/contact-us",
    checkedOn: "2026-08-22",
    verified: false,
    flag: "Opening balances quoted per product (CenteXpress UGX 3,000; current account UGX 100,000 plus two photos). Confirm these are current before repeating them to anyone — fees move.",
  },
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
