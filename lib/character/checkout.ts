import { decodeResultId } from "./ids";
import { buildReadingMetadata, kitPriceKeyForRegion, readingPriceKey } from "./pricing";
import { BASE_URL, stripe } from "./stripe-server";

export type Region = "std" | "sea";

export const SAVE_CARD_NOTE =
  "We'll save your payment details so you can add extras to your reading in one tap.";

/** Embedded Checkout session for a reading. The card is saved (on-session) for the one-tap kit upsell. */
export async function createReadingCheckout(opts: {
  resultId: string;
  answers: number[] | null;
  country: string | null;
  attribution: Record<string, string>;
  clientReferenceId?: string;
}): Promise<{ clientSecret: string; sessionId: string }> {
  if (!decodeResultId(opts.resultId)) throw new Error("Invalid result id");
  const region: Region = readingPriceKey(opts.country) === "STRIPE_PRICE_READING_SEA" ? "sea" : "std";
  const metadata = {
    ...buildReadingMetadata(opts.attribution, opts.resultId),
    region,
    ...(opts.answers ? { answers: opts.answers.join("") } : {}),
  };

  const session = await stripe().checkout.sessions.create({
    mode: "payment",
    ui_mode: "embedded",
    line_items: [{ price: process.env[readingPriceKey(opts.country)]!, quantity: 1 }],
    return_url: `${BASE_URL}/character/reading?session_id={CHECKOUT_SESSION_ID}`,
    customer_creation: "always",
    payment_intent_data: { setup_future_usage: "on_session", metadata },
    metadata,
    custom_text: { submit: { message: SAVE_CARD_NOTE } },
    ...(opts.clientReferenceId ? { client_reference_id: opts.clientReferenceId } : {}),
  });
  return { clientSecret: session.client_secret!, sessionId: session.id };
}

export type KitPurchaseResult =
  | { status: "succeeded" }
  | { status: "requires_action"; clientSecret: string }
  | { status: "failed"; message: string };

/**
 * One-tap kit upsell: charges the card saved during the reading checkout.
 * The kit PaymentIntent id is stored on the reading's PaymentIntent (metadata.kit_pi), so no database is needed.
 */
export async function buyKit(sessionId: string): Promise<KitPurchaseResult> {
  const s = stripe();
  const session = await s.checkout.sessions.retrieve(sessionId, { expand: ["payment_intent"] });
  const readingPi = session.payment_intent;
  if (session.payment_status !== "paid" || session.metadata?.product !== "reading" || !readingPi || typeof readingPi === "string") {
    return { status: "failed", message: "This reading isn't paid for yet." };
  }

  // Reuse an existing kit attempt if there is one.
  const existingId = readingPi.metadata?.kit_pi;
  if (existingId) {
    const existing = await s.paymentIntents.retrieve(existingId);
    if (existing.status === "succeeded") return { status: "succeeded" };
    if (existing.status === "requires_action" && existing.client_secret) {
      return { status: "requires_action", clientSecret: existing.client_secret };
    }
  }

  const customer = typeof session.customer === "string" ? session.customer : session.customer?.id;
  const paymentMethod = typeof readingPi.payment_method === "string" ? readingPi.payment_method : readingPi.payment_method?.id;
  if (!customer || !paymentMethod) return { status: "failed", message: "No saved payment method on this purchase." };

  const price = await s.prices.retrieve(process.env[kitPriceKeyForRegion(session.metadata?.region)]!);

  try {
    const pi = await s.paymentIntents.create(
      {
        amount: price.unit_amount!,
        currency: price.currency,
        customer,
        payment_method: paymentMethod,
        confirm: true,
        description: "2027 Year of the Goat kit",
        metadata: { product: "kit", reading_session: session.id, result_id: session.metadata?.result_id ?? "" },
        return_url: `${BASE_URL}/character/reading?session_id=${session.id}`,
      },
      { idempotencyKey: `kit-${session.id}-${Math.floor(Date.now() / 15000)}` },
    );
    await s.paymentIntents.update(readingPi.id, { metadata: { kit_pi: pi.id } });
    if (pi.status === "succeeded") return { status: "succeeded" };
    if (pi.status === "requires_action" && pi.client_secret) return { status: "requires_action", clientSecret: pi.client_secret };
    return { status: "failed", message: "Your bank didn't approve the payment." };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Payment failed.";
    return { status: "failed", message };
  }
}
