# Deploying GAL

GitHub, then Vercel. That is the whole deployment.

Most of the app still runs on the phone. The exception is Room, which uses
Supabase anonymous auth, Postgres, and Realtime. Elle is the other optional
networked surface.

## 1. GitHub

```bash
git push -u origin main
```

## 2. Vercel

New Project → import the repo → Deploy. Framework detection handles Next.js and
there is nothing to configure. **No environment variables are needed.**

You now have an HTTPS URL. Test on the actual iPhone before going further:

- **Install:** Share → Add to Home Screen. There is no install prompt in Safari.
- **Install first, then use.** An installed PWA gets different `localStorage`
  than the Safari tab, so anything saved in the tab does not carry over.
- **Shake** needs a secure context, so it works on the Vercel URL and not over
  `http://192.168.x.x`.

## 3. Room

Room needs the Supabase schema in `supabase/chat-schema.sql`, anonymous sign-ins
enabled in Supabase Auth, and these Vercel variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

In Vercel these two are **Config**, not Secret. They are intentionally public:
the anon key is protected by Supabase RLS policies, not by hiding it from the
browser.

After changing either value, redeploy the current production deployment so the
Next.js build sees the new environment.

## 4. Elle (optional)

One Vercel environment variable:

```
ANTHROPIC_API_KEY=sk-ant-...
```

**No `NEXT_PUBLIC_` prefix, ever.** A `NEXT_PUBLIC_` key is readable by anyone
who opens the site, and this one spends money. It is used only in
`app/api/elle/route.ts`, which runs server-side.

Without it, `/elle` says Elle is not switched on and nothing else changes. `/ask`
is unaffected — it never calls an API.

Two things to watch once it is live:

- **Cost.** Every message is a paid API call on `claude-opus-5`. There is no
  per-user rate limit in the app — the only guard is a 20-message window per
  request. Set a spend limit in the Anthropic console before you hand the URL to
  anyone.
- **The conversation is not saved anywhere**, by GAL or by this route. That is
  deliberate, and it means you cannot audit what Elle said. If you later need
  moderation or review, that is a decision to make openly, because it reverses a
  promise the screen currently makes to her.

## The service worker

`public/sw.js` precaches a fixed `SHELL` list. **Every route named there must
exist**, because `cache.addAll` rejects as a whole if any single URL 404s — one
stale path silently breaks offline mode for the entire app.

Bump `CACHE` on every deploy, or returning users keep the old bundle.

## Before real users

- `content/referrals.ts` has researched candidates, but zero confirmed phone
  lines. Research is not verification.
- `content/support.ts` still has **twelve unverified helplines and zero live
  ones**. The support page shows "numbers are being confirmed" and lists none.
  Call each one, then set `verified: true`. Three entries carry an unresolved
  `flag` — read them.
- `content/clinics.ts` ships empty and needs a real source.
- Remove `robots: { index: false }` from `app/layout.tsx` when it should be
  findable. It is deliberately excluded from search right now.
