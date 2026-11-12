import { NextResponse } from "next/server";
import { getResult } from "@/lib/character";
import { captureQuizEmail, isValidEmail } from "@/lib/character/email-capture";

/** POST { email, id, website? } — "website" is a honeypot that real visitors never fill. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string; id?: string; website?: string } | null;
  if (body?.website) return NextResponse.json({ ok: true }); // bot: pretend success
  const email = (body?.email ?? "").trim().toLowerCase();
  const view = getResult(body?.id ?? "");
  if (!view || !isValidEmail(email)) return NextResponse.json({ ok: false, error: "Check your email address." }, { status: 400 });

  try {
    await captureQuizEmail(email, view);
    console.log("[quiz-email]", JSON.stringify({ result_id: view.id, sent: true }));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[quiz-email] failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, error: "Couldn't send right now. Try again in a minute." }, { status: 500 });
  }
}
