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
| `docs/deploy.md` | Vercel + Supabase setup and env vars. |
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
`gal` entry (port 3240) from `D:\Workspace\.claude\launch.json`. Outside this
workspace, plain `npm run dev` is fine.

Running `next build` while the dev server is live corrupts `.next`. Stop the
server, `rm -rf .next`, rebuild, and clear `.next` again before restarting dev.

The app runs fully with **no environment variables** — Rooms says "not switched
on", Elle returns 503, everything else works. That is also how it first deploys.

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

- **Group rooms, not DMs.** Nobody can single her out in private.
- **Accounts are opt-in and unlock chat only.** Everything else stays
  device-local. Sign-in is a six-digit email code, never a password.
- **Moderation is built but not enabled.** `supabase/migrations/001_moderation.sql`
  is deliberately not run. Reports still write rows; read them in Supabase's
  table editor. Run the migration to turn the in-app queue on.
- **Third-party AI is approved** for Elle, with consent stated before she types.
- **Messages expire at 30 days.** A chat history is a record of who she talks to.

## What is deliberately unfinished

- **Twelve helplines, none verified.** This is why Support and Quiet Mode show
  nothing to dial. It is phone calls, not code — `docs/verification.md`.
- **Clinics empty.** Needs a real source.
- **28 of 34 article bodies empty.** The reader says so honestly rather than
  showing filler.
