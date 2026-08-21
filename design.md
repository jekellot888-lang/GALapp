# Design — GAL

**GAL — Guide, Assist, Liberate.** Always those three capitals. Never "Gal",
never "gal" in user-facing copy, never expanded on a guess.

The app icon is Elle's rose-gold monogram, not a G. Elle is the brand behind
GAL; the mark carries her identity, every name string says GAL. Both are
correct at once, so do not "fix" either to match the other.

A locked design system for this app. Every page reads this file before emitting
code. Do not regenerate per page — extend or amend this file when the system
needs to grow.

Pages that drift from this file are the defect. Amend here first, then build.

## Genre

**Editorial.** GAL is a reading app before it is anything else — 34 guides, a
reader, an index per section. Editorial's governing rule, *hairlines not card
borders*, is the direct cure for what this app looked like before: every screen
was the same white rounded rectangle floating on pink, so nothing had hierarchy
and everything read as generated.

The subject matter also rules out the loud editorial registers. No Brutal, no
Carnival, no Riso. A woman reading "He Beat You. Here's What to Do." is not
served by a page that is pleased with itself.

## Theme

**The Elle brand.** Superseded the invented palette on 2026-08-20, imported from
`Elle.dc.html` in the Claude Design project "Mobile app design improvement",
which derives from the Elle brand guide PDF.

Until then this system used a tuned palette I built, because no brand existed to
follow. That was a stand-in and it is now retired. A real brand guide outranks a
good guess, even a measured one.

- Ground `#FFF8F5`, surface `#FDF1EE`, ink `#2A1218`, divider `#EFDCD7`
- Accent `#7A1F3D`, a deep wine. 9.56:1 on the ground either direction.
- Second voice `#B76E79`, rose. **Never paragraph text** — it measures 3.62:1 on
  the ground, under AA. Marks, rules, fills and large display only.
- Secondary text takes `#6E4A52` (neutral-700), not neutral-600, which sits
  under AA for body copy on this ground.
- Radii 12 / 20, softer than the editorial pass.

Values live in `tokens.css`. Never inline a colour — every declaration
references a token by name.

The structural rules below did not change with the brand. Hairlines still
separate content, cards still do not float, and the accent still stays under
5 % of a viewport.

### Dark mode

Both schemes ship. Dark is not a courtesy here: a dark screen is far less
conspicuous in a dark room, and this app gets read at night by someone who may
not want the light noticed.

**Driven by `prefers-color-scheme` only.** There is no in-app toggle and no
stored preference. GAL keeps no accounts and writes as little to the device as it
can; a theme setting is one more thing on a phone somebody else might pick up.
If a toggle is ever added it belongs in a settings surface that does not exist
yet, and it must not become a sun/moon switch in the header.

Rules for the dark palette:

- **Warm, never neutral, never `#000`.** Pure black makes hairlines vanish on
  OLED, and hairlines are the one device this system separates content with.
  Paper sits near 19% lightness with a warm tint.
- **The accent inverts direction.** Deep madder at 42% lightness has nowhere near
  enough contrast on a dark ground, so dark lifts it to a terracotta near 74% and
  flips `accent-ink` to near-black. Any new accent needs the same treatment.
- **Only colour tokens are redefined.** Type, spacing, radius and motion are
  scheme-independent; if a value needs to change between schemes it is a colour.
- **High contrast is written per scheme.** Darkening `ink-2` helps on bone paper
  and ruins it on a dark ground, so the two directions are opposite. Never write
  one `prefers-contrast` block and assume it covers both.
- **Shadows barely read on dark.** The nav leans on its rule; the lift shadow
  deepens rather than spreading.
- The AA floor applies to both schemes, measured separately.

## Typography

Both faces come from the brand guide and replaced Fraunces + the system stack on
2026-08-20.

- **Display:** Cormorant Garamond, roman. Italic headers stay banned.
- **Body:** Manrope. This overrides the earlier argument for the system stack,
  which was correct only while GAL had no brand of its own. Two subset webfaces
  is real weight on roaming data, so keep the weight list tight — 400/500/600/700
  and no more.
