import { stripe } from "./stripe-server";
import { EXAMPLE_READING } from "./example";
import { decodeResultId } from "./ids";
import { parseAnswers } from "./reflection";

export type ReadingAccess = {
  resultId: string;
  answers: number[] | null;
  /** Bought the 2027 Goat-year kit with this checkout. */
  hasKit: boolean;
  /** e.g. "Visa ···· 4242" — the card saved at checkout, shown before a one-tap charge. */
  savedCard?: string | null;
  sessionId: string | null;
  example?: boolean;
};

const isDev = () => process.env.NODE_ENV !== "production";
const cap = (s: string) => (s === "amex" ? "Amex" : s.charAt(0).toUpperCase() + s.slice(1));

/**
 * Who may see a full reading (and its wallpapers):
 * - a paid Stripe Checkout session whose metadata.product is "reading", or
 * - a preview id, only outside production (for reviewing the page locally).
 */
export async function getReadingAccess(opts: {
  sessionId?: string | null;
  previewId?: string | null;
  previewAnswers?: string | null;
  /** Local preview only: pretend the kit was bought. */
  previewKit?: boolean;
  example?: boolean;
}): Promise<ReadingAccess | null> {
  if (opts.example) {
    return { resultId: EXAMPLE_READING.id, answers: [...EXAMPLE_READING.answers], hasKit: false, sessionId: null, example: true };
  }
  if (opts.sessionId) {
    try {
      const s = stripe();
      const session = await s.checkout.sessions.retrieve(opts.sessionId, { expand: ["payment_intent.payment_method"] });
      const resultId = session.metadata?.result_id ?? "";
      if (session.payment_status !== "paid" || session.metadata?.product !== "reading") return null;
      if (!decodeResultId(resultId)) return null;
      const pi = session.payment_intent;
      let hasKit = false;
      const kitPi = pi && typeof pi !== "string" ? pi.metadata?.kit_pi : undefined;
      if (kitPi) hasKit = (await s.paymentIntents.retrieve(kitPi)).status === "succeeded";
      const pm = pi && typeof pi !== "string" && pi.payment_method && typeof pi.payment_method !== "string" ? pi.payment_method : null;
      const savedCard = pm?.card ? `${cap(pm.card.brand)} ···· ${pm.card.last4}` : pm ? cap(pm.type.replace(/_/g, " ")) : null;
      return { resultId, answers: parseAnswers(session.metadata?.answers), hasKit, sessionId: session.id, savedCard };
    } catch {
      return null;
    }
  }
  if (opts.previewId && isDev() && decodeResultId(opts.previewId)) {
    return { resultId: opts.previewId, answers: parseAnswers(opts.previewAnswers), hasKit: Boolean(opts.previewKit), sessionId: null };
  }
  return null;
}

/** Query string that authorizes wallpaper downloads for this access. */
export function accessQuery(access: ReadingAccess): string {
  if (access.example) return "example=1";
  return access.sessionId
    ? `session_id=${encodeURIComponent(access.sessionId)}`
    : `preview=${encodeURIComponent(access.resultId)}${access.answers ? `&a=${access.answers.join("")}` : ""}`;
}
