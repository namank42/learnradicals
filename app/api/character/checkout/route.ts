import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ATTR_COOKIE, parseAttribution, stripeMetadata } from "@/lib/attribution";
import { createReadingCheckout } from "@/lib/character/checkout";
import { decodeResultId } from "@/lib/character/ids";
import { parseAnswers } from "@/lib/character/reflection";

/** POST { id, answers? } -> { clientSecret } for the embedded checkout sheet. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { id?: string; answers?: string } | null;
  const id = body?.id ?? "";
  if (!decodeResultId(id)) return NextResponse.json({ error: "Invalid result" }, { status: 400 });

  const attr = parseAttribution((await cookies()).get(ATTR_COOKIE)?.value);
  const country = request.headers.get("x-vercel-ip-country");
  try {
    const { clientSecret, sessionId } = await createReadingCheckout({
      resultId: id,
      answers: parseAnswers(body?.answers),
      country,
      attribution: stripeMetadata(attr),
      clientReferenceId: attr?.vid,
    });
    console.log("[attr]", JSON.stringify({ event: "checkout", product: "reading", result_id: id, country, session_id: sessionId }));
    return NextResponse.json({ clientSecret });
  } catch (err) {
    console.error("Character checkout error:", err);
    return NextResponse.json({ error: "Could not start checkout" }, { status: 500 });
  }
}
