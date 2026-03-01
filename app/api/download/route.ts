import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing session_id" },
      { status: 400 }
    );
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid session" },
      { status: 400 }
    );
  }

  try {
    const pdfPath = join(process.cwd(), "private", "learn-radicals.pdf");
    const pdf = await readFile(pdfPath);

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="learn-radicals.pdf"',
      },
    });
  } catch (err) {
    console.error("Failed to read PDF:", err);
    return NextResponse.json(
      { error: "File not available" },
      { status: 500 }
    );
  }
}
