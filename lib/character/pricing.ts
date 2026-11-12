export const SEA_COUNTRIES = ["ID", "VN", "MY", "PH", "TH"] as const;

export type ReadingPriceKey = "STRIPE_PRICE_READING_SEA" | "STRIPE_PRICE_READING_STD";

/** Country (ISO 3166-1 alpha-2, any case) -> env var holding the Stripe price id. */
export function readingPriceKey(country: string | null): ReadingPriceKey {
  const c = (country ?? "").toUpperCase();
  return (SEA_COUNTRIES as readonly string[]).includes(c)
    ? "STRIPE_PRICE_READING_SEA"
    : "STRIPE_PRICE_READING_STD";
}

export type KitPriceKey = "STRIPE_PRICE_GOAT_KIT_SEA" | "STRIPE_PRICE_GOAT_KIT_STD";

/** Kit add-on price for a country: +$5 standard, +$3 in Southeast Asia. */
export function kitPriceKey(country: string | null): KitPriceKey {
  return readingPriceKey(country) === "STRIPE_PRICE_READING_SEA" ? "STRIPE_PRICE_GOAT_KIT_SEA" : "STRIPE_PRICE_GOAT_KIT_STD";
}

/** Kit price for a stored region ("sea" | "std"), used by the post-purchase upsell. */
export function kitPriceKeyForRegion(region: string | undefined): KitPriceKey {
  return region === "sea" ? "STRIPE_PRICE_GOAT_KIT_SEA" : "STRIPE_PRICE_GOAT_KIT_STD";
}

/** Display prices for UI labels (Stripe holds the real amounts). */
export function displayPrices(country: string | null): { reading: string; kit: string; bundle: string } {
  return readingPriceKey(country) === "STRIPE_PRICE_READING_SEA"
    ? { reading: "$4", kit: "$3", bundle: "$7" }
    : { reading: "$7", kit: "$5", bundle: "$12" };
}

/** Stripe metadata for a reading purchase. product/result_id always win over attribution keys. */
export function buildReadingMetadata(
  attribution: Record<string, string>,
  resultId: string,
): Record<string, string> {
  return { ...attribution, product: "reading", result_id: resultId };
}
