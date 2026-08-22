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
 * ── Two grades of provenance ────────────────────────────────────────────────
 * Every entry here carries `source` and `checkedOn`, meaning the number was read
 * on that organisation own published page on that date. That is enough to show
 * it: the card says plainly that GAL has not rung it, and it takes the quiet
 * bordered button rather than the wine one.
 *
 * `verified: true` is a stronger claim and means a person dialled it and got an
 * answer. Nothing here has that yet, so nothing wears the wine button.
 *
 * Do not blur the two. Setting `verified` without phoning does not improve the
 * app, it destroys the only distinction that makes showing a number defensible.
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
    id: "dfcu-bank",
    category: "bank",
    name: "dfcu Bank",
    what: "A commercial bank with a toll-free line for account questions.",
    phone: "0800 222 000",
    url: "https://www.dfcugroup.com/contact-us/",
    address: "Plot 26, 5th Floor, Kyadondo Road, Nakasero, Kampala",
    cost: "Toll free",
    keywords: ["dfcu", "bank", "account", "open account", "savings", "money", "loan"],
    source: "https://www.dfcugroup.com/contact-us/",
    checkedOn: "2026-08-22",
    verified: false,
    flag: "Three numbers published: toll free 0800 222 000, call centre 0414 351 000, customer care 0200 504200. Find out which is answered and when.",
  },
  {
    id: "equity-bank-uganda",
    category: "bank",
    name: "Equity Bank Uganda",
    what: "A commercial bank with branches across the country.",
    phone: "+256 312 327 000",
    url: "https://equitygroupholdings.com/ug/",
    address: "Plot 34, Church House, Kampala Road, Kampala",
    cost: "Standard rates",
    keywords: ["equity", "bank", "account", "open account", "savings", "money", "branch"],
    source: "https://equitygroupholdings.com/ug/",
    checkedOn: "2026-08-22",
    verified: false,
    flag: "Numbers came from a search summary of equitybank.co.ug, which is a separate host from the equitygroupholdings.com site linked here. Confirm the number belongs to the Uganda operation and not the group.",
  },
  {
    id: "finca-uganda",
    category: "bank",
    name: "FINCA Uganda",
    what: "A microfinance bank. Small loans and savings for people banks usually turn away.",
    phone: "0800262262",
    url: "https://finca.ug/contact-us/",
    address: "Plot 11B Acacia Avenue, Kololo, Kampala",
    hours: "Mon-Fri 8:30am-5pm, Sat 9am-2pm",
    cost: "Toll free",
    keywords: ["finca", "microfinance", "loan", "small loan", "savings", "money", "business", "capital"],
    source: "https://finca.ug/contact-us/",
    checkedOn: "2026-08-22",
    verified: false,
    flag: "Hours came from a search summary; the contact page itself does not publish them. Confirm before showing them to anyone.",
  },
  {
    id: "brac-uganda",
    category: "bank",
    name: "BRAC Uganda Bank",
    what: "Group loans for women without collateral, and savings. Runs in most districts, not only Kampala.",
    phone: "+256 714 274201",
    url: "https://www.brac.net/global-impact/uganda/",
    address: "Plot 880 Heritage Road, Nsambya, Kampala",
    cost: "Standard rates",
    keywords: ["brac", "loan", "women", "group loan", "microfinance", "savings", "village", "business", "capital"],
    source: "https://www.brac.net/global-impact/uganda/",
    checkedOn: "2026-08-22",
    verified: false,
    flag: "The linked page is BRAC's global site, not a Uganda contact page. Loan sizes quoted in USD there, which is not how she will be quoted locally. Find the Uganda operation's own number and page before this goes live.",
  },
  {
    id: "ihk-kampala",
    category: "hospital",
    name: "International Hospital Kampala",
    what: "A private hospital on Yusuf Lule Road with its own emergency line.",
    phone: "+256 772 200 400",
    url: "https://img.co.ug/",
    address: "Plot 37 Yusuf Lule Road, Kampala",
    hours: "24 hours",
    cost: "Private. Treatment is charged.",
    keywords: ["ihk", "international hospital", "hospital", "emergency", "kampala", "private", "doctor"],
    source: "https://ihk.img.co.ug/appointments/",
    checkedOn: "2026-08-22",
    verified: false,
    flag: "The hospital's own subdomain ihk.img.co.ug does not resolve from here, so the link points at the parent medical group instead. Check the subdomain on a Ugandan connection and repoint the url if it works. Two emergency numbers published (+256 772 200 400 and +256 712 200 400) plus a main line +256 312 200 400.",
  },
  {
    id: "pride-microfinance",
    category: "bank",
    name: "Pride Microfinance",
    what: "A microfinance institution with a toll-free line and branches countrywide.",
    phone: "0800 333 999",
    address: "Victoria Office Park, Block B, Plot 6-9 Ben Kiwanuka Okot Close, Bukoto, Kampala",
    cost: "Toll free",
    keywords: ["pride", "microfinance", "loan", "small loan", "savings", "money", "business", "capital"],
    source: "https://www.pridemicrofinance.co.ug/contact-us/",
    checkedOn: "2026-08-22",
    verified: false,
    flag: "NO URL SET, so this stays hidden from /ask. pridemicrofinance.co.ug did not resolve from the build machine, with or without www — that may be geo-restriction rather than the site being down, since search indexes many live pages on it. Open it on a Ugandan connection; if it loads, add the url and this appears.",
  },
  {
    id: "case-hospital",
    category: "hospital",
    name: "Case Hospital",
    what: "A private hospital on Buganda Road with a 24-hour emergency department.",
    phone: "+256 312 250 700",
    address: "69-71 Buganda Road, Kampala",
    hours: "24 hours",
    cost: "Private. Treatment is charged.",
    keywords: ["case", "hospital", "emergency", "kampala", "private", "doctor", "casualty"],
    source: "https://casemedcare.org/contact-us/",
    checkedOn: "2026-08-22",
    verified: false,
    flag: "NO URL SET, so this stays hidden from /ask. casemedcare.org timed out from the build machine rather than refusing, which usually means unreachable from here rather than gone. Check on a Ugandan connection and add the url if it loads.",
  },
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
