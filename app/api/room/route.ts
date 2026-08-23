import {
  readRoom,
  postMessage,
  removeMessage,
  rateLimit,
  sanitise,
  isClosed,
  roomConfigured,
  MAX_LENGTH,
  type RoomMessage,
} from "@/lib/room/store";

/**
 * The room, server side.
 *
 * GET polls, POST sends, DELETE removes her own. No sockets: Vercel's WebSocket
 * upgrade is still flagged experimental, connections pin to one Function
 * instance and die at its max duration, and her connection is a Ugandan mobile
 * network where a socket that keeps dropping is worse than a request that
 * either lands or does not. Revisit past roughly 30 concurrent.
 *
 * Nothing here logs a message body, an IP, or a session id. The store keeps
 * messages for a day and keeps nothing else at all.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const off = () =>
  Response.json(
    { error: "The room is not switched on for this build.", closed: true },
    { status: 503, headers: { "Cache-Control": "no-store" } }
  );

export async function GET() {
  if (!roomConfigured()) return off();
  if (await isClosed()) {
    return Response.json(
      { closed: true, messages: [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
  const messages = await readRoom();
  return Response.json(
    { closed: false, messages },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(req: Request) {
  if (!roomConfigured()) return off();
  if (await isClosed()) {
    return Response.json({ error: "The room is closed right now." }, { status: 423 });
  }

  let body: { alias?: string; body?: string; sid?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }

  const sid = typeof body.sid === "string" ? body.sid.slice(0, 64) : "";
  const alias = typeof body.alias === "string" ? body.alias.trim().slice(0, 24) : "";
  const text = sanitise(typeof body.body === "string" ? body.body : "");

  if (!sid || alias.length < 2) {
    return Response.json({ error: "Set a name before sending." }, { status: 400 });
  }
  if (!text) {
    return Response.json({ error: "Nothing to send." }, { status: 400 });
  }

  const limited = await rateLimit(sid);
  if (limited) return Response.json({ error: limited }, { status: 429 });

  const message: RoomMessage = {
    id: crypto.randomUUID(),
    alias,
    body: text,
    at: Date.now(),
    sid,
  };
  await postMessage(message);

  /* Hand back what was stored, not what was typed. If sanitising changed her
     words she should see the change immediately rather than discover it. */
  return Response.json({ message, maxLength: MAX_LENGTH });
}

export async function DELETE(req: Request) {
  if (!roomConfigured()) return off();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") ?? "";
  const sid = searchParams.get("sid") ?? "";
  if (!id || !sid) return Response.json({ error: "Bad request." }, { status: 400 });

  const ok = await removeMessage(id, sid);
  return Response.json({ ok });
}
