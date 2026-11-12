import { NextResponse } from "next/server";
import { buyKit } from "@/lib/character/checkout";

/** POST { session_id } -> one-tap kit purchase with the card saved at the reading checkout. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { session_id?: string } | null;
  const sessionId = body?.session_id ?? "";
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    return NextResponse.json({ status: "failed", message: "Missing purchase." }, { status: 400 });
  }
  try {
    const result = await buyKit(sessionId);
    console.log("[kit]", JSON.stringify({ session_id: sessionId, status: result.status }));
    return NextResponse.json(result, { status: result.status === "failed" ? 402 : 200 });
  } catch (err) {
    console.error("Kit upsell error:", err);
    return NextResponse.json({ status: "failed", message: "Something went wrong." }, { status: 500 });
  }
}
