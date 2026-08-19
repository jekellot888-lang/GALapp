/**
 * Article inventory.
 *
 * Titles, blurbs, lengths and topics were transcribed from screenshots of the
 * Base44 build on 2026-08-19. That build's voice is the spec: second person,
 * specific, unsentimental, names the thing directly ("He Beat You. Here's What
 * to Do." — not "Coping With Difficult Situations"). Keep it when writing more.
 *
 * `body` is empty on every entry and the reader says so honestly rather than
 * showing filler. Bodies need a person, not a compiler. `verified` tracks
 * whether a human has read the finished body for accuracy and tone — it is not
 * about the title existing.
 *
 * Minutes are carried over from the source. They describe the intended body,
 * so re-check them once bodies are written.
 */

export type Section = "health" | "finance" | "learn";
export type Level = "beginner" | "intermediate";

export type Article = {
  slug: string;
  section: Section;
  title: string;
  blurb: string;
  minutes: number;
  /** Filter pill grouping within a section. See TOPICS below. */
  topic?: string;
  level?: Level;
  /** Shows the quick-exit control and the "talk to someone" footer. */
  sensitive?: boolean;
  /** A human has read the finished body. Not set by writing a title. */
  verified: boolean;
  body: string[];
};

/** Filter pills per section, in display order. "All" is prepended by the UI. */
export const TOPICS: Record<Section, string[]> = {
  health: ["Mind", "Body", "Sleep", "Food"],
  finance: ["Budgeting", "Saving", "Earning"],
  learn: ["Finance", "Health", "Life Skills", "Wellness"],
};

