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

## 4. Retention

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
- Rooms have no moderator queue yet. `reports` rows land in the table and
  nothing surfaces them; `profiles.muted_until` and `messages.hidden_at` are
  moderator tools with no UI. Someone has to watch that table, or the rooms
  should stay closed.
