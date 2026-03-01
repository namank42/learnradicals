import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

async function sendDownloadEmail(email: string, sessionId: string) {
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const downloadUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/download?session_id=${sessionId}`;

  await resend.emails.send({
    from: "Learn Radicals <hello@get.learnradicals.com>",
    to: email,
    subject: "Your Learn Radicals PDF is ready",
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF9F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:480px;margin:0 auto;padding:40px 24px">
    <h1 style="font-size:22px;color:#1A1A1A;margin:0 0 8px">Learn Radicals</h1>
    <p style="font-size:15px;color:#6B6B6B;margin:0 0 24px">Thank you for your purchase!</p>
    <div style="background:#FFFFFF;border-radius:12px;border-left:4px solid #C0392B;padding:24px;margin-bottom:24px">
      <p style="font-size:15px;color:#1A1A1A;margin:0 0 16px">Your PDF guide to all 214 Chinese radicals is ready to download.</p>
      <a href="${downloadUrl}" style="display:inline-block;background:#C0392B;color:#FFFFFF;padding:12px 28px;border-radius:12px;text-decoration:none;font-size:15px;font-weight:500">Download PDF</a>
    </div>
    <p style="font-size:13px;color:#6B6B6B;margin:0">This link is tied to your purchase and won&rsquo;t expire. Save this email for future access.</p>
  </div>
</body>
</html>`,
  });
}

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status === "paid" && session.customer_details?.email) {
      try {
        await sendDownloadEmail(session.customer_details.email, session.id);
      } catch (err) {
        console.error("Failed to send download email:", err);
        // Return 200 anyway — user has the success page as fallback
      }
    }
  }

  return NextResponse.json({ received: true });
}
