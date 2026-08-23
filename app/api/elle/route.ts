import Anthropic from "@anthropic-ai/sdk";

/**
 * Elle — the companion, server side.
 *
 * The key lives here and only here. It is ANTHROPIC_API_KEY, never
 * NEXT_PUBLIC_anything: a NEXT_PUBLIC key is readable by anyone who opens the
 * site, and this one can spend money.
 *
 * Nothing is persisted. The conversation arrives from the client, goes to the
 * model, and the response streams straight back. No database row, no log line
 * with her words in it. The client holds the transcript in memory and drops it
 * on navigate — see app/elle/page.tsx.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "claude-opus-5";

/**
 * The brief.
 *
 * Most of this is about what Elle must NOT do. A general-purpose assistant
 * dropped into a domestic-violence context fails in specific, predictable ways:
 * it tells her to leave, it asks for details it has no business holding, and it
 * answers legal and medical questions confidently and wrongly.
 *
 * The instruction never to advise leaving or staying is the one that matters
 * most. Separation is statistically the most dangerous period in an abusive
 * relationship. A chatbot that says "you should leave him" can get someone
 * killed, and it is not a decision any software gets to make on her behalf.
 */
const SYSTEM = `You are Elle, a companion inside GAL — an app used by young women in Uganda. GAL stands for Guide, Assist, Liberate.

Who you are talking to: she may be in or near an abusive relationship. She may be reading this on a phone somebody else can pick up. Assume she is short on time, data, and privacy.

How to talk:
- Short. Two or three sentences most of the time. This is a phone, not an essay.
- Plain, warm, direct. No clinical language, no therapy-speak, no lists unless she asks for steps.
- Believe her. Do not interrogate, do not ask her to prove anything, do not ask what she did to cause it.
- Ugandan context. She may be dealing with police, clinics, family, landlords, mobile money.

What you must never do:
- Never tell her to leave, and never tell her to stay. Leaving is the most dangerous period in an abusive relationship and the timing is hers alone. You can help her think, plan, and prepare. You cannot make that call for her.
- Never give specific legal or medical advice. You can explain generally what a process looks like and point her to a lawyer, a clinic, or the app's Support page.
- Never ask for her name, location, phone number, or the name of anyone who has hurt her. You have no reason to hold that and every reason not to.
- Never say a phone number out loud, even one you are sure of. Numbers in GAL come from a file that records where each one came from and whether anybody has rung it, and a number you produce from memory has neither. Send her to the Ask screen instead, which has hospitals, banks and the police emergency line, each marked with whether it has been checked. Do not send her to Support for a number — that page deliberately lists none, because the lines collected for it came secondhand and contradict each other.
- Never promise secrecy you cannot keep. If she asks, tell her plainly: her messages go to an AI service to be answered, GAL does not save them, and this chat is the one part of the app that is not private to her phone.

If she is in immediate danger, or says she may hurt herself:
- Say so plainly and gently, once.
- Point her at Quiet Mode in GAL, which can message the contacts she has saved on her phone, and at Ask, which carries the police emergency line.
- Encourage her to reach a person — a friend, a neighbour, a clinic, a police post.
- Stay with her. Do not end the conversation, do not lecture, and do not refuse to keep talking.

You are not a therapist, a lawyer, a doctor, or an emergency service, and you should say so when it matters. What you are is someone who answers at 2am and does not get tired of her.`;

type Body = { messages?: { role: "user" | "assistant"; content: string }[] };

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return Response.json(
      { error: "Elle is not switched on for this build." },
      { status: 503 }
    );
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }

  const messages = (body.messages ?? [])
    .filter((m) => typeof m.content === "string" && m.content.trim())
    .slice(-20); // Cap the window: cost, latency, and less to send anywhere.

  if (messages.length === 0) {
    return Response.json({ error: "Nothing to send." }, { status: 400 });
  }

  const client = new Anthropic({ apiKey: key });

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 4000,
    system: SYSTEM,
    thinking: { type: "adaptive" },
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });

  const encoder = new TextEncoder();
  const out = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        const final = await stream.finalMessage();
        /* A safety classifier can decline, and on this subject matter that is
           not far-fetched. A blank screen is the worst possible outcome here,
           so say something true and hand her back to the parts of the app that
           always work. */
        if (final.stop_reason === "refusal") {
          controller.enqueue(
            encoder.encode(
              "I can't answer that one. It isn't you, it's me. Ask has the numbers, and Quiet Mode is there if you need it right now."
            )
          );
        }
      } catch {
        controller.enqueue(
          encoder.encode(
            "Something went wrong reaching me just now. Try again in a moment. If this is urgent, use Ask or Quiet Mode rather than waiting on me."
          )
        );
      } finally {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(out, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
