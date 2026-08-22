# Deploying GAL

Order matters: GitHub, then Vercel, then Supabase. The app deploys and installs
fine before Supabase exists — rooms just say they are switched off. Get the live
HTTPS URL working first, because shake and install cannot be tested without one.

## 1. GitHub

The repo is already initialised and committed locally, with no remote.

```bash
cd "D:/Workspace/02-Projects/gal" && git remote add origin git@github.com:YOUR_ORG/gal.git && git push -u origin main
```

Make it **private**. The support content and the brand guide are client material.

## 2. Vercel

New Project → import the repo → Deploy. Framework detection handles Next.js and
there is nothing to configure. No env vars are needed for this first deploy.

You now have an HTTPS URL. Test on the actual iPhone before going further:

- **Install:** Share → Add to Home Screen. There is no install prompt in Safari.
- **Install first, then use.** An installed PWA gets different `localStorage`
  than the Safari tab, so anything saved in the tab does not carry over.
- **Shake** needs a secure context, so it works on the Vercel URL and not over
  `http://192.168.x.x`.

## 3. Supabase

Only the rooms need this. Everything else works without it.

1. New project. Pick the region closest to Uganda — `eu-central-1` is usually
   the best of a bad set; there is no East Africa region.
2. SQL Editor → New query → paste all of `supabase/schema.sql` → Run. **That is
   the only file you need.** It creates the tables, turns RLS on, writes every
   policy, seeds four rooms, and includes the column-privilege fix that stops a
   muted account clearing its own mute.

   `supabase/migrations/001_moderation.sql` is **optional and currently not
   run**. It adds a moderator role and the in-app queue at `/moderate`. Without
   it that page just says the account cannot see the queue, and nothing else in
   the app changes. Run it later if you ever want in-app moderation.
3. Authentication → Providers → Email. Turn **off** "Confirm email" and leave
   the OTP flow on: the app signs in with a six-digit code, not a magic link and
   not a password.
4. Authentication → Emails. Replace the body of **both** "Magic Link" and
   "Confirm signup" with the files in `supabase/email-templates/`. Read the
   comment at the top of each before pasting.

   This step is easy to skip and breaks sign-in completely when you do. The
   stock templates send `{{ .ConfirmationURL }}`, a link. Tapping a link opens
   Safari, and an installed PWA has different storage than the Safari tab, so
   she ends up signed in on a page she wasn't using while the app she installed
   still asks her to sign in. `{{ .Token }}` is the six-digit code the app
   actually asks for.

   Set both templates. Which one GoTrue sends to a brand-new address is a
   branch in its signup path, and guessing wrong costs you a debugging session
   for no gain.

   **Check the sender before testing.** Supabase's built-in email service is
   rate-limited to a handful of messages an hour and, on current projects, only
   delivers to addresses on the project team. If the end-to-end test gets no
   email, that is the first thing to check, not the template. Real users need
   custom SMTP under Project Settings → Authentication → SMTP.
5. Project Settings → API. Copy the URL and the **anon public** key.
6. Vercel → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

7. Redeploy. Env vars are baked in at build time, so an existing deployment
   will not pick them up until it rebuilds. Rooms keep saying "not switched on"
   until then, and that looks like a broken Supabase rather than a stale build.

**Never add the `service_role` key.** The app does not use it and it bypasses
every RLS policy in `schema.sql`. A `NEXT_PUBLIC_` service key would be readable
by anyone who opens the site.

## 4. Elle (the AI companion)

One more Vercel environment variable:

```
ANTHROPIC_API_KEY=sk-ant-...
```

**No `NEXT_PUBLIC_` prefix, ever.** A `NEXT_PUBLIC_` key is readable by anyone
who opens the site, and this one spends money. It is used only in
`app/api/elle/route.ts`, which runs server-side.

Without it, `/elle` says Elle is not switched on and nothing else changes.

Two things to watch once it is live:

- **Cost.** Every message is a paid API call on `claude-opus-5`. There is no
  per-user rate limit in the app yet — the only guard is a 20-message window per
  request. Set a spend limit in the Anthropic console before you hand the URL to
  anyone.
- **The conversation is not saved anywhere**, by GAL or by this route. That is
  deliberate, and it means you cannot audit what Elle said. If you later need
  moderation or review, that is a decision to make openly, because it reverses a
  promise the screen currently makes to her.

## 5. Retention

Messages are meant to expire. Enable `pg_cron` (Database → Extensions), then run
the scheduling block at the bottom of `schema.sql`. Until then the table just
grows; nothing breaks.

## Before real users

- `content/support.ts` still has **twelve unverified helplines and zero live
  ones**. The support page shows "numbers are being confirmed" and lists none.
  Call each one, then set `verified: true`. Three entries carry an unresolved
  `flag` — read them.
- Remove `robots: { index: false }` from `app/layout.tsx` when it should be
  findable. It is deliberately excluded from search right now.
- **Reports land in a table, not an inbox.** Running without the moderation
  migration is a deliberate choice, and this is its one consequence: the Report
  button in a room still works and still writes a row, but nothing surfaces it
  in the app. To read them, open Supabase → Table Editor → `reports`, and join
  by `message_id` to see what was reported.

  Put a recurring reminder somewhere. A report nobody reads is the same as no
  report button, and she has been told "Reported. Thank you."

  Report rows are deleted along with their message at the 30-day expiry, so the
  table stays small on its own.

- Reporting is one-way by design. A reporter sees "Reported. Thank you." and
  nothing further: no count, no status, no history. `reports` has no select
  policy for reporters, so the UI could not show more even if asked. That
  matters when the person being reported may be reading over her shoulder.

- **Anyone can delete their own messages** at any time, and nobody can edit
  anyone else's. That is the only in-app recourse without a moderator.
