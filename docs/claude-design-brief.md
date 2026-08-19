# GALL — Claude Design brief

Paste everything below the line into Claude Design.

---

Design the screens for **GALL**, an installable web app used daily by young women
in Uganda. It carries four things: mind, body, money, and knowing where to turn
when something has gone wrong. No accounts, no sign-in, nothing leaves the phone.

Build these as separate artboards on one canvas, all at **375 × 812** (iPhone,
portrait):

1. Home
2. Support
3. Learn (index with filters)
4. Reader (a single guide, mid-scroll)
5. Money (index)
6. Health (index)
7. Talk to Elle (conversational companion, not yet built)
8. Safety plan (not yet built)
9. Trusted contacts and shake alert (not yet built)
10. The self-check (five statements, one result state)

Then repeat **Home, Support and Reader in dark mode** as three more artboards, so
the pair can be compared side by side. Those three carry the most weight: Home is
what she opens, Support is what she needs in a crisis, and the Reader is where she
spends actual minutes.

## Who is holding the phone

Assume she is 19 to 28, on an iPhone or a mid-range Android, often on mobile data
she pays for by the megabyte. Sometimes she is reading a guide about being hit
while the person who hit her is in the next room. That single fact drives more
decisions here than any aesthetic preference:

- Somebody else may pick up this phone. The app should not announce its subject
  from across a room, and it must not look alarming on a lock screen.
- Every screen with sensitive content carries a **Quick exit** control that
  replaces the history entry and leaves for a neutral site.
- Screens get used outdoors in strong sun on cheap panels, so contrast has to be
  generous rather than fashionable.
- Thumb reach matters more than symmetry. Nothing tappable smaller than 44px.

## The design system is already locked. Follow it.

Do not invent a palette. These are the exact tokens:

```
paper        oklch(96.8% 0.009 75)   warm bone
paper-2      oklch(93.4% 0.013 70)   pressed / grouped
ink          oklch(24% 0.021 32)     warm near-black
ink-2        oklch(46% 0.022 32)     secondary text
rule         oklch(85% 0.014 62)     hairline
accent       oklch(42% 0.13 22)      deep madder
accent-ink   oklch(98% 0.006 75)     text on accent
```

Neither paper nor ink is pure. Both are tinted warm, deliberately.

Dark mode is not a preference toggle in this product, it's closer to a safety
feature: a dark screen is much less conspicuous in a dark room, and this gets read
at night by someone who may not want the light noticed. It follows the phone's
system setting, so don't draw a sun/moon switch anywhere.

```
paper        oklch(19% 0.012 40)     warm dark, never #000
paper-2      oklch(23.5% 0.014 40)
ink          oklch(93.5% 0.008 75)
ink-2        oklch(73% 0.014 68)
rule         oklch(33% 0.014 45)
accent       oklch(74% 0.132 38)     terracotta
accent-ink   oklch(17% 0.02 35)      near-black on the accent
```

Two things about that dark palette are load-bearing. **The accent inverts
direction**: deep madder at 42% lightness has nowhere near the contrast it needs
against a dark ground, so dark lifts it to a terracotta and flips the text on it
to near-black. And **pure black is banned**, because on OLED it makes the
hairlines disappear, and hairlines are the only device this system has for
separating content. Only colour changes between the two schemes; type, spacing and
radii are identical.

**Display type: Fraunces, roman, weight 600.** Never italic in a heading.
Tracking tightens as size grows: roughly −0.022em at display sizes, −0.012em at
heading sizes, 0 in body copy. **Body type: the system stack**, which resolves to
SF Pro on iPhone. That is a decision, not laziness; a second webfont is real
weight on roaming data and buys nothing for reading.

Spacing runs on a 4pt scale. Radii vary by role, tighter on controls than on
containers.

**The accent stays under 5% of any screen.** It marks the one action that
matters, and nothing else.

## The single most important rule

**Hairlines and space separate content. Not cards.**

The version being replaced put every piece of content inside a white rounded
rectangle with a soft shadow, floating on a pink field. Five screens ended up
looking like one screen, because when everything is the same shape nothing can
be more important than anything else. Hierarchy came only from size.

So: content sits directly on the paper. Rules divide it. Shadows are reserved
for the two genuinely floating layers, meaning the bottom nav and the quick exit,
and appear nowhere else. An index of guides is a list divided by hairlines, not a
deck of cards.

Vertical rhythm should vary between screens. An index can breathe wider than a
settings row. Uniform padding on every section is one of the things that made the
old version read as machine-made.

## Nav

