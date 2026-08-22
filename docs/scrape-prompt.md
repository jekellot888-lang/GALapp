# Research prompt — referral entries

Paste the block below into any assistant with live web search (Claude with web
search on, ChatGPT with browsing, Perplexity). Run it one category at a time —
banks, then hospitals, then police — because a single run over all of them
produces shallower sourcing on each.

Paste the result back and it drops straight into `content/referrals.ts`.

What comes back is **not** ready to show anyone. Every entry arrives
`verified: false` and stays hidden until somebody phones the number. That is the
same gate `content/support.ts` describes, and the scrape does not shortcut it —
it just turns "find the numbers" into "call down a list", which is the part that
was blocking.

---

```
You are compiling a referral directory for an app used by young women in Uganda.
Accuracy matters more than coverage. An entry that is wrong is worse than an
entry that is missing, because someone in trouble will dial it and get nothing.

TASK
Find current, published contact information for the institutions I name below.
For each one, return an object in the exact TypeScript shape given under OUTPUT.

SOURCES — in this order of preference
1. The institution's own website (the bank's site, the hospital's site).
2. A government or regulator page (Bank of Uganda, Ministry of Health, Uganda
   Police Force).
3. A major Ugandan news outlet, only to corroborate something already found.
Do not use aggregator sites, directories, blog listicles, or scraped-data sites
as a primary source. If the only thing you can find is an aggregator, treat the
entry as not found.

HARD RULES — these matter more than completeness
1. Never write a phone number, address, or URL you did not read on a source you
   can cite. If you cannot find it, set the field to "" and say why in `flag`.
   Do not reconstruct a number from a pattern, do not complete a partial number,
   and do not carry one over from memory.
2. `source` must be the exact page URL you actually read. Not the homepage
   unless the homepage is where the information was.
3. `checkedOn` is today's date, ISO format.
4. `verified` is ALWAYS false. Reading a website does not verify a line answers.
5. If two sources disagree — different numbers, different hours — record one and
   describe the disagreement in `flag`. Do not pick a winner and do not average
   them. The contradiction is the useful finding.
6. Distinguish a toll-free short code from a full number, and say which in
   `cost`. Whether a call is free decides whether someone with no airtime can
   make it.
7. No individual people. Institutions, departments, and desks only — no doctor
   names, no officer names, no named contacts. People move; departments do not.
8. Uganda only.

OUTPUT
Return a TypeScript array literal, nothing else. No prose before or after.

type Referral = {
  id: string;          // kebab-case, stable, unique. e.g. "stanbic-uganda"
  category: "bank" | "hospital" | "police" | "legal" | "mental-health" | "shelter";
  name: string;        // the official name as published
  what: string;        // ONE plain sentence: what she gets by contacting them.
                       // Written to her, not about them. No marketing language.
  phone: string;       // "" if not found. Format as published, with +256.
  url?: string;        // the single most useful page — account opening, or contact
  address?: string;    // street address, if it is a place she can walk into
  hours?: string;      // as published. "" if not published — do not assume 24/7.
  cost?: string;       // "Free" | "Standard rates" | a stated fee | ""
  keywords: string[];  // 5-12 lowercase words she might actually type looking
                       // for this. Include colloquial and Luganda terms where
                       // they are in common use. Not synonyms of the org name.
  source: string;      // exact URL you read
  checkedOn: string;   // ISO date
  verified: false;     // always
  flag?: string;       // anything uncertain, contradictory, or missing
};

TARGETS
The names below are starting points for you to search for, not facts to record.
Confirm each institution exists and is operating before writing an entry, and
drop any that you cannot source. Add others in the same category if you find
ones that clearly belong.

[ CATEGORY: bank — what she needs is how to open an account, and a number to
  call if she gets stuck. The `url` should be the account-opening or personal
  banking page, not the homepage. ]
Stanbic Bank Uganda, Centenary Bank, dfcu Bank, Equity Bank Uganda,
Absa Bank Uganda, PostBank Uganda, Housing Finance Bank.
For each, also note in `what` whether a National ID alone is enough to open the
account, if the source says so. That is the question she is actually asking.

[ CATEGORY: hospital — public and mission hospitals in and around Kampala that
  take walk-ins. `what` should say plainly what they handle. ]
Mulago National Referral Hospital, Kawempe National Referral Hospital,
Kiruddu National Referral Hospital, Naguru General Hospital,
Mengo Hospital, St Francis Hospital Nsambya, Kibuli Hospital.

[ CATEGORY: police — the desks that handle violence against women, not general
  enquiries. Where a station has a specific Child and Family Protection Unit,
  that is the entry, not the station switchboard. ]
Uganda Police Force emergency lines, the Child and Family Protection Unit,
Central Police Station Kampala, and the GBV or SGBV desk if one is published
separately.
```
