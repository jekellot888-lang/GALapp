/** Short, plain, second-person. No toxic positivity, no promises. */
export const AFFIRMATIONS: string[] = [
  "Your wellbeing matters today and always.",
  "You are allowed to take up space.",
  "Rest is not a reward you have to earn.",
  "You can change your mind about something you agreed to.",
  "Asking for help is a skill, not a failure.",
  "You do not owe anyone an explanation for your boundaries.",
  "One hard day is not the whole story.",
  "You are allowed to leave a room that does not feel right.",
  "Your body is telling you something. You can listen.",
  "Small steps still count as moving.",
  "You are not too much.",
  "What happened to you is not who you are.",
  "You can start again at any hour of the day.",
  "Your name in your own mouth is enough.",
  "You are allowed to want more than this.",
];

/** Stable per-day pick so it does not flicker on every render. */
export function affirmationForDay(iso: string): string {
  let h = 0;
  for (let i = 0; i < iso.length; i++) h = (h * 31 + iso.charCodeAt(i)) >>> 0;
  return AFFIRMATIONS[h % AFFIRMATIONS.length];
}

export function randomAffirmation(exclude?: string): string {
  const pool = exclude ? AFFIRMATIONS.filter((a) => a !== exclude) : AFFIRMATIONS;
  return pool[Math.floor(Math.random() * pool.length)];
}