export const ARTICLES: Article[] = [
  // ── Health ────────────────────────────────────────────────────────────────
  {
    slug: "patterns-that-harm-you",
    section: "health",
    title: "Understanding Patterns That Harm You",
    blurb:
      "A gentle, clear look at what gender-based violence really means, the signs that are easy to miss, why it is never your fault, and where quiet help exists.",
    minutes: 5,
    topic: "Mind",
    sensitive: true,
    verified: false,
    body: [],
  },
  {
    slug: "understanding-depression",
    section: "health",
    title: "Understanding Depression",
    blurb:
      "What depression looks like, why it's not weakness, and gentle steps that help.",
    minutes: 5,
    topic: "Mind",
    sensitive: true,
    verified: false,
    body: [],
  },
  {
    slug: "thoughts-feel-heavy",
    section: "health",
    title: "When Thoughts Feel Heavy",
    blurb:
      "If thoughts feel heavy, this guide and the helplines are here for you right now.",
    minutes: 4,
    topic: "Mind",
    sensitive: true,
    verified: false,
    body: [],
  },
  {
    slug: "recognizing-burnout",
    section: "health",
    title: "Recognizing Burnout Before It Stops You",
    blurb: "Signs your mind and body are asking for rest — and what to do.",
    minutes: 5,
    topic: "Mind",
    verified: false,
    body: [],
  },
  {
    slug: "breathing-for-calm",
    section: "health",
    title: "Breathing Exercises for Calm",
    blurb: "Three simple breathing techniques you can use anywhere, anytime.",
    minutes: 4,
    topic: "Mind",
    verified: false,
    body: [],
  },
  {
    slug: "self-care-rituals",
    section: "health",
    title: "5-Minute Self-Care Rituals",
    blurb: "Tiny daily practices that make a big difference in how you feel.",
    minutes: 4,
    topic: "Mind",
    verified: false,
    body: [],
  },
  {
    slug: "better-sleep",
    section: "health",
    title: "Better Sleep, Better Days",
    blurb: "Simple changes that can transform your rest and energy.",
    minutes: 4,
    topic: "Sleep",
    verified: false,
    body: [],
  },
  {
    slug: "sleep-for-grades",
    section: "health",
    title: "Student: Sleep for Better Grades",
    blurb: "Why rest is part of studying, and how to actually get it on campus.",
    minutes: 4,
    topic: "Sleep",
    verified: false,
    body: [],
  },
  {
    slug: "nutrition-on-a-budget",
    section: "health",
    title: "Nutrition on a Budget",
    blurb:
      "Eating well doesn't have to break the bank. Simple, affordable ways to nourish your body with local foods.",
    minutes: 4,
    topic: "Food",
    verified: false,
    body: [],
  },
  {
    slug: "common-illnesses",
    section: "health",
    title: "Common Illnesses & When to Get Help",
    blurb:
      "Spot the signs that matter and know when a clinic visit is the right move.",
    minutes: 4,
    topic: "Body",
    verified: false,
    body: [],
  },
  {
    slug: "minor-wounds",
    section: "health",
    title: "Caring for Minor Wounds & Injuries",
    blurb:
      "Simple, clean steps for small wounds, burns and cuts — and when to visit a clinic.",
    minutes: 4,
    topic: "Body",
    verified: false,
    body: [],
  },
  {
    slug: "recognizing-infections",
    section: "health",
    title: "Recognizing Infections Early",
    blurb: "Learn the early signs of infection so you can act before it spreads.",
    minutes: 4,
    topic: "Body",
    verified: false,
    body: [],
  },
  {
    slug: "exam-stress",
    section: "health",
    title: "Student: Beating Exam Stress",
    blurb:
      "Real, low pressure ways to get through exam week without losing yourself.",
    minutes: 4,
    topic: "Mind",
    verified: false,
    body: [],
  },
  {
    slug: "hostel-campus-safety",
    section: "health",
    title: "Student: Hostel & Campus Safety",
    blurb:
      "Small habits that keep you safer in hostels, on the walk home, and around campus.",
    minutes: 4,
    topic: "Body",
    sensitive: true,
    verified: false,
    body: [],
  },

  // ── Money ─────────────────────────────────────────────────────────────────
  {
    slug: "start-a-small-business",
    section: "finance",
    title: "How to Start a Small Business With Little Money",
    blurb: "Turn a small idea into income with what you already have.",
    minutes: 5,
    topic: "Earning",
    verified: false,
    body: [],
  },
  {
    slug: "turning-a-skill-into-income",
    section: "finance",
    title: "Turning a Skill Into Steady Income",
    blurb: "How to move from occasional jobs to reliable monthly earnings.",
    minutes: 5,
    topic: "Earning",
    verified: false,
    body: [],
  },
  {
    slug: "selling-online-without-a-shop",
    section: "finance",
    title: "Selling Online Without a Shop",
    blurb: "How to use your phone and free apps to reach customers across Uganda.",
    minutes: 5,
    topic: "Earning",
    verified: false,
    body: [],
  },
  {
    slug: "price-your-work-fairly",
    section: "finance",
    title: "How to Price Your Work Fairly",
    blurb:
      "Simple steps to set prices that respect your time and keep customers coming.",
    minutes: 4,
    topic: "Earning",
    verified: false,
    body: [],
  },
  {
    slug: "talking-money-with-family",
    section: "finance",
    title: "Talking About Money With Your Family",
    blurb: "How to have honest money conversations that build trust.",
    minutes: 4,
    topic: "Budgeting",
    verified: false,
    body: [],
  },
  {
    slug: "financial-independence-rights",
    section: "finance",
    title: "Your Rights: Understanding Financial Independence",
    blurb: "Know your rights when it comes to money, property, and independence.",
    minutes: 5,
    topic: "Saving",
    sensitive: true,
    verified: false,
    body: [],
  },

  // ── Learn ─────────────────────────────────────────────────────────────────
  {
    slug: "is-it-just-me",
    section: "learn",
    title: "Is It Just Me, or Is This Weird?",
    blurb:
      "If something feels off in your relationship but you keep telling yourself you're overreacting — this is the read.",
    minutes: 6,
    topic: "Wellness",
    level: "beginner",
    sensitive: true,
    verified: false,
    body: [],
  },
  {
    slug: "why-this-keeps-happening",
    section: "learn",
    title: "Why This Keeps Happening (and How to Stop It)",
    blurb:
      "Maybe you grew up watching your mom get hit. Maybe your last relationship looked just like this one. Here's why the pattern repeats.",
    minutes: 7,
    topic: "Wellness",
    level: "intermediate",
    sensitive: true,
    verified: false,
    body: [],
  },
  {
    slug: "real-love-vs-control",
    section: "learn",
    title: "Real Love vs. Control (How to Tell the Difference)",
    blurb:
      "What healthy love actually feels like — and the early signs that the intense, exciting thing you're in might actually be control.",
    minutes: 6,
    topic: "Wellness",
    level: "beginner",
    sensitive: true,
    verified: false,
    body: [],
  },
  {
    slug: "friend-just-told-you",
    section: "learn",
    title: "Your Friend Just Told You Something Bad. Now What?",
    blurb:
      "Someone you love just told you they're being hurt, or assaulted, or can't cope. What you say next matters.",
    minutes: 5,
    topic: "Wellness",
    level: "beginner",
    sensitive: true,
    verified: false,
    body: [],
  },
  {
    slug: "it-happened-last-night",
    section: "learn",
    title: "It Happened Last Night. Here's What to Do.",
    blurb:
      "If something happened to you — you didn't consent, you were forced, you were too drunk to say no — read this first.",
    minutes: 6,
    topic: "Life Skills",
    level: "beginner",
    sensitive: true,
    verified: false,
    body: [],
  },
  {
    slug: "he-beat-you",
    section: "learn",
    title: "He Beat You. Here's What to Do.",
    blurb:
      "A calm, step by step guide for surviving physical violence in Uganda — from getting safe and documenting injuries, to what comes next.",
    minutes: 11,
    topic: "Life Skills",
    level: "intermediate",
    sensitive: true,
    verified: false,
    body: [],
  },
  {
    slug: "going-to-the-police",
    section: "learn",
    title: "Going to the Police (Without Losing Your Mind)",
    blurb:
      "A calm, step by step guide to reporting to the police in Uganda — from protecting the evidence before you go, to what to expect.",
    minutes: 12,
    topic: "Life Skills",
    level: "intermediate",
    sensitive: true,
    verified: false,
    body: [],
  },
  {
    slug: "people-closest-to-you",
    section: "learn",
    title: "When the People Closest to You Aren't Safe",
    blurb:
      "Most danger doesn't come from a stranger in the dark — it comes from someone you know. A family member. A friend.",
    minutes: 10,
    topic: "Life Skills",
    level: "intermediate",
    sensitive: true,
    verified: false,
    body: [],
  },
  {
    slug: "phone-is-snitching",
    section: "learn",
    title: "Your Phone Is Snitching on You",
    blurb:
      "If someone's controlling you, your phone is both your lifeline and your biggest risk. Here's how to keep your digital life private.",
    minutes: 7,
    topic: "Life Skills",
    level: "intermediate",
    sensitive: true,
    verified: false,
    body: [],
  },
  {
    slug: "when-your-ride-isnt-safe",
    section: "learn",
    title: "When Your Ride Isn't Safe",
    blurb:
      "Bodas and cabs can get you home — or they can be the danger. How to read a ride before you get in.",
    minutes: 8,
    topic: "Life Skills",
    level: "beginner",
    sensitive: true,
    verified: false,
    body: [],
  },
  {
    slug: "when-your-drink-looks-off",
    section: "learn",
    title: "When Your Drink Looks Off",
    blurb:
      "If something feels wrong with your drink, don't ignore it. How to spot a spiked drink, and what to do the moment you suspect it.",
    minutes: 7,
    topic: "Life Skills",
    level: "beginner",
    sensitive: true,
    verified: false,
    body: [],
  },
  {
    slug: "money-equals-freedom",
    section: "learn",
    title: "Money = Freedom (Literally)",
    blurb:
      "Not a finance lecture. The real money stuff: how to keep cash he can't touch, how to save without him noticing.",
    minutes: 7,
    topic: "Finance",
    level: "beginner",
    sensitive: true,
    verified: false,
    body: [],
  },
  {
    slug: "he-took-your-money",
    section: "learn",
    title: "He Took Your Money. Here's How to Take It Back.",
    blurb:
      "Financial control is abuse. Here's how to recognise it, and the practical steps to get your independence back.",
    minutes: 8,
    topic: "Finance",
    level: "intermediate",
    sensitive: true,
    verified: false,
    body: [],
  },
  {
    slug: "side-hustles-that-work",
    section: "learn",
    title: "Side Hustles That Actually Work",
    blurb:
      "Your phone can pay your rent. How real young people in Kampala are making money — from content creation to small trade.",
    minutes: 9,
    topic: "Finance",
    level: "beginner",
    verified: false,
    body: [],
  },
];

export const bySection = (s: Section) => ARTICLES.filter((a) => a.section === s);
export const bySlug = (slug: string) => ARTICLES.find((a) => a.slug === slug);
export const byTopic = (s: Section, topic: string | null) =>
  bySection(s).filter((a) => !topic || a.topic === topic);
