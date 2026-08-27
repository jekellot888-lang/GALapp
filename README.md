# GAL

A daily companion — mind, body, money, and knowing where to turn.
Installable web app. Most features run on the device; Room uses Supabase
anonymous auth and Elle calls an AI service when enabled.

> **GAL — Guide, Assist, Liberate.**
>
> An acronym, not the word "gal". Three letters, always capitalised, and not to
> be "corrected" to GALL. This is the name everywhere: the app, the manifest,
> the installed icon label, the repo.
>
> The rose-gold monogram used as the app icon is Elle's mark, not the app's
> initial. That pairing is deliberate — Elle is the brand behind GAL, so the
> icon carries her identity while every name string says GAL.

---

## Ship it (do this first, before writing any features)

```bash
npm install
npm run dev          # http://localhost:3000
```

```bash
git init
git add -A
git commit -m "GAL v1"
git branch -M main
git remote add origin git@github.com:YOUR_ORG/gal.git
git push -u origin main
```

Then on Vercel: **New Project → import the repo → Deploy.** Room needs the two
public Supabase variables documented in `docs/deploy.md`; Elle needs
`ANTHROPIC_API_KEY` only if it is switched on.

**Deploy on commit #1.** Get the live HTTPS URL working before you build anything
else. The classic all-nighter failure is six hours of features and then a broken
deploy at 4am.

---

## Testing on the actual iPhone

Shake needs a **secure context**. `http://192.168.x.x:3000` will not work — the
motion API is silently dead over plain HTTP. Test on the Vercel URL, or tunnel
localhost over HTTPS.

Install path on iOS: **Share → Add to Home Screen.** There is no install prompt;
`beforeinstallprompt` does not exist in Safari. `components/InstallSheet.tsx`
walks her through it.

---

## Three iPhone realities baked into this build

**1. Storage is bucketed.** An installed home-screen PWA gets different
`localStorage` than Safari. Anything saved in the tab does not carry over on
install. Install first, then use — the install card says so.

**2. Vibration does not exist.** `navigator.vibrate` is absent in iOS Safari.
Not blocked, not permission-gated: absent. `lib/haptics.ts` tries it, then falls
back to the one real haptic a web page can fire on iOS 17.4+ — flipping a native
switch control (`components/HapticSwitch.tsx`), which produces a Taptic tick.
Every action also has a visible confirmation, because a confirmation the user
cannot feel is not a confirmation.

**3. Motion needs a tap first.** `DeviceMotionEvent.requestPermission()` must be
called from inside a real user gesture. Calling it on mount rejects. The
affirmation card shows a "Turn on shake" button on iOS and starts listening
straight away everywhere else.

---

## What is done

- PWA shell: manifest, hand-written service worker, icon set, offline page
- Home: greeting, streak, mood check-in, goals, shake-to-reroll affirmation
- Five-tab nav, article list + reader, static-generated
- Support page, quick exit, sensitive-content handling
- Supabase-powered Room with anonymous sign-in
- Device-local state with a rollover streak

## What is not

- **Eight article bodies.** `content/articles.ts` says which ones are empty and
  why. The medical and legal pages need sourced writing, not filler.
- **Verified support numbers and clinics.** Candidate numbers exist, but they do
  not become trusted until someone calls them and records the result.
- Telegram affirmations.

---

## ⚠ Before this goes anywhere near Miss World

`content/support.ts` is the highest-liability surface in the app. A dead number
is worse than no number: someone in trouble dials it, nothing happens, and they
stop trying. The support page will not display a resource until `verified: true`,
and it will not let you fake it — verify by calling, then record who and when.

Nothing here was carried over from the old build on trust.
