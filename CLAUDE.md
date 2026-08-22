# GAL

**GAL — Guide, Assist, Liberate.** Three capitals, always. An acronym, not the
word "gal". Do not "correct" it to GALL, and do not expand it on a guess.

A daily companion for young women in Uganda: mind, body, money, and knowing
where to turn. Installable PWA, Next.js 14 App Router, Tailwind, TypeScript.
Deployed on Vercel from `github.com/jekellot888-lang/GALapp`.

The app icon is Elle's rose-gold monogram, not a G. Elle is the brand behind
GAL. Both are correct at once — do not "fix" either to match the other.

## Read these before changing anything

| File | Why |
|---|---|
| `design.md` | The locked design system. Pages that drift from it are the defect — amend the file first, then build. |
| `tokens.css` | Every colour, size, space, easing. **Nothing in this app inlines a value.** |
| `content/support.ts` | Read the header. The verification gate is the most important rule in the codebase. |
| `content/clinics.ts` | Ships empty on purpose. The header says why. |
| `docs/deploy.md` | Vercel deploy. No database — the only env var is Elle's key. |
| `docs/verification.md` | How helplines get verified. This is the work that unblocks the app. |

## The threat model, which drives most decisions

She may be reading this on a phone the person she is trying to get away from can
pick up. That single fact explains the quick exit, the calculator disguise, Quiet
Mode being dark in both schemes, the safety plan having no free-text fields, and
the self-check saving nothing.

When a design choice and this threat model conflict, the threat model wins.

## Rules that are not style preferences

1. **No phone number renders until `verified: true`.** The gate is
   `liveResources()` / `liveClinics()` filtering on `verified && phone`. Support,
   Quiet Mode and the self-check all read it. Do not bypass it, do not hardcode a
   number in copy, and do not flip a flag without phoning the line. A dead number
   is worse than no number.
2. **Do not invent facts.** No clinics, no practitioners, no fees, no wellness
   percentages, no streak statistics. A visible gap beats a plausible
   fabrication. Everything currently in `content/` came from a real source and is
   marked with where it came from.
3. **`/check` and `/elle` must never persist anything.** Component state only.
   A stored string reading "I have been hit" is the most dangerous thing this app
   could leave on a phone.
4. **Contrast floor is WCAG AA, measured against the real rendered background.**
   Not estimated. `getComputedStyle` returns `oklch()` now, so a naive regex
   silently produces garbage — rasterise through a canvas instead.
5. **Tap targets ≥ 44px.** Quick exit stays reachable and never styled away.
6. **Elle must never advise leaving or staying.** Separation is the most
   dangerous period in an abusive relationship. See the system prompt in
   `app/api/elle/route.ts`.

## Colour means something

One meaning each, per `design.md`: **wine** = act now and safety, **rose** =
company and warmth, **sage** = settled/done/confirmed. Anything that fits none of
those is ink and rule. No fourth hue without a reason.

## Running it

Never `npm run dev` from Bash in this workspace — use the preview tool with the
`gal` entry (port 3240). There are two launch configs and the right one depends
on where the session is rooted: `.claude/launch.json` in this folder when the
session is inside the project, and `D:\Workspace\.claude\launch.json` when it is
rooted at the workspace. Outside this workspace, plain `npm run dev` is fine.

Running `next build` while the dev server is live corrupts `.next`. Stop the
server, `rm -rf .next`, rebuild, and clear `.next` again before restarting dev.

The app runs fully with **no environment variables** — Elle returns 503 and
everything else works, `/ask` included. That is also how it deploys. There is no
database and no backend to stand up.

## Two traps that will waste your time

**The service worker.** `components/SWRegister.tsx` registers in production only
and tears down stale registrations in dev. Without that, its cache-first `fetch`
handler replays old chunks after every edit and you get a wall of hydration
errors that have nothing to do with your code. If you see that wall, unregister
the worker and clear caches before debugging anything.

**The browser console buffer persists across reloads.** Errors shown there may be
stale. Log a unique marker, reload, and only trust what appears after it.
`preview_logs` is authoritative for SSR.

## Decisions already made, so they are not re-litigated

- **No accounts, no database, no chat between users.** Removed on 2026-08-22.
  GAL had group rooms behind an emailed sign-in link and a Supabase backend.
  All of it is gone — pages, schema, migrations, and the `@supabase/*`
  dependencies. Recoverable from `fe24ce5` if peer chat is ever wanted back.

  It was cut because the sign-in was blocking everything and buying little.
  Supabase locks auth email templates behind custom SMTP, the built-in mailer
  sends two messages an hour to project members only, and free projects pause
  after a week idle. That is a lot of fragility in front of a room that had
  nobody in it yet.

  What it bought instead: no signup, no moderation duty, no third party holding
  a list of users, and nothing to sign into on a phone somebody else may pick
  up. That last one was always in tension with the threat model.

- **`/ask` is a lookup, not a model.** It scores what she types against
  `content/referrals.ts` and can only ever return rows from that file. It cannot
  invent a phone number — structurally, not probabilistically — which is what
  makes it safe to point at banks, hospitals and police.

  It runs in the browser with no network, so it answers at zero bars and on no
  airtime. Do not "improve" it into an API call. Offline is most of the point,
  and an API-backed version would answer with a plausible wrong number exactly
  when she is least able to check it.

- **Elle is the only thing that calls an API**, and she stays optional. She is
  for the questions a list cannot answer. Third-party AI is approved for her,
  with consent stated before she types. Without `ANTHROPIC_API_KEY` she returns
  503 and the rest of the app is unaffected.

## What is deliberately unfinished

- **`content/referrals.ts` is empty**, so `/ask` says it has nothing to give.
  Research candidates with `docs/scrape-prompt.md`, then phone each number
  before setting `verified: true`. Reading a number on a website is not
  verification — it just turns "find the numbers" into "call down a list".
- **Twelve helplines, none verified.** This is why Support and Quiet Mode show
  nothing to dial. It is phone calls, not code — `docs/verification.md`.
- **Clinics empty.** Needs a real source.
- **28 of 34 article bodies empty.** The reader says so honestly rather than
  showing filler.
