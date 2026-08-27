/**
 * A small drawn set, not an icon library.
 *
 * Lucide and Feather are the default reach and they look it — every generated
 * interface of the last two years wears the same 24px 2px-stroke marks. These
 * are drawn for this app instead: 1.5 stroke, round caps and joins, on a 24 grid,
 * inheriting `currentColor` so they take whatever colour the row already has.
 *
 * Cliché metaphors are avoided deliberately. Support is a handset, because
 * Support is literally a list of numbers to call — not a shield, not a lifebuoy,
 * not clasped hands.
 *
 * Every icon is decorative: labels sit beside them everywhere they are used, so
 * they carry aria-hidden and never become the accessible name.
 */
type Props = { name: IconName; className?: string };

export type IconName =
  | "home"
  | "read"
  | "ask"
  | "room"
  | "support"
  | "quiet"
  | "plan"
  | "contacts"
  | "elle"
  | "clinic"
  | "check"
  | "breathe"
  | "money"
  | "police"
  | "legal"
  | "shelter"
  | "sun"
  | "moon";

const PATHS: Record<IconName, React.ReactNode> = {
  // A doorway rather than a pitched-roof house — this is a place she comes back to.
  home: (
    <>
      <path d="M4 21V9.5L12 3l8 6.5V21" />
      <path d="M9.5 21v-6a2.5 2.5 0 0 1 5 0v6" />
    </>
  ),
  // An open book, spine centred.
  read: (
    <>
      <path d="M12 6.5v13" />
      <path d="M12 6.5C10.5 5 8.4 4.5 4 4.5v13c4.4 0 6.5.5 8 2 1.5-1.5 3.6-2 8-2v-13c-4.4 0-6.5.5-8 2Z" />
    </>
  ),
  // Two speech shapes, overlapping. A question and an answer.
  ask: (
    <>
      <path d="M15.5 13.5H9l-3.5 3v-3H4.5A1.5 1.5 0 0 1 3 12V6a1.5 1.5 0 0 1 1.5-1.5h11A1.5 1.5 0 0 1 17 6v6a1.5 1.5 0 0 1-1.5 1.5Z" />
      <path d="M17.5 8.5h2A1.5 1.5 0 0 1 21 10v6a1.5 1.5 0 0 1-1.5 1.5H19v3l-3.5-3H11" />
    </>
  ),
  // A small room: two voices in one bounded place.
  room: (
    <>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H13l-4 4v-4H6.5A2.5 2.5 0 0 1 4 13.5Z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </>
  ),
  // A handset. Support is a list of numbers; say so.
  support: (
    <path d="M6.5 3.5h2l1.8 4-1.7 1.4a12.5 12.5 0 0 0 5.5 5.5l1.4-1.7 4 1.8v2a2.5 2.5 0 0 1-2.7 2.5C9.6 18.4 5.6 14.4 4 6.2A2.5 2.5 0 0 1 6.5 3.5Z" />
  ),
  // A crescent — night, and being unlit.
  quiet: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />,
  // A checklist page.
  plan: (
    <>
      <path d="M6 3.5h12v17H6z" />
      <path d="M9 9.5l1.5 1.5L13.5 8" />
      <path d="M9 15.5h6" />
    </>
  ),
  // Three marks, the cap on trusted contacts.
  contacts: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <path d="M17 9.5h3.5M18.75 7.75v3.5" />
    </>
  ),
  // A single speech shape — one companion, not a room.
  elle: (
    <path d="M20 12.5c0 4-3.6 7-8 7a9.6 9.6 0 0 1-2.6-.35L4 21l1.4-3.6A6.6 6.6 0 0 1 4 12.5c0-4 3.6-7 8-7s8 3 8 7Z" />
  ),
  // A cross in a rounded square. A place, not a caduceus.
  clinic: (
    <>
      <rect x="3.5" y="5.5" width="17" height="14" rx="2.5" />
      <path d="M12 9.5v6M9 12.5h6" />
    </>
  ),
  // Concentric arcs — the shape the breathing screen draws, at icon size.
  breathe: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 5.5a6.5 6.5 0 0 1 0 13" />
      <path d="M12 2a10 10 0 0 1 0 20" />
    </>
  ),
  // A question mark, because the screen asks one.
  check: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.7a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .9-1 1.6v.4" />
      <path d="M12 17.2h.01" />
    </>
  ),
  // A banknote, not a currency glyph. She banks in shillings, and a $ would be
  // both wrong and the first thing any icon set reaches for.
  money: (
    <>
      <rect x="2.5" y="6.5" width="19" height="11" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 10.5v3M18 10.5v3" />
    </>
  ),
  // A siren lamp on a roof bar. Not a badge and not a shield — one is American
  // television and the other is what every safety app in the store wears.
  //
  // The first attempt was a dome with radiating ticks, and rendered at 110px it
  // was plainly a sunrise: the rays read as sunlight, not as a light bar. The
  // lens division does the work the rays were failing at, and survives 16px.
  police: (
    <>
      <path d="M8 14.5v-1.5a4 4 0 0 1 8 0v1.5" />
      <rect x="5.5" y="14.5" width="13" height="3.5" rx="1.25" />
      <path d="m3.8 9.4 1.7 1.1" />
      <path d="m20.2 9.4-1.7 1.1" />
    </>
  ),
  // A written-on document. Scales of justice would be the obvious mark and
  // would promise a courtroom, when most of this is paperwork and advice. The
  // first version put a seal circle low on the page and it read as a keyhole,
  // so the seal became two lines of writing.
  legal: (
    <>
      <path d="M6 3.5h7l5 5v12H6Z" />
      <path d="M13 3.5v5h5" />
      <path d="M9 13.5h6M9 16.5h3.5" />
    </>
  ),
  // A bed. "Somewhere to stay" means somewhere to sleep tonight, and a little
  // house would collide with home, which is already a doorway.
  shelter: (
    <>
      <circle cx="7.5" cy="11" r="2" />
      <path d="M3.5 19v-8" />
      <path d="M3.5 14h12.5a4.5 4.5 0 0 1 4.5 4.5V19" />
      <path d="M3.5 17.5h17" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.75v2M12 19.25v2M4.42 4.42l1.42 1.42M18.16 18.16l1.42 1.42M2.75 12h2M19.25 12h2M4.42 19.58l1.42-1.42M18.16 5.84l1.42-1.42" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />,
};

export default function Icon({ name, className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {PATHS[name]}
    </svg>
  );
}
