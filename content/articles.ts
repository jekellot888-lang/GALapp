/**
 * Article inventory.
 *
 * Titles, blurbs, lengths and topics were transcribed from screenshots of the
 * Base44 build on 2026-08-19. That build's voice is the spec: second person,
 * specific, unsentimental, names the thing directly ("He Beat You. Here's What
 * to Do." — not "Coping With Difficult Situations"). Keep it when writing more.
 *
 * Six bodies were imported on 2026-08-20 from the Elle.dc.html design canvas
 * (Claude Design project "Mobile app design improvement"), which carried real
 * written copy rather than placeholder text: patterns-that-harm-you,
 * recognizing-burnout, breathing-for-calm, better-sleep,
 * financial-independence-rights and start-a-small-business.
 *
 * Twenty more bodies were written on 2026-08-22 by Claude, in the voice above.
 * They are not sourced from anywhere — they carry no statistics, no named
 * people, no clinical claims and no helpline numbers, because those are the
 * things that cannot be written without a source. What they do carry is
 * experience-level guidance: how control shows up early, how to price a job,
 * what to say when a friend discloses. Read them before anyone else does.
 *
 * ── The eight still empty, and why ──────────────────────────────────────────
 * These were left rather than filled, because writing them convincingly without
 * a source is exactly the failure mode this app is built to avoid:
 *
 *   understanding-depression, common-illnesses, minor-wounds,
 *   recognizing-infections, nutrition-on-a-budget
 *     — clinical. Needs a real health source. Plausible-sounding first aid is
 *       worse than a blank page.
 *
 *   going-to-the-police, it-happened-last-night, he-beat-you
 *     — Ugandan legal and medical procedure, and time-critical. What a police
 *       station actually requires, what a health facility can do and by when.
 *       Getting this approximately right is getting it wrong.
 *
 * `verified` stays false on all of them, written or imported: it tracks whether
 * a person has read the finished body for accuracy and tone, and neither
 * copying text across nor generating it is that.
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
    body: [
      "Harm is rarely one dramatic event. It is usually a pattern: something small, then an apology, then something smaller, then silence.",
      "Watch for the shape of it. Do you change your behaviour to keep someone calm? Do you check their mood before you speak? Do you explain away things you would not accept for a friend?",
      "Control counts. Money, phone, movement, friendships — when these are managed by someone else, that is abuse even when nobody has been hit.",
      "None of this is caused by what you wore, said, cooked, or failed to do. Responsibility sits with the person doing the harm.",
    ],
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
    body: [
      "Some days the thinking itself is the weight. Not one bad thought you could argue with, but everything arriving slower and heavier than it should.",
      "It lies about the future first. Heaviness does not present itself as a mood; it presents itself as the truth finally becoming clear, and that is the part worth knowing in advance.",
      "So do not make decisions in it. Nothing permanent, nothing you would need to undo. The thinking will be different in a week and you can decide then.",
      "Shrink the day instead. Not the week, not the term. What has to happen in the next hour, and often the honest answer is very little.",
      "Move the body before you try to fix the mind. Standing up, going outside, washing. It sounds far too small for how bad it feels, which is exactly why people skip it.",
      "Tell one person something true. Not the whole of it if you cannot manage that, just one accurate sentence to somebody who will not immediately try to solve you.",
      "If the thoughts have turned to hurting yourself, that is the point to bring in a person rather than reading anything, including this. Quiet Mode has the emergency lines and can reach your trusted contacts in two taps.",
      "Heavy stretches lift, and they lift more slowly than anyone wants. Getting through today without deciding anything is a legitimate outcome.",
    ],
  },
  {
    slug: "recognizing-burnout",
    section: "health",
    title: "Recognizing Burnout Before It Stops You",
    blurb: "Signs your mind and body are asking for rest — and what to do.",
    minutes: 5,
    topic: "Mind",
    verified: false,
    body: [
      "Burnout does not feel like tiredness. It feels like not caring about things you used to care about.",
      "The early signals are physical: shallow sleep, a short temper, a headache that lives behind one eye.",
      "Subtract before you add. One thing off the list this week beats one more coping technique.",
      "Tell one person. Carrying it privately is what turns a hard month into a hard year.",
    ],
  },
  {
    slug: "breathing-for-calm",
    section: "health",
    title: "Breathing Exercises for Calm",
    blurb: "Three simple breathing techniques you can use anywhere, anytime.",
    minutes: 4,
    topic: "Mind",
    verified: false,
    body: [
      "Breathing is the fastest lever you have. It works in a matatu, in a queue, in a locked bathroom.",
      "Four in, six out. Longer out than in is what tells your body the threat has passed. Do it six times.",
      "Box breathing: in for four, hold for four, out for four, hold for four. Useful when your thoughts are racing.",
      "Hand on the ribs. Feel the ribs widen sideways rather than the shoulders lifting. That is the breath doing the work.",
    ],
  },
  {
    slug: "self-care-rituals",
    section: "health",
    title: "5-Minute Self-Care Rituals",
    blurb: "Tiny daily practices that make a big difference in how you feel.",
    minutes: 4,
    topic: "Mind",
    verified: false,
    body: [
      "Self-care has been sold to you as candles and a bath you do not have time for. The useful version is smaller and much less photogenic.",
      "Pick things that take under five minutes and survive a bad day. A routine that needs a good day is not a routine.",
      "Water before tea or anything else. Most people wake up mildly dehydrated and read it as tiredness.",
      "Get daylight on your face early, even two minutes at the door. It does more for how you sleep tonight than anything you do at bedtime.",
      "Put one thing back where it belongs. A single clear surface changes how a room feels, and it costs almost nothing.",
      "Have one phrase for yourself that is not cruel. Most people talk to themselves in a way they would never talk to a friend, and noticing that is most of the repair.",
      "Do them badly rather than not at all. Two minutes counts.",
    ],
  },
  {
    slug: "better-sleep",
    section: "health",
    title: "Better Sleep, Better Days",
    blurb: "Simple changes that can transform your rest and energy.",
    minutes: 4,
    topic: "Sleep",
    verified: false,
    body: [
      "Rest is not a reward for finishing everything. It is the thing that makes tomorrow possible.",
      "Same wake time every day, including Sunday. The body sets its clock by when light arrives, not by when you fall asleep.",
      "Phone out of reach, not out of use. Distance is easier to keep than willpower.",
      "If you are awake for more than twenty minutes, get up, sit in low light, and come back. Bed should mean sleep, not waiting.",
    ],
  },
  {
    slug: "sleep-for-grades",
    section: "health",
    title: "Student: Sleep for Better Grades",
    blurb: "Why rest is part of studying, and how to actually get it on campus.",
    minutes: 4,
    topic: "Sleep",
    verified: false,
    body: [
      "Sleep is not what happens after studying. It is part of studying, and skipping it undoes the hours you just put in.",
      "What you revise gets filed overnight. A night without sleep does not only leave you tired; it leaves the material less available than if you had read less and gone to bed.",
      "Hostels make this hard and pretending otherwise is useless. You cannot control the corridor at 1am, so control the part you can, which is a consistent wake time even after a bad night.",
      "The wake time matters more than the bedtime. Getting up at the same hour pulls your sleep into shape within a few days, while lying in to catch up mostly moves the problem to tomorrow.",
      "Caffeine drunk after about four in the afternoon is still working at midnight for most people. If you are taking coffee to study late and then cannot sleep, those are the same fact.",
      "Naps are fine kept short. Twenty minutes helps. Ninety in the afternoon usually costs you the night.",
      "Given a choice between one more hour of revision and one more hour of sleep the night before a paper, take the sleep.",
    ],
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
    body: [
      "Exam week does not reward whoever suffers most. It rewards whoever can still think on the day.",
      "Work in blocks against a clock rather than by feel. Forty minutes on and ten off keeps you honest, and the ten is not optional.",
      "Do the hardest paper first each day, while there is most of you left. Warming up on the easy thing is how the hard thing never gets done.",
      "Testing yourself beats rereading. Shut the book, write what you remember on a blank page, then check what was missing. It feels worse and works better.",
      "Eat something. Skipping meals to buy time borrows from the hours you are trying to protect.",
      "Panic on the day is a body event rather than a knowledge one. Six breaths, longer out than in, before you turn the paper over. There is a read on breathing in GAL if you want the detail.",
      "One paper is not the degree, and the version of you sitting it is not the version anyone remembers in a year.",
    ],
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
    body: [
      "Campus safety advice is usually about walking alone at night, which is the smallest part of it. Most of what goes wrong involves somebody you already know and a room you are already in.",
      "Learn the routes rather than the rules. Which stretch between the hostel and the lecture block has lights that work, where the gate is manned at night, which shortcut everybody takes and which one is quiet for a reason.",
      "Your door is worth more attention than the walk. Find out how many copies of the key exist and who holds them, whether the lock has ever been changed, and whether the window closes properly. Ask the warden and ask early, before there is a reason to.",
      "Somebody should always know roughly where you are, and it should be reciprocal so it never feels like surveillance. A roommate who expects you back is worth more than a rape alarm.",
      "Be deliberate about rooms. Going somewhere private with someone you have just met is the ordinary business of being young, and it is also the moment where you have the least information. Tell a friend the room number.",
      "Drinks at hostel parties come from open jugs and unmarked bottles more often than from a bar. There is a separate read in GAL on what to watch for and what to do.",
      "The person who makes you uneasy is often somebody with a role: a senior student, somebody's boyfriend, a man who is around a great deal for reasons that make sense. Feeling rude is not evidence that you are wrong.",
      "Know what the university actually offers before you need it, because finding out during a crisis is too late. Who the warden reports to, whether there is a counsellor, what the clinic hours are.",
      "Leave early and alone if you want to. You do not need a reason that survives questioning.",
    ],
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
    body: [
      "Most businesses that last did not start with capital. They started with a skill, a phone, and somebody willing to pay for it once.",
      "Write down three things people already ask you for. That is your list. Pick the one that costs the least to try this week.",
      "Price it so that the money covers your time, your materials, and a little more. Undercharging is the most common way a good idea quietly dies.",
      "Keep the business money separate from the house money from the very first sale, even if it is only two envelopes.",
    ],
  },
  {
    slug: "turning-a-skill-into-income",
    section: "finance",
    title: "Turning a Skill Into Steady Income",
    blurb: "How to move from occasional jobs to reliable monthly earnings.",
    minutes: 5,
    topic: "Earning",
    verified: false,
    body: [
      "The gap between occasional jobs and steady money is rarely skill. Usually it is that nobody knows when you are free or what you charge.",
      "Pick the one thing people already ask you for and make it easy to buy. Being known for a single clear service beats being available for anything.",
      "Say what it costs before you are asked. A price list, however simple, ends the negotiation that otherwise starts every job with you already behind.",
      "Keep a record of every job: what it was, what you charged, how long it took. After ten of them you will know your real hourly rate, and it is rarely the one you assumed.",
      "Repeat customers are the business. One person who comes back each month is worth more than five who found you once, and the cost of keeping them is mostly answering messages promptly.",
      "Ask for the referral out loud. Most people are willing to recommend you and simply never think to.",
      "Separate the money the day it arrives. Money sitting with your personal cash is money already spent.",
    ],
  },
  {
    slug: "selling-online-without-a-shop",
    section: "finance",
    title: "Selling Online Without a Shop",
    blurb: "How to use your phone and free apps to reach customers across Uganda.",
    minutes: 5,
    topic: "Earning",
    verified: false,
    body: [
      "You do not need a website, premises, or stock sitting in a room. You need to be where people already are, and to be findable a second time.",
      "WhatsApp Business is free and handles the dull parts: a catalogue, a profile with your hours, and saved replies you stop retyping twenty times a day.",
      "Photograph in daylight against a plain wall. Bad photographs lose more sales than high prices do, and the fix costs nothing except standing somewhere else.",
      "Post the price. Every inbox me costs you the buyers who were never going to ask, and that is most of them.",
      "Answer fast. Speed is the one advantage you hold over a large seller, and it disappears the moment you leave messages until evening.",
      "Deliver in a way you can repeat. Work out what a boda across town actually costs you before promising free delivery to anybody.",
      "Ask every satisfied customer for a photograph or a line you can post. Other people's words sell what your own cannot.",
    ],
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
    body: [
      "Most people price by looking at what the person beside them charges and going slightly under. It is the quickest route to being busy and broke at the same time.",
      "Start from what the job costs you: materials, transport, airtime, hours. That is the floor, and working below it means paying for the privilege.",
      "Count the unpaid time as well. The trip to buy materials, the waiting, the messages back and forth. It is part of the job even though nobody ever bills for it.",
      "Then add what you want to earn, rather than what you think you can get away with. Those are different numbers, and only one of them has you still doing this next year.",
      "Say the price without apologising or explaining it. The explanation invites a negotiation; the bare number usually does not.",
      "Expect to lose people when you raise prices, then count what you actually lost instead of what it felt like. Losing a third of your customers while charging half as much again leaves you ahead and less tired.",
      "Review it every few months. A price that never moves is quietly falling while everything else rises.",
    ],
  },
  {
    slug: "talking-money-with-family",
    section: "finance",
    title: "Talking About Money With Your Family",
    blurb: "How to have honest money conversations that build trust.",
    minutes: 4,
    topic: "Budgeting",
    verified: false,
    body: [
      "Money conversations in families go wrong for a reason that has little to do with money. Everyone is arguing about obligation and using figures to do it.",
      "Choose the moment deliberately. Nothing useful about money was ever settled at the end of a long day or in front of an audience.",
      "Bring a number rather than a feeling. I can send fifty a month moves a conversation that I am struggling does not.",
      "Say what you can do before you say what you cannot. The order changes how the whole thing lands.",
      "Expect the request to be about more than cash. Being asked is often about being counted on, and answering only the financial part leaves the real question sitting there.",
      "You are allowed a limit, and you do not owe anyone a full account of your finances to justify it. That is what I can manage is a complete sentence.",
      "Write down what was agreed, even as a message afterwards. Memories of money conversations drift apart quickly.",
    ],
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
    body: [
      "Money is not just about buying things. It is about having options — the ability to say no, to leave, to start again.",
      "Under Ugandan law, a woman may own property in her own name, open an account without a husband's signature, and keep her earnings as her own. These are not favours. They are rights.",
      "Start with one account only you can see. A mobile money line registered to your own SIM counts. Keep the PIN out of shared notebooks and off shared phones.",
      "If someone controls your money — takes your earnings, gives you an allowance, demands receipts for everything — that is a recognised form of abuse, and there are people who will treat it as one.",
    ],
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
    body: [
      "You have probably had the thought already. Something is wrong, and then immediately behind it, the second thought that says you are making too much of it.",
      "Notice how much work that second thought does. It arrives faster than the first one, it argues better, and it always lands in the same place.",
      "Most people in this position keep a private ledger. The comment about your dress. The evening you cancelled because it was easier than the argument about going. The way your phone was picked up and put back down. Each line looks small enough to laugh off, which is why the ledger exists at all: some part of you is keeping a total, because you know the total is the real number.",
      "Ask where you learned the word. If the person who upsets you is also the person who taught you that you overreact, that is not neutral feedback and it did not come from nowhere.",
      "Whether it is bad enough is a question with no answer, and it will keep you busy for years. Try a different one. Are you managing him? Do you plan sentences before you say them, read his face before you speak, work out what mood he is in before you decide what kind of day you are having?",
      "Managing someone is work. You would not be doing it if there were nothing to manage.",
      "None of this tells you what to do, and it is not meant to. Seeing clearly and deciding what to do are separate things, and you are allowed to take as long as you want over the second one.",
      "If you would rather have the questions in order than circling in your head at 2am, the private check in GAL asks them and keeps nothing.",
    ],
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
    body: [
      "The pattern repeating is not evidence that something is wrong with you. Usually it is evidence that something taught you early what normal looks like, and taught it thoroughly.",
      "A child in a house where the shouting comes before the hitting learns to read a room faster than other children do. That is a real skill and it works. The trouble is that it outlives the house.",
      "You end up drawn to what is familiar rather than what is good, because familiar is legible. You know the rules. You know what comes next. Someone calm can feel like a language you were never taught.",
      "Intensity gets mistaken for depth. If the love you grew up around came with fear attached, a relationship without fear can feel like nothing much, and one with fear can feel like the real thing.",
      "Then there is the practical version, which people leave out. Leaving costs money, somewhere to sleep, and the goodwill of people whose goodwill you still need. Staying is often not a failure of insight. It is arithmetic.",
      "Naming the pattern does not break it, and anyone who promises otherwise is selling something. What naming does is shorten the delay. You recognise it in weeks rather than years, and that is the whole of the win.",
      "None of this makes what happened to you your fault, and none of it makes what is happening now your fault either.",
    ],
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
    body: [
      "Early control does not look like control. It looks like being wanted more than anyone has wanted you before.",
      "Speed is the first signal. Someone who needs it serious inside three weeks is not certain about you, because nobody can be certain about anyone in three weeks. They are closing a door before you have looked round the room.",
      "Jealousy gets sold as proof of feeling. It is proof of jealousy and nothing else, and it does not shrink when you reassure it. It feeds on that.",
      "Watch what happens to your other people. Control almost never arrives as a ban. It arrives as a mood, a sulk after you visit your sister, a separate good reason every single time. You look up one day and the list of people you still see is short.",
      "Money and movement are the two to take seriously. Someone who holds your airtime, your fare, or your phone is holding a great deal more than those things.",
      "Settled love is rarely described, so it is worth saying what it is actually like: fairly boring, in the way good things often are. You are not performing. You can be in a foul mood without it becoming an event. You can refuse something small and nothing happens afterwards.",
      "That last one is the test worth keeping. Say no to something that does not matter, and watch what it costs you.",
    ],
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
    body: [
      "The first few seconds matter more than anything you say afterwards, and the bar is lower than you think.",
      "Believe her out loud. Not are you sure, not that does not sound like him. Some plain version of I believe you. She has rehearsed this conversation expecting not to be believed, and being wrong about that changes what she is able to tell you next.",
      "Do not ask what she did. It leaves your mouth sounding like curiosity and lands as blame, and she has already put that question to herself more times than you could manage.",
      "Resist fixing it tonight. The urge to produce a plan is mostly about your own discomfort, and a friend who arrives with an ultimatum by Friday is a friend she stops ringing.",
      "Do not tell her to leave, however obvious it looks from where you are standing. Separation is the most dangerous stretch of all of this, the timing has to be hers, and making your support conditional on her going only takes one more person off her list.",
      "Ask what she needs instead. Sometimes it is nothing. Sometimes it is that you keep a bag at your place, or answer the phone at odd hours, or say nothing to anybody.",
      "Then keep turning up afterwards. Most people manage one dramatic evening of support and then go quiet, and she will notice which kind you turned out to be.",
      "Look after yourself as well. Carrying this is heavy, and you are allowed your own person to talk to.",
    ],
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
    body: [
      "The advice you grew up with was about strangers. Do not walk alone at night, do not take a lift from a man you do not know. It is not wrong. It is aimed at the wrong person.",
      "Harm from someone close never announces itself, because the person doing it holds a role in your life that explains everything away. An uncle has a reason to be in the house. A cousin has a reason to be alone with you. A boyfriend has a reason to know where you are.",
      "That is why the confusion feels so particular. You are not frightened of a shape in the dark. You are unsure whether the person who drives you to church is doing something wrong, and nothing you were taught gives you words for that.",
      "Trust the body. It tends to register something well before the mind is allowed to. If you consistently find reasons not to be alone with a particular relative, you have already reached a conclusion; you have simply not said it out loud yet.",
      "The pressure not to speak is the second harm and often the heavier one. Families protect their own shape. You may hear about school fees, about your mother's health, about what people will say, about what it would do to your sister's marriage. Every one of those can be true at the same time, and not one of them makes it your job to carry.",
      "Work out what telling will cost before you tell, and choose who you tell deliberately rather than in the moment it becomes unbearable. Ask yourself which person in your family has ever taken someone's side against the family. Start there, if such a person exists. If nobody comes to mind, then the answer is somebody outside it: a teacher, a clinic, a friend's mother, a line on the Support page.",
      "There is a practical layer worth having ready even if you never use it. Somewhere else to sleep. Somebody who expects you and would notice if you did not arrive. A reason for leaving a room that you do not have to defend.",
      "If something happened last night, or is happening now, GAL has separate reads for those and they cover things that will not wait.",
      "One thing to hold on to through all of it. Being related to someone is not consent, and neither is having stayed quiet about it until now.",
    ],
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
    body: [
      "Your phone is what gets you help and what shows where you have been. Both at once, which is why the answer is almost never to throw it away.",
      "Begin with who can see it rather than with settings. Most monitoring inside real relationships is not spyware. It is a shared account, a password he already knows, a handset he can pick up while you are washing, and the habit of asking to see it.",
      "Location sharing is the first thing to check. Android and iPhone will both share your position continuously with somebody who was granted permission once, months ago, and neither of them mentions it again afterwards. Find the location sharing or Find My list and read what is actually on it instead of assuming.",
      "Then the quieter one. If your Google or Apple account is signed in on his device, he does not need your phone at all: photos, contacts, and often your searches arrive on his screen without him touching yours. Look at the list of signed-in devices and remove anything you do not recognise.",
      "Notifications give away more than the apps do. A message can be read on a lock screen without the phone being unlocked, which is how a locked phone still tells on you. Turn off message previews if there is anything you would not want read across a room.",
      "Be careful with the obvious move. Deleting the conversation, changing the password, switching off the sharing — each one is visible to somebody who is watching, and the moment he notices is a moment you have not planned for. Timing matters more here than thoroughness does.",
      "Think about whether you need a separate route altogether. A cheap handset kept somewhere else, or an email address he has never seen, is usually safer than trying to secure a phone he already has his hands on.",
      "GAL has a quick exit on every screen and can open as a calculator. The private check saves nothing at all, and the safety plan keeps its ticks on this phone and sends them nowhere.",
    ],
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
    body: [
      "Most rides are fine. This is about the few that are not, and about the fact that you usually get a few seconds of warning if you know what to look at.",
      "Decide before you get on, because getting off is far harder than not getting on. That is the whole thing; everything below is detail.",
      "Use a stage you know, where the riders know each other, rather than a lone boda waiting in a quiet spot. Riders who work a stage have something to lose.",
      "Look at the bike and the man for a moment longer than feels polite. Is there a helmet for you. Does the plate exist. Does he seem sober.",
      "Send the plate to somebody before you move, out loud and in front of him. It is not rude. It is the single most protective thing available to you, and it changes the arithmetic for anyone who was weighing something up.",
      "In a cab, check the plate against the app before you open the door, and let him say your name rather than offering it. Someone who does not know it should not be driving you.",
      "Sit where you can get out. In a cab that is the back seat on the far side from the kerb, so nobody can open a door onto you at a stop.",
      "Follow the route on your own phone. Drivers take shortcuts for ordinary reasons, so a diversion proves nothing on its own; a diversion plus a refusal to explain it is a different matter.",
      "If it turns, make it public. Shout at a junction, put a window down in traffic, get out at a fuel station or anywhere with lights and people. Anyone intending harm needs you isolated, so cost him that.",
      "Trust the decision to get out early even when you cannot justify it afterwards. Being wrong about a ride costs you a fare.",
    ],
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
    body: [
      "Start from the honest position: usually you cannot see it. Most of what gets put into a drink carries no colour and no taste, and advice built on spotting it fails at the moment you need it.",
      "So the attention worth having is on the drink's history rather than its appearance. Where has it been, and who has had it while you were not looking.",
      "Watch it poured and carry it yourself. A drink arriving from across a room has a gap in it you cannot account for.",
      "If you leave it, leave it. Another drink is cheaper than the alternative and the embarrassment lasts an evening.",
      "The signs that matter show up in your body rather than the glass. Getting drunk far faster than the amount explains, a sudden heaviness, the room going distant, your legs not answering. If one drink is behaving like five, that is the information.",
      "Tell somebody straight away, and pick a person rather than announcing it to a group. Say the specific thing: I think there is something in my drink, stay with me, do not leave me alone with anyone.",
      "If a friend has gone that way suddenly, do not put her in a back room to sleep it off. Stay with her, keep her on her side if she cannot sit up, and get her to a health facility rather than waiting to see how it develops.",
      "Go to a health facility even if it passes off. Some of what matters afterwards is time-sensitive in ways nobody can judge from how they feel at the time, and going costs you an evening.",
      "None of it happened because of what you wore or drank or where you were standing. Somebody made a decision, and it stays theirs.",
    ],
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
    body: [
      "This is not a lecture about compound interest. It is about the fact that leaving costs money, and that a person with none has fewer choices available to her.",
      "Money you can reach without asking anyone is a different thing from money you technically own. The second kind is not much use in a hurry.",
      "Begin with an amount nobody would miss. Small and unnoticed beats ambitious and discovered, every time.",
      "Think about where it lives. A mobile money account he knows the PIN to is his account. A separate line, a savings group, cash held by somebody you trust: each is imperfect, and which one is right depends entirely on who has access to what.",
      "If another person holds cash for you, choose them for loyalty rather than means, and tell them plainly that it is yours and only yours.",
      "Documents count as money. A National ID, a birth certificate, school papers: these are what let anyone start again somewhere else, and replacing them is slow and expensive.",
      "If saving is impossible, skim instead. Rounding down what you report, keeping the change, pricing a job slightly higher. That is how most people actually build a fund, and none of it requires a spare month's income.",
      "None of this decides anything. It is about having options if you ever want them, and an option held quietly costs nothing to keep.",
    ],
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
    body: [
      "Financial control is not a disagreement about spending. It is one person deciding what the other is able to do, using money as the mechanism.",
      "It looks like an allowance you have to account for. Wages that go into his account. A phone that runs out of airtime on the days you were going somewhere. A business in your name that he runs. Debt in your name you learn about later.",
      "It works because it does not look like violence, and because it is usually described as being sensible about money. That makes it hard to name, including to yourself.",
      "Start with knowing rather than doing. What is in your name. What debts exist. Where your ID and papers are kept. Which accounts you can actually reach alone. You cannot plan around a picture you do not have.",
      "Get your own line if you have none. A SIM registered to you, in a handset he does not go through, is what everything else sits on.",
      "Documents before cash. Photograph your ID, certificates, and account details, and keep the images somewhere that is not this phone. An email account he has never seen will do.",
      "Move slowly, and keep each step explainable. A sudden change is the thing that gets noticed, and the stretch just after being noticed is the dangerous one.",
      "If your name is on debt you never agreed to, that is a legal problem with a legal answer, and it deserves a proper opinion rather than a family one. Support carries the confirmed lines.",
      "Whether you stay or go is not what this is for. Knowing where your money is, and holding some he cannot reach, is worth having either way.",
    ],
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
    body: [
      "Most lists of side hustles are written by people who have never run one. This is about the shape of work that actually pays rather than a list of ideas.",
      "The ones that survive share a few things. Somebody already pays for it. You can start without capital. Doing it a second time is easier than the first.",
      "Selling what other people make has the lowest barrier. Take the order first and buy afterwards, so there is no stock and no money tied up in things nobody wanted.",
      "Skills that fix or make one specific thing pay better than general availability. Hair, nails, tailoring, phone repair, cakes for an occasion. People search for the specific thing, and they pay more to someone who only does that.",
      "Anything involving other people's phones and computers is underrated. Setting up a business page, editing photographs, typing and printing, small design jobs. The people who need this are not going to learn it themselves.",
      "Content pays late and unreliably, and the honest version is that most people earn nothing from it for a long time. Worth doing if you would do it unpaid for months. A poor plan if the rent depends on it this quarter.",
      "Whatever it is, the second customer is the business. The first proves it can happen; the second proves it can happen again, and the rest is repetition.",
      "Two things kill more of these than lack of demand: not charging enough, and mixing the money in with your own so you never discover whether it earned anything.",
      "Start smaller than you think, and start this week. The hustle that begins once you have saved capital and researched the market generally does not begin.",
    ],
  },
];

export const bySection = (s: Section) => ARTICLES.filter((a) => a.section === s);
export const bySlug = (slug: string) => ARTICLES.find((a) => a.slug === slug);
export const byTopic = (s: Section, topic: string | null) =>
  bySection(s).filter((a) => !topic || a.topic === topic);
