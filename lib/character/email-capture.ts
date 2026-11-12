import { Resend } from "resend";
import type { ResultView } from "./index";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://learnradicals.com";
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Basic shape check; Resend does the real validation. */
export function isValidEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

/** Contact fields saved with each quiz signup (created once by scripts/resend-setup.mjs). */
export function quizProperties(view: ResultView): Record<string, string> {
  return {
    quiz_result: view.id,
    quiz_character: view.character.char,
    quiz_animal: view.animal.animal,
    quiz_element: view.element.element,
  };
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);
}

export function freeCardEmailHtml(view: ResultView): string {
  const c = view.character;
  const result = `${BASE}/character/r/${view.id}`;
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF8F4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <div style="max-width:480px;margin:0 auto;padding:36px 24px;text-align:center">
    <p style="font-size:12px;letter-spacing:3px;color:#6B6560;margin:0 0 16px">YOUR CHINESE CHARACTER</p>
    <img src="${BASE}/api/character/card/${view.id}" width="270" alt="${escapeHtml(`${c.char} ${c.meaning}`)}" style="width:270px;max-width:100%;border-radius:16px">
    <p style="font-size:17px;color:#1A1A1A;font-weight:600;margin:20px 0 6px">“${escapeHtml(c.decode)}”</p>
    <p style="font-size:14px;color:#B8860B;margin:0 0 24px">${escapeHtml(`${cap(view.element.element)} ${cap(view.animal.animal)}`)} · by birth year</p>
    <p style="font-size:15px;color:#1A1A1A;margin:0 0 18px">Your full reading covers who you are, love, money and work, your year animal, and 3 wallpapers.</p>
    <a href="${result}" style="display:inline-block;background:#CC3425;color:#FFFFFF;padding:14px 30px;border-radius:14px;text-decoration:none;font-size:16px;font-weight:500">Read my full ${c.char} reading</a>
    <p style="font-size:12px;color:#6B6560;margin:28px 0 0">You asked us to email your result. We'll occasionally send Chinese character notes; unsubscribe anytime.</p>
  </div>
</body>
</html>`;
}

/**
 * Saves the visitor as a Resend contact (in the quiz segment, with result fields) and emails their free card.
 * Saving never blocks the email: if the segment or fields aren't set up yet, the contact is saved without them.
 */
export async function captureQuizEmail(email: string, view: ResultView): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY!);
  const segmentId = process.env.RESEND_SEGMENT_QUIZ;
  const segments = segmentId ? [{ id: segmentId }] : undefined;

  const created = await resend.contacts.create({ email, unsubscribed: false, properties: quizProperties(view), segments });
  if (created.error) {
    // Already a contact, or the custom fields don't exist yet: fall back gracefully.
    const plain = await resend.contacts.create({ email, unsubscribed: false, segments });
    if (plain.error && segmentId) await resend.contacts.segments.add({ email, segmentId });
    console.warn("[quiz-email] contact saved with fallback:", created.error.name);
  }

  const sent = await resend.emails.send({
    from: "Learn Radicals <hello@get.learnradicals.com>",
    to: email,
    subject: `Your Chinese character: ${view.character.char} (${view.character.meaning})`,
    html: freeCardEmailHtml(view),
  });
  if (sent.error) throw new Error(sent.error.message);
}

/** Saves a reading buyer (email from Stripe Checkout) to the buyers segment. Never throws. */
export async function saveBuyerContact(email: string, view: ResultView): Promise<void> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const segmentId = process.env.RESEND_SEGMENT_BUYERS;
    const segments = segmentId ? [{ id: segmentId }] : undefined;
    const created = await resend.contacts.create({ email, unsubscribed: false, properties: quizProperties(view), segments });
    if (created.error) {
      const plain = await resend.contacts.create({ email, unsubscribed: false, segments });
      if (plain.error && segmentId) await resend.contacts.segments.add({ email, segmentId });
    }
  } catch (err) {
    console.warn("[buyer-contact] not saved:", err instanceof Error ? err.message : err);
  }
}
