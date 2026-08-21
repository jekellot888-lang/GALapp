/**
 * ⚠ SAME RULE AS content/support.ts. NOTHING HERE SHIPS UNVERIFIED. ⚠
 *
 * The design canvas described a doctor-booking flow with named practitioners,
 * fees, ratings and appointment slots. None of that is in this file, because
 * none of it was real — the canvas carried placeholder people, and a health
 * directory that invents a clinic is worse than one that admits it is empty.
 * Somebody walks to an address that does not exist.
 *
 * GAL is also not a booking system and should not pretend to be one. It has no
 * way to hold a slot, no way to tell a clinic she is coming, and no way to tell
 * her if they close early. What it can honestly be is a directory: here is a
 * place, here is what it does, here is the number, you call them.
 *
 * Before any entry goes live:
 *   1. Phone the clinic. Someone must answer.
 *   2. Confirm the address by a second source, not just the phone call.
 *   3. Confirm what they actually treat, and whether they see walk-ins.
 *   4. Confirm cost. "Free" must mean free, including consultation.
 *   5. For post-rape care specifically, confirm they provide it and within what
 *      window. Getting this wrong wastes hours that matter clinically.
 *   6. Record who verified it and when.
 */

export type Clinic = {
  id: string;
  name: string;
  what: string;
  area: string;
  address: string;
  phone: string;
  hours: string;
  cost: string;
  /** Post-rape care, which is time-critical and must be confirmed explicitly. */
  prc?: boolean;
  walkIn?: boolean;
  verified: boolean;
  verifiedOn?: string;
  verifiedBy?: string;
  flag?: string;
};

/**
 * Deliberately empty. Add entries only after step 1 through 6 above.
 *
 * Do not seed this from a web search, a directory listing, or the design
 * canvas. Every other content file in this project was allowed to carry
 * unverified data behind a gate because the data came from a real source that
 * simply needed checking. There is no such source for clinics yet, so inventing
 * a starting point would be fabrication rather than transcription.
 */
export const CLINICS: Clinic[] = [];

/** The gate. Same shape as liveResources() in content/support.ts. */
export const liveClinics = () => CLINICS.filter((c) => c.verified && c.phone);

/** Time-critical subset, surfaced first when it exists. */
export const prcClinics = () => liveClinics().filter((c) => c.prc);
