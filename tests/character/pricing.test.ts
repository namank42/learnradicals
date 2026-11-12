import { describe, expect, it } from "vitest";
import { buildReadingMetadata, readingPriceKey } from "@/lib/character/pricing";

describe("readingPriceKey", () => {
  it.each([
    ["ID", "STRIPE_PRICE_READING_SEA"],
    ["vn", "STRIPE_PRICE_READING_SEA"],
    ["MY", "STRIPE_PRICE_READING_SEA"],
    ["PH", "STRIPE_PRICE_READING_SEA"],
    ["TH", "STRIPE_PRICE_READING_SEA"],
    ["US", "STRIPE_PRICE_READING_STD"],
    ["SG", "STRIPE_PRICE_READING_STD"],
    [null, "STRIPE_PRICE_READING_STD"],
    ["", "STRIPE_PRICE_READING_STD"],
  ] as const)("%j -> %s", (country, key) => {
    expect(readingPriceKey(country)).toBe(key);
  });
});

describe("buildReadingMetadata", () => {
  it("always sets product and result_id, overriding attribution keys", () => {
    expect(
      buildReadingMetadata({ vid: "v1", product: "spoofed", result_id: "x" }, "wisdom-rabbit-water"),
    ).toEqual({ vid: "v1", product: "reading", result_id: "wisdom-rabbit-water" });
  });
});
