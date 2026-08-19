/**
 * ⚠⚠ NOTHING IN THIS FILE SHIPS UNVERIFIED. ⚠⚠
 *
 * This is the single highest-liability surface in GAL. A wrong or dead number
 * here is worse than no number at all: someone in trouble dials it, nothing
 * happens, and they stop trying.
 *
 * Rules before any entry goes live:
 *   1. Phone the number. A human or a working system must answer.
 *   2. Confirm the operating hours and the cost (free / standard rates).
 *   3. Confirm it serves the caller's location.
 *   4. Record who verified it and when.
 *
 * Do not port these across from the Base44 build on trust. Do not fill them in
 * from memory. Verify, then set `verified: true` and fill `verifiedOn`.
 */

export type Resource = {
  id: string;
  name: string;
  /** Leave empty until step 1 above is done. */
  phone: string;
  what: string;
  hours: string;
  cost: string;
  verified: boolean;
  verifiedOn?: string;
  verifiedBy?: string;
};

export const RESOURCES: Resource[] = [
  {
    id: "national-gbv",
    name: "National GBV helpline",
    phone: "",
    what: "Confidential support after violence or abuse.",
    hours: "",
    cost: "",
    verified: false,
  },
  {
    id: "child-helpline",
    name: "Child helpline",
    phone: "",
    what: "For anyone under 18, or an adult worried about a child.",
    hours: "",
    cost: "",
    verified: false,
  },
  {
    id: "mental-health",
    name: "Mental health support line",
    phone: "",
    what: "Someone to talk to on a heavy day.",
    hours: "",
    cost: "",
    verified: false,
  },
  {
    id: "police-gbv",
    name: "Police — Child & Family Protection Unit",
    phone: "",
    what: "To report violence and start a formal case.",
    hours: "",
    cost: "",
    verified: false,
  },
  {
    id: "medical",
    name: "Nearest health facility",
    phone: "",
    what: "Post-rape care is time-sensitive. Go as soon as you can.",
    hours: "",
    cost: "",
    verified: false,
  },
];

export const liveResources = () => RESOURCES.filter((r) => r.verified && r.phone);
