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
2. SQL Editor → New query → paste all of `supabase/schema.sql` → Run. That
   creates the tables, turns RLS on, writes every policy, and seeds four rooms.
   Then run `supabase/migrations/001_moderation.sql`, which adds the moderator
   role and the queue. If you ran an earlier copy of `schema.sql`, the migration
   also closes a hole where a muted user could clear their own mute — run it
   either way, it is safe twice.
3. Authentication → Providers → Email. Turn **off** "Confirm email" and leave
   the OTP flow on: the app signs in with a six-digit code, not a magic link and
   not a password.
4. Project Settings → API. Copy the URL and the **anon public** key.
5. Vercel → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

6. Redeploy.

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
- **Make yourself a moderator, or keep the rooms closed.** The queue exists at
  `/moderate`, but it is empty of permission until somebody is in the
  `moderators` table. Find your user id in Authentication → Users, then run:

  ```sql
  insert into public.moderators (id, note) values ('YOUR-UUID', 'founder');
  ```

  `/moderate` is deliberately not linked from anywhere in the app — a moderator
  types the URL. Access is enforced in the database, not by hiding the page.

- Reporting is one-way by design. A reporter sees "Reported. Thank you." and
  nothing further: no count, no status, no history. `reports` has no select
  policy for reporters, so the UI could not show more even if asked. That
  matters when the person being reported may be reading over her shoulder.

- An empty queue and an unwatched queue look identical from `/moderate`. Decide
  who checks it and how often before the rooms take real users.
