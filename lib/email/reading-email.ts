import { Resend } from "resend";
import { getResult } from "@/lib/character";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://learnradicals.com";

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);
}

/** Emails the buyer a permanent link to their full reading. */
export async function sendReadingEmail(email: string, sessionId: string, resultId: string): Promise<void> {
  const view = getResult(resultId);
  if (!view) throw new Error(`Unknown result ${resultId}`);
  const c = view.character;
  const url = `${BASE}/character/reading?session_id=${encodeURIComponent(sessionId)}`;

  await new Resend(process.env.RESEND_API_KEY!).emails.send({
    from: "Learn Radicals <hello@get.learnradicals.com>",
    to: email,
    subject: `Your Chinese character: ${c.char} (${c.meaning})`,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF8F4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:480px;margin:0 auto;padding:40px 24px;text-align:center">
    <p style="font-size:12px;letter-spacing:3px;color:#6B6560;margin:0 0 12px">YOUR CHINESE CHARACTER</p>
    <p style="font-size:96px;line-height:1;color:#CC3425;margin:0">${c.char}</p>
    <p style="font-size:18px;color:#1A1A1A;margin:12px 0 4px">${escapeHtml(c.pinyin)} · ${escapeHtml(c.meaning)}</p>
    <p style="font-size:17px;color:#1A1A1A;font-weight:600;margin:16px 0 28px">“${escapeHtml(c.decode)}”</p>
    <a href="${url}" style="display:inline-block;background:#CC3425;color:#FFFFFF;padding:14px 32px;border-radius:14px;text-decoration:none;font-size:16px;font-weight:500">Open my full reading</a>
    <p style="font-size:13px;color:#6B6560;margin:24px 0 0">Your reading, PDF and wallpapers live at this link. Save this email; the link is yours to keep.</p>
  </div>
</body>
</html>`,
  });
}
