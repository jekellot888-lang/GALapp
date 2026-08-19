/**
 * CONTENT SOURCE OF TRUTH.
 *
 * Titles and section assignments below are ported verbatim from the live Base44
 * app. Bodies are NOT — they still need to be pulled across (Block B).
 *
 * ⚠ Every article with `verified: false` must be read by a human before launch.
 * Nothing here was written by inference. If a body is empty, the reader shows a
 * short honest placeholder rather than filler.
 */

export type Section = "health" | "finance" | "learn";

export type Article = {
  slug: string;
  section: Section;
  title: string;
  blurb: string;
  minutes: number;
  level?: "beginner" | "intermediate";
  /** Sensitive topics get a quick-exit button and no scroll-position memory. */
  sensitive?: boolean;
  /** Set true only after a human has checked the copy. */
  verified: boolean;
  body: string[];
};

export const ARTICLES: Article[] = [
  {
    slug: "patterns-that-harm-you",
    section: "health",
    title: "Understanding Patterns That Harm You",
    blurb:
      "A clear look at what gender-based violence means, the signs that are easy to miss, why it is never your fault, and where quiet help exists.",
    minutes: 5,
    sensitive: true,
    verified: false,
    body: [],
  },
  {
    slug: "exam-stress",
    section: "health",
    title: "Student: Beating Exam Stress",
    blurb: "Practical ways to steady yourself before and during exams.",
    minutes: 4,
    verified: false,
    body: [],
  },
  {
    slug: "hostel-campus-safety",
    section: "health",
    title: "Student: Hostel & Campus Safety",
    blurb: "Staying safe where you live and study.",
    minutes: 4,
    sensitive: true,
    verified: false,
    body: [],
  },
  {
    slug: "sleep-for-grades",
    section: "health",
    title: "Student: Sleep for Better Grades",
    blurb: "Why rest is study time, and how to protect it.",
    minutes: 4,
    verified: false,
    body: [],
  },
  {
    slug: "minor-wounds",
    section: "health",
    title: "Caring for Minor Wounds & Injuries",
    blurb: "Simple first aid you can do at home, and when it stops being minor.",
    minutes: 4,
    verified: false,
    body: [],
  },
  {
    slug: "common-illnesses",
    section: "health",
    title: "Common Illnesses & When to Get Help",
    blurb: "Telling an ordinary week apart from a reason to see someone.",
    minutes: 4,
    verified: false,
    body: [],
  },
  {
    slug: "thoughts-feel-heavy",
    section: "health",
    title: "When Thoughts Feel Heavy",
    blurb: "What low days can look like, and what helps.",
    minutes: 4,
    sensitive: true,
    verified: false,
    body: [],
  },
  {
    slug: "recognizing-infections",
    section: "health",
    title: "Recognizing Infections Early",
    blurb: "Early signs worth paying attention to.",
    minutes: 4,
    verified: false,
    body: [],
  },
  {
    slug: "breathing-for-calm",
    section: "health",
    title: "Breathing Exercises for Calm",
    blurb: "Three techniques you can use anywhere, anytime.",
    minutes: 4,
    verified: false,
    body: [],
  },
  {
    slug: "better-sleep",
    section: "health",
    title: "Better Sleep, Better Days",
    blurb: "Small changes that shift your rest and energy.",
    minutes: 4,
    verified: false,
    body: [],
  },
  {
    slug: "is-it-just-me",
    section: "learn",
    title: "Is It Just Me, or Is This Weird?",
    blurb: "Naming the thing you have been talking yourself out of.",
    minutes: 6,
    level: "beginner",
    sensitive: true,
    verified: false,
    body: [],
  },
  {
    slug: "why-this-keeps-happening",
    section: "learn",
    title: "Why This Keeps Happening (and How to Stop It)",
    blurb: "Recognising a cycle from the inside.",
    minutes: 7,
    level: "intermediate",
    sensitive: true,
    verified: false,
    body: [],
  },
  {
    slug: "it-happened-last-night",
    section: "learn",
    title: "It Happened Last Night. Here's What to Do.",
    blurb: "The first hours: your health, your evidence, your choices.",
    minutes: 6,
    level: "beginner",
    sensitive: true,
    verified: false,
    body: [],
  },
];

export const bySection = (s: Section) => ARTICLES.filter((a) => a.section === s);
export const bySlug = (slug: string) => ARTICLES.find((a) => a.slug === slug);
