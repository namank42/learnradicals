import Stripe from "stripe";

let client: Stripe | null = null;

/** Server-only Stripe client (API version pinned by the installed SDK). */
export function stripe(): Stripe {
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY!);
  return client;
}

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://learnradicals.com";