Five tabs, fixed to the bottom, in this order: Home, Money, Health, Learn,
Support. Solid paper with a hairline above it. No frosted glass, no blur; the
labels have to stay readable over whatever scrolls underneath. Mark the active
tab with a short drawn rule above the label rather than a floating dot.

## Screen notes

**Home.** A greeting and her name at display scale, then the day's line, then a
mood check-in, then four small goals, then a route into Support. The day's line
is the one set-piece the app allows itself: she can shake the phone to get a new
one. Set it as type on paper. It is not a gradient box with a quote in it.

The mood control uses **words**, not emoji faces. Good, Okay, Low, Tough. If she
picks Tough, an offer to talk to someone appears underneath.

**Support** is the highest-stakes screen in the product. Structural restraint
here is a safety feature, so nothing decorative competes with the numbers. Above
the list, a short block titled "What happens when you call" that says the line is
free, confidential and judgement-free, that she will not be forced to report
anything, and that she can just talk and decide later. The barrier is almost never
finding a number; it is not knowing what happens after she dials.

**Use `+256 XXX XXX` style placeholders for every phone number in the mockups.**
Real numbers are still being verified by calling them, and a mockup that shows a
plausible-looking number risks it getting treated as confirmed. A dead line is
worse than no line, because she dials it, nothing happens, and she stops trying.

**Indexes** (Learn, Money, Health) each open with a heading and one line of
orientation, then a horizontally scrolling filter row, then the list. Learn
filters on Finance, Health, Life Skills, Wellness. Health filters on Mind, Body,
Sleep, Food. Money filters on Budgeting, Saving, Earning. Each entry shows title,
a sentence of blurb, and a quiet meta line with length and level.

**Reader.** Typography only, no decoration. Measure capped around 65 characters.
A back link to the parent section, the title, a meta line, then the body. Sensitive
guides get the quick exit at the top and an offer to talk to someone at the end.

**Talk to Elle, the safety plan, trusted contacts and the self-check** do not
exist yet, so design them from scratch inside the system above. For trusted
contacts: she can name up to three people, and shaking the phone reaches them.
For the self-check, five statements she can agree with, drawn from the real
version:

- I change my behaviour to keep someone calm
- I'm afraid of how someone reacts when they're angry
- I'm stopped from seeing friends or handling my own money
- I've been hit, pushed, threatened, or forced
- I feel small, controlled, or unable to make my own choices

The result state needs unusual care in the copy. It is a screening tool being
read by someone who may be in danger and may not yet have named what is happening
to her. Do not diagnose, do not score her out of five, and do not congratulate
her for answering. Show her what she has just described, tell her it is not her
fault, and put the next step within one tap.

## Voice

The existing copy is good and the mockups should match it. Second person, plain,
specific, unsentimental. Real titles from the library:

> He Beat You. Here's What to Do.
> Your Phone Is Snitching on You
> Is It Just Me, or Is This Weird?
> When Your Ride Isn't Safe
> Money = Freedom (Literally)

Not "Coping With Difficult Situations". Name the thing.

Buttons say what she would say. "Call the helpline" rather than "Learn more".
Sentence case in headings, never Title Case On Every Word.

## Imagery

The app currently ships no images at all, which leaves it flat. Photography would
help the indexes, and it should be real Ugandan photography, commissioned or
properly licensed, of ordinary life rather than staged distress. In the mockups,
show image slots as labelled grey blocks. Do not drop in stock photos and present
them as the design; the wrong photograph on a guide about assault does active
harm.

## Do not repeat these

The version being replaced committed all of them, and the earlier product they
came from committed most:

- A magenta-to-purple gradient on the hero card. It measured 4.37:1 for white
  text, under the accessibility floor, and it is the most recognisable
  machine-made look going.
- Emoji standing in for interface controls, and a sparkle beside her name.
- A small uppercase label above every single heading. If a heading needs a label
  to explain it, the heading is not working.
- Frosted glass anywhere.
- Wellness percentages, streak counts and savings totals with no data behind
  them. The earlier version showed "75% wellness", "68%", "UGX 15K saved this
  week" and "32 active minutes", all invented. Show a real number, an honest
  empty state, or nothing.
- Identical padding, identical corner radius and a centred single column on every
  screen.
- Card inside a card. A bordered control sitting inside a bordered box.

## Where to push past the old version

Give the screens actual hierarchy, so the eye lands somewhere on purpose. Let the
display type run large where the content earns it, particularly Home and the
index headings. Keep Support quiet and let the reassurance block carry it. Find a
treatment for the day's line that feels composed rather than boxed. And make the
whole thing feel discreet enough that she would not mind it being seen.
