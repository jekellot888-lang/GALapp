# Deploying GAL

GitHub, then Vercel. That is the whole deployment.

The app has **no database and no accounts**. Everything except Elle runs on the
phone with no backend at all, so there is nothing to provision, nothing to keep
running, and nothing that can pause under you. The one optional environment
variable is Elle's API key, and the app works without it.

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

## 3. Elle (optional)

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

## 4. The room (optional)

`vercel integration add upstash`, which sets `KV_REST_API_URL` and
`KV_REST_API_TOKEN` for you. Without them `/room` says it is not switched on and
nothing else in the app changes.

Two more, both optional, for report alerts:

```
RESEND_API_KEY=re_...
MODERATION_EMAIL=someone@example.com
```

Without these a report still removes the message immediately — it only loses the
notification, which is logged to the Function instead. Note that an unverified
Resend account only delivers to the account holder's own address. That made it
useless for user email and makes it exactly right here, where the alert never
goes anywhere else.

**Closing the room.** Set `gal:room:closed` to `1` in the Upstash data browser
and the room shuts for everybody within one poll. Set it to `0` to reopen. It
works from a phone, needs no deploy, and it is the only lever there is — with no
accounts there is nobody to ban, only a session that can be replaced in seconds.
Whoever is on call should be shown this before they need it.

## The service worker

`public/sw.js` precaches a fixed `SHELL` list. **Every route named there must
exist**, because `cache.addAll` rejects as a whole if any single URL 404s — one
stale path silently breaks offline mode for the entire app.

Bump `CACHE` on every deploy, or returning users keep the old bundle.

## Before real users

- `content/referrals.ts` is **empty**, so `/ask` says it has nothing to give.
  Research candidates with `docs/scrape-prompt.md`, paste them in, then phone
  each number and set `verified: true`. Research is not verification.
- `content/support.ts` still has **twelve unverified helplines and zero live
  ones**. The support page shows "numbers are being confirmed" and lists none.
  Call each one, then set `verified: true`. Three entries carry an unresolved
  `flag` — read them.
- `content/clinics.ts` ships empty and needs a real source.
- Remove `robots: { index: false }` from `app/layout.tsx` when it should be
  findable. It is deliberately excluded from search right now.
