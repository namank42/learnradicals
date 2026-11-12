import Stripe from "stripe";
import { decodeResultId } from "./ids";

export type ReadingAccess = { resultId: string; preordered: boolean; sessionId: string | null };

const isDev = () => process.env.NODE_ENV !== "production";

/**
 * Who may see a full reading (and its wallpapers):
 * - a paid Stripe Checkout session whose metadata.product is "reading", or
 * - a preview id, only outside production (for reviewing the page locally).
 */
export async function getReadingAccess(opts: {
  sessionId?: string | null;
  previewId?: string | null;
}): Promise<ReadingAccess | null> {
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
      return { resultId, preordered, sessionId: session.id };
    } catch {
      return null;
    }
  }
  if (opts.previewId && isDev() && decodeResultId(opts.previewId)) {
    return { resultId: opts.previewId, preordered: false, sessionId: null };
  }
  return null;
}

/** Query string that authorizes wallpaper downloads for this access. */
export function accessQuery(access: ReadingAccess): string {
  return access.sessionId
    ? `session_id=${encodeURIComponent(access.sessionId)}`
    : `preview=${encodeURIComponent(access.resultId)}`;
}
