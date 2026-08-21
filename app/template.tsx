/**
 * Route transition.
 *
 * `template.tsx` remounts its children on every navigation, unlike `layout.tsx`
 * which persists — that remount is precisely what an enter animation needs, and
 * it is why this is a template rather than something wired into the layout.
 *
 * Deliberately small: 200ms, a 6px rise, opacity and transform only. Page
 * transitions are seen dozens of times a day, so they sit in the
 * near-imperceptible tier. Anything longer turns navigation into waiting.
 *
 * Reduced motion drops the travel and keeps the fade — see globals.css.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-enter">{children}</div>;
}
