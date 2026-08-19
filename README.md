# GAL

A daily companion — mind, body, money, and knowing where to turn.
Installable web app. No accounts. Nothing leaves the device.

> **The name is an acronym, not the word "gal".** It is spelled GAL, three
> letters, and it is not to be "corrected" to GALL or expanded on a guess.
> The expansion is not recorded here yet — fill it in rather than inferring it.

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

Then on Vercel: **New Project → import the repo → Deploy.** No env vars needed for v1.
Framework detection handles the rest.

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
- Device-local state with a rollover streak

## What is not

- **Article bodies.** `content/articles.ts` has the real titles and blurbs ported
  from the old build. Bodies are empty and the reader says so honestly rather
  than showing filler. This is the long pole — it needs a person, not a compiler.
- **Support numbers.** `content/support.ts` ships deliberately empty. Read the
  header of that file before touching it.
- Talk to Elle, Telegram affirmations, Money content.

---

## ⚠ Before this goes anywhere near Miss World

`content/support.ts` is the highest-liability surface in the app. A dead number
is worse than no number: someone in trouble dials it, nothing happens, and they
stop trying. The support page will not display a resource until `verified: true`,
and it will not let you fake it — verify by calling, then record who and when.

Nothing here was carried over from the old build on trust.
