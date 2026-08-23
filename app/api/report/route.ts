import { findMessage, removeMessage, roomConfigured } from "@/lib/room/store";

/**
 * Report a message.
 *
 * The message is pulled from the room immediately, before any human looks at
 * it. "Reviewed later" must not mean the thing she reported sits on screen all
 * night — the review decides whether it was fair, not whether she had to keep
 * seeing it.
 *
 * The alert goes to one fixed address. Worth recording why Resend suits this
 * when it did not suit sign-in: an unverified Resend account can only deliver
 * to the account holder's own address, which was useless for user email and is
 * exactly right for an alert that never goes anywhere else.
 *
 * With no key configured the removal still happens and the alert is logged to
 * the server instead. Losing the notification is bad; leaving the message up
 * because the notification failed would be worse.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODERATOR = process.env.MODERATION_EMAIL || "";
const RESEND_KEY = process.env.RESEND_API_KEY || "";

export async function POST(req: Request) {
  if (!roomConfigured()) {
    return Response.json({ error: "The room is not switched on." }, { status: 503 });
  }

  let body: { id?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }
  const id = typeof body.id === "string" ? body.id : "";
  if (!id) return Response.json({ error: "Bad request." }, { status: 400 });

  const reported = await findMessage(id);
  await removeMessage(id);

  const when = new Date().toISOString();
  const summary = reported
    ? `alias: ${reported.alias}\nsent: ${new Date(reported.at).toISOString()}\n\n${reported.body}`
    : "The message was already gone by the time the report arrived.";

  if (RESEND_KEY && MODERATOR) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "GAL <onboarding@resend.dev>",
          to: [MODERATOR],
          subject: "A message in the GAL room was reported",
          text:
            `Reported at ${when}. It has already been removed from the room.\n\n` +
            `${summary}\n\n` +
            `Nothing else about the sender is stored, so there is no account to ` +
            `act on. If the room needs closing, set gal:room:closed to 1 in ` +
            `Upstash and it shuts immediately.`,
        }),
      });
    } catch (e) {
      console.error("[report] alert failed to send:", e);
    }
  } else {
    console.warn("[report] no RESEND_API_KEY/MODERATION_EMAIL — alert not sent:", when);
  }

  /* She is told it is done and nothing else. No count, no status, no way to
     check later — which matters when the person reported may be beside her. */
  return Response.json({ ok: true });
}