- Both self-hosted via `next/font`, so they work offline and the service worker
  caches them. Note that the Google Fonts fetch has failed transiently at build
  time and silently fallen back; if headings ever render as Georgia, that is
  why, and the fix is a rebuild, not a code change.
- Cormorant runs light and open, so display tracking eased from −0.022em to
  −0.012em. A sturdier face wanted more negative tracking than this one does.
- **Display tracking:** −0.02em at display sizes, easing to −0.01em at heading
  sizes, 0 at body. Tracking is size-specific; one value for all sizes is wrong
  somewhere.
- **Measure:** 60–70ch in the reader. Never full-bleed prose.

## Spacing

4-point named scale in `tokens.css`. Use `var(--space-md)`, never a raw value.

**Sections are not padded the same.** Vertical rhythm varies by weight of
content — an index page breathes wider than a settings row. Uniform padding
everywhere is one of the tells this redesign exists to remove.

## Structure

- **No floating cards.** Content sits on paper. Separation comes from hairline
  rules and space. `box-shadow` is reserved for genuine elevation — the two
  fixed layers (nav, quick-exit) and nothing else.
- **No card-in-card, ever.** A bordered control inside a bordered box is banned.
- **No section eyebrows.** No "TAP TO CALL", no "SHORT COURSES". A heading that
  needs a label above it is not doing its job. One exception: the reader's
  meta line, which carries real information (length, level).
- **No emoji as UI.** Words and drawn marks only.
- **Asymmetry is allowed and wanted.** Not every block is a centred full-width
  stack.

## Motion

Quiet. Carried over from the motion pass and unchanged by this redesign:

- Easings `--ease-out` / `--ease-in-out` / `--ease-drawer`. Never browser default.
- Press feedback 120ms, transform + colour only.
- Reduced motion is gentler, not zero: opacity survives, travel goes.
- One orchestrated entrance per screen. No bounce on UI state.

## Microinteractions stance

- Silent success. No celebratory toasts.
- Feedback on pointer-down, never only on release — iOS has no `navigator.vibrate`,
  so an unconfirmed tap is genuinely unconfirmed.
- Focus rings appear instantly and are never animated.
- Hover is gated behind `(hover: hover) and (pointer: fine)`.

## CTA voice

- **Primary:** solid accent fill, `--radius-inner`, full-width on mobile,
  weight 600. Copy is a verb the user would say: "Call 116", not "Learn more".
- **Secondary:** hairline rule, no fill, ink text.
- **Tertiary:** text with a drawn underline offset from the baseline.

Pill shapes survive only on filters and the quick exit. No gradient on a pill.

## Per-page allowances

- **Index pages** (Health, Money, Learn): editorial index — rules between
  entries, no cards, filter row allowed.
- **Reader:** typography only. No enrichment, no decoration.
- **Home:** the one page allowed a compositional set-piece (the affirmation).
- **Support:** structural restraint is a safety feature. Nothing decorative
  competes with the numbers.
- **404 / offline:** typography only.

## What pages MUST share

- The paper, ink, rule and accent tokens.
- Fraunces display + system body.
- The CTA voice.
- The hairline as the separating device.
- Accent under 5 % of any viewport.

## What pages MAY differ on

- Vertical rhythm and section padding.
- Whether an index is dense or generous.
- Heading scale — Home may run larger than the reader.

## Safety constraints that outrank aesthetics

These are not style choices and no redesign may weaken them:

1. **The support gate.** No phone number renders until `verified: true`. Visual
   work must never make an unverified number visible.
2. **Quick exit stays reachable** and must not be styled into invisibility.
3. **Contrast floor is WCAG AA** against the real rendered background, measured,
   not estimated. This app gets used on cheap screens in bright sun.
4. **Tap targets ≥ 44px.**
5. **No invented figures.** No wellness percentages, no fabricated streak stats.
