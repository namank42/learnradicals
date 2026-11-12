import Stripe from "stripe";
import { EXAMPLE_READING } from "./example";
import { decodeResultId } from "./ids";
import { parseAnswers } from "./reflection";

export type ReadingAccess = {
  resultId: string;
  answers: number[] | null;
  preordered: boolean;
  sessionId: string | null;
  example?: boolean;
};

const isDev = () => process.env.NODE_ENV !== "production";

/**
 * Who may see a full reading (and its wallpapers):
 * - a paid Stripe Checkout session whose metadata.product is "reading", or
 * - a preview id, only outside production (for reviewing the page locally).
 */
export async function getReadingAccess(opts: {
  sessionId?: string | null;
  previewId?: string | null;
  previewAnswers?: string | null;
  example?: boolean;
}): Promise<ReadingAccess | null> {
  if (opts.example) {
    return { resultId: EXAMPLE_READING.id, answers: [...EXAMPLE_READING.answers], preordered: false, sessionId: null, example: true };
  }
  if (opts.sessionId) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      const session = await stripe.checkout.sessions.retrieve(opts.sessionId);
      const resultId = session.metadata?.result_id ?? "";
      if (session.payment_status !== "paid" || session.metadata?.product !== "reading") return null;
      if (!decodeResultId(resultId)) return null;
      const preorderPrice = process.env.STRIPE_PRICE_GOAT_PREORDER;
      let preordered = false;
      if (preorderPrice) {
        const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 });
        preordered = items.data.some((li) => li.price?.id === preorderPrice);
      }
      return { resultId, answers: parseAnswers(session.metadata?.answers), preordered, sessionId: session.id };
    } catch {
      return null;
    }
  }
  if (opts.previewId && isDev() && decodeResultId(opts.previewId)) {
    return { resultId: opts.previewId, answers: parseAnswers(opts.previewAnswers), preordered: false, sessionId: null };
  }
  return null;
}

/** Query string that authorizes wallpaper downloads for this access. */
export function accessQuery(access: ReadingAccess): string {
  if (access.example) return "example=1";
  return access.sessionId
    ? `session_id=${encodeURIComponent(access.sessionId)}`
    : `preview=${encodeURIComponent(access.resultId)}`;
}
