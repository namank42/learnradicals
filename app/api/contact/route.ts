import { NextResponse } from "next/server";
import { Resend } from "resend";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, message, website } = body;

  // Honeypot — bots fill hidden fields
  if (website) {
    return NextResponse.json({ success: true });
  }

  if (!email || typeof email !== "string" || email.length > 320) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  if (!message || typeof message !== "string" || message.length > 2000) {
    return NextResponse.json({ error: "Message is required (max 2000 characters)" }, { status: 400 });
  }

  const safeName = name && typeof name === "string" ? name.slice(0, 100) : "";
  const safeEmail = email.trim();
  const safeMessage = message.trim();

  const resend = new Resend(process.env.RESEND_API_KEY!);

  try {
    await resend.emails.send({
      from: "Learn Radicals <hello@get.learnradicals.com>",
      to: "support@wovenlabs.net",
      replyTo: safeEmail,
      subject: `Contact form: ${safeName || "Anonymous"} <${safeEmail}>`,
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF9F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:480px;margin:0 auto;padding:40px 24px">
    <h1 style="font-size:22px;color:#1A1A1A;margin:0 0 8px">Learn Radicals</h1>
    <p style="font-size:15px;color:#6B6B6B;margin:0 0 24px">New contact form submission</p>
    <div style="background:#FFFFFF;border-radius:12px;border-left:4px solid #C0392B;padding:24px;margin-bottom:24px">
      <p style="font-size:13px;color:#6B6B6B;margin:0 0 4px">Name</p>
      <p style="font-size:15px;color:#1A1A1A;margin:0 0 16px">${escapeHtml(safeName || "Not provided")}</p>
      <p style="font-size:13px;color:#6B6B6B;margin:0 0 4px">Email</p>
      <p style="font-size:15px;color:#1A1A1A;margin:0 0 16px">${escapeHtml(safeEmail)}</p>
      <p style="font-size:13px;color:#6B6B6B;margin:0 0 4px">Message</p>
      <p style="font-size:15px;color:#1A1A1A;margin:0;white-space:pre-wrap">${escapeHtml(safeMessage)}</p>
    </div>
  </div>
</body>
</html>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to send contact email:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
