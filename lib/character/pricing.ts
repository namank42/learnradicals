export const SEA_COUNTRIES = ["ID", "VN", "MY", "PH", "TH"] as const;

export type ReadingPriceKey = "STRIPE_PRICE_READING_SEA" | "STRIPE_PRICE_READING_STD";

/** Country (ISO 3166-1 alpha-2, any case) -> env var holding the Stripe price id. */
export function readingPriceKey(country: string | null): ReadingPriceKey {
  const c = (country ?? "").toUpperCase();
  return (SEA_COUNTRIES as readonly string[]).includes(c)
    ? "STRIPE_PRICE_READING_SEA"
    : "STRIPE_PRICE_READING_STD";
}

/** Stripe metadata for a reading purchase. product/result_id always win over attribution keys. */
export function buildReadingMetadata(
  attribution: Record<string, string>,
  resultId: string,
): Record<string, string> {
  return { ...attribution, product: "reading", result_id: resultId };
}
