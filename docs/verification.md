# Verifying the numbers

Two files in GAL refuse to show anything until a human has checked it:
`content/support.ts` (helplines) and `content/clinics.ts` (clinics). Both are
currently empty of verified entries, which is why Support, Quiet Mode and the
end of the self-check all lead to a screen with nothing to dial.

This is the job that unblocks the app. It is phone calls, not code.

## Why the gate exists

A dead number is worse than no number. She dials it in the worst hour of her
life, nothing happens, and she stops trying. That is the failure this whole
design is built to avoid, and it is why nothing here is filled in from a web
search or a screenshot.

Transcribing the existing sources already turned up three contradictions, which
is the argument for calling rather than trusting:

- **Uganda Law Society** appears as three different numbers across sources —
  `0800000051`, `08000051`, and `0800 100 051`. At most one is right.
- **Mental Health Uganda** was listed as both `24/7` and `Mon–Fri 8:30–5`.
- Several lines appeared twice under different names.

## Start with three

`116`, `999` and `112`. They are short codes, they are the ones Quiet Mode
needs, and they are three calls. Everything else can follow later.

## What to ask on each call

1. **Does someone answer?** If it rings out, try twice more at different hours
   before writing it off. Note what happened either way.
2. **What are the actual hours?** Ask directly. Do not accept "always" — ask
   what happens at 2am on a Sunday.
3. **Is it free?** Free from which networks? A toll-free line that is only free
   from MTN is not free to somebody on Airtel, and that needs saying in the app.
4. **Who is it for?** Some lines are children only, some are GBV only, some will
   redirect. Write down what they say, not what the name implies.
5. **Does it serve her area?** A Kampala line may not help somebody in Gulu.

For clinics, additionally: confirm the address by a second source, ask whether
they see walk-ins, and for post-rape care ask explicitly whether they provide it
and within what window.

## Recording it

Open `content/support.ts`, find the entry, and set three fields:

```ts
verified: true,
verifiedOn: "2026-08-21",
verifiedBy: "your name",
```

If the call raised a question, put it in `flag` and leave `verified: false`. A
flagged entry stays hidden, which is the correct outcome for a line nobody could
reach.

Three entries currently carry a `flag`. Read them before calling — two of them
tell you exactly what to resolve.

## What happens then

Nothing else. No deploy step, no migration, no toggle. The gate is
`liveResources()` filtering on `verified && phone`, so the moment an entry
flips, it appears on Support, in Quiet Mode, and at the end of the self-check.

## If a line cannot be verified

Leave it `verified: false` and write why in `flag`. An empty Support page is an
honest one. The app already says the right thing in that state — that numbers
are being confirmed, and to go to the nearest health facility or police station
— and that sentence is better than a number that rings out.
